// Account deletion: blocker messages and where each is fixed, blockers from the 409 error, the form checks and body, the date in IST.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  REASON_MAX,
  blockerRoute,
  blockerViews,
  blockersFromDetails,
  canRequestDeletion,
  deletionBody,
  deletionDate,
  deletionDraftErrors,
  emptyDeletionDraft,
} from '../src/lib/account/helpers.ts';
import { deleteAccount } from '../src/content/account.ts';
import { DeletionBlockerValues } from '../src/lib/contract/enums.ts';

test('every blocker code has a message, a button and a route', () => {
  for (const code of DeletionBlockerValues) {
    const c = deleteAccount.blockers[code];
    assert.ok(c.message(1).length > 0 && c.message(3).length > 0, code);
    assert.ok(c.action.length > 0, code);
    assert.match(blockerRoute(code, 'customer'), /^\//);
  }
});

test('blocker routes: bookings follow the shell, the rest go to disputes, earnings or support', () => {
  assert.equal(blockerRoute('OPEN_BOOKINGS', 'customer'), '/bookings');
  assert.equal(blockerRoute('OPEN_BOOKINGS', 'companion'), '/companion/bookings');
  assert.equal(blockerRoute('OPEN_DISPUTES', 'customer'), '/disputes');
  assert.equal(blockerRoute('OPEN_DISPUTES', 'companion'), '/disputes');
  assert.equal(blockerRoute('UNPAID_EARNINGS', 'companion'), '/companion/earnings');
  assert.equal(blockerRoute('PENDING_REFUNDS', 'customer'), '/support');
});

test('blocker messages use the count, singular and plural', () => {
  const [one, many] = blockerViews(
    [
      { code: 'OPEN_BOOKINGS', count: 1 },
      { code: 'OPEN_DISPUTES', count: 2 },
    ],
    'customer',
  );
  assert.equal(one!.message, 'You have 1 upcoming or ongoing booking. Cancel it or finish it first.');
  assert.equal(one!.action, 'Go to bookings');
  assert.equal(one!.route, '/bookings');
  assert.equal(many!.message, 'You have 2 open disputes. We need to settle them first.');
  assert.equal(many!.route, '/disputes');
});

test('blockerViews keeps the API order and skips unknown codes', () => {
  const views = blockerViews(
    [
      { code: 'UNPAID_EARNINGS', count: 4 },
      { code: 'SOMETHING_NEW' as never, count: 1 },
      { code: 'PENDING_REFUNDS', count: 1 },
    ],
    'companion',
  );
  assert.deepEqual(
    views.map((v) => [v.code, v.route]),
    [
      ['UNPAID_EARNINGS', '/companion/earnings'],
      ['PENDING_REFUNDS', '/support'],
    ],
  );
});

test('blockersFromDetails reads ACCOUNT_DELETION_BLOCKED details and ignores junk', () => {
  assert.deepEqual(blockersFromDetails({ blockers: [{ code: 'OPEN_DISPUTES', count: 1 }] }), [{ code: 'OPEN_DISPUTES', count: 1 }]);
  assert.deepEqual(blockersFromDetails({ blockers: [{ code: 'NOPE', count: 1 }, { code: 'OPEN_BOOKINGS' }, null] }), []);
  assert.deepEqual(blockersFromDetails({}), []);
  assert.deepEqual(blockersFromDetails(undefined), []);
  assert.deepEqual(blockersFromDetails({ blockers: 'x' }), []);
});

test('form: password and the confirmation are required, the reason is optional and capped', () => {
  const empty = emptyDeletionDraft();
  assert.deepEqual(Object.keys(deletionDraftErrors(empty)).sort(), ['confirmed', 'password']);
  assert.equal(canRequestDeletion(empty), false);
  const ok = { password: 'Secret123', reason: '', confirmed: true };
  assert.deepEqual(deletionDraftErrors(ok), {});
  assert.equal(canRequestDeletion(ok), true);
  const long = { ...ok, reason: 'x'.repeat(REASON_MAX + 1) };
  assert.equal(deletionDraftErrors(long).reason, `Keep it under ${REASON_MAX} characters.`);
  assert.equal(canRequestDeletion({ ...ok, reason: 'x'.repeat(REASON_MAX) }), true);
});

test('request body: reason trimmed, left out when empty; password sent as typed', () => {
  assert.deepEqual(deletionBody({ password: ' pw ', reason: '   ', confirmed: true }), { password: ' pw ' });
  assert.deepEqual(deletionBody({ password: 'pw', reason: '  Moving away  ', confirmed: true }), { password: 'pw', reason: 'Moving away' });
});

test('deletion date is shown in IST like other dates', () => {
  // 20:00 UTC on 16 Dec is 01:30 on 17 Dec in India.
  assert.equal(deletionDate('2026-12-16T20:00:00.000Z'), '17 December 2026');
  assert.equal(deletionDate('2026-12-17T06:00:00Z'), '17 December 2026');
  assert.equal(deletionDate(null), '—');
  assert.equal(deleteAccount.doneBody(deletionDate('2026-12-17T06:00:00Z')), 'We will delete your account and personal data on 17 December 2026.');
});

test('copy names the grace period', () => {
  assert.ok(deleteAccount.what(30).some((l) => l.includes('30 days')));
  assert.match(deleteAccount.confirm(30), /30 days/);
});
