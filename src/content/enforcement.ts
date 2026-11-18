/**
 * Account status copy (D22): warnings, suspensions and bans, and appealing
 * them. Calm and plain: the person should understand why, until when and how
 * to appeal, without being made to feel ashamed.
 */
import type { AppealStatus, EnforcementAction, EnforcementStatus } from '@/lib/contract/enums';

export const enforcement = {
  title: 'Account status',
  rowLabel: 'Account status',
  rowDetail: 'Warnings, holds and appeals',
  subtitle: 'Any warnings or holds on your account, and how to appeal them.',

  hold: {
    suspendedTitle: 'Your account is on hold',
    suspendedUntil: (date: string) => `Your account is on hold until ${date}. It opens again automatically on that date.`,
    suspendedOpen: 'Your account is on hold for now. We will let you know when it opens again.',
    bannedTitle: 'Your account is closed',
    banned: 'Your account has been closed and stays closed unless the decision is lifted or overturned on appeal.',
    whileOnHold: 'While your account is on hold you cannot book, chat or take bookings. Any upcoming bookings were cancelled and fully refunded.',
    clearTitle: 'Your account is in good standing',
    clear: 'There are no holds on your account.',
    warningsNote: 'You have a warning on your account. It does not limit what you can do, but it is good to know about.',
  },

  historyTitle: 'Decisions on your account',

  actions: {
    WARNING: 'Warning',
    TEMP_SUSPENSION: 'Suspension',
    PERMANENT_BAN: 'Account closed',
    REINSTATEMENT: 'Account reopened',
  } satisfies Record<EnforcementAction, string>,

  statuses: {
    PENDING_APPROVAL: 'Being confirmed',
    ACTIVE: 'In place',
    EXPIRED: 'Ended',
    OVERTURNED: 'Overturned',
    REJECTED: 'Withdrawn',
  } satisfies Record<EnforcementStatus, string>,

  reason: 'Why',
  rule: 'Guideline',
  started: 'From',
  ends: 'Until',
  endsNever: 'Until it is lifted or overturned',

  appeal: {
    canAppeal: (date: string) => `You can appeal this until ${date}.`,
    canAppealOpen: 'You can appeal this.',
    windowClosed: (date: string) => `The time to appeal ended on ${date}.`,
    notAppealable: 'This cannot be appealed.',
    states: {
      SUBMITTED: (date: string) => `You appealed on ${date}. We will let you know the outcome.`,
      IN_REVIEW: () => 'Your appeal is being reviewed. We will let you know the outcome.',
      UPHELD: (date: string) => `Your appeal was reviewed on ${date}. The decision stays in place.`,
      OVERTURNED: (date: string) => `Your appeal was reviewed on ${date} and the decision was overturned.`,
    } satisfies Record<AppealStatus, (date: string) => string>,
    decisionReason: 'What the reviewer said',

    open: 'Appeal this decision',
    formTitle: 'Your appeal',
    guidance: 'Tell us what happened and why you think this is wrong. Someone who was not involved in the decision will review it.',
    label: 'What happened',
    counter: (n: number, max: number) => `${n} / ${max}`,
    tooShort: (min: number) => `Write at least ${min} characters so the reviewer understands what happened.`,
    tooLong: (max: number) => `Keep it under ${max} characters.`,
    once: 'You can appeal each decision once.',
    submit: 'Send appeal',
    cancel: 'Cancel',
    sent: 'Your appeal has been sent. We will let you know the outcome.',
  },

  logOut: 'Log out',
  refresh: 'Check again',
} as const;
