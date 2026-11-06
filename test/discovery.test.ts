// Discover helpers (Feature 3): filters <-> query, cursor paging, the waitlist branch, row memo / getItemLayout.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPTY_FILTERS,
  activeFilterCount,
  filtersToQuery,
  nextDates,
  overallBand,
  parseQuery,
  priceBuckets,
  queryToFilters,
  toggleIn,
  withCategory,
  withDate,
  type DiscoveryFilters,
} from '../src/lib/discovery/filters.ts';
import { applyPage, emptyPaged, nextCursor } from '../src/lib/discovery/paging.ts';
import {
  CARD_HEIGHT,
  ROW_HEIGHT,
  availabilityLabel,
  discoverView,
  fromPrice,
  getItemLayout,
  nextFree,
  sameCard,
  sameRowProps,
  shortDay,
  verifiedSince,
} from '../src/lib/discovery/list.ts';
import type { DiscoveryCard } from '../src/lib/discovery/types.ts';

const full: DiscoveryFilters = {
  category: 'cat-1',
  activity: 'act-9',
  zone: 'zone-2',
  languages: ['lang-a', 'lang-b'],
  interests: ['int-x'],
  date: '2026-11-07',
  timeWindow: 'evening',
  durationMinutes: 120,
  minPaise: 100000,
  maxPaise: 250000,
  sort: 'price_asc',
};

// ── filters <-> query ─────────────────────────────────────────────────────

test('empty filters make an empty query; only limit / cursor when asked', () => {
  assert.equal(filtersToQuery(EMPTY_FILTERS), '');
  assert.equal(filtersToQuery(EMPTY_FILTERS, { limit: 12 }), '?limit=12');
  assert.equal(filtersToQuery(EMPTY_FILTERS, { cursor: 'abc==', limit: 99 }), '?cursor=abc%3D%3D&limit=24');
  assert.equal(filtersToQuery(EMPTY_FILTERS, { limit: 0 }), '?limit=1');
});

test('every filter is written with the API parameter names, arrays repeated', () => {
  const q = filtersToQuery(full, { cursor: 'c1', limit: 12 });
  assert.equal(
    q,
    '?category=cat-1&activity=act-9&zone=zone-2&language=lang-a&language=lang-b&interest=int-x&date=2026-11-07&time_window=evening&duration_minutes=120&min_paise=100000&max_paise=250000&sort=price_asc&cursor=c1&limit=12',
  );
});

test('filters -> query -> filters round-trips', () => {
  assert.deepEqual(queryToFilters(filtersToQuery(full)), full);
  assert.deepEqual(queryToFilters(filtersToQuery(EMPTY_FILTERS)), EMPTY_FILTERS);
  const partial = { ...EMPTY_FILTERS, zone: 'z', interests: ['a', 'b'], sort: 'soonest' as const };
  assert.deepEqual(queryToFilters(filtersToQuery(partial)), partial);
});

test('route params (useLocalSearchParams shape) parse like a query string', () => {
  const f = queryToFilters({ category: 'cat-1', language: ['a', 'b'], interest: 'x,y', min_paise: '5000', sort: 'price_desc' });
  assert.deepEqual(f.languages, ['a', 'b']);
  assert.deepEqual(f.interests, ['x', 'y']);
  assert.equal(f.minPaise, 5000);
  assert.equal(f.sort, 'price_desc');
});

test('rules that mirror the API: activity needs a category, window needs a date, ranges ordered', () => {
  assert.equal(filtersToQuery({ ...EMPTY_FILTERS, activity: 'act' }), '');
  assert.equal(filtersToQuery({ ...EMPTY_FILTERS, timeWindow: 'morning' }), '');
  assert.equal(filtersToQuery({ ...EMPTY_FILTERS, minPaise: 300000, maxPaise: 100000 }), '?min_paise=100000&max_paise=300000');
  assert.equal(filtersToQuery({ ...EMPTY_FILTERS, durationMinutes: 10 }), '');
  assert.equal(filtersToQuery({ ...EMPTY_FILTERS, date: '7/11/2026' }), '');
  assert.equal(filtersToQuery({ ...EMPTY_FILTERS, languages: ['a', 'a'] }), '?language=a');
});

