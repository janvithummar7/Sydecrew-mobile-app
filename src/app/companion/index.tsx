import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackBar } from '@/components/account/BackBar';
import { Card, Section } from '@/components/companion/Bits';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/lib/auth';
import { routeForStep } from '@/lib/companion/steps';
import { colors } from '@/theme';

const ALLOWED = [
  'Friendly, strictly platonic company for everyday plans, occasions, events and older adults.',
  'Every meeting is at an approved public venue: cafés, restaurants, malls, event venues, parks.',
  'Chat, calls and payments stay inside Sydecrew. You are paid after the meeting.',
];
const NOT_ALLOWED = [
  'Anything romantic or sexual, or physical contact beyond a handshake.',
  'Meeting at homes, hotel rooms or anywhere private, or staying overnight.',
  'Sharing your number, social media or payment details, or being paid outside the app.',
];
const NEEDED = [
  'You are 18 or older (21 or older for Plus-One).',
  'A PAN card, passport, driving licence or voter ID, or Aadhaar through DigiLocker.',
  'A selfie, taken in the app, and 2 to 6 recent photos of yourself.',
];

/** Become a companion (landing). Applicants are sent on to their next step. */
export default function CompanionLanding() {
  const router = useRouter();
  const { user } = useAuth();
  const next = user?.companion?.next_step;

  useEffect(() => {
    if (next) router.replace(routeForStep(next));
  }, [next, router]);

  if (next) return null;
  return (
    <Screen footer={<Button onPress={() => router.push('/companion/apply')}>Apply to be a companion</Button>}>
      <BackBar />
      <View style={{ gap: 8 }}>
        <Text variant="eyebrow" color={colors.fog500}>Become a companion</Text>
        <Text variant="display" color={colors.fog50} accessibilityRole="header">Be someone&apos;s crew</Text>
        <Text color={colors.fog300}>
          Join Sydecrew as a verified companion in Ahmedabad. Choose what you offer, set your hours and your rate, and meet people at
          approved public venues.
        </Text>
      </View>
      <Section title="What companions do">
        <Card>{ALLOWED.map((t) => <Line key={t} icon="checkmark-circle-outline" color={colors.lime400} text={t} />)}</Card>
      </Section>
      <Section title="Never allowed">
        <Card>{NOT_ALLOWED.map((t) => <Line key={t} icon="close-circle-outline" color={colors.red300} text={t} />)}</Card>
      </Section>
      <Section title="What you need" hint="Every application is checked by a person. Usually within 48 hours.">
        <Card>{NEEDED.map((t) => <Line key={t} icon="document-text-outline" color={colors.lavender300} text={t} />)}</Card>
      </Section>
    </Screen>
  );
}

function Line({ icon, color, text }: { icon: keyof typeof Ionicons.glyphMap; color: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Ionicons name={icon} size={20} color={color} style={{ marginTop: 1 }} />
      <Text variant="small" color={colors.fog100} style={{ flex: 1 }}>{text}</Text>
    </View>
  );
}
