/**
 * Weekly availability checks done on the phone before saving (the API
 * repeats them; the database refuses overlaps too). Times are IST wall clock.
 */
export type Slot = { day_of_week: number; start_time: string; end_time: string };

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "9:5" / "09:05" -> minutes since midnight, or null. */
export function toMinutes(t: string): number | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(t.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

export const fromMinutes = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

/** Normalises "9:00" to "09:00"; leaves invalid input as it is. */
export function normaliseTime(t: string): string {
  const n = toMinutes(t);
  return n === null ? t : fromMinutes(n);
}

/** First problem per slot index: bad time, not on the quarter hour, too short, or overlapping another slot that day. */
export function slotErrors(slots: Slot[]): Record<number, string> {
  const errors: Record<number, string> = {};
  const byDay = new Map<number, [number, number, number][]>();
  slots.forEach((s, i) => {
    const a = toMinutes(s.start_time);
    const b = toMinutes(s.end_time);
    if (a === null || b === null) errors[i] = 'Use HH:MM, for example 09:30.';
    else if (a % 15 || b % 15) errors[i] = 'Use quarter hours (:00, :15, :30, :45).';
    else if (a >= b) errors[i] = 'The end must be after the start.';
    else if (b - a < 60) errors[i] = 'Each slot must be at least 1 hour.';
    else {
      const list = byDay.get(s.day_of_week) ?? [];
      const clash = list.find(([x, y]) => a < y && x < b);
      if (clash) errors[i] = `Overlaps another ${DAYS[s.day_of_week]} slot.`;
      list.push([a, b, i]);
      byDay.set(s.day_of_week, list);
    }
  });
  return errors;
}

/** YYYY-MM-DD today in India. */
export const todayIst = (now = new Date()) => now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
