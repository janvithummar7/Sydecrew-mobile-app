// Feature 7: PII scrubber, universal links, privacy helpers, statement format, dispute link. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { FILTERED, isSensitiveKey, scrubBreadcrumb, scrubEvent, scrubString } from '../src/lib/scrub.ts';
import { linkRoute, pushRoute, universalLinkPath } from '../src/lib/nav/pushLinks.ts';
import { canWithdraw, deletionReason, deletionView, exportView, hidesProfile, WITHDRAWABLE_CONSENTS } from '../src/lib/privacy/helpers.ts';
import { isOpenableLink, statementAction } from '../src/lib/payouts/helpers.ts';
import { disputeIdOf } from '../src/lib/support/helpers.ts';
import { ERROR_MESSAGES } from '../src/lib/contract/errors.ts';

const ID = '3f1c2a9e-4b5d-4e6f-8a7b-1c2d3e4f5a6b';

// ── Scrubber ───────────────────────────────────────────────────────────────

/** A realistic event: everything sensitive below must be gone after scrubEvent. */
const fixture = () => ({
  event_id: 'abc123',
  platform: 'javascript',
  level: 'error',
  release: 'sydecrew-mobile@1.0.0',
  sdk: { name: 'sentry.javascript.react-native', version: '8.28.0' },
  message: 'Failed for priya@example.com on +91 98765 43210',
  user: { id: 'u-1', email: 'priya@example.com', username: 'priya', ip_address: '10.1.2.3' },
  exception: {
    values: [{
      type: 'ApiError',
      value: `POST /me/delete-account failed: Bearer ${['eyJhbGciOiJIUzI1NiJ9', 'eyJzdWIiOiIxMjM0NTY3ODkwIn0', 'dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'].join('.')}`, // built at run time: no JWT literal in the repo
      stacktrace: { frames: [{ filename: 'app:///index.bundle', function: 'send', lineno: 10, vars: { password: 'hunter2', body: 'hi there' } }] },
    }],
  },
  request: {
    url: 'https://api.sydecrew.com/api/v1/auth/reset?token=s3cr3t&email=priya%40example.com&page=2',
    method: 'POST',
    headers: { Authorization: 'Bearer abc.def.ghi', 'x-client': 'mobile', Cookie: 'sid=1' },
    data: { password: 'hunter2', phone: '+919876543210' },
    cookies: { sid: '1' },
  },
  contexts: {
    os: { name: 'iOS', version: '19.0' },
    device: { name: "Priya's iPhone", model: 'iPhone17,1', family: 'iOS' },
    app: { app_name: 'Sydecrew', app_version: '1.0.0' },
    booking: { id: ID, venue_lat: 12.97, location: { lat: 12.9716, lng: 77.5946 } },
  },
  extra: {
    full_name: 'Priya Sharma',
    firstName: 'Priya',
    accountNumber: '123456789012',
    ifsc: 'HDFC0001234',
    aadhaar_number: '1234 5678 9012',
    pan: 'ABCDE1234F',
    document_number: 'P1234567',
    refresh_token: 'rt-1',
    newPassword: 'x',
    otp: '123456',
    statement: 'They were late and rude',
    description: 'long text',
    note: 'call me',
    text: 'chat message',
    body: { message: 'hello' },
    latitude: 12.9716,
    longitude: 77.5946,
    nested: [{ email: 'a@b.co', ok: 'free text with 12.9716, 77.5946 inside', status: 'PAID' }],
    booking_ref: 'SC-2026-0001',
    amount_paise: 150000,
  },
  breadcrumbs: [
    { category: 'console', level: 'log', message: 'response {"body":"secret chat"}' },
    { category: 'http', type: 'http', data: { url: 'https://api.sydecrew.com/api/v1/me/data-export/download?token=abc&id=1', method: 'GET', status_code: 200 } },
    { category: 'navigation', data: { from: '/chat/1', to: '/booking/2' } },
    { category: 'touch', message: 'Touch event within element: Pressable', data: { path: [{ name: 'Pressable', label: 'Message Priya' }] } },
  ],
  tags: { screen: 'privacy' },
});

