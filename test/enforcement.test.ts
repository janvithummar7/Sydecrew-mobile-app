// Account status (D22): on-hold routing, push link, labels, hold banner, appeal states, statement checks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCOUNT_STATUS_PATH,
  STATEMENT_MAX,
  STATEMENT_MIN,
  actionDates,
  actionLabel,
  appealBody,
  appealStateText,
  canSendStatement,
  holdEnded,
  holdSentence,
  holdView,
  isOnHold,
  isOnHoldError,
  markOnHold,
  onHoldRoute,
  statementError,
  statusLabel,
  statusTone,
} from '../src/lib/enforcement/helpers.ts';
import { deepLinkPath, routeFor, type RouteUser } from '../src/lib/routing.ts';
import { pushRoute } from '../src/lib/nav/pushLinks.ts';
import { enforcement } from '../src/content/enforcement.ts';
import { AppealStatusValues, EnforcementActionValues, EnforcementStatusValues } from '../src/lib/contract/enums.ts';
import type { StandingAction } from '../src/lib/enforcement/types.ts';

const done = { complete: true, next_step: null } as unknown as RouteUser['onboarding'];
const user = (over: Partial<RouteUser> = {}): RouteUser => ({ is_staff: false, roles: ['CUSTOMER'], onboarding: done, companion: null, on_hold: false, ...over }) as RouteUser;
const companionUser = (over: Partial<RouteUser> = {}) =>
  user({ roles: [] as unknown as RouteUser['roles'], companion: { status: 'APPROVED', next_step: 'LIVE' } as unknown as NonNullable<RouteUser['companion']>, ...over });

const action = (over: Partial<StandingAction> = {}): StandingAction => ({
  id: 'a1',
  action: 'TEMP_SUSPENSION',
  reason_code: 'NO_SHOWS',
  reason: 'You missed several bookings without cancelling.',
  rule: 'Turn up for bookings you accept',
  status: 'ACTIVE',
  starts_at: '2026-11-10T06:30:00Z',
  ends_at: '2026-11-24T06:30:00Z',
  appeal_deadline_at: '2026-11-24T06:30:00Z',
  can_appeal: true,
  appeal: null,
  ...over,
});
const NOW = new Date('2026-11-17T00:00:00Z');

// ── On-hold routing ─────────────────────────────────────────────────────

test('on hold: customers and companions go to Account status only; staff never', () => {
  assert.equal(ACCOUNT_STATUS_PATH, '/account-status');
  assert.equal(routeFor(user({ on_hold: true })), '/account-status');
  assert.equal(routeFor(companionUser({ on_hold: true }), 'companion'), '/account-status');
  // Even before onboarding is finished.
  assert.equal(routeFor(user({ on_hold: true, onboarding: { complete: false, next_step: 'DOB' } as unknown as RouteUser['onboarding'] })), '/account-status');
  assert.equal(routeFor(user({ is_staff: true, on_hold: true })), '/staff');
  assert.equal(onHoldRoute(user({ on_hold: true })), '/account-status');
  assert.equal(onHoldRoute(user()), null);
  assert.equal(onHoldRoute(null), null);
});

test('not on hold: the normal routing is unchanged (and a missing on_hold counts as not on hold)', () => {
  assert.equal(routeFor(user()), '/home');
  assert.equal(routeFor(companionUser(), 'companion'), '/companion/dashboard');
  const legacy = { is_staff: false, roles: ['CUSTOMER'], onboarding: done, companion: null } as unknown as RouteUser;
  assert.equal(isOnHold(legacy), false);
  assert.equal(routeFor(legacy), '/home');
});

test('a 403 ACCOUNT_ON_HOLD is recognised; other errors are not', () => {
  assert.equal(isOnHoldError({ status: 403, code: 'ACCOUNT_ON_HOLD' }), true);
  assert.equal(isOnHoldError({ code: 'ACCOUNT_ON_HOLD' }), true);
  assert.equal(isOnHoldError({ status: 403, code: 'PERMISSION_DENIED' }), false);
  assert.equal(isOnHoldError({ status: 401, code: 'ACCOUNT_ON_HOLD' }), false);
  assert.equal(isOnHoldError(null), false);
});

