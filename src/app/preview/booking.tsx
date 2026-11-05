import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PlaceholderNotice } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { previews } from '@/content/customer';
import { SAMPLE_LABEL, sampleBooking as b } from '@/content/samples';
import { colors, space } from '@/theme';

const copy = previews.booking;

/** Booking details (PLACEHOLDER, artboard "Booking details"). No booking API. */
export default function BookingPreview() {
  const router = useRouter();
  const rows: [string, string][] = [
    [copy.occasion, b.occasion],
    [copy.date, b.when],
    [copy.duration, b.duration],
    [copy.venue, b.venue],
    [copy.notes, b.notes],
  ];
  return (
    <Screen footer={<Button onPress={() => router.push('/preview/pay')}>{copy.continue}</Button>}>
      <BackBar />
      <Title>{`${copy.title} · ${b.companion.name}`}</Title>
      <PlaceholderNotice />
      <Text variant="caption" color={colors.warningText}>{SAMPLE_LABEL}</Text>
      <Card>
        {rows.map(([k, v]) => (
          <View key={k} style={{ gap: space.xs }}>
            <Text variant="caption" color={colors.textMuted}>{k}</Text>
            <Text color={colors.textStrong}>{v}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
