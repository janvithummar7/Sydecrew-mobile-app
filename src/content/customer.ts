/** Customer shell copy. */
export const customerHome = {
  eyebrow: 'Your account',
  hello: 'Hello,',
  verifyEmail: (email: string) => `Please verify ${email}. We send booking confirmations and receipts there.`,
  resend: 'Resend the link',
  sending: 'Sending…',
  sent: 'Link sent. Check your inbox.',
  sendFailed: 'Could not send the email.',
  discoverTitle: 'Discover companions',
  discoverBody: (zone: string) => `Browse verified companions for Crew, Plus-One, Crew Care and Crew Events near ${zone}.`,
  bookingsTitle: 'Your bookings',
  bookingsBody: 'Upcoming meetings, requests waiting for a reply, and your history.',
  companionTitleNew: 'Become a companion',
  companionTitleExisting: 'Your companion profile',
  companionBodyNew: 'Offer platonic company at approved public venues, set your own hours and rate, and get paid weekly.',
  companionBodyExisting: 'See your application, setup and availability.',
} as const;

export const account = {
  title: 'Profile',
  details: 'Account details',
  email: 'Email',
  mobile: 'Mobile',
  area: 'Area',
  shownAs: 'Shown to companions as',
  verified: 'Verified',
  notVerified: 'Not verified',
  logOut: 'Log out',
} as const;
