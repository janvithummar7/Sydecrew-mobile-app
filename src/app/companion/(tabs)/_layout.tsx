import { Tabs } from 'expo-router';
import { tabIcon, tabScreenOptions } from '@/components/nav/Shell';
import { useAuth } from '@/lib/auth';
import { isApproved } from '@/lib/companion/steps';
import { nav } from '@/content/common';

/**
 * Companion shell (carry-over gap §5.2): at most five tabs (src/lib/nav/companionTabs.ts):
 * Dashboard, Bookings, Messages, Earnings, More. Bookings, Messages and
 * Earnings appear once approved. Profile, Availability, Rates and Status stay
 * in this group (same routes, e.g. /companion/profile) but are hidden from the
 * bar (`href: null`) and listed under More.
 */
export default function CompanionTabs() {
  const { user } = useAuth();
  const approved = isApproved(user?.companion?.status);
  const t = nav.companion;
  const hidden = { href: null } as const;
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen name="dashboard" options={{ title: t.dashboard, tabBarIcon: tabIcon('grid-outline'), tabBarAccessibilityLabel: t.dashboard }} />
      <Tabs.Protected guard={approved}>
        <Tabs.Screen name="bookings" options={{ title: t.bookings, tabBarIcon: tabIcon('calendar-outline'), tabBarAccessibilityLabel: t.bookings }} />
        <Tabs.Screen name="messages" options={{ title: t.messages, tabBarIcon: tabIcon('chatbubbles-outline'), tabBarAccessibilityLabel: t.messages }} />
        <Tabs.Screen name="earnings" options={{ title: t.earnings, tabBarIcon: tabIcon('wallet-outline'), tabBarAccessibilityLabel: t.earnings }} />
      </Tabs.Protected>
      <Tabs.Screen name="more" options={{ title: t.more, tabBarIcon: tabIcon('menu-outline'), tabBarAccessibilityLabel: t.more }} />
      <Tabs.Screen name="profile" options={hidden} />
      <Tabs.Screen name="status" options={hidden} />
      <Tabs.Protected guard={approved}>
        <Tabs.Screen name="availability" options={hidden} />
        <Tabs.Screen name="rates" options={hidden} />
      </Tabs.Protected>
    </Tabs>
  );
}
