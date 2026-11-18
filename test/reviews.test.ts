// Reviews and ratings: the star picker, tags and the review form, the rating display rule, own-review states.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  COMMENT_MAX,
  MAX_TAGS,
  canSubmit,
  customerRatingText,
  draftErrors,
  emptyDraft,
  monthLabel,
  myReviewState,
  pageQuery,
  ratingView,
  reviewBody,
  reviewSection,
  starButtons,
  starFills,
  starLabel,
  tagDisabled,
  toggleTag,
} from '../src/lib/reviews/helpers.ts';
import { sameCard } from '../src/lib/discovery/list.ts';
import { reviewList, tagLabels, reviewReport } from '../src/content/reviews.ts';
import { ReviewReportReasonValues, ReviewTagValues, type ReviewTag } from '../src/lib/contract/enums.ts';
import type { Booking } from '../src/lib/bookings/types.ts';
import type { DiscoveryCard } from '../src/lib/discovery/types.ts';

const CUSTOMER_TAGS: ReviewTag[] = ['PUNCTUAL', 'GREAT_CONVERSATION', 'RESPECTFUL', 'KNOWLEDGEABLE', 'WARM_AND_FRIENDLY', 'GOOD_LISTENER', 'WELL_PLANNED'];
const COMPANION_TAGS: ReviewTag[] = ['PUNCTUAL', 'RESPECTFUL', 'CLEAR_PLANS', 'FRIENDLY', 'GOOD_VENUE_CHOICE', 'KEPT_TO_BOUNDARIES'];

// ── Star picker ───────────────────────────────────────────────────────────

test('star picker: five buttons named "1 star" … "5 stars"; only the chosen one is selected', () => {
  assert.equal(starLabel(1), '1 star');
  assert.equal(starLabel(4), '4 stars');
  const none = starButtons(null);
  assert.deepEqual(none.map((s) => s.label), ['1 star', '2 stars', '3 stars', '4 stars', '5 stars']);
  assert.ok(none.every((s) => !s.selected && !s.filled), 'nothing chosen yet');
  const four = starButtons(4);
  assert.deepEqual(four.map((s) => s.selected), [false, false, false, true, false]);
  assert.deepEqual(four.map((s) => s.filled), [true, true, true, true, false]);
});

test('read-only stars round to the nearest half', () => {
  assert.deepEqual(starFills(4.7), ['full', 'full', 'full', 'full', 'half']);
  assert.deepEqual(starFills(4.8), ['full', 'full', 'full', 'full', 'full']);
  assert.deepEqual(starFills(3.2), ['full', 'full', 'full', 'empty', 'empty']);
  assert.deepEqual(starFills(1), ['full', 'empty', 'empty', 'empty', 'empty']);
});

// ── Tags ──────────────────────────────────────────────────────────────────

test('tags: toggle on and off, only those offered, never more than five', () => {
  let tags: ReviewTag[] = [];
  tags = toggleTag(tags, 'PUNCTUAL', CUSTOMER_TAGS);
  assert.deepEqual(tags, ['PUNCTUAL']);
  tags = toggleTag(tags, 'PUNCTUAL', CUSTOMER_TAGS);
  assert.deepEqual(tags, [], 'a second tap removes it');
  assert.deepEqual(toggleTag([], 'CLEAR_PLANS', CUSTOMER_TAGS), [], 'a companion-only tag cannot be picked by a customer');
  for (const t of CUSTOMER_TAGS) tags = toggleTag(tags, t, CUSTOMER_TAGS);
  assert.equal(tags.length, MAX_TAGS);
  assert.ok(tagDisabled(tags, 'WELL_PLANNED') && tagDisabled(tags, 'GOOD_LISTENER'), 'the rest are disabled at five');
  assert.ok(!tagDisabled(tags, 'PUNCTUAL'), 'a picked tag stays tappable to remove');
  assert.deepEqual(toggleTag(tags, 'PUNCTUAL', CUSTOMER_TAGS).length, MAX_TAGS - 1);
});

test('every tag and report reason has a friendly label', () => {
  for (const t of ReviewTagValues) assert.ok(tagLabels[t] && !/_/.test(tagLabels[t]), t);
  for (const r of ReviewReportReasonValues) assert.ok(reviewReport.reasons[r], r);
  assert.ok([...CUSTOMER_TAGS, ...COMPANION_TAGS].every((t) => (ReviewTagValues as readonly string[]).includes(t)));
});

// ── Form ──────────────────────────────────────────────────────────────────

test('review form: a rating is required; comment up to 1000; body is trimmed and minimal', () => {
  const d = emptyDraft();
  assert.deepEqual(draftErrors(d, CUSTOMER_TAGS), { rating: 'required' });
  assert.equal(canSubmit(d, CUSTOMER_TAGS), false);
  const ok = { ...d, rating: 4 };
  assert.equal(canSubmit(ok, CUSTOMER_TAGS), true, 'stars alone are enough');
  assert.deepEqual(reviewBody(ok), { rating: 4, tags: [] }, 'empty comment is left out; tags always sent');
  assert.deepEqual(reviewBody({ rating: 5, comment: '  Lovely chat about books.  ', tags: ['GREAT_CONVERSATION', 'GREAT_CONVERSATION'] }), {
    rating: 5,
    comment: 'Lovely chat about books.',
    tags: ['GREAT_CONVERSATION'],
  });
  assert.equal(draftErrors({ ...ok, comment: 'x'.repeat(COMMENT_MAX + 1) }, CUSTOMER_TAGS).comment, 'too_long');
  assert.equal(draftErrors({ ...ok, comment: `  ${'x'.repeat(COMMENT_MAX)}  ` }, CUSTOMER_TAGS).comment, undefined, 'spaces around do not count');
  assert.equal(draftErrors({ ...ok, tags: ['CLEAR_PLANS'] }, CUSTOMER_TAGS).tags, 'not_allowed');
  assert.equal(draftErrors({ ...ok, tags: CUSTOMER_TAGS.slice(0, 6) }, CUSTOMER_TAGS).tags, 'too_many');
  assert.equal(draftErrors({ ...ok, rating: 6 }, CUSTOMER_TAGS).rating, 'required');
  assert.equal(draftErrors({ ...ok, rating: 0 }, CUSTOMER_TAGS).rating, 'required');
});

