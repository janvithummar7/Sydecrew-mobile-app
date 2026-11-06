import { Linking } from 'react-native';
import * as Location from 'expo-location';

/**
 * Foreground location only (Feature 5). The app never asks for background
 * location and has no background task: sharing pauses while the app is not on
 * screen (app.json disables background location on both platforms).
 */

export type Permission = 'granted' | 'denied' | 'undetermined';

export async function foregroundPermission(ask: boolean): Promise<Permission> {
  try {
    const current = await Location.getForegroundPermissionsAsync();
    if (current.granted) return 'granted';
    if (!ask) return current.canAskAgain ? 'undetermined' : 'denied';
    if (!current.canAskAgain) return 'denied';
    const res = await Location.requestForegroundPermissionsAsync();
    return res.granted ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

export type Point = { latitude: number; longitude: number; accuracy_meters?: number };

const toPoint = (p: Location.LocationObject): Point => ({
  latitude: p.coords.latitude,
  longitude: p.coords.longitude,
  ...(p.coords.accuracy != null ? { accuracy_meters: Math.round(p.coords.accuracy) } : {}),
});

/** One fix, or the last known one if a fresh fix takes longer than `timeoutMs` (SOS must not wait). */
export async function currentPoint(timeoutMs = 8000): Promise<Point | null> {
  try {
    const fresh = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }).then(toPoint);
    const late = new Promise<null>((r) => setTimeout(() => r(null), timeoutMs));
    const p = await Promise.race([fresh, late]);
    if (p) return p;
    const last = await Location.getLastKnownPositionAsync();
    return last ? toPoint(last) : null;
  } catch {
    return null;
  }
}

/** Watches position while the screen is open. Call the returned function to stop. */
export async function watchForeground(onPoint: (p: Point) => void): Promise<() => void> {
  const sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, timeInterval: 30_000, distanceInterval: 25 }, (p) => onPoint(toPoint(p)));
  return () => sub.remove();
}

export const openLocationSettings = () => Linking.openSettings();
