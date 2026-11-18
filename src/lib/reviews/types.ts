/** Reviews and ratings API shapes, from the generated contract (src/lib/contract/schema.ts). */
import type { components } from '../contract/schema';
import type { Booking } from '../bookings/types';

type S = components['schemas'];

export type Rating = S['Rating'];
export type ReviewTag = S['ReviewTag'];
export type ReviewStatus = S['ReviewStatus'];
export type ReviewReportReason = S['ReviewReportReason'];
export type BookingReview = Booking['review'];
export type MyReview = NonNullable<BookingReview['mine']>;
export type TheirReview = NonNullable<BookingReview['theirs']>;
export type ReviewInput = S['postBookingsByIdReviewBody'];
export type ReviewReportInput = S['postReviewsByIdReportBody'];
export type ReviewReported = S['ReportedResponse'];
/** GET /discovery/companions/:id/reviews (customers). */
export type CompanionReviews = S['CompanionReviewsResponse'];
/** GET /companion/reviews (the companion's own). */
export type OwnReviews = S['OwnReviewsResponse'];
export type ReviewItem = CompanionReviews['items'][number];
