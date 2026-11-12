import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { errorView } from './errors';

/**
 * Loads `fn` whenever the screen is focused, and again when `key` changes
 * (e.g. an id or a filter): data, loading, error (friendly copy), offline.
 */
export function useLoad<T>(fn: () => Promise<T>, key: string = '') {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<{ loading: boolean; error: string | null; offline: boolean; code: string | null }>({ loading: true, error: null, offline: false, code: null });
  const seq = useRef(0);
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  const load = useCallback(() => {
    const mine = ++seq.current;
    setState((s) => ({ ...s, loading: true }));
    fnRef.current().then(
      (x) => {
        if (mine !== seq.current) return;
        setData(x);
        setState({ loading: false, error: null, offline: false, code: null });
      },
      (err) => {
        if (mine !== seq.current) return;
        const v = errorView(err);
        setState({ loading: false, error: v.offline ? null : v.message, offline: v.offline, code: v.code });
      },
    );
    // `key` re-runs the load when what is being loaded changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useFocusEffect(load);
  return { data, setData, ...state, loading: state.loading && data === null, reload: load };
}