test('malformed query values fall back to "not set"', () => {
  const f = queryToFilters('?sort=cheapest&time_window=night&date=2026-11-07&duration_minutes=5&min_paise=-1&max_paise=abc&activity=a');
  assert.equal(f.sort, 'relevance');
  assert.equal(f.timeWindow, null);
  assert.equal(f.date, '2026-11-07');
  assert.equal(f.durationMinutes, null);
  assert.equal(f.minPaise, null);
  assert.equal(f.maxPaise, null);
  assert.equal(f.activity, null, 'activity without category is dropped');
  assert.deepEqual(parseQuery('?a=1&b=x%20y&b=z&empty='), { a: '1', b: ['x y', 'z'], empty: '' });
});

test('filter helpers: category clears activity, clearing the date clears the window, counts, toggles', () => {
  assert.equal(withCategory(full, 'cat-2').activity, null);
  assert.equal(withCategory(full, 'cat-1').activity, 'act-9');
  assert.equal(withDate(full, null).timeWindow, null);
  assert.equal(withDate(full, '2026-11-08').timeWindow, 'evening');
  assert.equal(activeFilterCount(EMPTY_FILTERS), 0);
  assert.equal(activeFilterCount(full), 8);
  assert.equal(activeFilterCount({ ...EMPTY_FILTERS, sort: 'soonest' }), 0, 'sort is not a filter');
  assert.deepEqual(toggleIn(['a'], 'b'), ['a', 'b']);
  assert.deepEqual(toggleIn(['a', 'b'], 'a'), ['b']);
});

test('price buckets split a band into thirds on whole ₹100', () => {
  assert.deepEqual(priceBuckets({ min_paise: 50000, max_paise: 350000 }), [
    { key: 'low', minPaise: null, maxPaise: 150000 },
    { key: 'mid', minPaise: 150000, maxPaise: 250000 },
    { key: 'high', minPaise: 250000, maxPaise: null },
  ]);
  assert.deepEqual(priceBuckets({ min_paise: 100000, max_paise: 100000 }), []);
  assert.deepEqual(priceBuckets(null), []);
  assert.deepEqual(overallBand([{ min_paise: 80000, max_paise: 200000 }, { min_paise: 50000, max_paise: 150000 }]), { min_paise: 50000, max_paise: 200000 });
  assert.equal(overallBand([]), null);
});

test('nextDates counts calendar days across month ends', () => {
  const d = nextDates('2026-11-29', 4);
  assert.deepEqual(d, ['2026-11-29', '2026-11-30', '2026-12-01', '2026-12-02']);
  assert.equal(nextDates('2026-11-06').length, 14);
  assert.deepEqual(nextDates('bad'), []);
});

// ── cursor paging ─────────────────────────────────────────────────────────

const card = (id: string, extra: Partial<DiscoveryCard> = {}): DiscoveryCard => ({
  id,
  display_name: `Companion ${id}`,
  photo_url: null,
  zone: { id: 'z1', name: 'Navrangpura' },
  languages: ['English', 'Gujarati'],
  categories: [{ id: 'c1', code: 'FRIEND', name: 'Crew' }],
  from_paise: 120000,
  next_available_at: null,
  verified: true,
  new_on_sydecrew: true,
  ...extra,
});

test('cursor paging: first page, append without duplicates, last page, refresh replaces', () => {
  let s = emptyPaged<DiscoveryCard>();
  assert.equal(nextCursor(s, false), null, 'nothing to page before the first load');
  s = applyPage(s, { items: [card('a'), card('b')], next_cursor: 'p2' }, 'reset');
  assert.deepEqual(s.items.map((i) => i.id), ['a', 'b']);
  assert.equal(nextCursor(s, false), 'p2');
  assert.equal(nextCursor(s, true), null, 'no second request while one is in flight');
  s = applyPage(s, { items: [card('b'), card('c')], next_cursor: null }, 'append');
  assert.deepEqual(s.items.map((i) => i.id), ['a', 'b', 'c'], 'a companion seen on page 1 is not repeated');
  assert.ok(s.done);
  assert.equal(nextCursor(s, false), null, 'no more pages');
  s = applyPage(s, { items: [card('z')], next_cursor: 'p2' }, 'reset');
  assert.deepEqual(s.items.map((i) => i.id), ['z']);
  assert.equal(s.done, false);
});