test('scrubEvent: a fixture event leaves the phone with no PII', () => {
  const input = fixture();
  const before = JSON.stringify(input);
  const out = scrubEvent(input) as ReturnType<typeof fixture>;
  assert.equal(JSON.stringify(input), before, 'the input is not mutated');
  const json = JSON.stringify(out);
  for (const leak of ['priya@example.com', 'priya%40example.com', '98765', '9876543210', 'Priya', 'hunter2', 's3cr3t', 'eyJhbGci', 'abc.def.ghi', '123456789012', 'HDFC0001234', '1234 5678 9012', 'ABCDE1234F', 'P1234567', 'rt-1', 'They were late', 'long text', 'call me', 'chat message', 'hello', '12.9716', '77.5946', 'a@b.co', '10.1.2.3', 'secret chat', 'sid=1', 'token=abc']) {
    assert.ok(!json.includes(leak), `leaked: ${leak}`);
  }
  // Kept: what is needed to debug.
  assert.deepEqual(out.sdk, input.sdk);
  assert.equal(out.event_id, 'abc123');
  assert.equal(out.release, 'sydecrew-mobile@1.0.0');
  assert.deepEqual(out.user, { id: 'u-1' });
  assert.equal(out.contexts.os.name, 'iOS');
  assert.equal(out.contexts.device.model, 'iPhone17,1');
  assert.equal((out.contexts.device as Record<string, unknown>).name, undefined);
  assert.equal(out.contexts.booking.id, ID);
  assert.equal(out.contexts.booking.location as unknown, FILTERED);
  assert.equal(out.exception.values[0].type, 'ApiError');
  assert.equal(out.exception.values[0].stacktrace.frames[0].function, 'send');
  assert.equal(out.exception.values[0].stacktrace.frames[0].vars, undefined);
  assert.equal(out.request.method, 'POST');
  assert.equal(out.request.data as unknown, FILTERED);
  assert.equal(out.request.headers.Authorization, FILTERED);
  assert.equal(out.request.headers['x-client'], 'mobile');
  assert.match(out.request.url, /page=2/);
  assert.equal(out.extra.booking_ref, 'SC-2026-0001');
  assert.equal(out.extra.amount_paise, 150000);
  assert.equal(out.extra.nested[0].status, 'PAID');
  assert.equal(out.tags.screen, 'privacy');
  assert.equal(out.breadcrumbs[0].message, FILTERED);
  assert.equal(out.breadcrumbs[2].data?.to, '/booking/2');
});

test('scrubBreadcrumb: data keys, URLs and console logs', () => {
  const http = scrubBreadcrumb({ category: 'http', data: { url: 'https://x.test/a?email=a%40b.co&phone=9876543210&lat=1.2&page=1', status_code: 200 } });
  assert.equal(http.data.url, `https://x.test/a?email=${FILTERED}&phone=${FILTERED}&lat=${FILTERED}&page=1`);
  assert.equal(http.data.status_code, 200);
  const crumb = scrubBreadcrumb({ category: 'ui', message: 'sent to priya@example.com', data: { body: 'hi', note: 'x', lng: 77.1 } });
  assert.equal(crumb.message, 'sent to [email]');
  assert.deepEqual(crumb.data, { body: FILTERED, note: FILTERED, lng: FILTERED });
  const log = scrubBreadcrumb({ category: 'console', level: 'warn', message: 'body: hello', data: { arguments: ['x'] } });
  assert.equal(log.message, FILTERED);
  assert.equal(log.data, undefined);
});

test('scrubString: patterns, and what it leaves alone', () => {
  assert.equal(scrubString('mail a.b+c@x.co.in now'), 'mail [email] now');
  assert.equal(scrubString('call +91 98765 43210'), 'call [number]');
  assert.equal(scrubString('call 98765-43210'), 'call [number]');
  assert.equal(scrubString('acct 50100123456789'), 'acct [number]');
  assert.equal(scrubString('Authorization: Bearer abcdef123456'), `Authorization: Bearer ${FILTERED}`);
  assert.equal(scrubString('pan ABCDE1234F'), 'pan [id]');
  assert.equal(scrubString('at 12.97161, 77.59461'), 'at [location]');
  assert.equal(scrubString('/reset?token=abc&x=1'), `/reset?token=${FILTERED}&x=1`);
  // Not PII: dates, UUIDs, money, short numbers, booking refs.
  for (const ok of ['2026-11-12', `booking ${ID}`, '₹1,500.50', 'status 404', 'SC-2026-0001', '2026-11-12T10:00:00.000Z']) assert.equal(scrubString(ok), ok);
});

test('isSensitiveKey: names, credentials, documents, bank, text, location', () => {
  for (const k of ['phone', 'email', 'full_name', 'firstName', 'display_name', 'password', 'newPassword', 'access_token', 'refreshToken', 'Authorization', 'x-api-key', 'otp', 'aadhaar_number', 'pan', 'passport_number', 'document_number', 'accountNumber', 'ifsc', 'upi_id', 'body', 'text', 'message', 'statement', 'description', 'note', 'lat', 'lng', 'latitude', 'longitude', 'location', 'address']) {
    assert.ok(isSensitiveKey(k), k);
  }
  for (const k of ['id', 'status', 'code', 'booking_id', 'amount_paise', 'created_at', 'url', 'method', 'status_code', 'type', 'category']) assert.ok(!isSensitiveKey(k), k);
});

