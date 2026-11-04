import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * The long-lived refresh token, kept in the iOS Keychain / Android Keystore.
 * The short-lived access token stays in memory only (see api.ts).
 *
 * SecureStore has no web implementation. The web build is only a development
 * preview, so it falls back to localStorage there.
 */
const KEY = 'sydecrew.refresh_token';

export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') return globalThis.localStorage?.getItem(KEY) ?? null;
  try {
    return await SecureStore.getItemAsync(KEY);
  } catch {
    // Keystore/Keychain entry unreadable (e.g. after a device restore): forget it and sign in again.
    await SecureStore.deleteItemAsync(KEY).catch(() => undefined);
    return null;
  }
}

export async function setRefreshToken(token: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    if (token) globalThis.localStorage?.setItem(KEY, token);
    else globalThis.localStorage?.removeItem(KEY);
    return;
  }
  if (token) await SecureStore.setItemAsync(KEY, token);
  else await SecureStore.deleteItemAsync(KEY);
}
