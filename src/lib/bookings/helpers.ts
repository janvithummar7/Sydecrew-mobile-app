/**
 * Booking helpers (Feature 4). Pure and unit-tested (test/bookings.test.ts):
 * idempotency keys, price lines, status and action mapping, the request SLA
 * countdown and polling the booking after payment. Money stays in paise.
 */
import type { Booking, BookingActions, BookingStatus, Breakdown } from './types';

// ── Idempotency ─────────────────────────────────────────────────────────

/** A key the API accepts (8–60 of A–Z a–z 0–9 _ . : -). One per booking attempt. */
export function newIdempotencyKey(now = Date.now(), random: () => number = Math.random): string {
  const rand = Array.from({ length: 4 }, () => Math.floor(random() * 0xffffffff).toString(36).padStart(7, '0')).join('');
  return `bk-${now.toString(36)}-${rand}`.slice(0, 60);
}
export const IDEMPOTENCY_KEY_RE = /^[A-Za-z0-9_.:-]{8,60}$/;

/**
 * The key for one attempt at booking one quote. A double tap or a retry after
 * a timeout reuses it (the API returns the same booking); a new quote starts
 * a new attempt with a new key.
 */
export function createAttempt(make: () => string = () => newIdempotencyKey()) {
  let quoteId: string | null = null;
  let key: string | null = null;
  return {
    keyFor(q: string): string {
      if (q !== quoteId || !key) {
        quoteId = q;
        key = make();
      }
      return key;
    },
    reset() {
      quoteId = null;
      key = null;
    },
  };
}

/** Errors after which the customer must get a new quote (the time was taken, or the quote ran out). */
export const REQUOTE_CODES = new Set(['SLOT_UNAVAILABLE', 'CUSTOMER_TIME_CONFLICT', 'QUOTE_EXPIRED', 'QUOTE_ALREADY_USED', 'QUOTE_NOT_FOUND']);

// ── Price lines ─────────────────────────────────────────────────────────

/** 90 -> "1 h 30 min"; 60 -> "1 h"; 45 -> "45 min". */
export function durationLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export type PriceLine = { key: string; label: string; paise: number; strong?: boolean };

/** What the customer pays, line by line (zero fee / GST / discount lines are left out). Sums to the total. */
export function customerLines(b: Breakdown, durationMinutes: number): PriceLine[] {
  const lines: PriceLine[] = [{ key: 'subtotal', label: `Companion's time (${durationLabel(durationMinutes)})`, paise: b.subtotal_paise }];
  if (b.discount_paise) lines.push({ key: 'discount', label: 'Discount', paise: -b.discount_paise });
  if (b.customer_fee_paise) lines.push({ key: 'fee', label: 'Service fee', paise: b.customer_fee_paise });
  if (b.gst_on_fee_paise) lines.push({ key: 'gst_fee', label: 'GST on the service fee', paise: b.gst_on_fee_paise });
  lines.push({ key: 'total', label: 'Total', paise: b.total_paise, strong: true });
  return lines;
}

/** Lines that add up to the total (everything except the total row). */
export const linesSum = (lines: PriceLine[]) => lines.filter((l) => l.key !== 'total').reduce((s, l) => s + l.paise, 0);

/** The companion's side of a booking: subtotal, commission and GST on it, earnings. */
export function companionLines(m: Booking['money']): PriceLine[] {
  const lines: PriceLine[] = [{ key: 'subtotal', label: 'Booking value', paise: m.subtotal_paise }];
  if (m.commission_paise) lines.push({ key: 'commission', label: 'Sydecrew commission', paise: -m.commission_paise });
  if (m.gst_on_commission_paise) lines.push({ key: 'gst_commission', label: 'GST on the commission', paise: -m.gst_on_commission_paise });
  lines.push({ key: 'earnings', label: 'Your earnings', paise: m.earnings_paise ?? 0, strong: true });
  return lines;
}

// ── Status and actions ──────────────────────────────────────────────────

export type BadgeKind = 'verified' | 'pending' | 'needs-changes' | 'live' | 'paused' | 'suspended' | 'neutral' | 'info';

const STATUS: Record<BookingStatus, { label: string; badge: BadgeKind }> = {
  DRAFT: { label: 'Draft', badge: 'neutral' },
  REQUESTED: { label: 'Request sent', badge: 'pending' },
  AWAITING_COMPANION: { label: 'Waiting for the companion', badge: 'pending' },
  ACCEPTED: { label: 'Accepted', badge: 'info' },
  REJECTED: { label: 'Not accepted', badge: 'neutral' },
  PAYMENT_PENDING: { label: 'Waiting for payment', badge: 'pending' },
  CONFIRMED: { label: 'Confirmed', badge: 'verified' },
  IN_PROGRESS: { label: 'In progress', badge: 'live' },
  COMPLETED: { label: 'Completed', badge: 'verified' },
  CANCELLED: { label: 'Cancelled', badge: 'neutral' },
  EXPIRED: { label: 'Expired', badge: 'neutral' },
  DISPUTED: { label: 'Issue under review', badge: 'needs-changes' },
  REFUNDED: { label: 'Refunded', badge: 'neutral' },
  PARTIALLY_REFUNDED: { label: 'Partly refunded', badge: 'neutral' },
};
/** Companion wording where it differs ("Waiting for you"). */
const COMPANION_STATUS: Partial<Record<BookingStatus, string>> = { AWAITING_COMPANION: 'Waiting for your answer', PAYMENT_PENDING: 'Waiting for the customer to pay' };

