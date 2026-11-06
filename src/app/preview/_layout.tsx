import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Screens for flows that are not built yet. Since Feature 4 only Safety SOS
 * remains (the in-app alert to the safety desk is Feature 5; the one-tap 112
 * call is real). It calls no booking or payment API.
 */
export default function PreviewLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
