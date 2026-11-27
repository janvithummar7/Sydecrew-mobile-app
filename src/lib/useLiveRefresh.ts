import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { AppState } from 'react-native';

/**
 * Calls `refresh` every `ms` (default 30 s) while `live` is true, this screen is
 * focused and the app is in the foreground. For screens whose server-side state
 * moves on by itself (check-in opening, the call window, the other side checking in).
 */
export function useLiveRefresh(live: boolean, refresh: () => void, ms = 30_000) {
  useFocusEffect(
    useCallback(() => {
      if (!live) return undefined;
      const t = setInterval(() => {
        if (AppState.currentState === 'active') refresh();
      }, ms);
      return () => clearInterval(t);
    }, [live, refresh, ms]),
  );
}
