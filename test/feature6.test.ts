// Feature 6: push deep links, companion tabs, money and status labels, payout-account form. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pushPath, pushRoute } from '../src/lib/nav/pushLinks.ts';
import { COMPANION_MORE, COMPANION_TABS, MAX_TABS } from '../src/lib/nav/companionTabs.ts';
import { accountStatus, earningStatus, maskAccount, normaliseAccount, payoutStatus, validateAccount } from '../src/lib/payouts/helpers.ts';
import { SAFETY_TYPES, TicketCategoryValues, complaintError, complaintLabels, disputeStatus, hasReceipt, isSafetyComplaint, ticketStatus } from '../src/lib/support/helpers.ts';
import { ComplaintTypeValues, DisputeStatusValues, EarningStatusValues, PayoutAccountStatusValues, PayoutStatusValues, TicketStatusValues } from '../src/lib/contract/enums.ts';
import { ERROR_MESSAGES } from '../src/lib/contract/errors.ts';
import { formatINR } from '../src/lib/money.ts';

const ID = '3f1c2a9e-4b5d-4e6f-8a7b-1c2d3e4f5a6b';

test('pushRoute: every documented path, for each shell', () => {
  const both: [string, string][] = [
    [`/bookings/${ID}`, `/booking/${ID}`],
    [`/messages/${ID}`, `/chat/${ID}`],
    [`/disputes/${ID}`, `/disputes/${ID}`],
    ['/support', '/support'],
    [`/support/${ID}`, `/support/${ID}`],
    ['/safety', '/safety/sos'],
    ['/safety/contacts', '/safety/contacts'],
  ];
  for (const [path, route] of both) {
    assert.equal(pushRoute(path, 'customer'), route, path);
    assert.equal(pushRoute(path, 'companion'), route, path);
  }
  assert.equal(pushRoute(`/earnings/payouts/${ID}`, 'companion'), `/companion/payouts/${ID}`);
  assert.equal(pushRoute('/earnings/account', 'companion'), '/companion/payout-account');
  assert.equal(pushRoute('/earnings', 'companion'), '/companion/earnings');
  assert.equal(pushRoute('/support/', 'customer'), '/support', 'a trailing slash is fine');
});

test('pushRoute: companion-only screens are not opened in the customer shell', () => {
  for (const p of ['/earnings', '/earnings/account', `/earnings/payouts/${ID}`]) assert.equal(pushRoute(p, 'customer'), null, p);
});

test('pushRoute: unknown and malicious paths -> null (the caller opens home)', () => {
  const bad = [
    '//evil.com',
    '//evil.com/bookings/1',
    'https://evil.com/bookings/1',
    'sydecrew://bookings/1',
    'javascript:alert(1)',
    '/bookings/../settings',
    '../bookings/1',
    '/bookings/..',
    '/bookings/%2e%2e',
    '/bookings/1?next=https://evil.com',
    '/bookings/1#x',
    '/bookings//1',
    '/bookings/',
    '/bookings/1/2',
    '/bookings',
    '/admin',
    '/companion/earnings',
    '/support\\evil',
    ' /support',
    '',
    '/',
    `/bookings/${'a'.repeat(65)}`,
    `/support/${'a'.repeat(300)}`,
  ];
  for (const p of bad) assert.equal(pushRoute(p, 'customer'), null, p);
  for (const p of [null, undefined, 42, {}, ['/support']]) assert.equal(pushRoute(p, 'companion'), null, String(p));
});

test('pushPath reads data.path only', () => {
  assert.equal(pushPath({ type: 'x', id: '1', path: '/support' }), '/support');
  assert.equal(pushPath(null), undefined);
  assert.equal(pushPath('nope'), undefined);
});

