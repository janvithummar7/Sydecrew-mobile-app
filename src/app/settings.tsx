import { Linking, View } from 'react-native';
import { BackBar } from '@/components/account/BackBar';
import { LinkRow } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { legal, nav } from '@/content/common';
import { colors, space } from '@/theme';

/** Public site for legal pages (EXPO_PUBLIC_SITE_URL, default the production site). */
export const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL || 'https://sydecrew.com').replace(/\/$/, '');

/** Settings: legal pages on the website (drafts pending legal review) and the grievance officer (placeholder). */
export default function Settings() {
  return (
    <Screen>
      <BackBar />
      <Title>{nav.settings}</Title>
      <Badge kind="needs-changes" label={legal.draftBadge} />
      <View>
        {legal.pages.map((p) => (
          <LinkRow key={p.key} label={p.title} detail={`${SITE_URL}${p.path}`} onPress={() => Linking.openURL(`${SITE_URL}${p.path}`)} />
        ))}
      </View>
      <Card>
        <Text weight="600" color={colors.textStrong}>{legal.grievanceTitle}</Text>
        <Text variant="small" color={colors.textMuted}>{legal.grievanceBody}</Text>
      </Card>
      <View style={{ height: space.lg }} />
    </Screen>
  );
}
