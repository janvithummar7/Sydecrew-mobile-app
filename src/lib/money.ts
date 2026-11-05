/**
 * Money is integer paise everywhere (API, database, app). These helpers only
 * format paise for display and parse what people type (rupees) exactly,
 * without floating point.
 */

/** 150000 -> "₹1,500"; 150050 -> "₹1,500.50" (Indian grouping: ₹1,50,000). */
export function formatPaise(paise: number | null | undefined): string {
  if (paise === null || paise === undefined || !Number.isFinite(paise)) return '—';
  const negative = paise < 0;
  const abs = Math.abs(Math.round(paise));
  const rupees = Math.floor(abs / 100);
  const rest = abs % 100;
  const grouped = groupIndian(String(rupees));
  return `${negative ? '-' : ''}₹${grouped}${rest ? `.${String(rest).padStart(2, '0')}` : ''}`;
}

/** "1500000" -> "15,00,000" (lakh / crore grouping, independent of the device's Intl support). */
function groupIndian(digits: string): string {
  if (digits.length <= 3) return digits;
  const last3 = digits.slice(-3);
  const head = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${head},${last3}`;
}

/**
 * What a person typed in rupees -> paise, or null if it is not a valid amount.
 * Accepts "1500", "1,500", "₹1,500.5", "1500.50". Rejects more than 2 decimals,
 * negatives, letters and empty input.
 */
export function parseRupees(input: string): number | null {
  const s = String(input ?? '').trim().replace(/^₹\s*/, '').replace(/,/g, '');
  const m = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) return null;
  const whole = Number(m[1]);
  const frac = m[2] ? Number(m[2].padEnd(2, '0')) : 0;
  return whole * 100 + frac;
}

/** Paise -> the rupee text shown in an input ("1500" or "1500.50"). */
export function paiseToInput(paise: number | null | undefined): string {
  if (paise === null || paise === undefined) return '';
  const rest = paise % 100;
  return rest ? `${Math.floor(paise / 100)}.${String(rest).padStart(2, '0')}` : String(Math.floor(paise / 100));
}

/** The one money formatter (paise in, rupees out), same name as on web. */
export const formatINR = formatPaise;
