/**
 * Discover filters <-> GET /discovery/companions query string. Pure (no React
 * Native imports) so it is unit-tested (test/discovery.test.ts).
 *
 * Rules that mirror the API (Sydecrew-be discovery.routes.js):
 *  - an activity belongs to a category: changing the category clears it;
 *  - the time window only applies to a chosen date, so it is dropped without one;
 *  - duration is 30–720 minutes; prices are whole paise and min <= max;
 *  - limit is 1–24.
 */
import { DiscoverySortValues, TimeWindowValues, type DiscoverySort, type TimeWindow } from '../contract/enums';

export type DiscoveryFilters = {
  category: string | null;
  activity: string | null;
  zone: string | null;
  languages: string[];
  interests: string[];
  date: string | null;
  timeWindow: TimeWindow | null;
  durationMinutes: number | null;
  minPaise: number | null;
  maxPaise: number | null;
  sort: DiscoverySort;
};

export const EMPTY_FILTERS: DiscoveryFilters = Object.freeze({
  category: null,
  activity: null,
  zone: null,
  languages: [],
  interests: [],
  date: null,
  timeWindow: null,
  durationMinutes: null,
  minPaise: null,
  maxPaise: null,
  sort: 'relevance',
}) as DiscoveryFilters;

/** Duration choices offered in the filters sheet (minutes). */
export const DURATION_CHOICES = [60, 120, 180, 240] as const;
export const PAGE_SIZE = 12;
const MAX_LIMIT = 24;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const enc = encodeURIComponent;

const intOrNull = (v: unknown, min: number, max = Number.MAX_SAFE_INTEGER): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : NaN;
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
};

/** Filters -> "?category=…&language=a&language=b&cursor=…" ("" when nothing is set). */
export function filtersToQuery(f: DiscoveryFilters, opts: { cursor?: string | null; limit?: number } = {}): string {
  const parts: [string, string][] = [];
  if (f.category) parts.push(['category', f.category]);
  if (f.category && f.activity) parts.push(['activity', f.activity]);
  if (f.zone) parts.push(['zone', f.zone]);
  for (const l of [...new Set(f.languages)]) parts.push(['language', l]);
  for (const i of [...new Set(f.interests)]) parts.push(['interest', i]);
  if (f.date && DATE_RE.test(f.date)) {
    parts.push(['date', f.date]);
    if (f.timeWindow) parts.push(['time_window', f.timeWindow]);
  }
  if (f.durationMinutes !== null && intOrNull(f.durationMinutes, 30, 720) !== null) parts.push(['duration_minutes', String(f.durationMinutes)]);
  const [min, max] = orderedRange(f.minPaise, f.maxPaise);
  if (min !== null) parts.push(['min_paise', String(min)]);
  if (max !== null) parts.push(['max_paise', String(max)]);
  if (f.sort !== 'relevance') parts.push(['sort', f.sort]);
  if (opts.cursor) parts.push(['cursor', opts.cursor]);
  if (opts.limit !== undefined) parts.push(['limit', String(Math.min(MAX_LIMIT, Math.max(1, Math.round(opts.limit))))]);
  return parts.length ? `?${parts.map(([k, v]) => `${k}=${enc(v)}`).join('&')}` : '';
}

/** A swapped range is put in order rather than rejected (the API would answer 422). */
function orderedRange(min: number | null, max: number | null): [number | null, number | null] {
  const a = min === null ? null : intOrNull(min, 0);
  const b = max === null ? null : intOrNull(max, 0);
  if (a !== null && b !== null && a > b) return [b, a];
  return [a, b];
}

type Params = Record<string, string | string[] | undefined>;

