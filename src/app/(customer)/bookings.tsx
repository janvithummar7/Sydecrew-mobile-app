import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinkRow } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PlaceholderNotice } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { bookings as copy } from '@/content/customer';
import { SAMPLE_LABEL, sampleBooking } from '@/content/samples';
import { colors, space } from '@/theme';

/** Bookings (PLACEHOLDER): one labelled sample booking linking to the booking-flow previews. No bookings API. */
export default function Bookings() {
  const router = useRouter();
  return (
    <Screen>
      <Title>{copy.title}</Title>
      <Text color={colors.textMuted}>{copy.subtitle}</Text>
      <PlaceholderNotice />
      <Card>
        <Badge kind="pending" label={SAMPLE_LABEL} />
        <Text variant="heading" color={colors.textStrong}>{`${sampleBooking.occasion} · ${sampleBooking.companion.name}`}</Text>
        <Text variant="small" color={colors.textMuted}>{`${sampleBooking.when} · ${sampleBooking.venue}`}</Text>
      </Card>
      <View style={{ gap: space.xs }}>
        <LinkRow label={copy.openDetails} onPress={() => router.push('/preview/booking')} />
        <LinkRow label={copy.openDay} onPress={() => router.push('/preview/booking-day')} />
      </View>
    </Screen>
  );
}
