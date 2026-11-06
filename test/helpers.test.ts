// Money, IST time and the one error helper. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatINR } from '../src/lib/money.ts';
import { formatDateIST, formatDateTimeIST, formatTimeIST, todayIST } from '../src/lib/time.ts';
import { errorView, messageFor } from '../src/lib/errors.ts';
import { ERROR_MESSAGES } from '../src/lib/contract/errors.ts';
import { ErrorCodeValues } from '../src/lib/contract/enums.ts';

test('formatINR: integer paise in Indian grouping', () => {
  assert.equal(formatINR(0), '₹0');
  assert.equal(formatINR(100), '₹1');
  assert.equal(formatINR(150000), '₹1,500');
  assert.equal(formatINR(150050), '₹1,500.50');
  assert.equal(formatINR(12345678900), '₹12,34,56,789');
  assert.equal(formatINR(5), '₹0.05');
});

test('IST formatting ignores the device time zone', () => {
  // 18:30 UTC on 4 Nov is midnight, 5 Nov, in India.
  assert.equal(formatDateIST('2026-11-04T18:30:00Z'), '5 November 2026');
  assert.equal(todayIST(new Date('2026-11-04T18:30:00Z')), '2026-11-05');
  assert.equal(todayIST(new Date('2026-11-04T18:29:00Z')), '2026-11-04');
  assert.match(formatDateTimeIST('2026-11-05T14:12:00Z'), /^5 Nov,? 7:42\s?pm$/i);
  const now = new Date('2026-11-05T10:00:00Z');
  assert.match(formatTimeIST('2026-11-05T14:12:00Z', now), /^7:42\s?pm$/i);
  assert.match(formatTimeIST('2026-11-03T14:12:00Z', now), /^3 Nov/);
  assert.equal(formatDateIST(null), '—');
});

test('errorView: one message per code, from the shared table', () => {
  assert.equal(Object.keys(ERROR_MESSAGES).length, ErrorCodeValues.length, 'every contract error code has a message');
  for (const code of ErrorCodeValues) assert.ok(ERROR_MESSAGES[code], code);

  const locked = errorView({ code: 'ACCOUNT_LOCKED', message: 'raw server text', status: 423 });
  assert.equal(locked.message, ERROR_MESSAGES.ACCOUNT_LOCKED);
  assert.equal(locked.offline, false);

  const invalid = errorView({ code: 'VALIDATION_FAILED', message: 'Email is not valid', details: { fields: { email: 'Enter a valid email' } } });
  assert.equal(invalid.message, 'Email is not valid');
  assert.deepEqual(invalid.fields, { email: 'Enter a valid email' });

  for (const code of ['NETWORK_ERROR', 'TIMEOUT', 'CONFIG_MISSING']) {
    const v = errorView({ code });
    assert.equal(v.offline, true, code);
    assert.match(v.message, /connection/);
  }

  assert.equal(errorView({ code: 'SOMETHING_NEW', message: 'Server says no' }).message, 'Server says no');
  assert.equal(errorView(new Error('')).message, 'Something went wrong. Please try again.');
  assert.equal(errorView(null).code, null);
  assert.equal(messageFor('OTP_EXPIRED'), ERROR_MESSAGES.OTP_EXPIRED);
  assert.equal(messageFor('NOPE'), 'Something went wrong. Please try again.');
});
