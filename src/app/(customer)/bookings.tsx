import { BookingsList } from '@/components/bookings/BookingsList';
import { list as copy } from '@/content/bookings';

/** Bookings tab (Feature 4): upcoming, past and cancelled bookings from GET /bookings. */
export default function Bookings() {
  return <BookingsList viewer="CUSTOMER" title={copy.title} />;
}
