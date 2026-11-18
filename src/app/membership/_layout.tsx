import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Customer membership (D12): plans and the current membership (/membership)
 * and the autopay step after starting one (/membership/autopay). Guarded with
 * the customer shell in the root layout (customers only, not the companion area).
 */
export default function MembershipLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
