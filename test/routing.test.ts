// Routing, deep links and the companion status table. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COMPANION_STEP_PATH, deepLinkPath, isPublicLink, routeFor, shellFor, type RouteUser } from '../src/lib/routing.ts';
import { STEP_ROUTES, companionStateKey, ctaRoute } from '../src/lib/companion/steps.ts';
import { CompanionNextStepValues, CompanionStatusValues, type CompanionNextStep, type CompanionStatus } from '../src/lib/contract/enums.ts';
import { companionStates } from '../src/content/companion.ts';

const done = { complete: true, next_step: null } as unknown as RouteUser['onboarding'];
const pending = { complete: false, next_step: 'DOB' } as unknown as RouteUser['onboarding'];
const companion = (next_step: CompanionNextStep, status: CompanionStatus = 'DRAFT') => ({ status, next_step }) as unknown as NonNullable<RouteUser['companion']>;
const user = (over: Partial<RouteUser> = {}): RouteUser => ({ is_staff: false, roles: ['CUSTOMER'], onboarding: done, companion: null, ...over }) as RouteUser;

const EXPECTED: Record<CompanionNextStep, string> = {
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

test('routeFor: signed out, staff, onboarding, customer', () => {
  assert.equal(routeFor(null), '/');
  assert.equal(routeFor(user({ is_staff: true })), '/staff');
  assert.equal(routeFor(user({ is_staff: true, onboarding: pending })), '/staff');
  assert.equal(routeFor(user({ onboarding: pending })), '/onboarding');
  assert.equal(routeFor(user()), '/home');
});

test('routeFor: every companion next_step, for a companion-only account', () => {
  assert.deepEqual([...CompanionNextStepValues].sort(), Object.keys(EXPECTED).sort(), 'test table covers the contract enum');
  for (const step of CompanionNextStepValues) {
    const u = user({ roles: ['COMPANION'], companion: companion(step) });
    assert.equal(routeFor(u), EXPECTED[step], step);
    // A companion applicant skips customer onboarding.
    assert.equal(routeFor({ ...u, onboarding: pending }), EXPECTED[step], `${step} (not onboarded)`);
  }
});

test('routeFor: both roles follow the preferred shell (default customer)', () => {
  for (const step of CompanionNextStepValues) {
    const u = user({ roles: ['CUSTOMER', 'COMPANION'], companion: companion(step) });
    assert.equal(routeFor(u), '/home', step);
    assert.equal(routeFor(u, 'customer'), '/home', step);
    assert.equal(routeFor(u, 'companion'), EXPECTED[step], step);
  }
  assert.equal(shellFor(user(), 'companion'), 'customer', 'a customer without a companion profile stays a customer');
});

test('step tables agree with the contract', () => {
  for (const step of CompanionNextStepValues) {
    assert.equal(COMPANION_STEP_PATH[step], EXPECTED[step], step);
    assert.equal(STEP_ROUTES[step], EXPECTED[step], step);
  }
});

test('deepLinkPath: companion and email links only', () => {
  assert.equal(deepLinkPath('sydecrew://companion/identity'), '/companion/identity');
  assert.equal(deepLinkPath('sydecrew:///companion/identity/'), '/companion/identity');
  assert.equal(deepLinkPath('sydecrew://companion'), '/companion');
  assert.equal(deepLinkPath('sydecrew://verify-email?token=abc'), '/verify-email?token=abc');
  assert.equal(deepLinkPath('sydecrew://reset-password?token=x%2By'), '/reset-password?token=x%2By');
  assert.equal(deepLinkPath('sydecrew://settings'), '/settings');
  for (const bad of [null, undefined, '', 'https://sydecrew.com/companion', 'sydecrew://admin', 'sydecrew://companion/../admin', 'other://companion']) {
    assert.equal(deepLinkPath(bad), null, String(bad));
  }
  assert.equal(isPublicLink('/verify-email?token=a'), true);
  assert.equal(isPublicLink('/reset-password'), true);
  assert.equal(isPublicLink('/companion/identity'), false);
});

test('every companion status has one screen state and a call to action', () => {
  const keys = [...CompanionStatusValues, 'COOLDOWN'];
  assert.deepEqual(Object.keys(companionStates).sort(), keys.sort());
  for (const status of CompanionStatusValues) {
    const copy = companionStates[companionStateKey(status, null)];
    assert.ok(copy.title && copy.body && copy.label, status);
    const route = ctaRoute(status, status === 'DRAFT' || status === 'REVERIFICATION_REQUIRED' ? 'DOCUMENTS' : status === 'APPROVED' || status === 'SETUP' ? 'SETUP' : null);
    if (status === 'SUSPENDED') assert.equal(copy.cta, null, 'suspended has no self-service action');
    else assert.ok(copy.cta, `${status} has a call to action`);
    if (status === 'PAUSED' || status === 'SUSPENDED') assert.equal(route, null, status);
    else assert.ok(route, `${status} has a route`);
  }
  assert.equal(companionStateKey('NEEDS_CHANGES', 'COOLDOWN'), 'COOLDOWN');
  assert.equal(ctaRoute('DRAFT', 'PHOTOS'), '/companion/photos');
  assert.equal(ctaRoute('NEEDS_CHANGES', 'FIX_REQUIRED', 'DOCUMENTS'), '/companion/identity');
  assert.equal(ctaRoute('IN_REVIEW', 'WAITING'), '/companion/status');
  assert.equal(ctaRoute('SETUP', 'GO_LIVE'), '/companion/go-live');
  assert.equal(ctaRoute('LIVE', 'LIVE'), '/companion/preview');
});
