/**
 * Booking, payment and cancellation copy (Feature 4). Plain, short, Sydecrew
 * wording. Money is never "held by Sydecrew": the payment is held by the
 * payment gateway until the meeting is complete.
 */
import type { BookingCancelReason, BookingIssue, BookingRejectReason, BookingStatus, MockPaymentScenario } from '@/lib/contract/enums';

/** Price lines (amounts are formatted with formatINR from paise). */
export const prices = {
  time: (duration: string) => `Companion's time (${duration})`,
  discount: 'Discount',
  fee: 'Service fee',
  gstFee: 'GST on the service fee',
  total: 'Total',
  bookingValue: 'Booking value',
  commission: 'Sydecrew commission',
  gstCommission: 'GST on the commission',
  earnings: 'Your earnings',
} as const;

/** Status labels; the companion sees its own wording where it differs. */
export const statusLabels = {
  DRAFT: 'Draft',
  REQUESTED: 'Request sent',
  AWAITING_COMPANION: 'Waiting for the companion',
  ACCEPTED: 'Accepted',
  REJECTED: 'Not accepted',
  PAYMENT_PENDING: 'Waiting for payment',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
  DISPUTED: 'Issue under review',
  REFUNDED: 'Refunded',
  PARTIALLY_REFUNDED: 'Partly refunded',
} satisfies Record<BookingStatus, string>;
export const companionStatusLabels: Partial<Record<BookingStatus, string>> = { AWAITING_COMPANION: 'Waiting for your answer', PAYMENT_PENDING: 'Waiting for the customer to pay' };

export const details = {
  title: 'Booking details',
  occasion: 'Occasion',
  date: 'Date',
  duration: 'How long',
  startTime: 'Start time (IST)',
  noTimes: 'No free start times on this day for this length. Try another day or a shorter time.',
  loadingTimes: 'Finding free times…',
  venue: 'Venue',
  venueHint: 'Approved public venues in the companion’s area only.',
  venuePending: 'Waiting for approval — you can send a request, and pay once Sydecrew approves the venue.',
  noVenues: 'No approved public venues for this activity in the companion’s area yet.',
  notes: 'Note for your companion (optional)',
  notesHint: 'Phone numbers, emails and links are hidden. Keep contact inside Sydecrew.',
  instant: 'Instant booking: pay now and it is confirmed.',
  request: 'Request: the companion has a few hours to accept, then you pay.',
  plusOneClosed: 'Plus-One bookings open once ID verification for customers is live.',
  continue: 'See the price',
  requote: 'That time is no longer available. Choose another time.',
  pick: 'Choose an occasion, date, time and venue.',
} as const;

export const review = {
  title: 'Review and pay',
  titleRequest: 'Review your request',
  breakdown: 'Price',
  cancellation: 'Cancellation policy',
  companionCancels: 'If the companion cancels, you get a full refund.',
  expires: (label: string) => `This price is held for ${label}.`,
  expired: 'This price expired. Get a new one.',
  getNew: 'Get a new price',
  consent: 'I will meet only at the approved public venue, keep it platonic, and follow the community guidelines.',
  consentNeeded: 'Please confirm the community guidelines first.',
  pay: (amount: string) => `Book and pay ${amount}`,
  send: 'Send request',
  requestNote: 'You pay only after the companion accepts. Until then nothing is charged.',
  held: 'Your payment is held by the payment gateway until the meeting is complete. Pay only inside Sydecrew, never by QR or bank transfer.',
  venuePending: 'The venue is waiting for approval, so this is a request. You can pay once it is approved.',
} as const;

export const pay = {
  title: 'Payment',
  starting: 'Preparing your payment…',
  due: (when: string) => `Pay by ${when} to keep this time.`,
  closed: 'The time to pay has passed and the slot was released. You have not been charged.',
  testTitle: 'Test payment — no real money',
  testBody: 'This is the development test checkout. Choose what the payment gateway should do.',
  scenarios: {
    SUCCESS: 'Payment succeeds',
    FAILED: 'Payment fails',
    PENDING_THEN_SUCCESS: 'Payment is pending, then succeeds',
    DUPLICATE_WEBHOOK: 'Succeeds (gateway sends its message twice)',
    LATE_SUCCESS: 'Succeeds late (after the hold)',
    REFUND_FAIL_ONCE: 'Succeeds (the first refund will fail)',
  } satisfies Record<MockPaymentScenario, string>,
  notOpenTitle: 'Payments open soon',
  notOpenBody: 'Card and UPI payments open once the payment gateway is approved. Your booking is held until the time shown.',
} as const;

export const result = {
  title: 'Payment',
  checking: 'Checking with the payment gateway…',
  checkingBody: 'We confirm your booking only when the payment gateway tells us the payment went through.',
  confirmedTitle: 'Booking confirmed',
  confirmedBody: 'See you there. Check in when you meet.',
  failedTitle: 'The payment did not go through',
  failedBody: 'You have not been charged. You can try again while the time is held.',
  closedTitle: 'This booking is no longer waiting for payment',
  closedBody: 'If any money was taken after the time ran out, it is refunded in full automatically.',
  stillTitle: 'Still checking',
  stillBody: 'This can take a few minutes. We will confirm as soon as the gateway does.',
  tryAgain: 'Try again',
  refresh: 'Check again',
  viewBooking: 'View booking',
} as const;

