import { View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { LinkRow } from '@/components/companion/Bits';
import { RoleSwitch } from '@/components/nav/Shell';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { useAuth } from '@/lib/auth';
import { isApproved } from '@/lib/companion/steps';
import { nav } from '@/content/common';
import { colors, space } from '@/theme';

/**
 * "More" (carry-over gap §5.2): every companion screen that is not one of the
 * five tabs. The routes are unchanged (/companion/profile, /companion/status, …).
 */
export default function More() {
  const router = useRouter();
  const { user } = useAuth();
  const approved = isApproved(user?.companion?.status);
  const go = (to: string) => () => router.push(to as Href);
  return (
    <Screen>
      <Title>{nav.companion.more}</Title>
      <View>
        <Text variant="eyebrow" color={colors.textSubtle}>Your profile</Text>
        <LinkRow label={nav.companion.profile} detail="Your intro, photos and categories" onPress={go('/companion/profile')} />
        {approved ? <LinkRow label={nav.companion.availability} detail="When you can meet" onPress={go('/companion/availability')} /> : null}
        {approved ? <LinkRow label={nav.companion.rates} detail="What you charge per hour" onPress={go('/companion/rates')} /> : null}
        <LinkRow label={nav.companion.status} detail="Your application and verification" onPress={go('/companion/status')} />
        {approved ? <LinkRow label={nav.payoutAccount} detail={nav.payoutAccountDetail} onPress={go('/companion/payout-account')} /> : null}
      </View>
      <View style={{ gap: space.xs }}>
        <Text variant="eyebrow" color={colors.textSubtle}>Help and safety</Text>
        <LinkRow label={nav.support} detail={nav.supportDetail} onPress={go('/support')} />
        <LinkRow label={nav.disputes} detail={nav.disputesDetail} onPress={go('/disputes')} />
        <LinkRow label={nav.sos} detail={nav.sosDetail} onPress={go('/safety/sos')} />
        <LinkRow label={nav.safetyContacts} detail={nav.safetyContactsDetail} onPress={go('/safety/contacts')} />
        <LinkRow label={nav.privacy} detail={nav.privacyDetail} onPress={go('/settings/privacy')} />
        <LinkRow label={nav.settings} onPress={go('/settings')} />
      </View>
      <RoleSwitch to="customer" />
    </Screen>
  );
}