test('an empty first page is "loaded", not "loading"', () => {
  const s = applyPage(emptyPaged<DiscoveryCard>(), { items: [], next_cursor: null }, 'reset');
  assert.ok(s.loaded && s.done);
  assert.equal(discoverView({ list: { in_pilot: true }, items: 0, loaded: s.loaded, failed: false }), 'empty');
});

// ── waitlist branch ───────────────────────────────────────────────────────

test('outside a pilot area the waitlist shows, whatever else happened', () => {
  assert.equal(discoverView({ list: { in_pilot: false }, items: 0, loaded: true, failed: false }), 'waitlist');
  assert.equal(discoverView({ list: null, optionsInPilot: false, items: 0, loaded: false, failed: true }), 'waitlist');
  assert.equal(discoverView({ list: { in_pilot: true }, items: 3, loaded: true, failed: false }), 'results');
  assert.equal(discoverView({ list: null, optionsInPilot: true, items: 0, loaded: false, failed: false }), 'loading');
  assert.equal(discoverView({ list: null, items: 0, loaded: false, failed: true }), 'error');
  assert.equal(discoverView({ list: { in_pilot: true }, items: 4, loaded: true, failed: true }), 'results', 'offline keeps the last results');
});

// ── row memo and getItemLayout ────────────────────────────────────────────

test('getItemLayout gives fixed rows without measuring', () => {
  assert.deepEqual(getItemLayout(null, 0), { length: ROW_HEIGHT, offset: 0, index: 0 });
  assert.deepEqual(getItemLayout([], 10), { length: ROW_HEIGHT, offset: ROW_HEIGHT * 10, index: 10 });
  assert.ok(ROW_HEIGHT > CARD_HEIGHT);
});

test('row memo: a refetched but identical card does not re-render; any shown change does', () => {
  const open = () => {};
  const a = card('a');
  assert.ok(sameCard(a, { ...a, zone: { ...a.zone! }, languages: [...a.languages], categories: [...a.categories] }));
  assert.ok(sameRowProps({ card: a, onOpen: open }, { card: { ...a }, onOpen: open }));
  assert.ok(!sameRowProps({ card: a, onOpen: open }, { card: a, onOpen: () => {} }), 'new handler re-renders');
  for (const change of [{ from_paise: 1 }, { display_name: 'X' }, { photo_url: 'https://x' }, { verified: false }, { new_on_sydecrew: false }, { next_available_at: '2026-11-07T12:30:00Z' }, { languages: ['English'] }, { zone: null }, { categories: [] }]) {
    assert.ok(!sameCard(a, card('a', change as Partial<DiscoveryCard>)), JSON.stringify(change));
  }
});

// ── display helpers ───────────────────────────────────────────────────────

test('display helpers: price, dates in IST, availability labels, verified since', () => {
  assert.equal(fromPrice(120000), '₹1,200');
  assert.equal(fromPrice(0), null);
  const day = shortDay('2026-11-06');
  assert.equal(day.day, '6');
  const now = new Date('2026-11-06T06:00:00Z'); // 11:30 IST
  assert.equal(nextFree('2026-11-06T12:30:00Z', now)?.today, true); // 18:00 IST, same day
  assert.equal(nextFree('2026-11-06T19:00:00Z', now)?.today, false); // 00:30 IST next day
  assert.equal(nextFree(null), null);
  const names = { morning: 'morning', afternoon: 'afternoon', evening: 'evening', none: 'not available' };
  assert.match(availabilityLabel({ date: '2026-11-06', morning: true, afternoon: false, evening: true }, names), /6 Nov: morning, evening$/);
  assert.match(availabilityLabel({ date: '2026-11-06', morning: false, afternoon: false, evening: false }, names), /not available$/);
  assert.equal(verifiedSince('2026-03'), 'March 2026');
  assert.equal(verifiedSince(null), null);
});
