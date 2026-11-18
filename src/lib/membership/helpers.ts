/**
 * Membership helpers (pure, unit-tested in test/membership.test.ts): the
 * status label and message, the next-charge sentence, what each plan's button
 * does (start, upgrade, downgrade, stay), the confirm text for it, the cancel
 * body, and the autopay polling outcome.
 */
import { autopay as autopayCopy, membership as copy } from '../../content/membership';
import { formatINR } from '../money';
import { formatDateIST } from '../time';
import type { Membership, MembershipOverview, MembershipPlan, SubscriptionStatus } from './types';

/** Statuses with member benefits (the only ones GET /subscriptions returns as `current`). */
export const LIVE_STATUSES: readonly SubscriptionStatus[] = ['TRIALING', 'ACTIVE', 'PAST_DUE'];
export const isLive = (m: Pick<Membership, 'status'> | null | undefined): m is Membership => !!m && LIVE_STATUSES.includes(m.status);

/** Short badge text: "Free trial", "Active", "Payment due", or "Ending" once cancelled at period end. */
export function statusLabel(m: Pick<Membership, 'status' | 'cancel_at_period_end'>): string {
  if (m.cancel_at_period_end && (m.status === 'TRIALING' || m.status === 'ACTIVE')) return copy.endingLabel;
  return copy.statusLabels[m.status];
}

export type StatusTone = 'ok' | 'warn' | 'info';
export const statusTone = (m: Pick<Membership, 'status' | 'cancel_at_period_end'>): StatusTone =>
  m.status === 'PAST_DUE' ? 'warn' : m.cancel_at_period_end ? 'info' : m.status === 'TRIALING' || m.status === 'ACTIVE' ? 'ok' : 'info';

/** The membership's last day with benefits (period end; for a trial the trial end when known). */
export const periodEnd = (m: Pick<Membership, 'status' | 'trial_ends_at' | 'current_period_end'>): string | null =>
  (m.status === 'TRIALING' ? m.trial_ends_at : null) ?? m.current_period_end;

/** One sentence about where the membership stands. */
export function statusMessage(m: Membership): string {
  const end = periodEnd(m);
  if (m.status === 'PAST_DUE') return m.grace_until ? copy.status.pastDue(formatDateIST(m.grace_until)) : copy.status.pastDueNoDate;
  if (m.status === 'INCOMPLETE') return copy.status.incomplete;
  if (!isLive(m)) return copy.status.ended;
  if (m.cancel_at_period_end && end) return copy.status.cancelling(formatDateIST(end));
  if (m.status === 'TRIALING' && end) return copy.status.trial(formatDateIST(end));
  return m.current_period_end ? copy.status.active(formatDateIST(m.current_period_end)) : copy.status.activeNoDate;
}

/** "Next charge: ₹299 on 24 November 2026 by autopay." ("First charge: …" in a trial); null when nothing is due (cancelling, past due). */
export function nextChargeSentence(m: Membership): string | null {
  if (!m.next_charge?.at || m.cancel_at_period_end) return null;
  const amount = formatINR(m.next_charge.amount_paise);
  const date = formatDateIST(m.next_charge.at);
  return m.status === 'TRIALING' ? copy.firstCharge(amount, date) : copy.nextCharge(amount, date);
}

/** "Moving to Premium on 24 November 2026. You will then pay ₹299 a month." or null. */
export function pendingSentence(m: Membership): string | null {
  if (!m.pending_plan || !m.current_period_end) return null;
  return copy.pendingDowngrade(m.pending_plan.name, formatDateIST(m.current_period_end), formatINR(m.pending_plan.price_paise));
}

/** Benefit lines for a plan: the API's list, or ones made from the discount and fee flags. */
export function planBenefits(p: Pick<MembershipPlan, 'benefits' | 'booking_discount_percent' | 'service_fee_waived'>): string[] {
  if (p.benefits?.length) return p.benefits;
  const out: string[] = [];
  if (p.booking_discount_percent > 0) out.push(copy.discount(p.booking_discount_percent));
  if (p.service_fee_waived) out.push(copy.noFee);
  return out;
}

