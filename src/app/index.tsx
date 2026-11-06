import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/ui/Brand';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/lib/auth';
import { colors, radius } from '@/theme';

const promises = [
  { icon: 'shield-checkmark-outline', title: 'ID checked by a person', text: 'Every companion passes ID, a live selfie and manual review.' },
  { icon: 'location-outline', title: 'Public venues only', text: 'Meetings happen at approved cafés, venues and events.' },
  { icon: 'card-outline', title: 'Pay only on Sydecrew', text: 'Never pay anyone by QR or bank transfer outside the app.' },
  { icon: 'headset-outline', title: '24×7 safety desk', text: 'Help is one tap away before, during and after a meeting.' },
] as const;

/** First screen for signed-out users. */
export default function Welcome() {
  const router = useRouter();
  const { offline, retry } = useAuth();
  return (
    <Screen
      footer={
        <View style={{ gap: 10 }}>
          <Button onPress={() => router.push('/signup')}>Create an account</Button>
          <Button variant="secondary" onPress={() => router.push('/login')}>
            Log in
          </Button>
          <Text variant="caption" color={colors.fog500} style={{ textAlign: 'center', marginTop: 4 }}>
            For adults 18+. Platonic social companionship only.
          </Text>
        </View>
      }
    >
      <Logo />
      {offline ? (
        <Alert action={<TextButton onPress={retry}>Try again</TextButton>}>
          We could not reach Sydecrew to restore your session. Check your connection.
        </Alert>
      ) : null}
      <View style={{ gap: 6, marginTop: 24 }}>
        <Text variant="display" color={colors.fog50}>Good company.</Text>
        <Text variant="display" color={colors.lavender300} style={styles.accent}>Your way.</Text>
        <Text color={colors.fog300} style={{ marginTop: 10 }}>
          Verified, strictly platonic companions for weddings, events, city days and quiet afternoons in Ahmedabad.
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        {promises.map((p) => (
          <View key={p.title} style={styles.card}>
            <Ionicons name={p.icon} size={20} color={colors.lime400} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="small" weight="600" color={colors.fog50}>{p.title}</Text>
              <Text variant="caption" color={colors.fog400}>{p.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  accent: { fontStyle: 'italic', fontWeight: '400', fontFamily: 'serif' },
  card: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
});
