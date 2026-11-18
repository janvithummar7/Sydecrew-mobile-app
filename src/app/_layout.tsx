import { useEffect, useRef } from 'react';
import { Stack, useRouter, type Href } from 'expo-router';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Geist_400Regular, Geist_500Medium, Geist_600SemiBold } from '@expo-google-fonts/geist';
import { InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/ui/Misc';
import { AuthProvider, useAuth } from '@/lib/auth';
import { RealtimeProvider } from '@/lib/comms/realtime-context';
import { RoleProvider, useRole } from '@/lib/role';
import { holdEnded, isOnHold } from '@/lib/enforcement/helpers';
import { deepLinkPath, isCustomer, isPublicLink, routeFor, shellFor } from '@/lib/routing';
import { pushPath, pushRoute } from '@/lib/nav/pushLinks';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

/**
 * Route sets, switched by `Stack.Protected` from GET /auth/me (src/lib/routing.ts):
 *  - signed out: welcome, login, sign-up, forgot password
 *  - token links (verify email, reset password): always reachable
 *  - staff: the "sign in on the web" screen only
 *  - customer onboarding unfinished (and not a companion applicant): onboarding
 *  - customer shell (tabs), discovery screens (/companions/*), making a booking (/book/*) and membership (/membership/*): onboarded customers, and anyone who is not a companion
 *  - one booking (/booking/[id]/*): any signed-in non-staff user (the API answers 404 unless they are its customer or companion)
 *  - companion area (its own tabs + application steps): any signed-in non-staff user
 *  - chat (/chat/[id]), safety (SOS, safety contacts), settings: any signed-in non-staff user
 *  - delete account: not guarded (its confirmation must outlive the sign-out); signed out, it redirects to the start
 *  - account status (/account-status): any signed-in non-staff user. A user on hold (`on_hold`, suspended or
 *    banned) gets ONLY this screen: every other signed-in guard excludes them, so neither shell mounts, and
 *    routeFor sends them here. A 403 ACCOUNT_ON_HOLD from any request marks them on hold (src/lib/auth.tsx).
 *    When the hold ends (GET /auth/me on focus or pull-to-refresh), they go to their normal home.
 * When the session changes, the current screen's guard fails and Expo Router
 * redirects to routeFor(user). A deep link opened while signed out is kept and
 * opened after sign-in.
 */
function RootNavigator() {
  const { status, user } = useAuth();
  const { preferred, ready } = useRole();
  const router = useRouter();
  const url = Linking.useLinkingURL();
  const pending = useRef<string | null>(null);

  useEffect(() => {
    if (status !== 'loading' && ready) SplashScreen.hideAsync();
  }, [status, ready]);

  // Remember a deep link (e.g. sydecrew://companion/identity from the web QR) until the user is signed in.
  useEffect(() => {
    const path = deepLinkPath(url);
    if (path && !isPublicLink(path) && status !== 'authenticated') pending.current = path;
  }, [url, status]);
  useEffect(() => {
    if (status === 'authenticated' && user && !user.is_staff && pending.current) {
      const to = pending.current;
      pending.current = null;
      router.push(to as Href);
    }
  }, [status, user, router]);

  // Push taps (carry-over gap §5.3), cold start and background: data.path -> the screen for this user's shell.
  // Unknown or unsafe paths open the home screen. Each notification is handled once; taps while signed out wait for sign-in.
  const lastResponse = Notifications.useLastNotificationResponse();
  const handledPush = useRef<string | null>(null);
  useEffect(() => {
    if (!lastResponse || status !== 'authenticated' || !user || user.is_staff) return;
    const key = lastResponse.notification.request.identifier;
    if (handledPush.current === key) return;
    handledPush.current = key;
    const role = shellFor(user, preferred);
    const to = pushRoute(pushPath(lastResponse.notification.request.content.data), role) ?? routeFor(user, preferred);
    router.push(to as Href);
    void Notifications.clearLastNotificationResponseAsync?.().catch(() => undefined);
  }, [lastResponse, status, user, preferred, router]);

  // The hold just ended (timed suspension over, lifted, or overturned on appeal): back to the normal home.
  const heldNow = status === 'authenticated' && isOnHold(user);
  const wasHeld = useRef(heldNow);
  useEffect(() => {
    if (holdEnded(wasHeld.current, heldNow) && user) router.replace(routeFor(user, preferred) as Href);
    wasHeld.current = heldNow;
  }, [heldNow, user, preferred, router]);

  if (status === 'loading' || !ready) return null; // the native splash stays up

  const signedIn = status === 'authenticated' && !!user;
  const staff = signedIn && user.is_staff;
  // Suspended or banned: only Account status (and log out) until the hold ends.
  const onHold = signedIn && isOnHold(user);
  const member = signedIn && !staff && !onHold;
  const onboarded = signedIn && user.onboarding.complete;
  const home = routeFor(signedIn ? user : null, preferred) as Href;
  const customerShell = member && onboarded && (isCustomer(user) || !user.companion);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
      <Stack.Protected guard={!signedIn} redirectTo={home}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="reset-password" />
      {/* Unguarded so its "scheduled for deletion" confirmation survives the sign-out; it sends signed-out visitors to the start itself. */}
      <Stack.Screen name="delete-account" />
      <Stack.Protected guard={staff} redirectTo={home}>
        <Stack.Screen name="staff" />
      </Stack.Protected>
      <Stack.Protected guard={member && !onboarded && !user.companion} redirectTo={home}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={customerShell} redirectTo={home}>
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="companions" />
        <Stack.Screen name="book" />
        <Stack.Screen name="membership" />
      </Stack.Protected>
      {/* Warnings, holds and appeals: reachable on hold (the only screen then) and when not. */}
      <Stack.Protected guard={signedIn && !staff} redirectTo={home}>
        <Stack.Screen name="account-status" />
      </Stack.Protected>
      {/* Becoming a companion needs a signed-in account (not on hold), not customer onboarding (the apply step collects what is missing). */}
      <Stack.Protected guard={member} redirectTo={home}>
        <Stack.Screen name="companion" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="safety" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="support" />
        <Stack.Screen name="disputes" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  // Brand fonts (tokens.json font.*.mobile); the splash stays until they are ready.
  const [fontsLoaded, fontError] = useFonts({ Geist_400Regular, Geist_500Medium, Geist_600SemiBold, InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic });
  if (!fontsLoaded && !fontError) return null;
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RealtimeProvider>
          <RoleProvider>
            <ToastProvider>
              <StatusBar style="light" />
              <RootNavigator />
            </ToastProvider>
          </RoleProvider>
        </RealtimeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
