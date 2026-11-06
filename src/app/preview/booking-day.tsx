import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PlaceholderNotice } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { previews } from '@/content/customer';
import { SAMPLE_LABEL, sampleBooking as b } from '@/content/samples';
import { colors, space } from '@/theme';

const copy = previews.day;

/** Booking day and check-in (PLACEHOLDER, artboard "Booking day and check-in"). Check-in, chat and calls are disabled. */
export default function BookingDayPreview() {
  const router = useRouter();
  return (
    <Screen footer={<Button variant="danger" onPress={() => router.push('/preview/sos')}>{copy.sos}</Button>}>
      <BackBar />
      <Title>{copy.title}</Title>
      <PlaceholderNotice />
      <Card>
        <Badge kind="pending" label={SAMPLE_LABEL} />
        <Text variant="heading" color={colors.textStrong}>{`${b.occasion} · ${b.companion.name}`}</Text>
        <Text variant="small" color={colors.textMuted}>{`${b.when} · ${b.venue}`}</Text>
      </Card>
      <Card>
        <Text weight="600" color={colors.textStrong}>{copy.arrived}</Text>
        <Button disabled>{copy.checkIn}</Button>
      </Card>
      <View style={{ gap: space.sm }}>
        <Text variant="eyebrow" color={colors.textSubtle}>{copy.boundaries}</Text>
        <Card>
          {b.companion.boundaries.map((x) => (
            <Text key={x} variant="small" color={colors.text}>{`• ${x}`}</Text>
          ))}
        </Card>
      </View>
      <View style={{ flexDirection: 'row', gap: space.md }}>
        <Button variant="secondary" disabled style={{ flex: 1 }}>{copy.chat}</Button>
        <Button variant="secondary" disabled style={{ flex: 1 }}>{copy.call}</Button>
      </View>
      <Button variant="secondary" disabled>{copy.shareTrip}</Button>
    </Screen>
  );
}