/** Parses "?a=1&b=2&b=3" into { a: '1', b: ['2', '3'] } without relying on URLSearchParams (partial on Hermes). */
export function parseQuery(query: string): Params {
  const out: Params = {};
  for (const pair of query.replace(/^\?/, '').split('&')) {
    if (!pair) continue;
    const [rawK, ...rest] = pair.split('=');
    const k = decodeURIComponent(rawK.replace(/\+/g, ' '));
    const v = decodeURIComponent(rest.join('=').replace(/\+/g, ' '));
    const prev = out[k];
    out[k] = prev === undefined ? v : Array.isArray(prev) ? [...prev, v] : [prev, v];
  }
  return out;
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const all = (v: string | string[] | undefined) => (v === undefined ? [] : (Array.isArray(v) ? v : v.split(',')).filter(Boolean));

/**
 * Query (a string, or route params from useLocalSearchParams) -> filters.
 * Unknown or malformed values fall back to "not set", never throw.
 */
export function queryToFilters(input: string | Params): DiscoveryFilters {
  const p = typeof input === 'string' ? parseQuery(input) : input;
  const category = first(p.category) || null;
  const date = first(p.date) ?? null;
  const tw = first(p.time_window);
  const sort = first(p.sort);
  const validDate = date && DATE_RE.test(date) ? date : null;
  const [minPaise, maxPaise] = orderedRange(intOrNull(first(p.min_paise), 0), intOrNull(first(p.max_paise), 0));
  return {
    category,
    activity: category ? first(p.activity) || null : null,
    zone: first(p.zone) || null,
    languages: [...new Set(all(p.language))],
    interests: [...new Set(all(p.interest))],
    date: validDate,
    timeWindow: validDate && tw && (TimeWindowValues as readonly string[]).includes(tw) ? (tw as TimeWindow) : null,
    durationMinutes: intOrNull(first(p.duration_minutes), 30, 720),
    minPaise,
    maxPaise,
    sort: sort && (DiscoverySortValues as readonly string[]).includes(sort) ? (sort as DiscoverySort) : 'relevance',
  };
}

/** How many filters are set (for the "Filters (3)" button). Sort is not a filter. */
export function activeFilterCount(f: DiscoveryFilters): number {
  return [
    f.category,
    f.category && f.activity,
    f.zone,
    f.languages.length,
    f.interests.length,
    f.date,
    f.durationMinutes,
    f.minPaise !== null || f.maxPaise !== null,
  ].filter(Boolean).length;
}

/** Choosing (or clearing) a category clears an activity that belonged to the old one. */
export function withCategory(f: DiscoveryFilters, category: string | null): DiscoveryFilters {
  return category === f.category ? f : { ...f, category, activity: null };
}

/** Clearing the date also clears the time window (it only applies to a date). */
export function withDate(f: DiscoveryFilters, date: string | null): DiscoveryFilters {
  return { ...f, date, timeWindow: date ? f.timeWindow : null };
}

export const toggleIn = (list: string[], id: string): string[] => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

export type PriceBucket = { key: string; minPaise: number | null; maxPaise: number | null };

/**
 * Three price choices inside a band (paise), rounded to whole ₹100:
 * up to a third, the middle third, from two thirds. Empty when the band is unusable.
 */
export function priceBuckets(band: { min_paise: number; max_paise: number } | null | undefined): PriceBucket[] {
  if (!band || !(band.max_paise > band.min_paise)) return [];
  const step = (band.max_paise - band.min_paise) / 3;
  const round = (p: number) => Math.round(p / 10000) * 10000;
  const a = round(band.min_paise + step);
  const b = round(band.min_paise + 2 * step);
  if (!(a > band.min_paise && b > a && b < band.max_paise)) return [];
  return [
    { key: 'low', minPaise: null, maxPaise: a },
    { key: 'mid', minPaise: a, maxPaise: b },
    { key: 'high', minPaise: b, maxPaise: null },
  ];
}

/** The widest band across categories (for the price choices when no category is chosen). */
export function overallBand(bands: { min_paise: number; max_paise: number }[]): { min_paise: number; max_paise: number } | null {
  if (!bands.length) return null;
  return { min_paise: Math.min(...bands.map((b) => b.min_paise)), max_paise: Math.max(...bands.map((b) => b.max_paise)) };
}

/** The next `days` dates (YYYY-MM-DD) from `today`, computed in UTC so device time zones cannot shift them. */
export function nextDates(today: string, days = 14): string[] {
  if (!DATE_RE.test(today)) return [];
  const start = Date.parse(`${today}T00:00:00Z`);
  return Array.from({ length: days }, (_, i) => new Date(start + i * 86_400_000).toISOString().slice(0, 10));
}
