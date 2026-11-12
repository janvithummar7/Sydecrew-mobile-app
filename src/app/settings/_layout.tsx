import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Settings: legal and grievance officer (/settings) and privacy (/settings/privacy).
 * Reachable from both shells (Profile / More).
 * Guarded for signed-in non-staff users.
 */
export default function SettingsLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