/** The note under a plan before starting it: the free trial only when the person is eligible and the plan has one. */
export function startNote(p: Pick<MembershipPlan, 'price_paise' | 'trial_days'>, trialEligible: boolean): string {
  const amount = formatINR(p.price_paise);
  return trialEligible && p.trial_days > 0 ? copy.trialNote(p.trial_days, amount) : copy.paidNote(amount);
}

// ── What a plan's button does ───────────────────────────────────────────

export type PlanAction =
  | { kind: 'start'; label: string }
  | { kind: 'current' }
  | { kind: 'stay'; label: string }
  | { kind: 'pending' }
  | { kind: 'upgrade'; label: string }
  | { kind: 'downgrade'; label: string }
  | { kind: 'blocked'; reason: string }
  /** The Free card when the person is a member: leaving is "Cancel membership" on the status card. */
  | { kind: 'none' };

/** Upgrade when the target costs more than what the member pays now; downgrade when less. */
export function changeKind(current: Pick<Membership, 'price_paise' | 'plan'>, target: Pick<MembershipPlan, 'id' | 'price_paise'>): 'same' | 'upgrade' | 'downgrade' {
  if (target.id === current.plan.id) return 'same';
  return target.price_paise > current.price_paise ? 'upgrade' : 'downgrade';
}

/** The button for a paid plan, given the current membership (null = free). */
export function planAction(plan: MembershipPlan, current: Membership | null, trialEligible: boolean): PlanAction {
  if (!isLive(current)) return { kind: 'start', label: trialEligible && plan.trial_days > 0 ? copy.startTrial : copy.choose(plan.name) };
  const kind = changeKind(current, plan);
  if (kind === 'same') return current.pending_plan ? { kind: 'stay', label: copy.stay(plan.name) } : { kind: 'current' };
  if (current.pending_plan?.id === plan.id) return { kind: 'pending' };
  if (current.status === 'PAST_DUE') return { kind: 'blocked', reason: copy.blockedPastDue };
  if (current.cancel_at_period_end) return { kind: 'blocked', reason: copy.blockedCancelling };
  return kind === 'upgrade' ? { kind: 'upgrade', label: copy.upgrade(plan.name) } : { kind: 'downgrade', label: copy.downgrade(plan.name) };
}

export type Confirm = { title: string; body: string; confirm: string };

/** Text for the native confirm before starting, upgrading, downgrading or staying. */
export function confirmFor(action: PlanAction, plan: MembershipPlan, current: Membership | null, trialEligible: boolean): Confirm | null {
  const amount = formatINR(plan.price_paise);
  switch (action.kind) {
    case 'start':
      return { title: copy.startTitle(plan.name), body: `${startNote(plan, trialEligible)}\n\n${copy.startNext}`, confirm: copy.startConfirm };
    case 'upgrade': {
      if (!current) return null;
      const end = periodEnd(current);
      const date = end ? formatDateIST(end) : '—';
      const body = current.status === 'TRIALING' ? copy.upgradeTrialBody(plan.name, amount, date) : copy.upgradeBody(plan.name, amount, date);
      return { title: copy.upgradeTitle(plan.name), body, confirm: copy.upgradeConfirm };
    }
    case 'downgrade': {
      if (!current) return null;
      const date = current.current_period_end ? formatDateIST(current.current_period_end) : '—';
      return { title: copy.downgradeTitle(plan.name), body: copy.downgradeBody(current.plan.name, plan.name, amount, date), confirm: copy.downgradeConfirm };
    }
    case 'stay':
      return current?.pending_plan ? { title: copy.stayTitle(plan.name), body: copy.stayBody(current.pending_plan.name), confirm: copy.stayConfirm } : null;
    default:
      return null;
  }
}

/** The toast after POST /subscriptions/me/change. */
export function changeResultText(kind: 'upgrade' | 'downgrade' | 'stay', plan: Pick<MembershipPlan, 'name'>, result: { subscription: Membership | null; charged_paise?: number }): string {
  if (kind === 'stay') return copy.stayed(plan.name);
  if (kind === 'downgrade') {
    const end = result.subscription?.current_period_end;
    return copy.downgraded(plan.name, end ? formatDateIST(end) : '—');
  }
  return result.charged_paise ? copy.upgradedCharged(plan.name, formatINR(result.charged_paise)) : copy.upgraded(plan.name);
}

