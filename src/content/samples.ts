/**
 * SAMPLE DATA for the placeholder screens (discover, companion profile,
 * booking details, review and pay, booking day). Labelled "Sample" on screen.
 * Like the design artboards, there are NO invented numbers: prices and totals
 * are shown as "₹[rate]" style slots until pricing and bookings exist.
 * No screen using this file calls a booking or payment endpoint.
 */
export const SAMPLE_LABEL = 'Sample — design preview only';

export type SampleCompanion = {
  id: string;
  name: string;
  category: string;
  area: string;
  languages: string[];
  headline: string;
  intro: string;
  rateLabel: string;
  mode: 'Request' | 'Instant';
  interests: string[];
  boundaries: string[];
  offers: { activity: string; label: string }[];
};

export const sampleCompanions: SampleCompanion[] = [
  {
    id: 'sample-a',
    name: 'Sample companion A',
    category: 'Plus-One',
    area: 'Sample zone, Ahmedabad',
    languages: ['Gujarati', 'Hindi', 'English'],
    headline: 'Weddings · corporate dinners',
    intro: 'Sample profile text. Comfortable at family functions and work events, keeps the conversation easy.',
    rateLabel: '₹[rate]/h',
    mode: 'Request',
    interests: ['Garba', 'Live music', 'Heritage walks'],
    boundaries: ['Strictly platonic, friendly company', 'Public venues and hosted events only', 'No alcohol-centred plans', 'Leaves by 11 pm'],
    offers: [
      { activity: 'Wedding or family function', label: '₹[rate]/h · min 3 h' },
      { activity: 'Corporate dinner or event', label: '₹[rate]/h · min 2 h' },
    ],
  },
  {
    id: 'sample-b',
    name: 'Sample companion B',
    category: 'Crew',
    area: 'Sample zone, Ahmedabad',
    languages: ['Hindi', 'English'],
    headline: 'Cafés · movies · city walks',
    intro: 'Sample profile text. Knows the new cafés in town.',
    rateLabel: '₹[rate]/h',
    mode: 'Instant',
    interests: ['Cafés', 'Movies', 'Photography'],
    boundaries: ['Strictly platonic, friendly company', 'No photos or videos without consent'],
    offers: [{ activity: 'Coffee and conversation', label: '₹[rate]/h · min 1 h' }],
  },
  {
    id: 'sample-c',
    name: 'Sample companion C',
    category: 'Crew Care',
    area: 'Sample zone, Ahmedabad',
    languages: ['Gujarati'],
    headline: 'Senior walks · temple visits',
    intro: 'Sample profile text. Morning walks, temple visits and a game of chess.',
    rateLabel: '₹[rate]/h',
    mode: 'Request',
    interests: ['Chess', 'Walks'],
    boundaries: ['Strictly platonic, friendly company', 'No travel outside the booked zone'],
    offers: [{ activity: 'Senior walk and conversation', label: '₹[rate]/h · min 1 h' }],
  },
];

export const sampleBooking = {
  ref: 'SAMPLE',
  companion: sampleCompanions[0],
  occasion: 'Wedding or family function',
  venue: '[Approved public venue]',
  when: '[Date] · 7:00–10:00 pm',
  duration: '3 h',
  notes: 'Sample note to the companion.',
  lines: [
    { label: '₹[rate] × 3 h', amount: '₹[subtotal]' },
    { label: 'Service fee', amount: '₹[fee]' },
    { label: 'GST on fee', amount: '₹[gst]' },
  ],
  total: '₹[total]',
};
