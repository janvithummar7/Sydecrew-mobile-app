/**
 * List helpers for the Discover screen (pure, unit-tested): fixed card heights
 * for FlatList's getItemLayout, the row memo comparison, which view to show
 * (waitlist or list), and the text a card and the availability strip show.
 */
import { formatPaise } from '../money';
import type { AvailabilityDay, DiscoveryCard, DiscoveryList } from './types';

/** Every card has exactly this height (single-line texts), so the list never measures rows. */
export const CARD_HEIGHT = 140;
export const CARD_GAP = 12;
export const ROW_HEIGHT = CARD_HEIGHT + CARD_GAP;

/** FlatList getItemLayout for fixed-height rows (no list header: filters sit above the list). */
export function getItemLayout(_data: ArrayLike<unknown> | null | undefined, index: number) {
  return { length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index };
}

/** The card fields a row renders. Two cards with equal fields render the same row. */
const RENDERED: (keyof DiscoveryCard)[] = ['id', 'display_name', 'photo_url', 'from_paise', 'next_available_at', 'verified', 'new_on_sydecrew'];

export function sameCard(a: DiscoveryCard, b: DiscoveryCard): boolean {
  if (a === b) return true;
  if (RENDERED.some((k) => a[k] !== b[k])) return false;
  if ((a.rating?.average ?? null) !== (b.rating?.average ?? null) || (a.rating?.count ?? null) !== (b.rating?.count ?? null)) return false;
  if ((a.zone?.id ?? null) !== (b.zone?.id ?? null) || (a.zone?.name ?? null) !== (b.zone?.name ?? null)) return false;
  if (a.languages.join('|') !== b.languages.join('|')) return false;
  return a.categories.map((c) => c.id).join('|') === b.categories.map((c) => c.id).join('|');
}

/** React.memo comparison for a card row: same card content and the same press handler. */
export function sameRowProps(prev: { card: DiscoveryCard; onOpen: unknown }, next: { card: DiscoveryCard; onOpen: unknown }): boolean {
  return prev.onOpen === next.onOpen && sameCard(prev.card, next.card);
}

export type DiscoverView = 'loading' | 'waitlist' | 'results' | 'empty' | 'error';

/**
 * Outside a pilot area (`in_pilot: false`) the screen is the waitlist, whatever
 * the filters. Otherwise: results, or the empty state once a page has loaded.
 * A failed load with nothing cached is an error; with cached items the results stay.
 */
export function discoverView(s: { list: Pick<DiscoveryList, 'in_pilot'> | null; optionsInPilot?: boolean | null; items: number; loaded: boolean; failed: boolean }): DiscoverView {
  if (s.list ? !s.list.in_pilot : s.optionsInPilot === false) return 'waitlist';
  if (s.items > 0) return 'results';
  if (s.failed) return 'error';
  if (!s.loaded) return 'loading';
  return 'empty';
}

/** "From ₹1,200 / hour" style price; null when the companion has no rate yet (from_paise 0). */
export const fromPrice = (paise: number): string | null => (paise > 0 ? formatPaise(paise) : null);

const TZ = 'Asia/Kolkata';

/** "Fri 6 Nov" for a YYYY-MM-DD date (a calendar date: formatted in UTC so it never shifts). */
export function shortDay(date: string): { weekday: string; day: string; month: string } {
  const d = new Date(`${date}T00:00:00Z`);
  return {
    weekday: d.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' }),
    day: String(d.getUTCDate()),
    month: d.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' }),
  };
}

/** "Next free: today, 6:00 pm" / "Next free: 7 Nov, 11:00 am" in India time; null when not known. */
export function nextFree(iso: string | null, now = new Date()): { today: boolean; text: string } | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const day = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: TZ });
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
  if (day(d) === day(now)) return { today: true, text: time };
  return { today: false, text: `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: TZ })}, ${time}` };
}

/** Screen-reader text for one day of the 14-day strip: "Fri 6 Nov: morning, evening" / "…: not available". */
export function availabilityLabel(day: AvailabilityDay, names: { morning: string; afternoon: string; evening: string; none: string }): string {
  const d = shortDay(day.date);
  const parts = (['morning', 'afternoon', 'evening'] as const).filter((k) => day[k]).map((k) => names[k]);
  return `${d.weekday} ${d.day} ${d.month}: ${parts.length ? parts.join(', ') : names.none}`;
}

/** "Verified since March 2026" from YYYY-MM; null when unknown. */
export function verifiedSince(ym: string | null): string | null {
  if (!ym || !/^\d{4}-\d{2}$/.test(ym)) return null;
  return new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
