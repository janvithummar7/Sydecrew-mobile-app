import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Booking chats (Feature 5): /chat/[id], one conversation per booking, for
 * either side. The API answers 404 unless the user is a party to it.
 * Guarded for signed-in non-staff users.
 */
export default function ChatLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />;
}
