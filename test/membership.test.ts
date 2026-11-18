// Membership (D12): status label and message, next-charge sentence, plan buttons (start / upgrade / downgrade / stay),
// confirm text, cancel body and request, the member price lines on a quote, and the autopay polling outcome.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  autopayOutcome,
  autopayResult,
  cancelBody,
  cancelRequest,
  canCancel,
  canResume,
  changeKind,
  changeResultText,
  confirmFor,
  nextChargeSentence,
  pendingSentence,
  planAction,
  planBenefits,
  pollMembership,
  startNote,
  statusLabel,
  statusMessage,
  statusTone,
} from '../src/lib/membership/helpers.ts';
import { customerLines, memberFeeNote } from '../src/lib/bookings/helpers.ts';
import { autopay, membership } from '../src/content/membership.ts';
import { MockMandateScenarioValues, SubscriptionStatusValues } from '../src/lib/contract/enums.ts';
import type { Membership, MembershipOverview, MembershipPlan } from '../src/lib/membership/types.ts';
import type { Breakdown } from '../src/lib/bookings/types.ts';

const PREMIUM: MembershipPlan = {
  id: '11111111-1111-4111-8111-111111111111',
  code: 'PREMIUM',
  name: 'Premium',
  description: null,
  price_paise: 29900,
  billing_interval: 'MONTH',
  trial_days: 7,
  booking_discount_percent: 5,
  service_fee_waived: false,
  benefits: [],
};
const ELITE: MembershipPlan = { ...PREMIUM, id: '22222222-2222-4222-8222-222222222222', code: 'ELITE', name: 'Elite', price_paise: 79900, booking_discount_percent: 10, service_fee_waived: true };

const member = (over: Partial<Membership> = {}): Membership => ({
  id: '33333333-3333-4333-8333-333333333333',
  status: 'ACTIVE',
  plan: { id: PREMIUM.id, code: 'PREMIUM', name: 'Premium' },
  price_paise: 29900,
  benefits: { booking_discount_percent: 5, service_fee_waived: false },
  current_period_start: '2026-11-17T06:30:00.000Z',
  current_period_end: '2026-12-17T06:30:00.000Z',
  trial_ends_at: null,
  cancel_at_period_end: false,
  pending_plan: null,
  grace_until: null,
  next_charge: { at: '2026-12-17T06:30:00.000Z', amount_paise: 29900 },
  ...over,
});
const overview = (current: Membership | null): MembershipOverview => ({ plans: [PREMIUM, ELITE], current, trial_eligible: false, receipts: [] });

// ── Copy ────────────────────────────────────────────────────────────────

test('copy: a label for every status and test scenario; the trial note matches the product wording', () => {
  for (const s of SubscriptionStatusValues) assert.ok(membership.statusLabels[s], s);
  for (const s of MockMandateScenarioValues) assert.ok(autopay.scenarios[s], s);
  assert.equal(startNote(PREMIUM, true), 'Free for 7 days, then ₹299 a month. We remind you before the first charge. Cancel any time.');
  assert.equal(startNote(PREMIUM, false), '₹299 a month by autopay, starting today. We remind you before every charge. Cancel any time.');
  assert.equal(startNote({ ...PREMIUM, trial_days: 0 }, true), startNote(PREMIUM, false), 'no trial on the plan: no trial promise');
  assert.match(autopay.testTitle, /no real money/);
});

// ── Status ──────────────────────────────────────────────────────────────

test('status: label, tone and message for trial, active, cancelling and past due', () => {
  const trial = member({ status: 'TRIALING', trial_ends_at: '2026-11-24T06:30:00.000Z', current_period_end: '2026-11-24T06:30:00.000Z', next_charge: { at: '2026-11-24T06:30:00.000Z', amount_paise: 29900 } });
  assert.equal(statusLabel(trial), 'Free trial');
  assert.equal(statusMessage(trial), 'Your free trial ends on 24 November 2026.');
  assert.equal(nextChargeSentence(trial), 'First charge: ₹299 on 24 November 2026, unless you cancel before then.');

  const active = member();
  assert.equal(statusLabel(active), 'Active');
  assert.equal(statusTone(active), 'ok');
  assert.equal(statusMessage(active), 'Your membership renews on 17 December 2026.');
  assert.equal(nextChargeSentence(active), 'Next charge: ₹299 on 17 December 2026 by autopay.');

  const ending = member({ cancel_at_period_end: true, next_charge: null });
  assert.equal(statusLabel(ending), 'Ending');
  assert.equal(statusMessage(ending), 'Your membership ends on 17 December 2026. Autopay is off, so you will not be charged again.');
  assert.equal(nextChargeSentence(ending), null);
  assert.equal(nextChargeSentence(member({ cancel_at_period_end: true })), null, 'never a next charge while cancelling');

  const due = member({ status: 'PAST_DUE', grace_until: '2026-12-24T06:30:00.000Z', next_charge: null });
  assert.equal(statusLabel(due), 'Payment due');
  assert.equal(statusTone(due), 'warn');
  assert.match(statusMessage(due), /did not go through.*continue until 24 December 2026/);
});

