import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Previews of flows that are not built yet (integration pass §2.5): design-faithful
 * screens with a visible "Coming soon — not bookable yet" notice and labelled
 * sample data (src/content/samples.ts). None of them calls a booking or payment API.
 */
export default function PreviewLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
