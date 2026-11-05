import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { ProfileView } from '@/components/companion/ProfileView';
import { Button } from '@/components/ui/Button';
import { PlaceholderNotice } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/States';
import { previews } from '@/content/customer';
import { SAMPLE_LABEL, sampleCompanions } from '@/content/samples';

/** Sample companion profile (PLACEHOLDER, artboard "Companion profile"). */
export default function SampleCompanionProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = sampleCompanions.find((s) => s.id === id);
  if (!c) {
    return (
      <Screen>
        <BackBar />
        <EmptyState title="Sample not found" />
      </Screen>
    );
  }
  return (
    <Screen>
      <BackBar />
      <PlaceholderNotice />
      <ProfileView
        data={{
          name: c.name,
          headline: c.headline,
          meta: `${SAMPLE_LABEL} · ${c.category} · ${c.area} · ${c.languages.join(', ')}`,
          verified: true,
          intro: c.intro,
          offers: c.offers,
          interests: c.interests,
          boundaries: c.boundaries,
        }}
        actions={<Button onPress={() => router.push('/preview/booking')}>{previews.profile.request}</Button>}
      />
    </Screen>
  );
}