test('status: a booked downgrade names the plan, the date and the new price', () => {
  const m = member({ plan: { id: ELITE.id, code: 'ELITE', name: 'Elite' }, price_paise: 79900, pending_plan: { id: PREMIUM.id, code: 'PREMIUM', name: 'Premium', price_paise: 29900 } });
  assert.equal(pendingSentence(m), 'Moving to Premium on 17 December 2026. You will then pay ₹299 a month.');
  assert.equal(pendingSentence(member()), null);
});

test('benefits: the API list when given, otherwise from the discount and fee flags', () => {
  assert.deepEqual(planBenefits(ELITE), ['10% off bookings', 'No service fee']);
  assert.deepEqual(planBenefits({ ...PREMIUM, benefits: ['5% off bookings', 'Priority support'] }), ['5% off bookings', 'Priority support']);
});

// ── Plan buttons ────────────────────────────────────────────────────────

test('plan buttons: start (trial only when eligible), upgrade, downgrade, current, stay, pending, blocked', () => {
  assert.deepEqual(planAction(PREMIUM, null, true), { kind: 'start', label: 'Start free trial' });
  assert.deepEqual(planAction(PREMIUM, null, false), { kind: 'start', label: 'Choose Premium' });

  const onPremium = member();
  assert.equal(changeKind(onPremium, ELITE), 'upgrade');
  assert.deepEqual(planAction(PREMIUM, onPremium, false), { kind: 'current' });
  assert.deepEqual(planAction(ELITE, onPremium, false), { kind: 'upgrade', label: 'Upgrade to Elite' });

  const onElite = member({ plan: { id: ELITE.id, code: 'ELITE', name: 'Elite' }, price_paise: 79900 });
  assert.equal(changeKind(onElite, PREMIUM), 'downgrade');
  assert.deepEqual(planAction(PREMIUM, onElite, false), { kind: 'downgrade', label: 'Switch to Premium' });

  const booked = { ...onElite, pending_plan: { id: PREMIUM.id, code: 'PREMIUM', name: 'Premium', price_paise: 29900 } };
  assert.deepEqual(planAction(ELITE, booked, false), { kind: 'stay', label: 'Stay on Elite' }, 'the current plan cancels a booked downgrade');
  assert.deepEqual(planAction(PREMIUM, booked, false), { kind: 'pending' });

  assert.equal(planAction(ELITE, member({ status: 'PAST_DUE' }), false).kind, 'blocked');
  assert.equal(planAction(ELITE, member({ cancel_at_period_end: true }), false).kind, 'blocked');
  assert.equal(planAction(ELITE, member({ status: 'EXPIRED' }), true).kind, 'start', 'an ended membership is like free');
});

test('confirm text: start explains the trial, upgrade is charged now (free in a trial), downgrade from the renewal date', () => {
  const start = confirmFor({ kind: 'start', label: '' }, PREMIUM, null, true)!;
  assert.equal(start.title, 'Start Premium?');
  assert.match(start.body, /^Free for 7 days, then ₹299 a month\./);
  assert.match(start.body, /approve autopay/);

  const up = confirmFor({ kind: 'upgrade', label: '' }, ELITE, member(), false)!;
  assert.equal(up.title, 'Upgrade to Elite?');
  assert.equal(up.body, 'Elite starts now. Today we charge the difference for the rest of this month, then ₹799 a month from 17 December 2026.');

  const trial = member({ status: 'TRIALING', trial_ends_at: '2026-11-24T06:30:00.000Z' });
  assert.equal(confirmFor({ kind: 'upgrade', label: '' }, ELITE, trial, false)!.body, 'Elite starts now and stays free until your trial ends on 24 November 2026. Then ₹799 a month.');

  const onElite = member({ plan: { id: ELITE.id, code: 'ELITE', name: 'Elite' }, price_paise: 79900 });
  assert.equal(confirmFor({ kind: 'downgrade', label: '' }, PREMIUM, onElite, false)!.body, 'You keep Elite until 17 December 2026. Premium starts then, at ₹299 a month.');
  assert.equal(confirmFor({ kind: 'current' }, PREMIUM, member(), false), null);
});

test('change result: charged amount on upgrade, the date on downgrade', () => {
  assert.equal(changeResultText('upgrade', ELITE, { subscription: member(), charged_paise: 16667 }), 'You are now on Elite. We charged ₹166.67 for the rest of this month.');
  assert.equal(changeResultText('upgrade', ELITE, { subscription: member(), charged_paise: 0 }), 'You are now on Elite.');
  assert.equal(changeResultText('downgrade', PREMIUM, { subscription: member() }), 'Premium starts on 17 December 2026.');
  assert.equal(changeResultText('stay', ELITE, { subscription: member() }), 'You are staying on Elite.');
});