test('scrubEvent: cycles and deep nesting do not throw', () => {
  const a: Record<string, unknown> = { id: 1 };
  a.self = a;
  let deep: Record<string, unknown> = { v: 'end' };
  for (let i = 0; i < 30; i++) deep = { d: deep };
  const out = scrubEvent({ extra: { a, deep } }) as { extra: { a: { self: unknown } } };
  assert.equal(out.extra.a.self, FILTERED);
});

// ── Universal links ───────────────────────────────────────────────────────

test('universal links: valid paths map like push paths, for both hosts', () => {
  for (const host of ['https://sydecrew.com', 'https://www.sydecrew.com', 'HTTPS://SYDECREW.COM']) {
    assert.equal(linkRoute(`${host}/bookings/${ID}`, 'customer', '/home'), `/booking/${ID}`);
    assert.equal(linkRoute(`${host}/messages/${ID}`, 'companion', '/companion/dashboard'), `/chat/${ID}`);
    assert.equal(linkRoute(`${host}/earnings/payouts/${ID}`, 'companion', '/companion/dashboard'), `/companion/payouts/${ID}`);
    assert.equal(linkRoute(`${host}/earnings`, 'companion', '/x'), '/companion/earnings');
    assert.equal(linkRoute(`${host}/disputes/${ID}`, 'customer', '/home'), `/disputes/${ID}`);
    assert.equal(linkRoute(`${host}/support`, 'customer', '/home'), '/support');
    assert.equal(linkRoute(`${host}/safety`, 'customer', '/home'), '/safety/sos');
    assert.equal(linkRoute(`${host}/settings`, 'customer', '/home'), '/settings');
    assert.equal(linkRoute(`${host}/settings/privacy`, 'companion', '/x'), '/settings/privacy');
  }
});

test('universal links: query strings and fragments are dropped', () => {
  assert.equal(universalLinkPath(`https://sydecrew.com/bookings/${ID}?utm_source=email&next=https://evil.com`), `/bookings/${ID}`);
  assert.equal(linkRoute(`https://sydecrew.com/support/${ID}#reply`, 'customer', '/home'), `/support/${ID}`);
  assert.equal(linkRoute('https://sydecrew.com/settings/privacy?x=1', 'customer', '/home'), '/settings/privacy');
  assert.equal(linkRoute('https://sydecrew.com?x=1', 'customer', '/home'), '/home');
});

test('universal links: other hosts, http and other schemes are ignored (null)', () => {
  const ignored = [
    `http://sydecrew.com/bookings/${ID}`,
    `https://evil.com/bookings/${ID}`,
    `https://sydecrew.com.evil.com/bookings/${ID}`,
    `https://evilsydecrew.com/bookings/${ID}`,
    `https://api.sydecrew.com/bookings/${ID}`,
    `https://sydecrew.com@evil.com/bookings/${ID}`,
    `https://sydecrew.com:8443/bookings/${ID}`,
    `https://www.sydecrew.com.evil.com/`,
    `sydecrew://bookings/${ID}`,
    `//sydecrew.com/bookings/${ID}`,
    `/bookings/${ID}`,
    'javascript:alert(1)',
    ' https://sydecrew.com/support',
    '',
    null,
    undefined,
    42,
    `https://sydecrew.com/${'a'.repeat(600)}`,
  ];
  for (const u of ignored) {
    assert.equal(universalLinkPath(u), null, String(u));
    assert.equal(linkRoute(u, 'customer', '/home'), null, String(u));
  }
});

test('universal links: traversal, encoded and unknown paths open home', () => {
  const home = [
    'https://sydecrew.com/bookings/../settings',
    'https://sydecrew.com/bookings/%2e%2e/admin',
    'https://sydecrew.com/bookings//1',
    'https://sydecrew.com/admin',
    'https://sydecrew.com/legal/terms',
    'https://sydecrew.com/',
    'https://sydecrew.com',
    'https://sydecrew.com/bookings',
    `https://sydecrew.com/bookings/${ID}/extra`,
    'https://sydecrew.com/support\\evil',
  ];
  for (const u of home) assert.equal(linkRoute(u, 'customer', '/home'), '/home', u);
  // Companion-only screens in the customer shell: home, not the companion screen.
  assert.equal(linkRoute('https://sydecrew.com/earnings', 'customer', '/home'), '/home');
});

