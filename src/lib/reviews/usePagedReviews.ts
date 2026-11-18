import { useCallback, useEffect, useRef, useState } from 'react';
import { applyPage, emptyPaged, nextCursor, type Paged } from '../discovery/paging';
import { errorView } from '../errors';
import type { ReviewItem } from './types';

type Page = { items: ReviewItem[]; next_cursor: string | null };

/**
 * Cursor paging for a review list ("Show more"): the first page on mount (and
 * when `key` changes or `reload` is called), later pages appended without
 * duplicates. `head` is the latest response (rating, public, min_count).
 * Set `enabled` false to skip loading (e.g. no public rating yet).
 */
export function usePagedReviews<R extends Page>(fetchPage: (cursor: string | null) => Promise<R>, key: string, enabled = true) {
  const [paged, setPaged] = useState<Paged<ReviewItem>>(emptyPaged);
  const [head, setHead] = useState<R | null>(null);
  const [state, setState] = useState<{ loading: boolean; loadingMore: boolean; error: string | null; offline: boolean }>({ loading: enabled, loadingMore: false, error: null, offline: false });
  const fetchRef = useRef(fetchPage);
  useEffect(() => {
    fetchRef.current = fetchPage;
  });
  const seq = useRef(0);
  const busy = useRef(false);

  /** The first page. State changes only after the request settles (the first render already shows loading). */
  const first = useCallback(() => {
    if (!enabled) return;
    const mine = ++seq.current;
    busy.current = true;
    fetchRef.current(null).then(
      (r) => {
        if (mine !== seq.current) return;
        busy.current = false;
        setHead(r);
        setPaged((p) => applyPage(p, r, 'reset'));
        setState({ loading: false, loadingMore: false, error: null, offline: false });
      },
      (err) => {
        if (mine !== seq.current) return;
        busy.current = false;
        const v = errorView(err);
        setState({ loading: false, loadingMore: false, error: v.offline ? null : v.message, offline: v.offline });
      },
    );
    // `key` re-runs the first page when what is listed changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  useEffect(() => {
    first();
  }, [first]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null, offline: false }));
    first();
  }, [first]);

  const loadMore = useCallback(() => {
    const cursor = nextCursor(paged, busy.current);
    if (!cursor) return;
    const mine = seq.current;
    busy.current = true;
    setState((s) => ({ ...s, loadingMore: true, error: null, offline: false }));
    fetchRef.current(cursor).then(
      (r) => {
        if (mine !== seq.current) return;
        busy.current = false;
        setPaged((p) => applyPage(p, r, 'append'));
        setState((s) => ({ ...s, loadingMore: false }));
      },
      (err) => {
        if (mine !== seq.current) return;
        busy.current = false;
        const v = errorView(err);
        setState((s) => ({ ...s, loadingMore: false, error: v.offline ? null : v.message, offline: v.offline }));
      },
    );
  }, [paged]);

  return { items: paged.items, loaded: paged.loaded, hasMore: paged.loaded && !paged.done, head, ...state, reload, loadMore };
}
