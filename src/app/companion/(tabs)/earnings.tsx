import { Alert } from '@/components/ui/Feedback';
import { PlaceholderNotice } from '@/components/ui/Misc';
import { EmptyState } from '@/components/ui/States';
import { Screen } from '@/components/ui/Screen';
import { Title } from '@/components/ui/Text';
import { nav } from '@/content/common';

/** Earnings (PLACEHOLDER until bookings and payouts exist). No payout API. */
export default function Earnings() {
  return (
    <Screen>
      <Title>{nav.companion.earnings}</Title>
      <PlaceholderNotice title="Coming soon — payouts are not open yet" body="Earnings and weekly payouts appear here once bookings open." />
      <EmptyState icon="wallet-outline" title="No earnings yet" body="You are paid after each completed meeting, weekly, to your verified bank account." />
      <Alert tone="info">Adding a bank account comes with payouts. You do not need it to go live.</Alert>
    </Screen>
  );
}