test('push paths gain /settings and /settings/privacy (the deletion notice links there)', () => {
  assert.equal(pushRoute('/settings/privacy', 'customer'), '/settings/privacy');
  assert.equal(pushRoute('/settings', 'companion'), '/settings');
  assert.equal(pushRoute('/settings/other', 'customer'), null);
});

test('app.json: associated domains and verified Android intent filters for every linked path', () => {
  const app = JSON.parse(fs.readFileSync(new URL('../app.json', import.meta.url), 'utf8')).expo;
  assert.deepEqual(app.ios.associatedDomains, ['applinks:sydecrew.com', 'applinks:www.sydecrew.com']);
  const filter = app.android.intentFilters[0];
  assert.equal(filter.autoVerify, true);
  for (const host of ['sydecrew.com', 'www.sydecrew.com']) {
    for (const p of ['/bookings', '/messages', '/earnings', '/disputes', '/support', '/safety', '/settings']) {
      assert.ok(filter.data.some((d: { scheme: string; host: string; pathPrefix: string }) => d.scheme === 'https' && d.host === host && d.pathPrefix === p), `${host}${p}`);
    }
  }
  assert.ok(!filter.data.some((d: { scheme: string }) => d.scheme !== 'https'), 'https only');
});

test('Sentry: config plugin present; uploads off unless SENTRY_AUTH_TOKEN', async () => {
  const app = JSON.parse(fs.readFileSync(new URL('../app.json', import.meta.url), 'utf8')).expo;
  const { default: dynamic } = await import('../app.config.js');
  const prev = process.env.SENTRY_AUTH_TOKEN;
  try {
    delete process.env.SENTRY_AUTH_TOKEN;
    const off = dynamic({ config: app }).plugins.find((p: unknown) => Array.isArray(p) && p[0] === '@sentry/react-native');
    assert.deepEqual(off[1], { disableAutoUpload: true });
    process.env.SENTRY_AUTH_TOKEN = 'test-only';
    const on = dynamic({ config: app }).plugins.find((p: unknown) => Array.isArray(p) && p[0] === '@sentry/react-native');
    assert.equal(on[1].disableAutoUpload, false);
    assert.ok(!JSON.stringify(on).includes('test-only'), 'the token is never written into the config');
  } finally {
    if (prev === undefined) delete process.env.SENTRY_AUTH_TOKEN;
    else process.env.SENTRY_AUTH_TOKEN = prev;
  }
  const sentry = fs.readFileSync(new URL('../src/lib/sentry.ts', import.meta.url), 'utf8');
  assert.match(sentry, /sendDefaultPii: false/);
  assert.match(sentry, /replaysSessionSampleRate: 0/);
  assert.match(sentry, /replaysOnErrorSampleRate: 0/);
  assert.match(sentry, /if \(sentryEnabled\)/);
  assert.match(sentry, /beforeSend: \(event\) => scrubEvent\(event\)/);
  assert.match(sentry, /beforeBreadcrumb: \(crumb\) => scrubBreadcrumb\(crumb\)/);
});

// ── Privacy helpers ───────────────────────────────────────────────────────

const consent = (type: string, granted = true, withdrawable = true) => ({ type, granted, withdrawable, version: '1', at: '2026-11-01T00:00:00Z' });

test('consents: only granted, withdrawable, known types can be withdrawn', () => {
  assert.deepEqual([...WITHDRAWABLE_CONSENTS], ['MARKETING', 'LOCATION_SHARING', 'KYC_BIOMETRIC_PROCESSING']);
  for (const t of WITHDRAWABLE_CONSENTS) assert.ok(canWithdraw(consent(t)), t);
  assert.ok(!canWithdraw(consent('MARKETING', false, false)), 'already withdrawn');
  assert.ok(!canWithdraw(consent('MARKETING', true, false)), 'the API says no');
  assert.ok(!canWithdraw(consent('TERMS', true, true)), 'required consents never');
  assert.ok(hidesProfile('KYC_BIOMETRIC_PROCESSING', true));
  assert.ok(!hidesProfile('KYC_BIOMETRIC_PROCESSING', false), 'customers have no profile to hide');
  assert.ok(!hidesProfile('MARKETING', true));
});

