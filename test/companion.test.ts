// Feature 2 pure helpers. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatPaise, paiseToInput, parseRupees } from '../src/lib/money.ts';
import { contactProblems, contactWarning } from '../src/lib/contentWarning.ts';
import { checklistRows, isApproved, isEditable, routeForStep, timelineStages } from '../src/lib/companion/steps.ts';
import { normaliseTime, slotErrors, toMinutes } from '../src/lib/companion/availability.ts';
import { afterFailure, backoffMs, due, isRetryable, MAX_ATTEMPTS, parseQueue, remove, replaceSide, restartFromUrl, upsert, type PendingUpload } from '../src/lib/uploads/queue.ts';

test('paise: Indian formatting and exact rupee parsing', () => {
  assert.equal(formatPaise(150000), '₹1,500');
  assert.equal(formatPaise(150050), '₹1,500.50');
  assert.equal(formatPaise(15000000), '₹1,50,000');
  assert.equal(formatPaise(1234567800), '₹1,23,45,678');
  assert.equal(formatPaise(5), '₹0.05');
  assert.equal(formatPaise(null), '—');
  assert.equal(parseRupees('1500'), 150000);
  assert.equal(parseRupees('₹1,500.5'), 150050);
  assert.equal(parseRupees(' 850.05 '), 85005);
  assert.equal(parseRupees('0.1'), 10);
  for (const bad of ['', 'abc', '-5', '1.234', '1e3', '1,50,0.0.0']) assert.equal(parseRupees(bad), null, bad);
  // No floating point drift: 1159.99 rupees is exactly 115999 paise.
  assert.equal(parseRupees('1159.99'), 115999);
  assert.equal(paiseToInput(150050), '1500.50');
  assert.equal(paiseToInput(150000), '1500');
  assert.equal(paiseToInput(null), '');
});

test('contact warning mirrors the API filter for live feedback', () => {
  assert.deepEqual(contactProblems('Call me on 98765 43210'), ['PHONE']);
  assert.ok(contactProblems('priya (at) gmail dot com').includes('EMAIL'));
  assert.ok(contactProblems('see www.example.com').includes('URL'));
  assert.ok(contactProblems('find me on insta').includes('SOCIAL'));
  assert.ok(contactProblems('nine eight seven six five four three two').includes('PHONE'));
  assert.equal(contactWarning('I love heritage walks and filter coffee.'), null);
  assert.match(contactWarning('whatsapp me') ?? '', /social media/);
});

test('steps: API step names map to screens; checklist rows in order', () => {
  assert.equal(routeForStep('PROFILE'), '/companion/profile');
  assert.equal(routeForStep('DOCUMENTS'), '/companion/identity');
  assert.equal(routeForStep('FIX_REQUIRED'), '/companion/status');
  assert.equal(routeForStep('GO_LIVE'), '/companion/go-live');
  assert.equal(routeForStep('LIVE'), '/companion/dashboard');
  assert.equal(routeForStep('SOMETHING_NEW'), '/companion/status');
  assert.equal(routeForStep(null), '/companion');
  const rows = checklistRows(['PHOTOS', 'DOCUMENTS']);
  assert.deepEqual(rows.map((r) => [r.key, r.done]), [['PROFILE', true], ['PHOTOS', false], ['CATEGORIES', true], ['DOCUMENTS', false]]);
  assert.ok(isApproved('LIVE') && isApproved('SETUP') && !isApproved('IN_REVIEW'));
  assert.ok(isEditable('NEEDS_CHANGES') && !isEditable('IN_REVIEW'));
  const t = timelineStages('IN_REVIEW');
  assert.deepEqual(t.map((s) => s.done), [true, true, true, false]);
  assert.equal(t[3]!.current, true);
});

