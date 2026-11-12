import { Stack } from 'expo-router';
import { colors } from '@/theme';

/** Disputes (Feature 6), both shells: list (/disputes) and one dispute (/disputes/[id]). Guarded for signed-in non-staff users. */
export default function DisputesLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
