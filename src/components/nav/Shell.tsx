import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useRole } from '@/lib/role';
import { COMPANION_STEP_PATH, hasBothRoles } from '@/lib/routing';
import { nav } from '@/content/common';
import { colors, fonts, space, touchTarget } from '@/theme';

/** Shared tab bar look for the customer and companion shells. */
export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.accent,
  tabBarInactiveTintColor: colors.textSubtle,
  tabBarStyle: { backgroundColor: colors.bgRaised, borderTopColor: colors.border, minHeight: touchTarget + space.xl },
  tabBarLabelStyle: { fontFamily: fonts.sans.medium, fontSize: 11 },
  sceneStyle: { backgroundColor: colors.bg },
} as const;

type IconName = ComponentProps<typeof Ionicons>['name'];
export const tabIcon = (name: IconName) =>
  function TabIcon({ color, size }: { color: unknown; size: number }) {
    // Tab tint colours are token strings (tabScreenOptions).
    return <Ionicons name={name} color={color as string} size={size} />;
  };

/** For users with both roles: switch between the customer and companion shells. */
export function RoleSwitch({ to }: { to: 'customer' | 'companion' }) {
  const { user } = useAuth();
  const { setPreferred } = useRole();
  const router = useRouter();
  if (!user || !hasBothRoles(user)) return null;
  const go = () => {
    setPreferred(to);
    const path = to === 'companion' && user.companion ? COMPANION_STEP_PATH[user.companion.next_step] : '/home';
    router.replace(path as Href);
  };
  return (
    <Button variant="secondary" onPress={go} icon={<Ionicons name="swap-horizontal" size={18} color={colors.textStrong} />}>
      {to === 'companion' ? nav.switchToCompanion : nav.switchToCustomer}
    </Button>
  );
}
