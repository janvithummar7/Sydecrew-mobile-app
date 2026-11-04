// Unit tests for pure helpers. Run with: npm test (Node's built-in runner strips the types).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ageFrom, toIsoDate } from '../src/lib/dates.ts';
import { indianMobile, isEmail, passwordOk } from '../src/lib/validation.ts';

test('toIsoDate accepts real dates only', () => {
  assert.equal(toIsoDate('5', '6', '1996'), '1996-06-05');
  assert.equal(toIsoDate('29', '02', '2000'), '2000-02-29');
  for (const [d, m, y] of [['29', '02', '2001'], ['31', '04', '1990'], ['0', '1', '1990'], ['1', '13', '1990'], ['1', '1', '90'], ['', '', '']]) {
    assert.equal(toIsoDate(d, m, y), null, `${d}/${m}/${y}`);
  }
});

test('ageFrom handles birthdays and leap days', () => {
  const on = new Date(2026, 10, 4); // 4 Nov 2026
  assert.equal(ageFrom('2008-11-04', on), 18);
  assert.equal(ageFrom('2008-11-05', on), 17);
  assert.equal(ageFrom('2008-02-29', new Date(2026, 1, 28)), 17);
  assert.equal(ageFrom('2008-02-29', new Date(2026, 2, 1)), 18);
});

test('validation mirrors the API', () => {
  assert.equal(indianMobile('+91 98765 43210'), '9876543210');
  assert.equal(indianMobile('12345'), null);
  assert.ok(isEmail('a@b.co'));
  assert.ok(passwordOk('Secret123'));
  assert.ok(!passwordOk('password'));
});
