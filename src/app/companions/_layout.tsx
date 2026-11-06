import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Customer discovery screens outside the tab bar (Feature 3): a companion's
 * public profile (/companions/[id]) and the Saved and Recently viewed lists.
 * Guarded with the customer shell in the root layout (CUSTOMER role, onboarded).
 */
export default function CompanionsLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
