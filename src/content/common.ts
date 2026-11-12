/**
 * Shared user-facing words (integration pass §5). The same terms as the web
 * app: Crew, Plus-One, Crew Care, Crew Events, "approved public venues", "verified".
 */
export const brand = { name: 'sydecrew', legalName: 'Sydecrew' } as const;

/** Public category names by API code. */
export const categoryNames: Record<string, string> = {
  FRIEND: 'Crew',
  PLUS_ONE: 'Plus-One',
  CREW_CARE: 'Crew Care',
  CREW_EVENTS: 'Crew Events',
};

export const terms = {
  venues: 'approved public venues',
  verified: 'verified',
  platonic: 'strictly platonic',
} as const;

export const states = {
  loading: 'Loading',
  retry: 'Try again',
  offline: 'You are offline. We will try again when you reconnect.',
  emptyTitle: 'Nothing here yet',
  genericError: 'Something went wrong. Please try again.',
} as const;

export const safety = {
  title: 'Safety on every meeting',
  points: [
    'Meetings happen only at approved public venues.',
    'Strictly platonic. Respect the boundaries on every profile.',
    'Chat, calls and payments stay inside Sydecrew. Never pay by QR or bank transfer.',
    'Help is one tap away: our safety desk and 112.',
  ],
  call112: 'Call 112 (emergency)',
  call112Hint: 'Opens the phone dialler with 112',
} as const;

export const placeholders = {
  title: 'Coming soon — not bookable yet',
  body: 'This screen shows how the feature will look. It uses clearly labelled sample data and makes no bookings or payments.',
  sampleLabel: 'Sample',
} as const;

export const nav = {
  customer: { home: 'Home', discover: 'Discover', bookings: 'Bookings', messages: 'Messages', profile: 'Profile' },
  companion: { dashboard: 'Dashboard', bookings: 'Bookings', messages: 'Messages', profile: 'Profile', availability: 'Availability', rates: 'Rates', status: 'Status', earnings: 'Earnings', more: 'More' },
  support: 'Help and support',
  supportDetail: 'Ask us anything, report a problem',
  disputes: 'Disputes',
  disputesDetail: 'Issues being reviewed, and decisions',
  payoutAccount: 'Payout account',
  payoutAccountDetail: 'The bank account your earnings go to',
  switchToCompanion: 'Switch to companion',
  switchToCustomer: 'Switch to customer',
  becomeCompanion: 'Become a companion',
  previewProfile: 'Preview your public profile',
  settings: 'Settings and legal',
  sos: 'SOS and safety',
  sosDetail: 'Call 112, alert our 24×7 safety desk',
  safetyContacts: 'Safety contacts',
  safetyContactsDetail: 'People who can follow your meetings',
} as const;

export const legal = {
  draftBadge: 'Draft — pending legal review',
  pages: [
    { key: 'terms', title: 'Terms of use', path: '/legal/terms' },
    { key: 'privacy', title: 'Privacy policy', path: '/legal/privacy' },
    { key: 'refunds', title: 'Cancellation and refunds', path: '/legal/refunds' },
    { key: 'guidelines', title: 'Community guidelines', path: '/legal/community-guidelines' },
  ],
  grievanceTitle: 'Grievance officer',
  grievanceBody: 'Details of our grievance officer will be published here before launch.',
} as const;

export const staff = {
  title: 'Staff accounts sign in on the web',
  body: 'The admin area is only available on the Sydecrew website, with two-step sign-in.',
} as const;
