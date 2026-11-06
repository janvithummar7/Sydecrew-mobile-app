/**
 * The one routing decision (integration pass §4): where a user belongs, from
 * GET /auth/me alone (onboarding.next_step, companion.next_step, roles, staff).
 * Pure, so it is unit-tested against every next_step value (test/routing.test.ts).
 */
import type { CompanionNextStep } from './contract/enums';
import type { Me } from './types';

export type Role = 'customer' | 'companion';

/** Companion screen for each companion.next_step. */
export const COMPANION_STEP_PATH: Record<CompanionNextStep, string> = {
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
  SETUP: '/companion/availability',
  GO_LIVE: '/companion/go-live',
  LIVE: '/companion/dashboard',
  PAUSED: '/companion/dashboard',
};

export type RouteUser = Pick<Me, 'is_staff' | 'roles' | 'onboarding' | 'companion'>;

export const isCustomer = (u: Pick<Me, 'roles'>) => u.roles.includes('CUSTOMER');
export const isCompanion = (u: Pick<Me, 'companion'>) => !!u.companion;
export const hasBothRoles = (u: Pick<Me, 'roles' | 'companion'>) => isCustomer(u) && isCompanion(u);

/**
 * Which shell a user sees. Customer-only and companion-only accounts have one;
 * a user with both roles gets the one they last chose (default: customer).
 */
export function shellFor(u: RouteUser, preferred: Role | null = null): Role {
  if (!isCompanion(u)) return 'customer';
  if (!isCustomer(u)) return 'companion';
  return preferred ?? 'customer';
}

/** The screen a signed-in (or signed-out) user lands on. */
export function routeFor(u: RouteUser | null, preferred: Role | null = null): string {
  if (!u) return '/';
  if (u.is_staff) return '/staff';
  // A companion-only applicant skips customer onboarding: the apply step collects what is missing.
  if (!u.onboarding.complete && !u.companion) return '/onboarding';
  if (shellFor(u, preferred) === 'companion' && u.companion) return COMPANION_STEP_PATH[u.companion.next_step] ?? '/companion/status';
  return '/home';
}

/** Paths a deep link may open after sign-in. */
const DEEP_LINK_PATHS = [/^\/companion(\/[a-z-]+)?$/, /^\/verify-email$/, /^\/reset-password$/, /^\/settings$/];

/**
 * sydecrew://companion/identity -> "/companion/identity";
 * sydecrew://verify-email?token=abc -> "/verify-email?token=abc".
 * Anything else (other schemes, unknown paths) -> null.
 */
export function deepLinkPath(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = /^sydecrew:\/\/\/?([^?#]*)(\?[^#]*)?/.exec(url);
  if (!m) return null;
  const path = `/${m[1].replace(/\/+$/, '')}`;
  if (!DEEP_LINK_PATHS.some((re) => re.test(path))) return null;
  return `${path}${m[2] ?? ''}`;
}

/** Links that work while signed out (they carry their own token). */
export const isPublicLink = (path: string) => /^\/(verify-email|reset-password)(\?|$)/.test(path);
