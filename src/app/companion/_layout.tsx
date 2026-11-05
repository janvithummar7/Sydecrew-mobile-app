import { Stack } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { CompanionProvider } from '@/lib/companion/context';
import { COMPANION_HOME, isApproved } from '@/lib/companion/steps';
import { colors } from '@/theme';

/**
 * Companion area (D3, D4). Guards follow user.companion from /auth/me:
 *  - landing and apply: any signed-in user;
 *  - the shell (tabs: dashboard, profile, status, availability, rates, earnings),
 *    the application steps and the public-profile preview: once applied;
 *  - go-live: once approved.
 * The web "continue on phone" QR opens sydecrew://companion/identity.
 */
export default function CompanionLayout() {
  const { user } = useAuth();
  const status = user?.companion?.status ?? null;
  const applied = !!status;
  return (
    <CompanionProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="apply" />
        <Stack.Protected guard={applied} redirectTo={COMPANION_HOME}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="photos" />
          <Stack.Screen name="categories" />
          <Stack.Screen name="identity" />
          <Stack.Screen name="capture" options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }} />
          <Stack.Screen name="review" />
          <Stack.Screen name="preview" />
        </Stack.Protected>
        <Stack.Protected guard={isApproved(status)} redirectTo={COMPANION_HOME}>
          <Stack.Screen name="go-live" />
        </Stack.Protected>
      </Stack>
    </CompanionProvider>
  );
}
