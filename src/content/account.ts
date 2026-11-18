/** Account deletion copy: the "Delete account" row, what happens, what blocks it, the form and the confirmation. */
import type { DeletionBlocker } from '@/lib/contract/enums';

export const deleteAccount = {
  title: 'Delete account',
  rowLabel: 'Delete account',
  rowDetail: 'Close your account and erase your personal data',
  subtitle: 'We are sorry to see you go. Here is what happens before you decide.',

  whatTitle: 'What happens',
  what: (days: number) => [
    'Your account is hidden straight away, and you are signed out on every device.',
    `You have ${days} days to change your mind. Sign in again before then and your account stays as it is.`,
    `After ${days} days we erase your personal data: your name, email, mobile number, date of birth and photos.`,
    'We keep only what the law asks us to, such as bookings, payments, invoices and safety reports, without your contact details.',
    'Reviews you wrote stay up, shown as "Former member".',
    'If you are a companion, your profile and the reviews about you are removed.',
    'You can sign up again later with the same email or mobile number.',
  ],

  blockedTitle: 'A few things to finish first',
  blockedBody: 'You can delete your account once these are done. Come back here when they are.',
  blockers: {
    OPEN_BOOKINGS: {
      message: (n: number) => (n === 1 ? 'You have 1 upcoming or ongoing booking. Cancel it or finish it first.' : `You have ${n} upcoming or ongoing bookings. Cancel them or finish them first.`),
      action: 'Go to bookings',
    },
    OPEN_DISPUTES: {
      message: (n: number) => (n === 1 ? 'You have 1 open dispute. We need to settle it first.' : `You have ${n} open disputes. We need to settle them first.`),
      action: 'Go to disputes',
    },
    PENDING_REFUNDS: {
      message: (n: number) => (n === 1 ? 'You have 1 refund still being processed. It usually clears in a few days.' : `You have ${n} refunds still being processed. They usually clear in a few days.`),
      action: 'Contact support',
    },
    UNPAID_EARNINGS: {
      message: (n: number) => (n === 1 ? 'You have 1 earning or payout not yet paid out. We pay it first.' : `You have ${n} earnings or payouts not yet paid out. We pay them first.`),
      action: 'Go to earnings',
    },
  } satisfies Record<DeletionBlocker, { message: (n: number) => string; action: string }>,

  formTitle: 'Confirm it is you',
  password: 'Your password',
  passwordHint: 'The one you sign in with.',
  passwordNeeded: 'Enter your password.',
  reason: 'Why are you leaving? (optional)',
  reasonHint: 'It helps us improve. Only our team reads it.',
  reasonTooLong: (max: number) => `Keep it under ${max} characters.`,
  confirm: (days: number) => `I understand my account will be deleted after ${days} days unless I sign in again.`,
  confirmNeeded: 'Tick the box to confirm.',
  submit: 'Delete my account',

  alertTitle: 'Delete your account?',
  alertBody: (days: number) => `You will be signed out now. Sign in within ${days} days if you change your mind.`,
  alertCancel: 'Keep my account',
  alertConfirm: 'Delete',

  notDeletable: 'This account cannot be deleted in the app. Our support team can help.',
  staff: 'Staff accounts are closed by a super admin on the web.',
  support: 'Contact support',

  doneTitle: 'Your account is scheduled for deletion',
  doneBody: (date: string) => `We will delete your account and personal data on ${date}.`,
  doneKeep: 'Changed your mind? Sign in before then to keep your account.',
  doneEmail: 'We have also sent this to your email.',
  doneButton: 'Back to start',
} as const;
