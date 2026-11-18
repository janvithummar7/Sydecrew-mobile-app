/**
 * Membership copy (D12): plans, the status card, plan changes, cancelling,
 * receipts and the autopay step. Plans and prices come from the API; amounts
 * and dates are passed in already formatted (formatINR, formatDateIST).
 * The member discount is paid by Sydecrew, never by the companion.
 */
import type { MockMandateScenario, SubscriptionStatus } from '@/lib/contract/enums';

export const membership = {
  title: 'Membership',
  rowLabel: 'Membership',
  rowDetail: 'Member prices on every booking, paid monthly by autopay.',
  intro: 'Save on every booking. Sydecrew pays the member discount, so companions earn the same.',

  // Plans
  plansTitle: 'Plans',
  freeName: 'Free',
  freeBenefits: ['Standard prices on bookings', 'Safety tools and support on every booking'],
  perMonth: (amount: string) => `${amount} a month`,
  yourPlan: 'Your plan',
  startsOn: (date: string) => `From ${date}`,
  discount: (percent: number) => `${percent}% off bookings`,
  noFee: 'No service fee',
  trialNote: (days: number, amount: string) => `Free for ${days} days, then ${amount} a month. We remind you before the first charge. Cancel any time.`,
  paidNote: (amount: string) => `${amount} a month by autopay, starting today. We remind you before every charge. Cancel any time.`,
  startTrial: 'Start free trial',
  choose: (plan: string) => `Choose ${plan}`,
  upgrade: (plan: string) => `Upgrade to ${plan}`,
  downgrade: (plan: string) => `Switch to ${plan}`,
  stay: (plan: string) => `Stay on ${plan}`,
  blockedPastDue: 'Plan changes open again once your payment goes through.',
  blockedCancelling: 'To change your plan, keep your membership first.',

  // Status card
  statusLabels: {
    INCOMPLETE: 'Setting up',
    TRIALING: 'Free trial',
    ACTIVE: 'Active',
    PAST_DUE: 'Payment due',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Ended',
    SUSPENDED: 'Paused',
  } satisfies Record<SubscriptionStatus, string>,
  endingLabel: 'Ending',
  status: {
    trial: (date: string) => `Your free trial ends on ${date}.`,
    active: (date: string) => `Your membership renews on ${date}.`,
    activeNoDate: 'Your membership is active.',
    cancelling: (date: string) => `Your membership ends on ${date}. Autopay is off, so you will not be charged again.`,
    pastDue: (date: string) => `Your last payment did not go through. We are trying again. Your benefits continue until ${date}, then the membership ends.`,
    pastDueNoDate: 'Your last payment did not go through. We are trying again. Your benefits continue for now.',
    incomplete: 'Waiting for autopay to be approved.',
    ended: 'Your membership has ended.',
  },
  firstCharge: (amount: string, date: string) => `First charge: ${amount} on ${date}, unless you cancel before then.`,
  nextCharge: (amount: string, date: string) => `Next charge: ${amount} on ${date} by autopay.`,
  preDebit: 'We remind you before every charge.',
  pendingDowngrade: (plan: string, date: string, amount: string) => `Moving to ${plan} on ${date}. You will then pay ${amount} a month.`,
  keep: 'Keep my membership',
  cancel: 'Cancel membership',
  discountNote: 'The member discount is paid by Sydecrew. Companions earn the same.',
  confirmedNote: 'Bookings you have already confirmed never change price, even if your membership ends.',

  // Confirm alerts
  alertBack: 'Not now',
  startTitle: (plan: string) => `Start ${plan}?`,
  startNext: 'Next, you approve autopay (UPI Autopay or card).',
  startConfirm: 'Continue',
  upgradeTitle: (plan: string) => `Upgrade to ${plan}?`,
  upgradeBody: (plan: string, amount: string, date: string) =>
    `${plan} starts now. Today we charge the difference for the rest of this month, then ${amount} a month from ${date}.`,
  upgradeTrialBody: (plan: string, amount: string, date: string) => `${plan} starts now and stays free until your trial ends on ${date}. Then ${amount} a month.`,
  upgradeConfirm: 'Upgrade now',
  downgradeTitle: (plan: string) => `Switch to ${plan}?`,
  downgradeBody: (current: string, plan: string, amount: string, date: string) => `You keep ${current} until ${date}. ${plan} starts then, at ${amount} a month.`,
  downgradeConfirm: 'Switch',
  stayTitle: (plan: string) => `Stay on ${plan}?`,
  stayBody: (pending: string) => `Your move to ${pending} is cancelled. Nothing else changes.`,
  stayConfirm: 'Stay',

  // Results
  upgraded: (plan: string) => `You are now on ${plan}.`,
  upgradedCharged: (plan: string, amount: string) => `You are now on ${plan}. We charged ${amount} for the rest of this month.`,
  downgraded: (plan: string, date: string) => `${plan} starts on ${date}.`,
  stayed: (plan: string) => `You are staying on ${plan}.`,
  resumed: 'Your membership continues. Autopay is back on.',
  cancelled: (date: string) => `Membership cancelled. Your benefits last until ${date}.`,
  endedNow: 'Your membership has ended.',

  // Cancel sheet
  cancelTitle: 'Cancel membership',
  cancelBody: (date: string) => `Autopay turns off now and you will not be charged again. Your benefits last until ${date}.`,
  cancelBodyPastDue: 'Your membership ends now and we stop trying to charge you.',
  reason: 'Why are you leaving? (optional)',
  reasonHint: 'This helps us improve.',
  cancelConfirm: 'Cancel membership',
  cancelBack: 'Keep it',

  // Receipts
  receiptsTitle: 'Receipts',
  receiptsEmpty: 'No membership payments yet.',
  receipt: (number: string) => `Receipt ${number}`,
} as const;

export const autopay = {
  title: 'Set up autopay',
  intro: (amount: string) => `Approve autopay with a limit of ${amount} a month. We remind you before every charge, and you can cancel any time.`,
  testTitle: 'Test autopay — no real money',
  testBody: 'This is the development test autopay. Choose what the bank should do.',
  scenarios: {
    AUTHORIZED: 'Approve autopay',
    DECLINED: 'Decline autopay',
    RENEWAL_FAILS_ONCE: 'Approve (the first renewal fails once)',
    CHARGES_FAIL: 'Approve (every charge fails)',
  } satisfies Record<MockMandateScenario, string>,
  approve: 'Continue with test autopay',
  notOpenTitle: 'Autopay opens soon',
  notOpenBody: 'UPI Autopay and card mandates open once the payment gateway is approved. You have not been charged.',
  checking: 'Checking with the payment gateway…',
  checkingBody: 'Your membership starts only when the payment gateway confirms autopay.',
  trialTitle: 'Your free trial has started',
  trialBody: (plan: string, date: string, amount: string) => `Enjoy ${plan}. Your trial ends on ${date}, then ${amount} a month by autopay. We remind you before the first charge.`,
  activeTitle: (plan: string) => `Welcome to ${plan}`,
  activeBody: 'Member prices now apply to your bookings.',
  pastDueTitle: 'Autopay is on, but the payment did not go through',
  failedTitle: 'Your membership did not start',
  failedBody: 'Autopay was not approved, or the first payment did not go through. You have not been charged.',
  stillTitle: 'Still checking',
  stillBody: 'This can take a few minutes. Check your membership again shortly.',
  refresh: 'Check again',
  back: 'Back to Membership',
  missing: 'This autopay link is not valid. Start again from Membership.',
} as const;
