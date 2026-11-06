import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RoleSwitch } from '@/components/nav/Shell';
import { Badge } from '@/components/ui/Badge';
import { Logo } from '@/components/ui/Brand';
import { TextButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert, DevHint } from '@/components/ui/Feedback';
import { SafetyCallout } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorView } from '@/lib/errors';
import { COMPANION_HOME, statusLabel } from '@/lib/companion/steps';
import type { OnboardingOptions } from '@/lib/types';
import { customerHome as copy } from '@/content/customer';
import { colors, space } from '@/theme';

/** Customer Home tab: greeting, email check, the way into Discover / Bookings, becoming a companion. */
export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [options, setOptions] = useState<OnboardingOptions | null>(null);
  const [email, setEmail] = useState<{ sending?: boolean; sent?: boolean; error?: string; devLink?: string }>({});

  useEffect(() => {
    authApi.onboardingOptions().then(setOptions).catch(() => setOptions(null));
  }, []);

  if (!user) return null;
  const zone = options?.cities.find((c) => c.id === user.city_id)?.zones.find((z) => z.id === user.zone_id);

  const resend = async () => {
    setEmail({ sending: true });
    try {
      const res = await authApi.resendEmail();
      setEmail({ sent: true, devLink: res.dev_link });
    } catch (err) {
      setEmail({ error: errorView(err).message || copy.sendFailed });
    }
  };

  return (
    <Screen>
      <Logo />
      <View style={{ gap: space.xs }}>
        <Text variant="eyebrow" color={colors.textSubtle}>{copy.eyebrow}</Text>
        <Text variant="display" color={colors.textStrong} accessibilityRole="header">
          {`${copy.hello} `}
          <Text variant="display" serif color={colors.brand}>{user.full_name.split(' ')[0]}</Text>
        </Text>
      </View>

      {!user.email_verified ? (
        <Alert
          tone="info"
          action={email.sent ? <Text variant="small" weight="600" color={colors.textStrong}>{copy.sent}</Text> : <TextButton onPress={resend} disabled={email.sending}>{email.sending ? copy.sending : copy.resend}</TextButton>}
        >
          {`${copy.verifyEmail(user.email)}${email.error ? `\n${email.error}` : ''}`}
        </Alert>
      ) : null}
      {email.devLink ? <DevHint>{email.devLink}</DevHint> : null}

      <View style={{ gap: space.md }}>
        <Card onPress={() => router.push('/discover')} accessibilityLabel={copy.discoverTitle}>
          <Row icon="compass-outline" />
          <Text variant="heading" color={colors.textStrong}>{copy.discoverTitle}</Text>
          <Text variant="small" color={colors.textMuted}>{copy.discoverBody(zone?.name ?? 'you')}</Text>
        </Card>
        <Card onPress={() => router.push('/bookings')} accessibilityLabel={copy.bookingsTitle}>
          <Row icon="calendar-outline" />
          <Text variant="heading" color={colors.textStrong}>{copy.bookingsTitle}</Text>
          <Text variant="small" color={colors.textMuted}>{copy.bookingsBody}</Text>
        </Card>
        <Card onPress={() => router.push(COMPANION_HOME)} tone="accent" accessibilityLabel={user.companion ? copy.companionTitleExisting : copy.companionTitleNew}>
          <Row icon="people-outline" badge={user.companion ? statusLabel(user.companion.status) : undefined} />
          <Text variant="heading" color={colors.textStrong}>{user.companion ? copy.companionTitleExisting : copy.companionTitleNew}</Text>
          <Text variant="small" color={colors.textMuted}>{user.companion ? copy.companionBodyExisting : copy.companionBodyNew}</Text>
        </Card>
      </View>
      <SafetyCallout compact />
      <RoleSwitch to="companion" />
    </Screen>
  );
}

function Row({ icon, badge }: { icon: keyof typeof Ionicons.glyphMap; badge?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Ionicons name={icon} size={22} color={colors.accent} />
      {badge ? <Badge kind="pending" label={badge} /> : null}
    </View>
  );
}