// ── Rating display rule ───────────────────────────────────────────────────

test('rating rule: stars only when the API gives a rating; otherwise "New on Sydecrew"', () => {
  assert.deepEqual(ratingView(null), { kind: 'new' });
  assert.deepEqual(ratingView(undefined), { kind: 'new' });
  assert.deepEqual(ratingView({ average: 0, count: 0 }), { kind: 'new' }, 'never invent stars');
  assert.deepEqual(ratingView({ average: Number.NaN, count: 3 }), { kind: 'new' });
  const v = ratingView({ average: 4.66, count: 12 });
  assert.equal(v.kind, 'rated');
  if (v.kind === 'rated') {
    assert.equal(v.averageText, '4.7');
    assert.equal(v.text, '★ 4.7 · 12 reviews');
    assert.equal(v.label, 'Rated 4.7 out of 5, 12 reviews');
  }
  const one = ratingView({ average: 5, count: 1 });
  assert.equal(one.kind === 'rated' && one.text, '★ 5.0 · 1 review');
  assert.equal(customerRatingText({ average: 4.7, count: 3 }), '★ 4.7 · 3 reviews from companions');
  assert.equal(customerRatingText(null), null, 'below the threshold the companion sees nothing');
});

test('discovery row memo re-renders when the rating changes', () => {
  const card: DiscoveryCard = {
    id: 'a', display_name: 'A', photo_url: null, zone: null, languages: [], categories: [], from_paise: 0,
    next_available_at: null, verified: true, rating: null, new_on_sydecrew: true,
  };
  assert.ok(sameCard(card, { ...card }));
  assert.ok(!sameCard(card, { ...card, rating: { average: 4.5, count: 3 }, new_on_sydecrew: false }));
  assert.ok(!sameCard({ ...card, rating: { average: 4.5, count: 3 } }, { ...card, rating: { average: 4.5, count: 4 } }));
});

// ── The booking's review section ──────────────────────────────────────────

const mine = { rating: 4, comment: null, tags: [] as ReviewTag[], submitted_at: '2026-11-10T10:00:00Z' };

test('own review state: shared, waiting for the other side, being checked, hidden', () => {
  assert.equal(myReviewState({ status: 'PUBLISHED', visible: true }), 'visible');
  assert.equal(myReviewState({ status: 'PUBLISHED', visible: false }), 'waiting');
  assert.equal(myReviewState({ status: 'FLAGGED', visible: false }), 'checking');
  assert.equal(myReviewState({ status: 'HIDDEN', visible: false }), 'hidden');
});

test('review section: form only with can_review and no review yet; theirs only for companions', () => {
  const b = (over: { can_review?: boolean; mine?: unknown; theirs?: unknown; viewer?: 'CUSTOMER' | 'COMPANION' }) =>
    ({
      viewer: over.viewer ?? 'CUSTOMER',
      actions: { can_review: over.can_review ?? false },
      review: { window_ends_at: null, tags: CUSTOMER_TAGS, mine: over.mine ?? null, theirs: over.theirs ?? null },
    }) as unknown as Booking;
  assert.deepEqual(reviewSection(b({})), { show: false, form: false, mine: null, theirs: null });
  assert.equal(reviewSection(b({ can_review: true })).form, true);
  const done = reviewSection(b({ can_review: true, mine: { ...mine, status: 'PUBLISHED', visible: false } }));
  assert.equal(done.form, false, 'one review per side');
  assert.ok(done.show && done.mine);
  assert.equal(reviewSection(b({ theirs: mine })).show, false, 'a customer never sees the companion review');
  assert.ok(reviewSection(b({ theirs: mine, viewer: 'COMPANION' })).theirs);
});

// ── Lists ─────────────────────────────────────────────────────────────────

test('review byline and paging query', () => {
  assert.equal(monthLabel('2026-11'), 'Nov 2026');
  assert.equal(monthLabel('bad'), '');
  assert.equal(reviewList.byline('Priya', 'Coffee', monthLabel('2026-11')), 'Priya · Coffee · Nov 2026');
  assert.equal(pageQuery(), '');
  assert.equal(pageQuery(null, 5), '?limit=5');
  assert.equal(pageQuery('a b=', 99), '?cursor=a%20b%3D&limit=50');
});

test('the review.request push (entity "bookings") opens the booking for both sides', async () => {
  const { pushRoute } = await import('../src/lib/nav/pushLinks.ts');
  const id = '3f2b8c1e-9d4a-4e7b-8c2d-1a2b3c4d5e6f';
  assert.equal(pushRoute(`/bookings/${id}`, 'customer'), `/booking/${id}`);
  assert.equal(pushRoute(`/bookings/${id}`, 'companion'), `/booking/${id}`);
});