/** What cancelling means for this membership (PAST_DUE ends at once). */
export function cancelBody(m: Membership): string {
  if (m.status === 'PAST_DUE') return copy.cancelBodyPastDue;
  const end = periodEnd(m);
  return copy.cancelBody(end ? formatDateIST(end) : '—');
}

/** POST /subscriptions/me/cancel body: the trimmed reason, left out when empty. */
export function cancelRequest(reason: string): { reason?: string } {
  const r = reason.trim().slice(0, 500);
  return r ? { reason: r } : {};
}

export const canCancel = (m: Membership | null): boolean => isLive(m) && (m.status === 'PAST_DUE' || !m.cancel_at_period_end);
export const canResume = (m: Membership | null): boolean => isLive(m) && m.status !== 'PAST_DUE' && m.cancel_at_period_end;

// ── Autopay result ──────────────────────────────────────────────────────

export type AutopayOutcome = 'trial' | 'active' | 'past_due' | 'failed' | 'pending';

/**
 * The result of approving autopay, from GET /subscriptions. `current` holds
 * only live memberships, so "none" means declined / first charge failed once
 * the webhook has had its moment (`settled`), or straight away when the test
 * scenario was a decline.
 */
export function autopayOutcome(o: Pick<MembershipOverview, 'current'>, { settled = false, declined = false }: { settled?: boolean; declined?: boolean } = {}): AutopayOutcome {
  const s = o.current?.status;
  if (s === 'TRIALING') return 'trial';
  if (s === 'ACTIVE') return 'active';
  if (s === 'PAST_DUE') return 'past_due';
  if (s === 'INCOMPLETE') return 'pending';
  return declined || settled ? 'failed' : 'pending';
}

/**
 * Polls GET /subscriptions (every ~1.5 s, up to ~20 s) until the outcome is
 * known. An empty `current` counts as failed from the `settleAfter`-th
 * answer on. `sleep` and `now` are injectable for tests.
 */
export async function pollMembership(
  fetch: () => Promise<MembershipOverview>,
  {
    intervalMs = 1500,
    timeoutMs = 20_000,
    settleAfter = 3,
    declined = false,
    sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
    now = () => Date.now(),
    signal,
  }: { intervalMs?: number; timeoutMs?: number; settleAfter?: number; declined?: boolean; sleep?: (ms: number) => Promise<void>; now?: () => number; signal?: { aborted: boolean } } = {},
): Promise<{ outcome: AutopayOutcome; overview: MembershipOverview | null; attempts: number }> {
  const start = now();
  let attempts = 0;
  let answers = 0;
  let last: MembershipOverview | null = null;
  for (;;) {
    if (signal?.aborted) return { outcome: 'pending', overview: last, attempts };
    attempts += 1;
    try {
      last = await fetch();
      answers += 1;
      const outcome = autopayOutcome(last, { declined, settled: answers >= settleAfter });
      if (outcome !== 'pending') return { outcome, overview: last, attempts };
    } catch {
      // offline for a moment: keep trying until the timeout
    }
    if (now() - start + intervalMs > timeoutMs) return { outcome: 'pending', overview: last, attempts };
    await sleep(intervalMs);
  }
}

/** Title and body for a known autopay outcome. */
export function autopayResult(outcome: Exclude<AutopayOutcome, 'pending'>, m: Membership | null): { title: string; body: string } {
  if (outcome === 'trial' && m) {
    const end = periodEnd(m);
    return { title: autopayCopy.trialTitle, body: autopayCopy.trialBody(m.plan.name, end ? formatDateIST(end) : '—', formatINR(m.next_charge?.amount_paise ?? m.price_paise)) };
  }
  if (outcome === 'active' && m) {
    const next = nextChargeSentence(m);
    return { title: autopayCopy.activeTitle(m.plan.name), body: next ? `${autopayCopy.activeBody} ${next}` : autopayCopy.activeBody };
  }
  if (outcome === 'past_due' && m) return { title: autopayCopy.pastDueTitle, body: statusMessage(m) };
  return { title: autopayCopy.failedTitle, body: autopayCopy.failedBody };
}
