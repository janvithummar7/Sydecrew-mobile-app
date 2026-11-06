import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * One booking (Feature 4), for either side: detail (/booking/[id]), payment
 * (/booking/[id]/pay), payment result (/booking/[id]/result) and booking day
 * (/booking/[id]/day). The API decides who may see it (its customer or its
 * companion); everyone else gets 404. Guarded for signed-in non-staff users.
 */
export default function BookingLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
