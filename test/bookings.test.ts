// Booking helpers (Feature 4): idempotency keys, price lines, status / actions mapping, SLA countdown, payment polling.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  IDEMPOTENCY_KEY_RE,
  REQUOTE_CODES,
  actionList,
  companionLines,
  countdown,
  createAttempt,
  customerLines,
  durationChoices,
  durationLabel,
  hhmmIST,
  isBookingDay,
  linesSum,
  newIdempotencyKey,
  paymentOutcome,
  pollPayment,
  statusView,
} from '../src/lib/bookings/helpers.ts';
import type { Booking, Breakdown } from '../src/lib/bookings/types.ts';

const breakdown = (over: Partial<Breakdown> = {}): Breakdown => ({
  hourly_rate_paise: 62345,
  subtotal_paise: 93518,
  customer_fee_paise: 0,
  gst_on_fee_paise: 0,
  discount_paise: 0,
  total_paise: 93518,
  commission_paise: 18704,
  gst_on_commission_paise: 3367,
  companion_earnings_paise: 71447,
  is_repeat: false,
  ...over,
});
const noActions = { can_pay: false, can_cancel: false, can_accept: false, can_reject: false, can_check_in: false, can_check_out: false, can_report_issue: false };
const booking = (over: Partial<Booking>): Booking => ({ status: 'PAYMENT_PENDING', payment: null, ...over }) as Booking;

test('idempotency keys match the API rule and stay the same for one attempt', () => {
  for (let i = 0; i < 200; i++) assert.match(newIdempotencyKey(), IDEMPOTENCY_KEY_RE);
  assert.notEqual(newIdempotencyKey(), newIdempotencyKey());
  let n = 0;
  const attempt = createAttempt(() => `key-0000-${++n}`);
  const k1 = attempt.keyFor('quote-a');
  assert.equal(attempt.keyFor('quote-a'), k1, 'double tap / retry: same key');
  const k2 = attempt.keyFor('quote-b');
  assert.notEqual(k2, k1, 'a new quote is a new attempt');
  attempt.reset();
  assert.notEqual(attempt.keyFor('quote-b'), k2, 'reset starts over');
  assert.ok(REQUOTE_CODES.has('SLOT_UNAVAILABLE') && REQUOTE_CODES.has('QUOTE_EXPIRED') && REQUOTE_CODES.has('CUSTOMER_TIME_CONFLICT'));
});

test('price lines: only non-zero extras, and the lines add up to the total', () => {
  const plain = customerLines(breakdown(), 90);
  assert.deepEqual(plain.map((l) => l.key), ['subtotal', 'total']);
  assert.equal(plain[0].label, "Companion's time (1 h 30 min)");
  assert.equal(linesSum(plain), 93518);
  const withFee = breakdown({ customer_fee_paise: 2806, gst_on_fee_paise: 505, total_paise: 96829 });
  const lines = customerLines(withFee, 90);
  assert.deepEqual(lines.map((l) => l.key), ['subtotal', 'fee', 'gst_fee', 'total']);
  assert.equal(linesSum(lines), lines.find((l) => l.key === 'total')!.paise);
  const c = companionLines({ subtotal_paise: 93518, refunded_paise: 0, commission_paise: 18704, gst_on_commission_paise: 3367, earnings_paise: 71447 });
  assert.equal(c.filter((l) => l.key !== 'earnings').reduce((s, l) => s + l.paise, 0), 71447, 'subtotal − commission − GST = earnings');
  assert.deepEqual([durationLabel(60), durationLabel(45), durationLabel(150)], ['1 h', '45 min', '2 h 30 min']);
  assert.deepEqual(durationChoices(60, 240), [60, 90, 120, 150, 180, 210, 240]);
  assert.deepEqual(durationChoices(60, 75), [60, 75]);
});

test('status wording per viewer and buttons only from the API actions, most important first', () => {
  assert.deepEqual(statusView('AWAITING_COMPANION'), { label: 'Waiting for the companion', badge: 'pending' });
  assert.equal(statusView('AWAITING_COMPANION', 'COMPANION').label, 'Waiting for your answer');
  assert.equal(statusView('CONFIRMED').badge, 'verified');
  assert.deepEqual(actionList(noActions), []);
  assert.deepEqual(actionList({ ...noActions, can_cancel: true, can_pay: true }), ['pay', 'cancel']);
  assert.deepEqual(actionList({ ...noActions, can_reject: true, can_accept: true }), ['accept', 'reject']);
  assert.deepEqual(actionList({ ...noActions, can_report_issue: true, can_check_out: true }), ['check_out', 'report_issue']);
  assert.equal(isBookingDay({ status: 'CONFIRMED' }), true);
  assert.equal(isBookingDay({ status: 'COMPLETED' }), false);
});

test('SLA countdown', () => {
  const now = Date.parse('2026-11-07T10:00:00Z');
  assert.deepEqual(countdown('2026-11-07T12:15:00Z', now), { expired: false, minutes: 135, label: '2 h 15 min left' });
  assert.equal(countdown('2026-11-07T12:00:00Z', now).label, '2 h left');
  assert.equal(countdown('2026-11-07T10:00:30Z', now).label, '1 min left');
  assert.equal(countdown('2026-11-07T09:59:00Z', now).expired, true);
  assert.equal(countdown(null, now).label, '');
});

test('payment outcome comes from the booking, never from the checkout return', () => {
  assert.equal(paymentOutcome(booking({ status: 'CONFIRMED' })), 'confirmed');
  assert.equal(paymentOutcome(booking({ status: 'PAYMENT_PENDING', payment: { status: 'FAILED', attempts: 1, in_flight: false } })), 'failed');
  assert.equal(paymentOutcome(booking({ status: 'PAYMENT_PENDING', payment: { status: 'AUTHORIZED', attempts: 1, in_flight: true } })), 'pending');
  assert.equal(paymentOutcome(booking({ status: 'EXPIRED' })), 'closed');
});

test('polling stops at the first settled answer, survives a failed request, and times out as pending', async () => {
  const answers: (Booking | Error)[] = [booking({ payment: { status: 'CREATED', attempts: 1, in_flight: true } }), new Error('offline'), booking({ status: 'CONFIRMED' })];
  let t = 0;
  const r = await pollPayment(async () => {
    const a = answers.shift()!;
    if (a instanceof Error) throw a;
    return a;
  }, { intervalMs: 1000, timeoutMs: 10_000, sleep: async (ms) => { t += ms; }, now: () => t });
  assert.equal(r.outcome, 'confirmed');
  assert.equal(r.attempts, 3);
  t = 0;
  const slow = await pollPayment(async () => booking({}), { intervalMs: 2000, timeoutMs: 7000, sleep: async (ms) => { t += ms; }, now: () => t });
  assert.equal(slow.outcome, 'pending');
  assert.equal(slow.attempts, 4, '0, 2, 4 and 6 s; the next would pass 7 s');
  const aborted = await pollPayment(async () => booking({}), { signal: { aborted: true } });
  assert.equal(aborted.attempts, 0);
});

test('IST wall-clock time for quotes', () => {
  assert.equal(hhmmIST('2026-11-07T13:00:00Z'), '18:30');
});