test('availability: quarter hours, minimum length, no overlaps on a day', () => {
  assert.equal(toMinutes('9:30'), 570);
  assert.equal(toMinutes('24:00'), null);
  assert.equal(normaliseTime('9:00'), '09:00');
  const errs = slotErrors([
    { day_of_week: 1, start_time: '10:00', end_time: '13:00' },
    { day_of_week: 1, start_time: '12:00', end_time: '15:00' }, // overlaps
    { day_of_week: 2, start_time: '10:10', end_time: '12:00' }, // not quarter hour
    { day_of_week: 3, start_time: '10:00', end_time: '10:30' }, // too short
    { day_of_week: 4, start_time: '14:00', end_time: '12:00' }, // backwards
    { day_of_week: 1, start_time: '15:00', end_time: '16:00' }, // starts when slot 1 ends: fine
  ]);
  assert.deepEqual(Object.keys(errs).map(Number), [1, 2, 3, 4]);
  assert.match(errs[1]!, /Overlaps/);
});

const item = (over: Partial<PendingUpload> = {}): PendingUpload => ({
  id: 'a',
  kind: 'PHOTO',
  localUri: 'file:///a.jpg',
  mime: 'image/jpeg',
  bytes: 10,
  sha256: 'f'.repeat(64),
  assetId: null,
  stage: 'PREPARED',
  attempts: 0,
  nextAttemptAt: 0,
  createdAt: 1,
  ...over,
});

test('upload queue: retries what may pass, gives up on refusals, keeps the asset id', () => {
  assert.equal(backoffMs(1), 2000);
  assert.equal(backoffMs(3), 8000);
  assert.equal(backoffMs(20), 300000, 'capped at 5 minutes');
  assert.ok(isRetryable(0, 'NETWORK_ERROR'));
  assert.ok(isRetryable(503));
  assert.ok(isRetryable(429));
  assert.ok(!isRetryable(422, 'IMAGE_TOO_SMALL'));
  assert.ok(!isRetryable(409, 'APPLICATION_LOCKED'));

  const withAsset = item({ assetId: 'asset-1', stage: 'UPLOADED' });
  const next = afterFailure(withAsset, 1000, 0, 'NETWORK_ERROR');
  assert.ok(next);
  assert.equal(next.assetId, 'asset-1', 'the same upload id is retried');
  assert.equal(next.attempts, 1);
  assert.equal(next.nextAttemptAt, 3000);
  assert.equal(afterFailure(withAsset, 1000, 422, 'UPLOAD_CORRUPTED'), null);
  assert.equal(afterFailure(item({ attempts: MAX_ATTEMPTS - 1 }), 0, 500), null, 'gives up after the limit');
  assert.equal(restartFromUrl(withAsset).stage, 'PREPARED');
  assert.equal(restartFromUrl(withAsset).assetId, 'asset-1');

  const list = [item({ id: 'b', createdAt: 5 }), item({ id: 'c', createdAt: 2, nextAttemptAt: 9999 }), item({ id: 'd', createdAt: 1 })];
  assert.deepEqual(due(list, 100).map((i) => i.id), ['d', 'b']);
  assert.equal(upsert(list, item({ id: 'b', attempts: 3 })).find((i) => i.id === 'b')!.attempts, 3);
  assert.equal(remove(list, 'b').length, 2);
  const docs = [item({ id: 'x', kind: 'DOCUMENT', side: 'FRONT' }), item({ id: 'y', kind: 'DOCUMENT', side: 'SELFIE' })];
  assert.deepEqual(replaceSide(docs, 'FRONT').map((i) => i.id), ['y']);
});

test('upload queue survives a restart: persisted JSON is parsed defensively', () => {
  const saved = JSON.stringify([item({ id: 'ok', assetId: 'asset-9' }), { id: 'broken' }, null]);
  const restored = parseQueue(saved);
  assert.equal(restored.length, 1);
  assert.equal(restored[0]!.assetId, 'asset-9');
  assert.deepEqual(parseQueue('not json'), []);
  assert.deepEqual(parseQueue(null), []);
});
