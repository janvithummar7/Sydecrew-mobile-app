import { Tabs } from 'expo-router';
import { tabIcon, tabScreenOptions } from '@/components/nav/Shell';
import { useAuth } from '@/lib/auth';
import { isApproved } from '@/lib/companion/steps';
import { nav } from '@/content/common';

/**
 * Companion shell (integration pass §4): Dashboard, Profile, Status, and once
 * approved Bookings (Feature 4), Availability, Rates, Earnings* (* = placeholder until payouts).
 */
export default function CompanionTabs() {
  const { user } = useAuth();
  const approved = isApproved(user?.companion?.status);
  const t = nav.companion;
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen name="dashboard" options={{ title: t.dashboard, tabBarIcon: tabIcon('grid-outline'), tabBarAccessibilityLabel: t.dashboard }} />
      <Tabs.Protected guard={approved}>
        <Tabs.Screen name="bookings" options={{ title: t.bookings, tabBarIcon: tabIcon('calendar-outline'), tabBarAccessibilityLabel: t.bookings }} />
      </Tabs.Protected>
      <Tabs.Screen name="profile" options={{ title: t.profile, tabBarIcon: tabIcon('person-outline'), tabBarAccessibilityLabel: t.profile }} />
      <Tabs.Protected guard={approved}>
        <Tabs.Screen name="availability" options={{ title: t.availability, tabBarIcon: tabIcon('time-outline'), tabBarAccessibilityLabel: t.availability }} />
        <Tabs.Screen name="rates" options={{ title: t.rates, tabBarIcon: tabIcon('pricetag-outline'), tabBarAccessibilityLabel: t.rates }} />
      </Tabs.Protected>
      <Tabs.Screen name="status" options={{ title: t.status, tabBarIcon: tabIcon('pulse-outline'), tabBarAccessibilityLabel: t.status }} />
      <Tabs.Protected guard={approved}>
        <Tabs.Screen name="earnings" options={{ title: t.earnings, tabBarIcon: tabIcon('wallet-outline'), tabBarAccessibilityLabel: `${t.earnings}, coming soon` }} />
      </Tabs.Protected>
    </Tabs>
  );
}
