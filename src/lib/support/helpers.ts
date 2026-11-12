/** Complaint, dispute and ticket labels and checks (Feature 6). Pure: unit-tested. */
import type { BadgeKind } from '../../components/ui/Badge';
import type { ComplaintType, DisputeStatus, TicketCategory, TicketStatus } from './types';

type View = { label: string; badge: BadgeKind };

/** Complaint types that go straight to the safety desk. */
export const SAFETY_TYPES: readonly ComplaintType[] = ['SAFETY', 'HARASSMENT', 'THREAT', 'ASSAULT', 'UNSAFE_SITUATION'];
export const isSafetyComplaint = (t: ComplaintType | null | undefined) => !!t && SAFETY_TYPES.includes(t);

export const complaintLabels: Record<ComplaintType, string> = {
  NO_SHOW: 'They did not come',
  LATE: 'They were very late',
  SERVICE_QUALITY: 'The meeting was not as described',
  BOUNDARY_VIOLATION: 'A boundary was crossed',
  BILLING: 'A problem with the amount',
  PAYMENT_FAILED: 'A payment problem',
  SAFETY: 'I felt unsafe',
  HARASSMENT: 'Harassment',
  THREAT: 'A threat',
  ASSAULT: 'Physical harm',
  UNSAFE_SITUATION: 'An unsafe situation',
  OTHER: 'Something else',
};

export const COMPLAINT_MIN = 10;
export const COMPLAINT_MAX = 2000;
export const STATEMENT_MIN = 10;
export const APPEAL_MIN = 20;
export const MAX_EVIDENCE = 5;

export function complaintError(type: ComplaintType | null, description: string): string | null {
  if (!type) return 'Choose what happened.';
  const n = description.trim().length;
  if (n < COMPLAINT_MIN) return `Tell us a little more (at least ${COMPLAINT_MIN} characters).`;
  if (n > COMPLAINT_MAX) return `Please keep it under ${COMPLAINT_MAX} characters.`;
  return null;
}

export const disputeStatus: Record<DisputeStatus, View> = {
  OPEN: { label: 'Open', badge: 'pending' },
  AWAITING_RESPONSE: { label: 'Waiting for statements', badge: 'pending' },
  UNDER_REVIEW: { label: 'Being reviewed', badge: 'info' },
  RESOLVED: { label: 'Decided', badge: 'verified' },
  APPEALED: { label: 'Appeal in review', badge: 'info' },
  CLOSED: { label: 'Closed', badge: 'neutral' },
};

export const ticketStatus: Record<TicketStatus, View> = {
  OPEN: { label: 'Open', badge: 'pending' },
  IN_PROGRESS: { label: 'We are on it', badge: 'info' },
  PENDING_USER: { label: 'Waiting for you', badge: 'needs-changes' },
  RESOLVED: { label: 'Resolved', badge: 'verified' },
  CLOSED: { label: 'Closed', badge: 'neutral' },
};

export const ticketCategories: Record<TicketCategory, string> = {
  BOOKING: 'A booking',
  PAYMENT: 'A payment or refund',
  PAYOUT: 'My payouts',
  ACCOUNT: 'My account',
  SAFETY: 'Safety',
  OTHER: 'Something else',
};

/** A receipt exists once the customer's payment went through (§5.4). */
export const hasReceipt = (b: { viewer: string; payment: { status: string } | null }) =>
  b.viewer === 'CUSTOMER' && !!b.payment && ['CAPTURED', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(b.payment.status);

/** The request body enum is inline in the contract (no component schema), so the list lives here. */
export const TicketCategoryValues = Object.keys(ticketCategories) as TicketCategory[];

/**
 * The dispute on a booking (Feature 7: bookings carry `dispute_id` and
 * `dispute.id`), so booking detail opens /disputes/<id> directly. Only an id
 * that looks like one is used; anything else falls back to the disputes list.
 */
export function disputeIdOf(b: { dispute_id?: string | null; dispute?: { id?: string | null } | null }): string | null {
  const id = b.dispute_id ?? b.dispute?.id ?? null;
  return typeof id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(id) ? id : null;
}