test('exportView: none, preparing, ready, expired, failed and the weekly limit', () => {
  const now = Date.parse('2026-11-12T10:00:00Z');
  const ex = (status: 'QUEUED' | 'READY' | 'EXPIRED' | 'FAILED', expires_at: string | null = null) => ({ id: ID, status, ready_at: null, expires_at, download_count: 0, created_at: '2026-11-12T09:00:00Z' });
  assert.deepEqual(exportView({ export: null, next_request_at: null, cooldown_days: 7 }, now), { kind: 'none', canRequest: true });
  assert.deepEqual(exportView({ export: ex('QUEUED'), next_request_at: '2026-11-19T09:00:00Z', cooldown_days: 7 }, now), { kind: 'preparing', canRequest: false });
  assert.deepEqual(exportView({ export: ex('READY', '2026-11-15T09:00:00Z'), next_request_at: '2026-11-19T09:00:00Z', cooldown_days: 7 }, now), { kind: 'ready', id: ID, expiresAt: '2026-11-15T09:00:00Z', canRequest: false, nextAt: '2026-11-19T09:00:00Z' });
  assert.deepEqual(exportView({ export: ex('READY', '2026-11-12T09:59:00Z'), next_request_at: '2026-11-12T09:00:00Z', cooldown_days: 7 }, now), { kind: 'expired', canRequest: true, nextAt: null });
  assert.deepEqual(exportView({ export: ex('EXPIRED'), next_request_at: '2026-11-19T09:00:00Z', cooldown_days: 7 }, now), { kind: 'expired', canRequest: false, nextAt: '2026-11-19T09:00:00Z' });
  assert.deepEqual(exportView({ export: ex('FAILED'), next_request_at: null, cooldown_days: 7 }, now), { kind: 'failed', canRequest: true, nextAt: null });
});

test('deletionView and deletionReason', () => {
  const b = { code: 'UPCOMING_BOOKING' as const, message: 'You have an upcoming booking.' };
  assert.deepEqual(deletionView({ request: null, blockers: [], cooling_days: 7 }), { kind: 'available' });
  assert.deepEqual(deletionView({ request: null, blockers: [b], cooling_days: 7 }), { kind: 'blocked', blockers: [b] });
  assert.deepEqual(deletionView({ request: { id: ID, status: 'COOLING', scheduled_for: '2026-11-19T00:00:00Z', blocked: [] }, blockers: [b], cooling_days: 7 }), { kind: 'scheduled', scheduledFor: '2026-11-19T00:00:00Z', blocked: [] });
  assert.equal(deletionReason('   '), undefined);
  assert.equal(deletionReason('  moving on  '), 'moving on');
  assert.equal(deletionReason('x'.repeat(600))?.length, 500);
});

// ── Payout statement and dispute link ─────────────────────────────────────

test('statement: HTML opens in the browser, CSV goes to the share sheet; only https links', () => {
  assert.equal(statementAction('html'), 'browser');
  assert.equal(statementAction('csv'), 'share');
  assert.ok(isOpenableLink('https://api.sydecrew.com/api/v1/statements/x?token=1'));
  assert.ok(!isOpenableLink('http://api.sydecrew.com/x'));
  assert.ok(isOpenableLink('http://10.0.2.2:4000/x', true), 'http only in development');
  for (const bad of ['javascript:alert(1)', 'file:///etc/passwd', '', null, 'https://a b']) assert.ok(!isOpenableLink(bad), String(bad));
});

test('disputeIdOf: dispute_id, then dispute.id, else null', () => {
  assert.equal(disputeIdOf({ dispute_id: ID, dispute: null }), ID);
  assert.equal(disputeIdOf({ dispute_id: null, dispute: { id: ID } }), ID);
  assert.equal(disputeIdOf({ dispute_id: null, dispute: null }), null);
  assert.equal(disputeIdOf({}), null);
  assert.equal(disputeIdOf({ dispute_id: '../admin' }), null);
});

// ── Error copy ────────────────────────────────────────────────────────────

test('every Feature 7 error code the app can meet has copy', () => {
  for (const code of ['ACCOUNT_DELETION_BLOCKED', 'ACCOUNT_DELETION_NOT_PENDING', 'ACCOUNT_DELETION_PENDING', 'CONSENT_NOT_GIVEN', 'CONSENT_NOT_WITHDRAWABLE', 'DATA_EXPORT_LINK_INVALID', 'DATA_EXPORT_NOT_FOUND', 'DATA_EXPORT_NOT_READY', 'DATA_EXPORT_TOO_SOON', 'OTP_NOT_YOURS', 'PASSWORD_INCORRECT', 'STATEMENT_LINK_INVALID']) {
    assert.ok(ERROR_MESSAGES[code], code);
  }
});
