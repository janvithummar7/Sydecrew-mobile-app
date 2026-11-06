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
  comingSoon: 'Coming soon',
} as const;

export const bookings = {
  title: 'Bookings',
  subtitle: 'Your upcoming meetings and history will appear here.',
  sampleUpcoming: 'Sample upcoming booking',
  openDetails: 'Booking details',
  openDay: 'Booking day and check-in',
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

export const previews = {
  booking: {
    title: 'Booking details',
    occasion: 'Occasion',
    date: 'Date and time',
    duration: 'Duration',
    venue: 'Venue (approved public venues only)',
    notes: 'Notes for your companion',
    continue: 'Continue to review',
  },
  pay: {
    title: 'Review and pay',
    breakdown: 'Price breakdown',
    total: 'Total',
    protected: 'Your payment is protected',
    protectedBody: 'Pay only inside Sydecrew. Never by QR or bank transfer to anyone.',
    pay: 'Pay securely',
    disabled: 'Payments are not open yet.',
  },
  day: {
    title: 'Booking day and check-in',
    arrived: 'Arrived at the venue?',
    checkIn: 'Check in',
    boundaries: 'Agreed boundaries',
    shareTrip: 'Share trip with a trusted contact',
    chat: 'Chat',
    call: 'Masked call',
    sos: 'Need help? Open SOS',
  },
  sos: {
    title: 'Safety SOS',
    body: 'In an emergency, call 112 now. Our 24×7 safety desk and in-app SOS alerts open with bookings.',
    leave: 'End the meeting and leave',
    leaveBody: 'You never have to stay. Walk to a staffed public area and call 112 or someone you trust.',
  },
} as const;
