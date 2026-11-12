/** Labels and the payout-account form check (Feature 6). Pure: unit-tested. */
import type { BadgeKind } from '../../components/ui/Badge';
import type { EarningStatus, PayoutAccountStatus, PayoutStatus } from './types';

type View = { label: string; badge: BadgeKind };

export const earningStatus: Record<EarningStatus, View> = {
  PENDING: { label: 'Pending', badge: 'pending' },
  ON_HOLD: { label: 'On hold', badge: 'needs-changes' },
  AVAILABLE: { label: 'Available', badge: 'verified' },
  IN_BATCH: { label: 'In this week’s payout', badge: 'info' },
  PAID: { label: 'Paid', badge: 'live' },
  FAILED: { label: 'Payout failed', badge: 'suspended' },
  REVERSED: { label: 'Reversed', badge: 'neutral' },
  CLAWBACK: { label: 'Taken from later payouts', badge: 'needs-changes' },
};

export const payoutStatus: Record<PayoutStatus, View> = {
  PENDING: { label: 'Scheduled', badge: 'pending' },
  AWAITING_APPROVAL: { label: 'Being checked', badge: 'pending' },
  PROCESSING: { label: 'On its way', badge: 'info' },
  PAID: { label: 'Paid', badge: 'live' },
  FAILED: { label: 'Failed', badge: 'suspended' },
  ON_HOLD: { label: 'On hold', badge: 'needs-changes' },
  CANCELLED: { label: 'Cancelled', badge: 'neutral' },
  REVERSED: { label: 'Returned by the bank', badge: 'suspended' },
};

export const accountStatus: Record<PayoutAccountStatus, View> = {
  PENDING_VERIFICATION: { label: 'Checking your account', badge: 'pending' },
  VERIFIED: { label: 'Verified', badge: 'verified' },
  NEEDS_REVIEW: { label: 'Our team is checking', badge: 'pending' },
  REJECTED: { label: 'Not accepted', badge: 'suspended' },
  COOLING: { label: 'Waiting period', badge: 'info' },
  SUPERSEDED: { label: 'Replaced', badge: 'neutral' },
};

/** Only ever the last 4 digits: "•••• 1234". */
export const maskAccount = (digits: string | null | undefined) => {
  const d = String(digits ?? '').replace(/\D/g, '').slice(-4);
  return d ? `•••• ${d}` : '—';
};

export type AccountForm = { account_number: string; confirm_account_number: string; ifsc: string; account_holder_name: string };
export type AccountErrors = Partial<Record<keyof AccountForm, string>>;

/** What was typed, cleaned: digits only, IFSC upper case, single-spaced name. */
export function normaliseAccount(f: AccountForm): AccountForm {
  return {
    account_number: f.account_number.replace(/[\s-]/g, ''),
    confirm_account_number: f.confirm_account_number.replace(/[\s-]/g, ''),
    ifsc: f.ifsc.trim().toUpperCase(),
    account_holder_name: f.account_holder_name.trim().replace(/\s+/g, ' '),
  };
}

export const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/** Field errors (empty = valid): the same rules as the API. */
export function validateAccount(raw: AccountForm): AccountErrors {
  const f = normaliseAccount(raw);
  const e: AccountErrors = {};
  if (!/^\d{9,18}$/.test(f.account_number)) e.account_number = 'Enter your account number: 9 to 18 digits.';
  if (!f.confirm_account_number) e.confirm_account_number = 'Type the account number again.';
  else if (f.confirm_account_number !== f.account_number) e.confirm_account_number = 'The two account numbers do not match.';
  if (!IFSC_RE.test(f.ifsc)) e.ifsc = 'Enter the 11-character IFSC, like HDFC0001234.';
  if (f.account_holder_name.length < 2 || f.account_holder_name.length > 120) e.account_holder_name = 'Enter the name on the account, as on your verified ID.';
  return e;
}
