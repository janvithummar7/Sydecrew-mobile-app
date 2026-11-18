/** Booking API shapes (Feature 4), from the generated contract (src/lib/contract/schema.ts). */
import type { components } from '../contract/schema';

type S = components['schemas'];

export type BookingForm = S['BookingFormResponse'];
export type BookingOffering = BookingForm['offerings'][number];
export type BookingVenue = BookingForm['venues'][number];
export type BookingSlots = S['BookingSlotsResponse'];
export type Quote = S['BookingQuoteResponse'];
export type QuoteInput = S['postBookingsQuoteBody'];
export type Breakdown = S['BookingBreakdown'];
export type CancellationPolicy = S['CancellationPolicy'];
export type Booking = S['BookingView'];
export type BookingActions = Booking['actions'];
export type BookingMoney = Booking['money'];
export type TimelineEntry = Booking['timeline'][number];
export type BookingList = S['BookingListResponse'];
export type BookingListItem = BookingList['items'][number];
export type BookingTab = BookingList['tab'];
export type BookingResponse = S['BookingResponse'];
export type PaymentStart = S['BookingPaymentResponse'];
export type CancellationPreview = S['CancellationPreviewResponse'];
export type BookingCancelled = S['BookingCancelledResponse'];
export type CancelInput = S['postBookingsByIdCancelBody'];
export type RejectInput = S['postCompanionBookingsByIdRejectBody'];
export type MockOrder = S['MockPaymentOrderResponse'];
export type MockCheckout = S['MockCheckoutResponse'];
export type BookingStatus = S['BookingStatus'];
export type MockScenario = S['MockPaymentScenario'];
