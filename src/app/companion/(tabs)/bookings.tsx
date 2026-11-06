import { BookingsList } from '@/components/bookings/BookingsList';
import { companionInbox as copy } from '@/content/bookings';

/** Companion bookings (Feature 4): requests with the answer countdown, upcoming, past and cancelled. */
export default function CompanionBookings() {
  return <BookingsList viewer="COMPANION" title={copy.title} subtitle={copy.subtitle} />;
}
