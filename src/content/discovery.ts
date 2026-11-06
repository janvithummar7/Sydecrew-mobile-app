/** Discovery copy (Feature 3): Discover tab, filters, public profile, saved / recent, report, waitlist. */
import type { DiscoverySort, ProfileReportReason, TimeWindow } from '@/lib/contract/enums';

export const discover = {
  title: 'Discover',
  subtitle: 'Verified companions for Crew, Plus-One, Crew Care and Crew Events, at approved public venues.',
  all: 'All',
  filters: 'Filters',
  filtersCount: (n: number) => (n ? `Filters (${n})` : 'Filters'),
  saved: 'Saved',
  recent: 'Recent',
  loadingMore: 'Loading more companions',
  end: 'You have seen everyone who matches.',
  emptyTitle: 'No companions match yet',
  emptyBody: 'Try fewer filters, another date or a wider price range.',
  clearFilters: 'Clear filters',
  offlineKept: 'Showing the last results we loaded.',
  card: {
    verified: 'Verified',
    newOn: 'New on Sydecrew',
    from: 'From',
    perHour: '/ hour',
    noRate: 'Rate shown on profile',
    nextFree: 'Next free',
    today: 'today',
    open: (name: string) => `Open ${name}'s profile`,
  },
} as const;

export const sortLabels: Record<DiscoverySort, string> = {
  relevance: 'Recommended',
  price_asc: 'Price: low to high',
  price_desc: 'Price: high to low',
  soonest: 'Available soonest',
};

export const windowLabels: Record<TimeWindow, string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

export const filtersSheet = {
  title: 'Filters',
  category: 'Category',
  activity: 'Activity',
  activityHint: 'Choose a category to see its activities.',
  zone: 'Area',
  anyZone: 'Any area',
  languages: 'Languages',
  interests: 'Interests',
  date: 'Date',
  anyDate: 'Any date',
  today: 'Today',
  time: 'Time of day',
  timeHint: 'Without a date, this means that time on any day.',
  anyTime: 'Any time',
  exactTime: 'Exact time',
  from: 'From',
  until: 'Until',
  duration: 'Duration',
  anyDuration: 'Any length',
  hours: (m: number) => (m % 60 === 0 ? `${m / 60} h` : `${Math.floor(m / 60)} h ${m % 60} min`),
  price: 'Price per hour',
  anyPrice: 'Any price',
  priceUpTo: (r: string) => `Up to ${r}`,
  priceBetween: (a: string, b: string) => `${a}–${b}`,
  priceFrom: (r: string) => `${r} and up`,
  sort: 'Sort by',
  reset: 'Reset',
  apply: 'Show companions',
} as const;

export const waitlist = {
  title: 'Sydecrew is not in your area yet',
  body: (city: string | null) =>
    city ? `We are opening in ${city} soon. Join the waitlist and we will tell you as soon as companions are available near you.` : 'Join the waitlist and we will tell you as soon as companions are available near you.',
  join: 'Join the waitlist',
  joined: 'You are on the waitlist',
  joinedBody: 'We will let you know when discovery opens near you.',
  noCity: 'Add your city in your profile to join the waitlist.',
} as const;

export const profile = {
  back: 'Back',
  photoOf: (name: string, i: number, n: number) => `Photo ${i} of ${n} of ${name}`,
  verified: 'ID verified by Sydecrew',
  verifiedSince: (when: string) => `Verified since ${when}`,
  newOn: 'New on Sydecrew',
  age: (n: number) => `${n}`,
  about: 'About',
  offers: 'Offers',
  perHour: '/ hour',
  minHours: (h: number) => `Minimum ${h} h`,
  noRate: 'Rate not set yet',
  interests: 'Interests',
  boundaries: 'Boundaries',
  boundariesNote: 'Every meeting follows these. Breaking them ends the meeting.',
  availability: 'Availability, next 14 days',
  availabilityNote: 'Shown by part of day. Exact times appear when you book.',
  parts: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', none: 'not available' },
  cancellation: 'Cancellation',
  companionCancels: 'If your companion cancels',
  reviews: 'Reviews',
  noReviews: 'No reviews yet. Only customers with a completed booking can review.',
  meeting: 'Where you meet',
  save: 'Save',
  saved: 'Saved',
  saveHint: 'Adds this companion to your saved list',
  savedToast: 'Saved to your list.',
  unsavedToast: 'Removed from your saved list.',
  report: 'Report',
  reportLabel: 'Report this profile',
  request: 'Request to book',
  requestHint: 'Choose a time and an approved public venue, then see the price.',
  notFoundTitle: 'This profile is not available',
  notFoundBody: 'The companion may be taking a break, or the profile was removed.',
  backToDiscover: 'Back to Discover',
} as const;

export const preview = {
  title: 'Your public profile',
  subtitle: 'This is exactly what customers see in Discover.',
  notLive: 'You are not live, so customers cannot find this profile right now.',
  live: 'You are live. Customers can find you in Discover.',
} as const;

export const report = {
  title: 'Report this profile',
  intro: 'Reports are private. The companion is not told who reported them. Our safety team reviews every report.',
  reason: 'What is wrong?',
  note: 'Anything else we should know? (optional)',
  noteRequired: 'Tell us a little more.',
  submit: 'Send report',
  thanks: 'Thank you. Our safety team will review this profile.',
  already: 'You already reported this profile. Our team is on it.',
  emergency: 'In danger right now? Call 112.',
  reasons: {
    FAKE_PROFILE: 'Fake profile or photos',
    INAPPROPRIATE_CONTENT: 'Inappropriate photos or text',
    OFF_PLATFORM_CONTACT: 'Asks to talk or pay outside Sydecrew',
    NOT_PLATONIC: 'Not platonic: romantic or sexual intent',
    SAFETY_CONCERN: 'Safety concern',
    OTHER: 'Something else',
  } satisfies Record<ProfileReportReason, string>,
} as const;

export const lists = {
  savedTitle: 'Saved companions',
  savedEmptyTitle: 'Nothing saved yet',
  savedEmptyBody: 'Tap Save on a profile to keep it here.',
  recentTitle: 'Recently viewed',
  recentEmptyTitle: 'No profiles viewed yet',
  recentEmptyBody: 'Profiles you open in Discover show up here.',
  browse: 'Browse companions',
  savedDetail: 'Companions you saved for later',
  recentDetail: 'Profiles you opened recently',
} as const;

export const companionProfile = {
  interests: 'Interests',
  interestsHint: (max: number) => `Shown on your public profile. Up to ${max}.`,
  showAge: 'Show my age on my public profile',
  showAgeHint: 'Customers see your age in whole years, never your date of birth.',
} as const;
