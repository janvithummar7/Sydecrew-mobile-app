import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinkRow } from '@/components/companion/Bits';
import { RoleSwitch } from '@/components/nav/Shell';
import { Avatar } from '@/components/ui/Misc';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { COMPANION_HOME } from '@/lib/companion/steps';
import type { OnboardingOptions } from '@/lib/types';
import { deleteAccount } from '@/content/account';
import { enforcement } from '@/content/enforcement';
import { account as copy } from '@/content/customer';
import { lists } from '@/content/discovery';
import { membership } from '@/content/membership';
import { nav } from '@/content/common';
import { colors, space } from '@/theme';

/** "+919876543210" → "+91 98765 43210" */
const formatPhone = (p: string | null) => {
  const m = p ? /^\+91(\d{5})(\d{5})$/.exec(p) : null;
  return m ? `+91 ${m[1]} ${m[2]}` : (p ?? '—');
};

/** Customer Profile tab: account details, membership, saved and recently viewed companions, "Become a companion", SOS and safety contacts, settings and legal, log out, account status, delete account. */
export default function Account() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [options, setOptions] = useState<OnboardingOptions | null>(null);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    authApi.onboardingOptions().then(setOptions).catch(() => setOptions(null));
  }, []);
  if (!user) return null;
  const city = options?.cities.find((c) => c.id === user.city_id);
  const zone = city?.zones.find((z) => z.id === user.zone_id);

  return (
    <Screen>
      <View style={styles.head}>
        <Avatar name={user.full_name} uri={user.avatar_url} size={64} />
        <View style={{ flex: 1, gap: space.xs }}>
          <Title>{user.display_name ?? user.full_name}</Title>
          {user.phone_verified ? <Badge kind="verified" label={copy.verified} /> : null}
        </View>
      </View>

      <View style={{ gap: space.md }}>
        <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{copy.details}</Text>
        <Card>
          <Row label={copy.email} value={user.email} ok={user.email_verified} />
          <Row label={copy.mobile} value={formatPhone(user.phone)} ok={user.phone_verified} />
          <Row label={copy.area} value={zone && city ? `${zone.name}, ${city.name}` : '—'} />
          <Row label={copy.shownAs} value={user.display_name ?? user.full_name} />
        </Card>
      </View>

      <View>
        <LinkRow label={membership.rowLabel} detail={membership.rowDetail} onPress={() => router.push('/membership' as Href)} />
        <LinkRow label={lists.savedTitle} detail={lists.savedDetail} onPress={() => router.push('/companions/saved')} />
        <LinkRow label={lists.recentTitle} detail={lists.recentDetail} onPress={() => router.push('/companions/recent')} />
        <LinkRow label={user.companion ? nav.companion.dashboard : nav.becomeCompanion} detail={user.companion ? undefined : 'Platonic company at approved public venues, on your own hours.'} onPress={() => router.push(COMPANION_HOME)} />
        <LinkRow label={nav.sos} detail={nav.sosDetail} onPress={() => router.push('/safety/sos')} />
        <LinkRow label={nav.safetyContacts} detail={nav.safetyContactsDetail} onPress={() => router.push('/safety/contacts')} />
        <LinkRow label={nav.support} detail={nav.supportDetail} onPress={() => router.push('/support')} />
        <LinkRow label={nav.disputes} detail={nav.disputesDetail} onPress={() => router.push('/disputes')} />
        <LinkRow label={nav.settings} onPress={() => router.push('/settings')} />
      </View>
      <RoleSwitch to="companion" />
      <Button
        variant="secondary"
        loading={leaving}
        icon={<Ionicons name="log-out-outline" size={18} color={colors.textStrong} />}
        onPress={async () => {
          setLeaving(true);
          await signOut(); // the route guard returns to the welcome screen
        }}
      >
        {copy.logOut}
      </Button>
      <View>
        <LinkRow label={enforcement.rowLabel} detail={enforcement.rowDetail} onPress={() => router.push('/account-status' as Href)} />
        <LinkRow label={deleteAccount.rowLabel} detail={deleteAccount.rowDetail} onPress={() => router.push('/delete-account' as Href)} />
      </View>
    </Screen>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <View style={{ gap: space.xs }}>
      <Text variant="caption" color={colors.textMuted}>{label}</Text>
      <View style={styles.value}>
        <Text variant="small" color={colors.text} style={{ flexShrink: 1 }}>{value}</Text>
        {ok === undefined ? null : <Badge kind={ok ? 'verified' : 'neutral'} label={ok ? copy.verified : copy.notVerified} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  value: { flexDirection: 'row', alignItems: 'center', gap: space.md, flexWrap: 'wrap' },
});