test('markOnHold takes the status from the error details, defaulting to SUSPENDED', () => {
  const u = { on_hold: false, status: 'ACTIVE' as const, id: 'u1' };
  assert.deepEqual(markOnHold(u, { status: 'BANNED', suspended_until: null }), { on_hold: true, status: 'BANNED', id: 'u1' });
  assert.deepEqual(markOnHold(u, { status: 'SUSPENDED', suspended_until: '2026-12-01T00:00:00Z' }), { on_hold: true, status: 'SUSPENDED', id: 'u1' });
  assert.deepEqual(markOnHold(u, undefined), { on_hold: true, status: 'SUSPENDED', id: 'u1' });
});

test('holdEnded only when the hold goes from on to off', () => {
  assert.equal(holdEnded(true, false), true);
  assert.equal(holdEnded(true, true), false);
  assert.equal(holdEnded(false, false), false);
  assert.equal(holdEnded(false, true), false);
});

test('push and deep links open Account status in both shells', () => {
  assert.equal(pushRoute('/account-status', 'customer'), '/account-status');
  assert.equal(pushRoute('/account-status', 'companion'), '/account-status');
  assert.equal(pushRoute('/membership', 'customer'), '/membership');
  assert.equal(pushRoute('/membership', 'companion'), null);
  assert.equal(pushRoute('/account-status/', 'customer'), '/account-status');
  assert.equal(pushRoute('/account-status/x', 'customer'), null);
  assert.equal(deepLinkPath('sydecrew://account-status'), '/account-status');
});

// ── Labels ──────────────────────────────────────────────────────────────

test('every action, status and appeal status has words', () => {
  for (const a of EnforcementActionValues) assert.ok(actionLabel(a).length > 0, a);
  for (const s of EnforcementStatusValues) assert.ok(statusLabel(s).length > 0 && statusLabel(s) !== s, s);
  for (const s of AppealStatusValues) assert.ok(enforcement.appeal.states[s]('17 November 2026').length > 0, s);
  assert.equal(actionLabel('WARNING'), 'Warning');
  assert.equal(actionLabel('TEMP_SUSPENSION'), 'Suspension');
  assert.equal(actionLabel('PERMANENT_BAN'), 'Account closed');
  assert.equal(statusLabel('ACTIVE'), 'In place');
  assert.equal(statusTone(action()), 'warn');
  assert.equal(statusTone(action({ status: 'OVERTURNED' })), 'ok');
  assert.equal(statusTone(action({ status: 'EXPIRED' })), 'neutral');
});

// ── Hold banner ─────────────────────────────────────────────────────────

test('hold sentence: suspended until a date, open-ended, closed, or no hold', () => {
  assert.equal(
    holdSentence({ status: 'SUSPENDED', on_hold: true, suspended_until: '2026-11-24T06:30:00Z' }),
    'Your account is on hold until 24 November 2026. It opens again automatically on that date.',
  );
  assert.equal(holdSentence({ status: 'SUSPENDED', on_hold: true, suspended_until: null }), enforcement.hold.suspendedOpen);
  assert.equal(holdSentence({ status: 'BANNED', on_hold: true, suspended_until: null }), enforcement.hold.banned);
  assert.equal(holdSentence({ status: 'ACTIVE', on_hold: false, suspended_until: null }), enforcement.hold.clear);
});

test('hold banner: kind, title, and the warning note when not on hold', () => {
  const banned = holdView({ status: 'BANNED', on_hold: true, suspended_until: null, actions: [] });
  assert.equal(banned.kind, 'banned');
  assert.equal(banned.title, 'Your account is closed');
  assert.equal(banned.note, enforcement.hold.whileOnHold);
  const suspended = holdView({ status: 'SUSPENDED', on_hold: true, suspended_until: '2026-11-24T06:30:00Z', actions: [action()] });
  assert.equal(suspended.kind, 'suspended');
  assert.equal(suspended.title, 'Your account is on hold');
  const clear = holdView({ status: 'ACTIVE', on_hold: false, suspended_until: null, actions: [] });
  assert.equal(clear.kind, 'clear');
  assert.equal(clear.note, null);
  const warned = holdView({ status: 'ACTIVE', on_hold: false, suspended_until: null, actions: [action({ action: 'WARNING', ends_at: null })] });
  assert.equal(warned.note, enforcement.hold.warningsNote);
  const oldWarning = holdView({ status: 'ACTIVE', on_hold: false, suspended_until: null, actions: [action({ action: 'WARNING', status: 'EXPIRED' })] });
  assert.equal(oldWarning.note, null);
});

