/** Reviews and ratings copy: the review on a booking, rating lines, review lists, reporting a review. */
import type { ReviewReportReason, ReviewTag } from '@/lib/contract/enums';

/** Friendly tag labels (both directions share one list; the API says which a viewer may pick). */
export const tagLabels = {
  PUNCTUAL: 'On time',
  GREAT_CONVERSATION: 'Great conversation',
  RESPECTFUL: 'Respectful',
  KNOWLEDGEABLE: 'Knowledgeable',
  WARM_AND_FRIENDLY: 'Warm and friendly',
  GOOD_LISTENER: 'Good listener',
  WELL_PLANNED: 'Well planned',
  CLEAR_PLANS: 'Clear plans',
  FRIENDLY: 'Friendly',
  GOOD_VENUE_CHOICE: 'Good venue choice',
  KEPT_TO_BOUNDARIES: 'Kept to boundaries',
} satisfies Record<ReviewTag, string>;

export const stars = {
  one: '1 star',
  many: (n: number) => `${n} stars`,
  rated: (average: string) => `Rated ${average} out of 5`,
  reviews: (n: number) => (n === 1 ? '1 review' : `${n} reviews`),
  fromCompanions: (n: number) => (n === 1 ? '1 review from companions' : `${n} reviews from companions`),
} as const;

export const bookingReview = {
  title: 'Review',
  customerIntro: (name: string) =>
    `How was your time with ${name}? Your review appears on ${name}'s public profile with your first name. ${name} sees it after writing theirs, or when the time to review ends.`,
  companionIntro: (name: string) =>
    `How was your time with ${name}? Your review is private: only Sydecrew's safety team reads it. Other companions see only ${name}'s average rating, never what you wrote.`,
  deadline: (when: string) => `You can review until ${when}. Reviews cannot be changed after you send them.`,
  rating: 'Your rating',
  ratingNeeded: 'Choose a rating from 1 to 5 stars.',
  tags: (max: number) => `What stood out? (optional, up to ${max})`,
  tagsFull: (max: number) => `You can pick up to ${max}.`,
  comment: 'Anything to add? (optional)',
  commentHint: 'Keep it about the meeting. Phone numbers, links and personal details are not allowed.',
  commentTooLong: (max: number) => `Keep it under ${max} characters.`,
  submit: 'Send review',
  sent: 'Thank you. Your review was sent.',
  mineTitle: 'Your review',
  theirsTitle: (name: string) => `${name}'s review of you`,
  states: {
    visible: 'Shared',
    /** A companion's review is never shown to the customer: once released it only counts. */
    visibleCompanion: 'Counted',
    waiting: 'Waiting',
    checking: 'Being checked',
    hidden: 'Hidden',
  },
  stateBody: {
    visibleCustomer: (name: string) => `${name} can see your review, and it counts towards their rating.`,
    visibleCompanion: (name: string) => `Your review now counts towards ${name}'s average. It stays private.`,
    waiting: (name: string, when: string | null) =>
      when ? `${name} sees it after writing theirs, or on ${when} when the time to review ends.` : `${name} sees it after writing theirs, or when the time to review ends.`,
    checking: 'Our team is checking your comment before it can be shown. Until then it is not shown or counted.',
    hidden: 'This review broke our community guidelines, so it is not shown or counted.',
  },
} as const;

export const reviewList = {
  title: 'Reviews',
  showMore: 'Show more',
  loadingMore: 'Loading more reviews',
  report: 'Report',
  reportLabel: (who: string) => `Report ${who}'s review`,
  reported: 'Reported',
  /** "Priya · Coffee · Nov 2026" */
  byline: (who: string, activity: string, month: string) => [who, activity, month].filter(Boolean).join(' · '),
  noPublic: 'No public reviews yet. Only customers with a completed booking can review.',
} as const;

export const ownReviews = {
  title: 'Your reviews',
  subtitle: 'What customers wrote after meeting you.',
  average: 'Your rating',
  publicYes: 'Customers can see your rating and reviews on your profile.',
  publicNo: (min: number, n: number) => `Customers see your rating from ${min} reviews; you have ${n}.`,
  emptyTitle: 'No reviews yet',
  emptyBody: 'After a completed booking, customers have 14 days to review. A review shows here once you have both written yours, or when that time ends.',
} as const;

export const reviewReport = {
  title: 'Report this review',
  intro: 'Reports are private. Our safety team checks every report and removes reviews that break the community guidelines.',
  reason: 'What is wrong?',
  note: 'Anything else we should know? (optional)',
  submit: 'Send report',
  thanks: 'Thank you. Our safety team will check this review.',
  already: 'You already reported this review. Our team is on it.',
  reasons: {
    FAKE_OR_MISLEADING: 'Fake or misleading',
    OFFENSIVE: 'Offensive or abusive',
    CONTACT_DETAILS: 'Shares contact details',
    NOT_ABOUT_THE_MEETING: 'Not about the meeting',
    PRIVATE_INFORMATION: 'Shares private information',
    OTHER: 'Something else',
  } satisfies Record<ReviewReportReason, string>,
} as const;
