/**
 * Review helpers (pure, unit-tested in test/reviews.test.ts): the star picker,
 * tag limits, the review form's checks and request body, the rating display
 * rule (a rating only when the API gives one, otherwise "New on Sydecrew"),
 * the state of the viewer's own review, and review bylines.
 */
import { stars as starCopy } from '../../content/reviews';
import type { Booking } from '../bookings/types';
import type { MyReview, Rating, ReviewInput, ReviewTag } from './types';

export const STARS = [1, 2, 3, 4, 5] as const;
export const MAX_TAGS = 5;
export const COMMENT_MAX = 1000;

// ── Star picker ─────────────────────────────────────────────────────────

/** Spoken name of one star button: "1 star", "4 stars". */
export const starLabel = (n: number) => (n === 1 ? starCopy.one : starCopy.many(n));

/** The five star buttons: label, whether it is the chosen value, whether it is drawn filled. */
export function starButtons(value: number | null): { value: number; label: string; selected: boolean; filled: boolean }[] {
  return STARS.map((n) => ({ value: n, label: starLabel(n), selected: value === n, filled: value !== null && n <= value }));
}

/** Read-only stars for an average: each of five is full, half or empty (rounded to the nearest half). */
export function starFills(average: number): ('full' | 'half' | 'empty')[] {
  const r = Math.round(Math.min(5, Math.max(0, average)) * 2) / 2;
  return STARS.map((n) => (r >= n ? 'full' : r >= n - 0.5 ? 'half' : 'empty'));
}

// ── Tags ────────────────────────────────────────────────────────────────

/** Adds or removes a tag. Only tags the API offers this viewer; never more than MAX_TAGS. */
export function toggleTag(tags: ReviewTag[], tag: ReviewTag, allowed: readonly ReviewTag[]): ReviewTag[] {
  if (tags.includes(tag)) return tags.filter((t) => t !== tag);
  if (!allowed.includes(tag) || tags.length >= MAX_TAGS) return tags;
  return [...tags, tag];
}

/** A chip is disabled once five are picked (the picked ones stay tappable to remove). */
export const tagDisabled = (tags: ReviewTag[], tag: ReviewTag) => !tags.includes(tag) && tags.length >= MAX_TAGS;

// ── Form ────────────────────────────────────────────────────────────────

export type ReviewDraft = { rating: number | null; comment: string; tags: ReviewTag[] };
export const emptyDraft = (): ReviewDraft => ({ rating: null, comment: '', tags: [] });

export type DraftErrors = { rating?: 'required'; comment?: 'too_long'; tags?: 'too_many' | 'not_allowed' };

/** What is wrong with the draft before it is sent (the API checks again). */
export function draftErrors(d: ReviewDraft, allowed: readonly ReviewTag[]): DraftErrors {
  const e: DraftErrors = {};
  if (d.rating === null || !Number.isInteger(d.rating) || d.rating < 1 || d.rating > 5) e.rating = 'required';
  if (d.comment.trim().length > COMMENT_MAX) e.comment = 'too_long';
  if (d.tags.length > MAX_TAGS) e.tags = 'too_many';
  else if (d.tags.some((t) => !allowed.includes(t))) e.tags = 'not_allowed';
  return e;
}

export const canSubmit = (d: ReviewDraft, allowed: readonly ReviewTag[]) => Object.keys(draftErrors(d, allowed)).length === 0;

/** POST /bookings/:id/review body: trimmed comment (left out when empty), unique tags. */
export function reviewBody(d: ReviewDraft): ReviewInput {
  const comment = d.comment.trim();
  return { rating: d.rating ?? 0, tags: [...new Set(d.tags)], ...(comment ? { comment } : {}) };
}

// ── Rating display rule ─────────────────────────────────────────────────

export type RatingView = { kind: 'new' } | { kind: 'rated'; average: number; averageText: string; count: number; text: string; label: string };

/**
 * A rating is shown only when the API gives one (it does so from the public
 * threshold of visible reviews). Otherwise: "New on Sydecrew", never made-up stars.
 */
export function ratingView(rating: Rating | null | undefined): RatingView {
  if (!rating || !Number.isFinite(rating.average) || rating.average <= 0 || !(rating.count > 0)) return { kind: 'new' };
  const average = Math.min(5, Math.max(1, rating.average));
  const averageText = average.toFixed(1);
  const reviews = starCopy.reviews(rating.count);
  return { kind: 'rated', average, averageText, count: rating.count, text: `★ ${averageText} · ${reviews}`, label: `${starCopy.rated(averageText)}, ${reviews}` };
}

/** "★ 4.7 · 3 reviews from companions" for a companion viewing a customer; null below the threshold. */
export function customerRatingText(rating: Rating | null | undefined): string | null {
  const v = ratingView(rating);
  return v.kind === 'rated' ? `★ ${v.averageText} · ${starCopy.fromCompanions(v.count)}` : null;
}

// ── The viewer's own review ─────────────────────────────────────────────

export type MyReviewState = 'visible' | 'waiting' | 'checking' | 'hidden';

/** Shown to the other side / counted (visible), held by the double-blind (waiting), held by the filter (checking), or hidden by staff. */
export function myReviewState(mine: Pick<MyReview, 'status' | 'visible'>): MyReviewState {
  if (mine.status === 'FLAGGED') return 'checking';
  if (mine.status === 'HIDDEN') return 'hidden';
  return mine.visible ? 'visible' : 'waiting';
}

/** What the booking's review section shows: the form, the viewer's review, the other side's (companions only). */
export function reviewSection(b: Pick<Booking, 'actions' | 'review' | 'viewer'>): { show: boolean; form: boolean; mine: MyReview | null; theirs: Booking['review']['theirs'] } {
  const mine = b.review.mine ?? null;
  const theirs = b.viewer === 'COMPANION' ? (b.review.theirs ?? null) : null;
  const form = !mine && b.actions.can_review;
  return { show: form || !!mine || !!theirs, form, mine, theirs };
}

// ── Lists ───────────────────────────────────────────────────────────────

/** "Nov 2026" from YYYY-MM; '' when not a month. */
export function monthLabel(ym: string): string {
  if (!/^\d{4}-\d{2}$/.test(ym)) return '';
  return new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** "?cursor=…&limit=…" (or ""): cursor paging for the review lists (limit 1–50). */
export function pageQuery(cursor?: string | null, limit?: number): string {
  const q: string[] = [];
  if (cursor) q.push(`cursor=${encodeURIComponent(cursor)}`);
  if (limit) q.push(`limit=${Math.min(50, Math.max(1, Math.floor(limit)))}`);
  return q.length ? `?${q.join('&')}` : '';
}
