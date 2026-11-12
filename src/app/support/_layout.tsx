import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Help and support (Feature 6), both shells: the inbox (/support), a new
 * request (/support/new), one conversation (/support/[id]) and the complaint
 * form (/support/report, optionally ?booking=<id>). Guarded for signed-in non-staff users.
 */
export default function SupportLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
