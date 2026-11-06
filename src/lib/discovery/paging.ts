/**
 * Cursor paging for GET /discovery/companions (opaque `next_cursor`). Pure, unit-tested.
 * A refresh replaces the list; a next page is appended without duplicates (a
 * companion whose rank changed between pages must not appear twice).
 */
export type Paged<T extends { id: string }> = {
  items: T[];
  /** Cursor for the next page; null when there are no more pages. */
  cursor: string | null;
  /** True once a page has loaded and its next_cursor was null. */
  done: boolean;
  /** At least one page has loaded (so an empty list means "no results", not "loading"). */
  loaded: boolean;
};

export const emptyPaged = <T extends { id: string }>(): Paged<T> => ({ items: [], cursor: null, done: false, loaded: false });

export function applyPage<T extends { id: string }>(state: Paged<T>, page: { items: T[]; next_cursor: string | null }, mode: 'reset' | 'append'): Paged<T> {
  const base = mode === 'reset' ? [] : state.items;
  const seen = new Set(base.map((i) => i.id));
  const items = [...base];
  for (const it of page.items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    items.push(it);
  }
  return { items, cursor: page.next_cursor, done: page.next_cursor === null, loaded: true };
}

/**
 * The cursor to fetch when the list end is reached, or null when nothing
 * should be fetched (first page not loaded yet, already loading, or no more pages).
 */
export function nextCursor<T extends { id: string }>(state: Paged<T>, busy: boolean): string | null {
  if (busy || !state.loaded || state.done) return null;
  return state.cursor;
}