test('companion tab bar: at most 5 tabs, and the screen files exist', () => {
  assert.ok(COMPANION_TABS.length <= MAX_TABS);
  assert.deepEqual([...COMPANION_TABS], ['dashboard', 'bookings', 'messages', 'earnings', 'more']);
  const layout = fs.readFileSync(new URL('../src/app/companion/(tabs)/_layout.tsx', import.meta.url), 'utf8');
  const shown = [...layout.matchAll(/<Tabs\.Screen name="([a-z-]+)" options=\{\{ title/g)].map((m) => m[1]);
  assert.deepEqual(shown, [...COMPANION_TABS], 'tabs with a title in the layout are exactly the five');
  for (const name of COMPANION_MORE) {
    assert.ok(new RegExp(`name="${name}" options=\\{hidden\\}`).test(layout), `${name} is hidden from the bar`);
    assert.ok(fs.existsSync(new URL(`../src/app/companion/(tabs)/${name}.tsx`, import.meta.url)), `${name} route still exists`);
  }
  const customer = fs.readFileSync(new URL('../src/app/(customer)/_layout.tsx', import.meta.url), 'utf8');
  assert.ok((customer.match(/<Tabs\.Screen /g) ?? []).length <= MAX_TABS, 'customer tabs stay within 5');
});

test('status labels cover every contract enum value', () => {
  assert.deepEqual(Object.keys(earningStatus).sort(), [...EarningStatusValues].sort());
  assert.deepEqual(Object.keys(payoutStatus).sort(), [...PayoutStatusValues].sort());
  assert.deepEqual(Object.keys(accountStatus).sort(), [...PayoutAccountStatusValues].sort());
  assert.deepEqual(Object.keys(disputeStatus).sort(), [...DisputeStatusValues].sort());
  assert.deepEqual(Object.keys(ticketStatus).sort(), [...TicketStatusValues].sort());
  assert.deepEqual(Object.keys(complaintLabels).sort(), [...ComplaintTypeValues].sort());
  assert.deepEqual(TicketCategoryValues, ['BOOKING', 'PAYMENT', 'PAYOUT', 'ACCOUNT', 'SAFETY', 'OTHER']);
});

test('money: paise in, rupees out; clawback stays negative', () => {
  assert.equal(formatINR(150000), '₹1,500');
  assert.equal(formatINR(10000000), '₹1,00,000');
  assert.equal(formatINR(-25050), '-₹250.50');
  assert.equal(formatINR(0), '₹0');
});

test('maskAccount: never more than the last 4 digits', () => {
  assert.equal(maskAccount('1234'), '•••• 1234');
  assert.equal(maskAccount('123456789012'), '•••• 9012');
  assert.equal(maskAccount(null), '—');
  assert.equal(maskAccount(''), '—');
});

test('validateAccount: number, confirmation, IFSC and name', () => {
  const ok = { account_number: '1234 5678 9012', confirm_account_number: '123456789012', ifsc: 'hdfc0001234', account_holder_name: '  Asha   Patel ' };
  assert.deepEqual(validateAccount(ok), {});
  assert.deepEqual(normaliseAccount(ok), { account_number: '123456789012', confirm_account_number: '123456789012', ifsc: 'HDFC0001234', account_holder_name: 'Asha Patel' });
  assert.ok(validateAccount({ ...ok, account_number: '12345678' }).account_number, '8 digits is too short');
  assert.ok(validateAccount({ ...ok, account_number: '1'.repeat(19), confirm_account_number: '1'.repeat(19) }).account_number, '19 digits is too long');
  assert.ok(validateAccount({ ...ok, account_number: '12345678901a' }).account_number, 'letters');
  assert.equal(validateAccount({ ...ok, confirm_account_number: '123456789013' }).confirm_account_number, 'The two account numbers do not match.');
  assert.ok(validateAccount({ ...ok, confirm_account_number: '' }).confirm_account_number);
  for (const ifsc of ['HDFC1001234', 'HDF00001234', 'HDFC000123', 'HDFC00012345', 'HDFC0-01234']) assert.ok(validateAccount({ ...ok, ifsc }).ifsc, ifsc);
  assert.deepEqual(validateAccount({ ...ok, ifsc: 'SBIN0ABC123' }), {});
  assert.ok(validateAccount({ ...ok, account_holder_name: 'A' }).account_holder_name);
});

test('complaints: safety types and the description length', () => {
  assert.deepEqual([...SAFETY_TYPES].sort(), ['ASSAULT', 'HARASSMENT', 'SAFETY', 'THREAT', 'UNSAFE_SITUATION']);
  assert.ok(isSafetyComplaint('THREAT'));
  assert.ok(!isSafetyComplaint('LATE'));
  assert.ok(!isSafetyComplaint(null));
  assert.equal(complaintError(null, 'long enough text'), 'Choose what happened.');
  assert.ok(complaintError('LATE', 'too short'));
  assert.equal(complaintError('LATE', 'They arrived 40 minutes late.'), null);
  assert.ok(complaintError('LATE', 'x'.repeat(2001)));
});

test('receipt: customers with a captured or refunded payment only', () => {
  assert.ok(hasReceipt({ viewer: 'CUSTOMER', payment: { status: 'CAPTURED' } }));
  assert.ok(hasReceipt({ viewer: 'CUSTOMER', payment: { status: 'PARTIALLY_REFUNDED' } }));
  assert.ok(!hasReceipt({ viewer: 'CUSTOMER', payment: { status: 'CREATED' } }));
  assert.ok(!hasReceipt({ viewer: 'CUSTOMER', payment: null }));
  assert.ok(!hasReceipt({ viewer: 'COMPANION', payment: { status: 'CAPTURED' } }));
});

test('every Feature 6 error code has friendly copy', () => {
  for (const code of ['DISPUTE_RESPONSE_CLOSED', 'STATEMENT_ALREADY_SUBMITTED', 'APPEAL_WINDOW_CLOSED', 'PAYOUT_ACCOUNT_UNCHANGED', 'PAYOUT_ACCOUNT_CHANGE_IN_PROGRESS', 'TICKET_CLOSED', 'NO_RECEIPT_YET', 'PAYOUT_NOT_FOUND']) {
    assert.ok(ERROR_MESSAGES[code], code);
  }
});
