import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { COMPANION_HOME, statusLabel } from '@/lib/companion/steps';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/ui/Brand';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert, DevHint } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError, authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { OnboardingOptions } from '@/lib/types';
import { colors, radius } from '@/theme';

/** "+919876543210" → "+91 98765 43210" */
const formatPhone = (p: string | null) => {
  const m = p ? /^\+91(\d{5})(\d{5})$/.exec(p) : null;
  return m ? `+91 ${m[1]} ${m[2]}` : (p ?? '—');
};

/** Signed-in home. Discovery and bookings plug in here as they are built. */
export default function Home() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [options, setOptions] = useState<OnboardingOptions | null>(null);
  const [email, setEmail] = useState<{ sending?: boolean; sent?: boolean; error?: string; devLink?: string }>({});
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    authApi.onboardingOptions().then(setOptions).catch(() => setOptions(null));
  }, []);

  if (!user) return null;
  const city = options?.cities.find((c) => c.id === user.city_id);
  const zone = city?.zones.find((z) => z.id === user.zone_id);

  const resend = async () => {
    setEmail({ sending: true });
    try {
      const res = await authApi.resendEmail();
      setEmail({ sent: true, devLink: res.dev_link });
    } catch (err) {
      setEmail({ error: err instanceof ApiError ? err.message : 'Could not send the email.' });
    }
  };

  return (
    <Screen>
      <Logo />
      <View style={{ gap: 4 }}>
        <Text variant="eyebrow" color={colors.fog500}>Your account</Text>
        <Text variant="display" color={colors.fog50} accessibilityRole="header">
          Hello, <Text variant="display" color={colors.lavender300} style={styles.accent}>{user.full_name.split(' ')[0]}</Text>
        </Text>
      </View>

      {!user.email_verified ? (
        <Alert
          tone="info"
          action={
            email.sent ? (
              <Text variant="small" weight="600" color={colors.fog50}>Link sent. Check your inbox.</Text>
            ) : (
              <TextButton onPress={resend} disabled={email.sending}>{email.sending ? 'Sending…' : 'Resend the link'}</TextButton>
            )
          }
        >
          {`Please verify ${user.email}. We send booking confirmations and receipts there.${email.error ? `\n${email.error}` : ''}`}
        </Alert>
      ) : null}
      {email.devLink ? <DevHint>{email.devLink}</DevHint> : null}

      <View style={{ gap: 12 }}>
        <Card icon="compass-outline" title="Discover companions" badge="Next release">
          {`Browse verified companions for Crew, Plus-One, Crew Care and Crew Events near ${zone?.name ?? 'you'}.`}
        </Card>
        <Card icon="calendar-outline" title="Your bookings" badge="Next release">
          Upcoming meetings, requests waiting for a reply, and your history.
        </Card>
        <Pressable onPress={() => router.push(COMPANION_HOME)} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <Card icon="people-outline" title={user.companion ? 'Your companion profile' : 'Become a companion'} badge={user.companion ? statusLabel(user.companion.status) : undefined}>
            {user.companion
              ? 'See your application, setup and availability.'
              : 'Offer platonic company at approved public venues, set your own hours and rate, and get paid weekly.'}
          </Card>
        </Pressable>
        <Card icon="shield-checkmark-outline" title="Safety">
          Every meeting is at an approved public venue, with check-in, a safety ping and one-tap SOS.
        </Card>
      </View>

      <View style={{ gap: 10 }}>
        <Text variant="heading" color={colors.fog50} accessibilityRole="header">Account details</Text>
        <View style={styles.list}>
          <Row label="Email" value={user.email} status={user.email_verified ? 'Verified' : 'Not verified'} ok={user.email_verified} />
          <Row label="Mobile" value={formatPhone(user.phone)} status={user.phone_verified ? 'Verified' : 'Not verified'} ok={user.phone_verified} />
          <Row label="Area" value={zone && city ? `${zone.name}, ${city.name}` : '—'} />
          <Row label="Shown to companions as" value={user.display_name ?? user.full_name} last />
        </View>
      </View>

      <Button
        variant="secondary"
        loading={leaving}
        icon={<Ionicons name="log-out-outline" size={18} color={colors.fog50} />}
        onPress={async () => {
          setLeaving(true);
          await signOut(); // the route guard returns to the welcome screen
        }}
      >
        Log out
      </Button>
    </Screen>
  );
}

function Card({ icon, title, badge, children }: { icon: keyof typeof Ionicons.glyphMap; title: string; badge?: string; children: string }) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${title}${badge ? `, ${badge}` : ''}. ${children}`}>
      <View style={styles.cardTop}>
        <Ionicons name={icon} size={22} color={colors.lime400} />
        {badge ? (
          <View style={styles.badge}>
            <Text variant="caption" color={colors.fog400}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text variant="heading" color={colors.fog50}>{title}</Text>
      <Text variant="small" color={colors.fog300}>{children}</Text>
    </View>
  );
}

function Row({ label, value, status, ok, last }: { label: string; value: string; status?: string; ok?: boolean; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Text variant="caption" color={colors.fog400}>{label}</Text>
      <View style={styles.rowValue}>
        <Text variant="small" color={colors.fog100} style={{ flexShrink: 1 }}>{value}</Text>
        {status ? (
          <View style={[styles.pill, { backgroundColor: ok ? 'rgba(212,255,79,0.15)' : 'rgba(255,255,255,0.06)' }]}>
            <Text variant="caption" color={ok ? colors.lime300 : colors.fog400}>{status}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accent: { fontStyle: 'italic', fontWeight: '400', fontFamily: 'serif' },
  card: { gap: 8, padding: 18, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.03)' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  list: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.03)' },
  row: { gap: 4, paddingHorizontal: 16, paddingVertical: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowValue: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  pill: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 2 },
});