// ── One decision ────────────────────────────────────────────────────────

test('dates: timed suspension has an end, a ban in place lasts until lifted, a warning has none', () => {
  assert.deepEqual(actionDates(action()), { from: '10 November 2026', until: '24 November 2026' });
  assert.deepEqual(actionDates(action({ action: 'PERMANENT_BAN', ends_at: null })), { from: '10 November 2026', until: enforcement.endsNever });
  assert.deepEqual(actionDates(action({ action: 'PERMANENT_BAN', ends_at: null, status: 'OVERTURNED' })), { from: '10 November 2026', until: null });
  assert.deepEqual(actionDates(action({ action: 'WARNING', ends_at: null, starts_at: null })), { from: null, until: null });
});

test('appeal state text: can appeal, window closed, not appealable, and each appeal status', () => {
  assert.equal(appealStateText(action(), NOW), 'You can appeal this until 24 November 2026.');
  assert.equal(appealStateText(action({ appeal_deadline_at: null }), NOW), enforcement.appeal.canAppealOpen);
  assert.equal(appealStateText(action({ can_appeal: false, appeal_deadline_at: '2026-11-01T00:00:00Z' }), NOW), 'The time to appeal ended on 1 November 2026.');
  assert.equal(appealStateText(action({ can_appeal: false, appeal_deadline_at: null }), NOW), enforcement.appeal.notAppealable);
  const appeal = (status: 'SUBMITTED' | 'IN_REVIEW' | 'UPHELD' | 'OVERTURNED') =>
    action({ can_appeal: false, appeal: { id: 'p1', status, submitted_at: '2026-11-12T06:30:00Z', decided_at: status === 'UPHELD' || status === 'OVERTURNED' ? '2026-11-15T06:30:00Z' : null, decision_reason: null } });
  assert.equal(appealStateText(appeal('SUBMITTED'), NOW), 'You appealed on 12 November 2026. We will let you know the outcome.');
  assert.equal(appealStateText(appeal('IN_REVIEW'), NOW), 'Your appeal is being reviewed. We will let you know the outcome.');
  assert.equal(appealStateText(appeal('UPHELD'), NOW), 'Your appeal was reviewed on 15 November 2026. The decision stays in place.');
  assert.equal(appealStateText(appeal('OVERTURNED'), NOW), 'Your appeal was reviewed on 15 November 2026 and the decision was overturned.');
});

// ── Appeal form ─────────────────────────────────────────────────────────

test('statement: 20 to 2000 characters after trimming', () => {
  assert.equal(STATEMENT_MIN, 20);
  assert.equal(STATEMENT_MAX, 2000);
  assert.equal(statementError(''), enforcement.appeal.tooShort(20));
  assert.equal(statementError(`   ${'a'.repeat(19)}   `), enforcement.appeal.tooShort(20));
  assert.equal(statementError('a'.repeat(20)), null);
  assert.equal(statementError('a'.repeat(2000)), null);
  assert.equal(statementError('a'.repeat(2001)), enforcement.appeal.tooLong(2000));
  assert.equal(canSendStatement('I was at the venue on time and waited.'), true);
  assert.deepEqual(appealBody('  I was at the venue on time.  '), { statement: 'I was at the venue on time.' });
});

test('the appeal guidance is the agreed wording', () => {
  assert.equal(
    enforcement.appeal.guidance,
    'Tell us what happened and why you think this is wrong. Someone who was not involved in the decision will review it.',
  );
});