export function statusView(status: BookingStatus, viewer: 'CUSTOMER' | 'COMPANION' = 'CUSTOMER') {
  const s = STATUS[status];
  return { label: (viewer === 'COMPANION' && COMPANION_STATUS[status]) || s.label, badge: s.badge };
}

export type ActionKey = 'pay' | 'check_in' | 'check_out' | 'accept' | 'reject' | 'cancel' | 'report_issue';
const ACTION_ORDER: [ActionKey, keyof BookingActions][] = [
  ['accept', 'can_accept'],
  ['pay', 'can_pay'],
  ['check_in', 'can_check_in'],
  ['check_out', 'can_check_out'],
  ['reject', 'can_reject'],
  ['report_issue', 'can_report_issue'],
  ['cancel', 'can_cancel'],
];
/** The buttons to show, most important first; only what the API allows (`actions`), nothing guessed. */
export function actionList(actions: BookingActions): ActionKey[] {
  return ACTION_ORDER.filter(([, flag]) => actions[flag]).map(([k]) => k);
}

/** Show the "booking day" screen: confirmed or in progress (check-in, boundaries, SOS). */
export const isBookingDay = (b: Pick<Booking, 'status'>) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS';

// ── Request SLA ─────────────────────────────────────────────────────────

/** "2 h 15 min left" / "12 min left" / "Expired" until a due time (the companion's answer, or the payment window). */
export function countdown(dueIso: string | null | undefined, now = Date.now()): { expired: boolean; minutes: number; label: string } {
  if (!dueIso) return { expired: false, minutes: 0, label: '' };
  const ms = Date.parse(dueIso) - now;
  if (!(ms > 0)) return { expired: true, minutes: 0, label: 'Expired' };
  const minutes = Math.ceil(ms / 60_000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const label = h && m ? `${h} h ${m} min left` : h ? `${h} h left` : `${m} min left`;
  return { expired: false, minutes, label };
}

// ── Payment result ──────────────────────────────────────────────────────

export type PaymentOutcome = 'confirmed' | 'failed' | 'closed' | 'pending';

/**
 * What the booking says about the payment. The return from the checkout is
 * never trusted: only the API's booking status confirms.
 */
export function paymentOutcome(b: Pick<Booking, 'status' | 'payment'>): PaymentOutcome {
  if (['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(b.status)) return 'confirmed';
  if (b.status !== 'PAYMENT_PENDING') return 'closed';
  if (b.payment?.status === 'FAILED') return 'failed';
  return 'pending';
}

/**
 * Polls GET /bookings/:id until the payment outcome is known, or gives up
 * after `timeoutMs` (still 'pending': the screen says "still checking" and
 * offers a refresh). `sleep` and `now` are injectable for tests.
 */
export async function pollPayment(
  fetch: () => Promise<Booking>,
  { intervalMs = 2000, timeoutMs = 60_000, sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms)), now = () => Date.now(), signal }: { intervalMs?: number; timeoutMs?: number; sleep?: (ms: number) => Promise<void>; now?: () => number; signal?: { aborted: boolean } } = {},
): Promise<{ outcome: PaymentOutcome; booking: Booking | null; attempts: number }> {
  const start = now();
  let attempts = 0;
  let last: Booking | null = null;
  for (;;) {
    if (signal?.aborted) return { outcome: 'pending', booking: last, attempts };
    attempts += 1;
    try {
      last = await fetch();
      const outcome = paymentOutcome(last);
      if (outcome !== 'pending') return { outcome, booking: last, attempts };
    } catch {
      // offline for a moment: keep trying until the timeout
    }
    if (now() - start + intervalMs > timeoutMs) return { outcome: 'pending', booking: last, attempts };
    await sleep(intervalMs);
  }
}

// ── Form helpers ────────────────────────────────────────────────────────

/** Durations offered in the form: min..max in 30-minute steps (and the max itself). */
export function durationChoices(min: number, max: number, step = 30): number[] {
  const out: number[] = [];
  for (let m = min; m <= max; m += step) out.push(m);
  if (out[out.length - 1] !== max && max > min) out.push(max);
  return out;
}

/** "18:30" for a UTC instant, in IST (the quote takes IST wall-clock time). */
export function hhmmIST(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
}
