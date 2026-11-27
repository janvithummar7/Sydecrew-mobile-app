/**
 * Dates and times: the API stores and sends UTC (ISO 8601); the app always
 * shows India time (IST, Asia/Kolkata), whatever the phone's time zone is.
 */
const TZ = 'Asia/Kolkata';

/** "5 November 2026" */
export function formatDateIST(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
}

/** "5 Nov, 7:42 pm"; "12 Dec 2025, 7:00 pm" when it is not this year in India (so an old date never reads as an upcoming one). */
export function formatDateTimeIST(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const year = (x: Date) => x.toLocaleDateString('en-CA', { year: 'numeric', timeZone: TZ });
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', ...(year(d) !== year(now) ? { year: 'numeric' } : {}), hour: 'numeric', minute: '2-digit', timeZone: TZ });
}

/** "7:42 pm", or "5 Nov, 7:42 pm" when it is not today in India. */
export function formatTimeIST(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const day = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: TZ });
  return day(d) === day(now) ? d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: TZ }) : formatDateTimeIST(iso, now);
}

/** YYYY-MM-DD for today in India. */
export const todayIST = (now = new Date()) => now.toLocaleDateString('en-CA', { timeZone: TZ });
