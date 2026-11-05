import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

/**
 * A random per-install id sent as X-Device-Id, so the API can spot one
 * phone behind several companion accounts (the API stores only a keyed hash).
 * It is not a hardware id and resets if the app is reinstalled.
 */
const KEY = 'sydecrew.device_id';
let cached: Promise<string> | null = null;

async function load(): Promise<string> {
  if (Platform.OS === 'web') {
    const existing = globalThis.localStorage?.getItem(KEY);
    if (existing) return existing;
    const id = Crypto.randomUUID();
    globalThis.localStorage?.setItem(KEY, id);
    return id;
  }
  try {
    const existing = await SecureStore.getItemAsync(KEY);
    if (existing) return existing;
  } catch {
    // unreadable after a restore: make a new one
  }
  const id = Crypto.randomUUID();
  await SecureStore.setItemAsync(KEY, id).catch(() => undefined);
  return id;
}

export const deviceId = () => (cached ??= load());

/** Headers sent with every API request. */
export async function deviceHeaders(): Promise<Record<string, string>> {
  return {
    'x-device-id': await deviceId(),
    'x-platform': Platform.OS === 'ios' ? 'IOS' : Platform.OS === 'android' ? 'ANDROID' : 'WEB',
  };
}
