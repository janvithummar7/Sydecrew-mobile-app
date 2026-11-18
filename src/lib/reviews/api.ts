import { api } from '../api';
import type { Booking, BookingResponse } from '../bookings/types';
import { pageQuery } from './helpers';
import type { CompanionReviews, OwnReviews, ReviewInput, ReviewReported, ReviewReportInput } from './types';

const enc = encodeURIComponent;

/**
 * Reviews and ratings. Writing a review lives on the booking; a companion's
 * public reviews on discovery (customers); a companion's own list under
 * /companion; reporting a review under /reviews.
 */
export const reviewsApi = {
  /** Once per side, after a completed meeting, within the window. Returns the updated booking. */
  submit: (bookingId: string, body: ReviewInput): Promise<Booking> =>
    api<BookingResponse>(`/bookings/${enc(bookingId)}/review`, { method: 'POST', body }).then((r) => r.booking),
  /** A companion's public reviews (empty until the public threshold). */
  forCompanion: (companionId: string, cursor?: string | null, limit?: number) =>
    api<CompanionReviews>(`/discovery/companions/${enc(companionId)}/reviews${pageQuery(cursor, limit)}`),
  /** The signed-in companion's own reviews and average. */
  mine: (cursor?: string | null, limit?: number) => api<OwnReviews>(`/companion/reviews${pageQuery(cursor, limit)}`),
  report: (reviewId: string, body: ReviewReportInput) => api<ReviewReported>(`/reviews/${enc(reviewId)}/report`, { method: 'POST', body }),
};
