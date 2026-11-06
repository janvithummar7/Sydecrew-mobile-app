import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Making a booking (Feature 4): booking details (/book/[companionId]) then
 * review and pay (/book/review). Guarded with the customer shell in the root layout.
 */
export default function BookLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
