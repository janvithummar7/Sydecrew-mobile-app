import type { Href } from 'expo-router';

/**
 * Where each part of the companion application lives in the app. The API
 * names steps (GET /auth/me companion.next_step, fix_items[].step,
 * checklist.missing); the app turns them into screens.
 */
export type CompanionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'NEEDS_CHANGES'
  | 'APPROVED'
  | 'SETUP'
  | 'LIVE'
  | 'PAUSED'
  | 'REVERIFICATION_REQUIRED'
  | 'SUSPENDED'
  | 'REJECTED';

/** Companion screens. Typed as Href for navigation; the literal list documents them. */
export type CompanionPath =
  | '/companion'
  | '/companion/apply'
  | '/companion/profile'
  | '/companion/photos'
  | '/companion/categories'
  | '/companion/identity'
  | '/companion/review'
  | '/companion/status'
  | '/companion/setup'
  | '/companion/rates'
  | '/companion/go-live'
  | '/companion/dashboard';

export type CompanionRoute = Href;
const as = (p: CompanionPath): CompanionRoute => p as unknown as Href;
export const COMPANION_HOME = as('/companion');

const STEP_ROUTES: Record<string, CompanionPath> = {
  PROFILE: '/companion/profile',
  PHOTOS: '/companion/photos',
  CATEGORIES: '/companion/categories',
  DOCUMENTS: '/companion/identity',
  SUBMIT: '/companion/review',
  WAITING: '/companion/status',
  FIX_REQUIRED: '/companion/status',
  COOLDOWN: '/companion/status',
  REJECTED: '/companion/status',
  SUSPENDED: '/companion/status',
  SETUP: '/companion/setup',
  GO_LIVE: '/companion/go-live',
  LIVE: '/companion/dashboard',
  PAUSED: '/companion/dashboard',
};

/** Screen for an API step name (unknown steps go to the status screen). */
export const routeForStep = (step: string | null | undefined): CompanionRoute => as(step ? (STEP_ROUTES[step] ?? '/companion/status') : '/companion');

/** The application steps in order, as shown on the review screen. */
export const APPLICATION_STEPS = [
  { key: 'PROFILE', label: 'Profile basics', route: '/companion/profile' },
  { key: 'PHOTOS', label: 'Photos', route: '/companion/photos' },
  { key: 'CATEGORIES', label: 'Categories and boundaries', route: '/companion/categories' },
  { key: 'DOCUMENTS', label: 'Identity check', route: '/companion/identity' },
] as const satisfies readonly { key: string; label: string; route: CompanionPath }[];

/** Checklist -> rows with done flags, in step order. */
export function checklistRows(missing: string[]) {
  return APPLICATION_STEPS.map((s) => ({ key: s.key, label: s.label, route: as(s.route), done: !missing.includes(s.key) }));
}

/** Statuses after approval, where setup screens apply. */
export const APPROVED_STATES: CompanionStatus[] = ['APPROVED', 'SETUP', 'LIVE', 'PAUSED'];
/** Statuses where the applicant can edit the application. */
export const EDITABLE_STATES: CompanionStatus[] = ['DRAFT', 'NEEDS_CHANGES', 'REVERIFICATION_REQUIRED'];

export const isApproved = (s: string | null | undefined) => !!s && (APPROVED_STATES as string[]).includes(s);
export const isEditable = (s: string | null | undefined) => !!s && (EDITABLE_STATES as string[]).includes(s);

/** Plain-language status shown to the companion. */
export function statusLabel(s: string): string {
  return (
    {
      DRAFT: 'Application not submitted yet',
      SUBMITTED: 'Submitted',
      IN_REVIEW: 'In review',
      NEEDS_CHANGES: 'Changes needed',
      APPROVED: 'Approved',
      SETUP: 'Setting up',
      LIVE: 'Live',
      PAUSED: 'Paused',
      REVERIFICATION_REQUIRED: 'Re-verification required',
      SUSPENDED: 'Suspended',
      REJECTED: 'Not approved',
    } as Record<string, string>
  )[s] ?? s;
}

/** The four stages of the status timeline and which are complete for a status. */
export function timelineStages(status: string) {
  const order = ['Submitted', 'Checks', 'In review', 'Decision'];
  const reached: Record<string, number> = {
    DRAFT: 0,
    SUBMITTED: 1,
    IN_REVIEW: 3,
    NEEDS_CHANGES: 4,
    REJECTED: 4,
    APPROVED: 4,
    SETUP: 4,
    LIVE: 4,
    PAUSED: 4,
    REVERIFICATION_REQUIRED: 0,
    SUSPENDED: 4,
  };
  const n = reached[status] ?? 0;
  return order.map((label, i) => ({ label, done: i < n, current: i === n }));
}
