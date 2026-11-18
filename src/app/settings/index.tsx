import { Linking, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { LinkRow } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Screen } from '@/components/ui/Screen';
import { Title } from '@/components/ui/Text';
import { legal, nav } from '@/content/common';
import { privacy } from '@/content/privacy';
import { SITE_URL } from '@/lib/site';
import { space } from '@/theme';

/** Settings: privacy and your data (export, consents, delete account, grievance officer), and the legal pages on the website (drafts pending legal review). */
export default function Settings() {
  const router = useRouter();
  return (
    <Screen>
      <BackBar />
      <Title>{nav.settings}</Title>
      <LinkRow label={privacy.title} detail={privacy.navDetail} onPress={() => router.push('/settings/privacy')} />
      <Badge kind="needs-changes" label={legal.draftBadge} />
      <View>
        {legal.pages.map((p) => (
          <LinkRow key={p.key} label={p.title} detail={`${SITE_URL}${p.path}`} onPress={() => Linking.openURL(`${SITE_URL}${p.path}`)} />
        ))}
      </View>
      <View style={{ height: space.lg }} />
    </Screen>
  );
}
