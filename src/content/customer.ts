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

export const messages = {
  title: 'Messages',
  emptyTitle: 'No messages yet',
  emptyBody: 'Chat opens after a booking is confirmed. Phone numbers and links are hidden for your safety.',
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

/** Screens for flows that are not built yet (Feature 4 replaced booking, pay and booking day; SOS remains). */
export const previews = {
  sos: {
    title: 'Safety SOS',
    body: 'In an emergency, call 112 now. In-app SOS alerts to our 24×7 safety desk open in a later update.',
    leave: 'End the meeting and leave',
    leaveBody: 'You never have to stay. Walk to a staffed public area and call 112 or someone you trust.',
    noticeTitle: 'In-app SOS alerts to our safety desk open in a later update',
    noticeBody: 'Until then, call 112 in an emergency. This screen sends nothing to Sydecrew.',
  },
} as const;
