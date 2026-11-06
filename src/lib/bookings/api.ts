import { api } from '../api';
import type {
  Booking,
  BookingCancelled,
  BookingForm,
  BookingList,
  BookingResponse,
  BookingSlots,
  CancelInput,
  CancellationPreview,
  IssueInput,
  MockCheckout,
  MockOrder,
  MockScenario,
  PaymentStart,
  Quote,
  QuoteInput,
  RejectInput,
} from './types';

const enc = encodeURIComponent;
const unwrap = (p: Promise<BookingResponse>): Promise<Booking> => p.then((r) => r.booking);

/**
 * /api/v1/bookings (Feature 4). Money is integer paise; times are UTC ISO
 * strings (shown in IST). Payment success is never taken from the client:
 * only GET /bookings/:id says whether a booking is CONFIRMED.
 */
export const bookingsApi = {
  form: (companionId: string) => api<BookingForm>(`/bookings/form?companion_id=${enc(companionId)}`),
  slots: (q: { companion_id: string; offering_id: string; date: string; duration_minutes: number }) =>
    api<BookingSlots>(`/bookings/slots?companion_id=${enc(q.companion_id)}&offering_id=${enc(q.offering_id)}&date=${enc(q.date)}&duration_minutes=${q.duration_minutes}`),
  quote: (body: QuoteInput) => api<Quote>('/bookings/quote', { method: 'POST', body }),
  /** One Idempotency-Key per booking attempt: a retry or a double tap sends the same key and gets the same booking. */
  create: (body: { quote_id: string; notes?: string }, idempotencyKey: string) =>
    unwrap(api<BookingResponse>('/bookings', { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey } })),
  list: (tab: 'upcoming' | 'past' | 'cancelled') => api<BookingList>(`/bookings?tab=${tab}`),
  detail: (id: string) => unwrap(api<BookingResponse>(`/bookings/${enc(id)}`)),
  pay: (id: string) => api<PaymentStart>(`/bookings/${enc(id)}/pay`, { method: 'POST', body: {} }),
  cancellationPreview: (id: string) => api<CancellationPreview>(`/bookings/${enc(id)}/cancellation-preview`),
  cancel: (id: string, body: CancelInput) => api<BookingCancelled>(`/bookings/${enc(id)}/cancel`, { method: 'POST', body }),
  checkIn: (id: string) => unwrap(api<BookingResponse>(`/bookings/${enc(id)}/check-in`, { method: 'POST', body: {} })),
  checkOut: (id: string) => unwrap(api<BookingResponse>(`/bookings/${enc(id)}/check-out`, { method: 'POST', body: {} })),
  reportIssue: (id: string, body: IssueInput) => unwrap(api<BookingResponse>(`/bookings/${enc(id)}/report-issue`, { method: 'POST', body })),

  // Companion inbox
  companionList: (status: 'requests' | 'upcoming' | 'past' | 'cancelled') => api<BookingList>(`/companion/bookings?status=${status}`),
  accept: (id: string) => unwrap(api<BookingResponse>(`/companion/bookings/${enc(id)}/accept`, { method: 'POST', body: {} })),
  reject: (id: string, body: RejectInput) => unwrap(api<BookingResponse>(`/companion/bookings/${enc(id)}/reject`, { method: 'POST', body })),

  // Test checkout: development builds only (the API does not serve it in production).
  mockOrder: (orderId: string) => api<MockOrder>(`/payments/mock/orders/${enc(orderId)}`),
  mockComplete: (orderId: string, scenario: MockScenario) => api<MockCheckout>(`/payments/mock/orders/${enc(orderId)}/complete`, { method: 'POST', body: { scenario } }),
};