export const list = {
  title: 'Bookings',
  tabs: { upcoming: 'Upcoming', past: 'Past', cancelled: 'Cancelled' },
  companionTabs: { requests: 'Requests', upcoming: 'Upcoming', past: 'Past', cancelled: 'Cancelled' },
  emptyUpcoming: 'No upcoming bookings',
  emptyUpcomingBody: 'Find a verified companion and send a request.',
  emptyPast: 'No past bookings yet',
  emptyCancelled: 'Nothing cancelled',
  emptyRequests: 'No requests right now',
  emptyRequestsBody: 'New requests appear here. Answer before the time runs out.',
  discover: 'Discover companions',
  answerBy: (label: string) => `Answer within ${label}`,
  payBy: (label: string) => `Pay within ${label}`,
  venuePending: 'Venue waiting for approval',
} as const;

export const detail = {
  title: 'Booking',
  when: 'When',
  venue: 'Venue',
  with: 'With',
  notes: 'Note',
  notesMasked: 'Contact details were hidden.',
  money: 'Money',
  refunds: 'Refunds',
  timeline: 'What happened',
  boundaries: 'Agreed boundaries',
  cancellation: 'Cancellation policy',
  answerBy: (label: string) => `The companion has ${label} to answer.`,
  youAnswerBy: (label: string) => `You have ${label} to answer.`,
  payBy: (label: string) => `Pay within ${label} to keep this time.`,
  venuePending: 'The venue is waiting for Sydecrew’s approval. You can pay once it is approved.',
  issue: 'An issue was reported. Sydecrew is reviewing it; the companion’s earnings are on hold until then.',
  actions: {
    pay: 'Pay now',
    check_in: 'Check in',
    check_out: 'Check out',
    accept: 'Accept request',
    reject: 'Decline',
    cancel: 'Cancel booking',
    report_issue: 'Report an issue',
  },
  day: 'Booking day',
  held: 'Payment held by the payment gateway until the meeting is complete.',
  actor: { CUSTOMER: 'Customer', COMPANION: 'Companion', SYSTEM: 'Sydecrew', ADMIN: 'Sydecrew staff' },
  refundDone: (when: string) => `Refunded ${when}`,
  refundApproval: 'Waiting for approval',
  refundProcessing: 'Being processed',
  accepted: 'Request accepted',
  declined: 'Request declined',
} as const;

export const day = {
  title: 'Booking day',
  arrived: 'At the venue?',
  checkInBody: 'Check in when you meet. It is a tap, not your location.',
  opens: (when: string) => `Check-in opens at ${when}.`,
  closes: (when: string) => `Check-in closes at ${when}.`,
  you: 'You',
  other: (who: string) => who,
  checkedIn: 'Checked in',
  notYet: 'Not yet',
  inProgress: 'Meeting in progress. Check out when you part ways.',
  checkedIn2: 'Checked in. Waiting for the other person.',
  sos: 'Need help? Open SOS',
  boundaries: 'Agreed boundaries',
} as const;

export const cancel = {
  title: 'Cancel booking',
  loading: 'Working out your refund…',
  refund: 'Refund',
  keeps: (amount: string) => `The companion keeps ${amount} of their share.`,
  penalty: 'Cancelling counts against your reliability. The customer gets a full refund.',
  reason: 'Reason',
  note: 'Anything to add? (optional)',
  confirm: 'Cancel booking',
  keep: 'Keep booking',
  done: 'Booking cancelled',
  reasons: {
    CHANGE_OF_PLANS: 'Change of plans',
    EMERGENCY: 'Emergency',
    FEEL_UNSAFE: 'I do not feel safe',
    SCHEDULE_CONFLICT: 'Schedule conflict',
    VENUE_ISSUE: 'Problem with the venue',
    OTHER: 'Something else',
  } satisfies Record<BookingCancelReason, string>,
} as const;

export const issue = {
  title: 'Report an issue',
  body: 'Sydecrew reviews every report. The companion’s earnings are held until then. In an emergency, call 112.',
  reason: 'What happened?',
  note: 'Tell us more (optional)',
  submit: 'Send report',
  done: 'Thanks. We will look into it.',
  reasons: {
    NO_SHOW: 'The other person did not turn up',
    LATE_ARRIVAL: 'They arrived very late',
    ENDED_EARLY: 'It ended early',
    BOUNDARY_CROSSED: 'A boundary was crossed',
    SAFETY_CONCERN: 'I felt unsafe',
    OTHER: 'Something else',
  } satisfies Record<BookingIssue, string>,
} as const;

export const reject = {
  title: 'Decline request',
  reason: 'Reason',
  note: 'Note for the customer (optional)',
  confirm: 'Decline',
  reasons: {
    NOT_AVAILABLE: 'I am not available then',
    VENUE_NOT_SUITABLE: 'The venue does not suit me',
    ACTIVITY_NOT_SUITABLE: 'The activity does not suit me',
    TOO_SHORT_NOTICE: 'Too short notice',
    OTHER: 'Something else',
  } satisfies Record<BookingRejectReason, string>,
} as const;

export const companionInbox = {
  title: 'Bookings',
  subtitle: 'Requests, upcoming meetings and history. Earnings are paid out after the meeting and the review window.',
  earnings: (amount: string) => `Your earnings ${amount}`,
} as const;
