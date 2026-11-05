import { Tabs } from 'expo-router';
import { tabIcon, tabScreenOptions } from '@/components/nav/Shell';
import { nav } from '@/content/common';

/** Customer shell (integration pass §4): Home, Discover*, Bookings*, Messages*, Profile. * = placeholder. */
export default function CustomerTabs() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen name="home" options={{ title: nav.customer.home, tabBarIcon: tabIcon('home-outline'), tabBarAccessibilityLabel: nav.customer.home }} />
      <Tabs.Screen name="discover" options={{ title: nav.customer.discover, tabBarIcon: tabIcon('compass-outline'), tabBarAccessibilityLabel: `${nav.customer.discover}, coming soon` }} />
      <Tabs.Screen name="bookings" options={{ title: nav.customer.bookings, tabBarIcon: tabIcon('calendar-outline'), tabBarAccessibilityLabel: `${nav.customer.bookings}, coming soon` }} />
      <Tabs.Screen name="messages" options={{ title: nav.customer.messages, tabBarIcon: tabIcon('chatbubbles-outline'), tabBarAccessibilityLabel: `${nav.customer.messages}, coming soon` }} />
      <Tabs.Screen name="account" options={{ title: nav.customer.profile, tabBarIcon: tabIcon('person-circle-outline'), tabBarAccessibilityLabel: nav.customer.profile }} />
    </Tabs>
  );
}
