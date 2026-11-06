import { BackBar } from '@/components/account/BackBar';
import { Card } from '@/components/ui/Card';
import { PlaceholderNotice, SafetyCallout } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { previews } from '@/content/customer';
import { colors } from '@/theme';

const copy = previews.sos;

/**
 * Safety SOS (PLACEHOLDER, artboard "Safety SOS"). The in-app alert to the
 * safety desk opens with bookings; the one-tap 112 call is real and works now.
 */
export default function SosPreview() {
  return (
    <Screen>
      <BackBar />
      <Title>{copy.title}</Title>
      <Text color={colors.text}>{copy.body}</Text>
      <SafetyCallout sos />
      <Card>
        <Text weight="600" color={colors.textStrong}>{copy.leave}</Text>
        <Text variant="small" color={colors.textMuted}>{copy.leaveBody}</Text>
      </Card>
      <PlaceholderNotice title="SOS alerts to our safety desk open with bookings" body="Until then, call 112 in an emergency. This screen sends nothing to Sydecrew." />
    </Screen>
  );
}
