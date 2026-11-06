import type { BadgeKind } from '@/components/ui/Badge';

/**
 * Status-driven UI (integration pass §4): every companion profile state has
 * exactly one screen state and one call to action. Used by the companion
 * dashboard; documented in docs/TRACEABILITY.md.
 */
export type CompanionStateKey =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'NEEDS_CHANGES'
  | 'COOLDOWN'
  | 'REJECTED'
  | 'APPROVED'
  | 'SETUP'
  | 'LIVE'
  | 'PAUSED'
  | 'REVERIFICATION_REQUIRED'
  | 'SUSPENDED';

export type CompanionStateCopy = { badge: BadgeKind; label: string; title: string; body: string; cta: string | null };

export const companionStates: Record<CompanionStateKey, CompanionStateCopy> = {
  DRAFT: { badge: 'pending', label: 'Draft', title: 'Finish your application', body: 'Complete each step, then submit for our checks and review.', cta: 'Continue application' },
  SUBMITTED: { badge: 'pending', label: 'Submitted', title: 'Application submitted', body: 'We are running the automatic checks on your documents.', cta: 'See status' },
  IN_REVIEW: { badge: 'pending', label: 'In review', title: 'A person is reviewing your application', body: 'You will hear from us as soon as there is a decision.', cta: 'See status' },
  NEEDS_CHANGES: { badge: 'needs-changes', label: 'Changes needed', title: 'A few changes are needed', body: 'Fix the items listed, then submit again.', cta: 'Fix and resubmit' },
  COOLDOWN: { badge: 'needs-changes', label: 'Try again later', title: 'Please wait before trying again', body: 'Too many automatic checks failed in a row. You can try again after the date shown.', cta: 'See status' },
  REJECTED: { badge: 'suspended', label: 'Not approved', title: 'Your application was not approved', body: 'See the reason and when you can apply again.', cta: 'See details' },
  APPROVED: { badge: 'verified', label: 'Approved', title: 'You are approved', body: 'Set your availability and rates to go live.', cta: 'Start setup' },
  SETUP: { badge: 'verified', label: 'Setting up', title: 'Finish your setup', body: 'Add availability and a rate in each approved category, then go live.', cta: 'Continue setup' },
  LIVE: { badge: 'live', label: 'Live', title: 'You are live', body: 'Customers can find you in Discover. Keep your availability up to date.', cta: 'Preview your public profile' },
  PAUSED: { badge: 'paused', label: 'Paused', title: 'Your profile is paused', body: 'You are hidden from search. Resume any time.', cta: 'Resume' },
  REVERIFICATION_REQUIRED: { badge: 'needs-changes', label: 'Re-verify', title: 'Please re-verify your identity', body: 'Your profile is hidden until you re-verify. Existing bookings are not cancelled automatically.', cta: 'Re-verify now' },
  SUSPENDED: { badge: 'suspended', label: 'Suspended', title: 'Your profile is suspended', body: 'Our Trust & Safety team will contact you. You can appeal by replying to their message.', cta: null },
};
