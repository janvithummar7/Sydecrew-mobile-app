import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { commsApi } from './api';

/**
 * Push notifications (Feature 5). The API sends no message text or names in a
 * push ("You have a new message"), so a banner never leaks a chat.
 *
 *  - The system permission is asked only after our own explanation sheet
 *    (PushPrompt), the first time the user opens Messages or a chat.
 *  - Once granted, the Expo push token is registered on every sign-in
 *    (POST /devices/push-token) and removed on sign-out (DELETE).
 *  - Getting an Expo push token needs the EAS project id (app.json
 *    extra.eas.projectId, set by `eas init`). Without it, or on a simulator,
 *    or in Expo Go on Android, registration is skipped quietly.
 */

const ASKED_KEY = 'sydecrew.push_prompted';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

const projectId = (): string | undefined => Constants.easConfig?.projectId ?? (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId;

export type PushState = 'granted' | 'denied' | 'undetermined' | 'unavailable';

export async function pushPermission(): Promise<PushState> {
  if (Platform.OS === 'web' || !Device.isDevice) return 'unavailable';
  try {
    const p = await Notifications.getPermissionsAsync();
    if (p.granted || p.ios?.status === IosAuthorizationStatus.PROVISIONAL) return 'granted';
    return p.canAskAgain ? 'undetermined' : 'denied';
  } catch {
    return 'unavailable';
  }
}

/** True when our explanation sheet should be shown (never asked before and the system can still ask). */
export async function shouldExplainPush(): Promise<boolean> {
  if ((await pushPermission()) !== 'undetermined') return false;
  const asked = await SecureStore.getItemAsync(ASKED_KEY).catch(() => null);
  return !asked;
}

export async function rememberPushPrompted() {
  await SecureStore.setItemAsync(ASKED_KEY, '1').catch(() => undefined);
}

/** Registers this device's token with the API. Returns why it was skipped, if it was. */
export async function registerPush(): Promise<'registered' | 'no-permission' | 'unavailable' | 'no-project-id' | 'failed'> {
  const state = await pushPermission();
  if (state === 'unavailable') return 'unavailable';
  if (state !== 'granted') return 'no-permission';
  const id = projectId();
  if (!id) return 'no-project-id';
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', { name: 'Sydecrew', importance: AndroidImportance.DEFAULT });
    }
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId: id });
    await commsApi.registerPush(data, Platform.OS === 'ios' ? 'IOS' : 'ANDROID');
    return 'registered';
  } catch {
    return 'failed';
  }
}

/** After our explanation: ask the system, then register. */
export async function askAndRegisterPush() {
  await rememberPushPrompted();
  try {
    const res = await Notifications.requestPermissionsAsync();
    if (!res.granted) return 'no-permission' as const;
  } catch {
    return 'unavailable' as const;
  }
  return registerPush();
}

/** On sign-out (while the session is still valid). */
export async function unregisterPush() {
  if (Platform.OS === 'web') return;
  await commsApi.unregisterPush().catch(() => undefined);
}
