import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Safety (Feature 5): SOS (/safety/sos, optionally ?booking=<id>) and safety
 * contacts (/safety/contacts). Reachable from both shells without a booking.
 * Guarded for signed-in non-staff users.
 */
export default function SafetyLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
