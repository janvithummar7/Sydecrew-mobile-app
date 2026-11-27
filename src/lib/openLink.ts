import { Alert, Linking } from 'react-native';

/**
 * Opens a link (web page, mail, phone). When the phone cannot (no mail app, no dialler, blocked),
 * says so in a native alert with what to do instead, rather than silently doing nothing.
 */
export function openLink(url: string, fallback: { title: string; message: string }): void {
  Linking.openURL(url).catch(() => Alert.alert(fallback.title, fallback.message));
}

export const CALL_112_FAILED = { title: 'Could not open the phone app', message: 'Dial 112 on your phone now.' };
