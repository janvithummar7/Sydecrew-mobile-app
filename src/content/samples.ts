/**
 * SAMPLE DATA for the placeholder screens (booking details, review and pay, booking day). Labelled "Sample" on screen.
 * Like the design artboards, there are NO invented numbers: prices and totals
 * are shown as "₹[rate]" style slots until pricing and bookings exist.
 * No screen using this file calls a booking or payment endpoint.
 */
export const SAMPLE_LABEL = 'Sample — design preview only';

export const sampleBooking = {
  ref: 'SAMPLE',
  companion: { name: 'Sample companion A', boundaries: ['Strictly platonic, friendly company', 'Public venues and hosted events only', 'No alcohol-centred plans', 'Leaves by 11 pm'] },
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