test('cancel: benefits until the period end (ends now when past due); reason trimmed and optional; keep only while cancelling', () => {
  assert.equal(cancelBody(member()), 'Autopay turns off now and you will not be charged again. Your benefits last until 17 December 2026.');
  assert.equal(cancelBody(member({ status: 'PAST_DUE' })), 'Your membership ends now and we stop trying to charge you.');
  assert.deepEqual(cancelRequest('   '), {});
  assert.deepEqual(cancelRequest('  Too expensive '), { reason: 'Too expensive' });
  assert.ok(canCancel(member()) && !canResume(member()));
  assert.ok(!canCancel(member({ cancel_at_period_end: true })) && canResume(member({ cancel_at_period_end: true })));
  assert.ok(canCancel(member({ status: 'PAST_DUE' })) && !canResume(member({ status: 'PAST_DUE', cancel_at_period_end: true })));
  assert.ok(!canCancel(null) && !canResume(null));
});

// ── Autopay result ──────────────────────────────────────────────────────

test('autopay outcome: trial / active / past due from the API; none = failed once settled or declined', () => {
  assert.equal(autopayOutcome(overview(member({ status: 'TRIALING' }))), 'trial');
  assert.equal(autopayOutcome(overview(member())), 'active');
  assert.equal(autopayOutcome(overview(member({ status: 'PAST_DUE' }))), 'past_due');
  assert.equal(autopayOutcome(overview(null)), 'pending', 'the webhook may not have landed yet');
  assert.equal(autopayOutcome(overview(null), { settled: true }), 'failed');
  assert.equal(autopayOutcome(overview(null), { declined: true }), 'failed');
  assert.equal(autopayResult('failed', null).title, 'Your membership did not start');
  assert.equal(autopayResult('active', member()).title, 'Welcome to Premium');
});

test('pollMembership: stops at a live membership, gives up as failed after it settles, pending at the timeout', async () => {
  let t = 0;
  const clock = { sleep: async (ms: number) => void (t += ms), now: () => t };
  const answers = [overview(null), overview(member({ status: 'TRIALING' }))];
  let i = 0;
  const started = await pollMembership(async () => answers[Math.min(i++, answers.length - 1)], { ...clock, settleAfter: 3 });
  assert.equal(started.outcome, 'trial');
  assert.equal(started.attempts, 2);

  t = 0;
  const failed = await pollMembership(async () => overview(null), { ...clock, settleAfter: 3 });
  assert.equal(failed.outcome, 'failed');
  assert.equal(failed.attempts, 3);

  t = 0;
  const offline = await pollMembership(async () => Promise.reject(new Error('offline')), { ...clock, intervalMs: 1500, timeoutMs: 20_000 });
  assert.equal(offline.outcome, 'pending');
  assert.ok(offline.attempts >= 13 && offline.attempts <= 14, `about 20 s of 1.5 s polls (${offline.attempts})`);

  const aborted = await pollMembership(async () => overview(null), { ...clock, signal: { aborted: true } });
  assert.equal(aborted.attempts, 0);
});

// ── Member prices on a quote ────────────────────────────────────────────

const breakdown = (over: Partial<Breakdown> = {}): Breakdown => ({
  hourly_rate_paise: 100000,
  subtotal_paise: 100000,
  customer_fee_paise: 3000,
  gst_on_fee_paise: 540,
  discount_paise: 0,
  total_paise: 103540,
  commission_paise: 20000,
  gst_on_commission_paise: 3600,
  companion_earnings_paise: 76400,
  is_repeat: false,
  member_plan_name: null,
  member_fee_waived_paise: 0,
  ...over,
});

test('quote: "Member discount (Premium)" line and a waived-fee note only for members', () => {
  const premium = customerLines(breakdown({ member_plan_name: 'Premium', discount_paise: 5000, total_paise: 98540 }), 60);
  const line = premium.find((l) => l.key === 'discount')!;
  assert.equal(line.label, 'Member discount (Premium)');
  assert.equal(line.paise, -5000);
  assert.equal(memberFeeNote(breakdown({ member_plan_name: 'Premium' })), null, 'Premium still pays the fee');
  assert.equal(memberFeeNote(breakdown({ member_plan_name: 'Premium', customer_fee_paise: 0 })), null, 'no fee for anyone is not a waiver');
  const elite = breakdown({ member_plan_name: 'Elite', discount_paise: 10000, customer_fee_paise: 0, gst_on_fee_paise: 0, total_paise: 90000, member_fee_waived_paise: 5000 });
  assert.equal(memberFeeNote(elite), 'No service fee with your Elite membership.');
  assert.ok(!customerLines(elite, 60).some((l) => l.key === 'fee'));
  assert.equal(memberFeeNote(breakdown({ customer_fee_paise: 0 })), null, 'no note for non-members');
  assert.equal(customerLines(breakdown({ discount_paise: 2000 }), 60).find((l) => l.key === 'discount')!.label, 'Discount');
});
