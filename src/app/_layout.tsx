import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/lib/auth';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

/**
 * Three route sets, switched by `Stack.Protected`:
 * - signed out: welcome, login, sign-up, forgot password
 * - signed in, onboarding unfinished: onboarding
 * - signed in and onboarded: home
 * When the session changes, the current screen's guard fails and Expo Router
 * redirects, so screens never navigate after login / logout themselves.
 */
function RootNavigator() {
  const { status, user } = useAuth();

  useEffect(() => {
    if (status !== 'loading') SplashScreen.hideAsync();
  }, [status]);

  if (status === 'loading') return null; // the native splash stays up

  const signedIn = status === 'authenticated' && !!user;
  const onboarded = signedIn && user.onboarding.complete;
  const home = !signedIn ? '/' : onboarded ? '/home' : '/onboarding';

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ink950 }, animation: 'slide_from_right' }}>
      <Stack.Protected guard={!signedIn} redirectTo={home}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !onboarded} redirectTo={home}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={onboarded} redirectTo={home}>
        <Stack.Screen name="home" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
