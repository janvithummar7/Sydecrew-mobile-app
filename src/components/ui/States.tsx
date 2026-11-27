import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, motion, radius, space, alpha } from '@/theme';
import { Button } from './Button';
import { Text } from './Text';
import { states as copy } from '@/content/common';

/** Loading placeholder. Pulses gently unless the user asked for reduced motion. */
export function Skeleton({ width = '100%', height = 16, radius: r = radius.sm }: { width?: DimensionValue; height?: number; radius?: number }) {
  const reduced = useReducedMotion();
  const o = useSharedValue(0.5);
  useEffect(() => {
    if (!reduced) o.value = withRepeat(withTiming(1, { duration: motion.duration.slow }), -1, true);
  }, [reduced, o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width, height, borderRadius: r, backgroundColor: colors.surfaceStrong }, style]} />;
}

/** A few skeleton rows for a loading screen; announced as busy. */
export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <View style={{ gap: space.lg }} accessibilityRole="progressbar" accessibilityLabel={copy.loading} accessibilityState={{ busy: true }}>
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={{ gap: space.sm }}>
          <Skeleton width="60%" height={18} />
          <Skeleton height={14} />
          <Skeleton width="80%" height={14} />
        </View>
      ))}
    </View>
  );
}

export function EmptyState({ icon = 'sparkles-outline', title, body, action }: { icon?: keyof typeof Ionicons.glyphMap; title: string; body?: string; action?: ReactNode }) {
  return (
    <View style={styles.center}>
      <View style={styles.iconWrap}><Ionicons name={icon} size={26} color={colors.brand} /></View>
      <Text variant="heading" color={colors.textStrong} style={styles.centerText}>{title}</Text>
      {body ? <Text variant="small" color={colors.textMuted} style={styles.centerText}>{body}</Text> : null}
      {action}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={[styles.center, styles.error]} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Ionicons name="alert-circle-outline" size={26} color={colors.dangerText} />
      <Text color={colors.text} style={styles.centerText}>{message}</Text>
      {onRetry ? <Button variant="secondary" onPress={onRetry}>{copy.retry}</Button> : null}
    </View>
  );
}

/** Shown when the API cannot be reached. */
export function OfflineBanner({ onRetry }: { onRetry?: () => void }) {
  return (
    <View style={styles.offline} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Ionicons name="cloud-offline-outline" size={18} color={colors.warningText} />
      <Text variant="small" color={colors.warningText} style={{ flex: 1 }}>{copy.offline}</Text>
      {onRetry ? <Button variant="ghost" onPress={onRetry}>{copy.retry}</Button> : null}
    </View>
  );
}

/**
 * The four data states in one place: loading (skeleton), error (+ retry, or the
 * offline banner when the network is down), empty, and the content itself.
 */
export function DataState({ loading, error, offline, empty, onRetry, children, emptyTitle, emptyBody, hasData = false }: {
  loading: boolean;
  /** Something was loaded before: a failed refresh keeps it on screen under a banner instead of replacing it. */
  hasData?: boolean;
  error?: string | null;
  offline?: boolean;
  empty?: boolean;
  onRetry?: () => void;
  children: ReactNode;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  if (loading) return <SkeletonList />;
  if (hasData && (offline || error)) {
    return (
      <>
        {offline ? <OfflineBanner onRetry={onRetry} /> : <ErrorState message={error ?? ''} onRetry={onRetry} />}
        {children}
      </>
    );
  }
  if (offline) return <OfflineBanner onRetry={onRetry} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (empty) return <EmptyState title={emptyTitle ?? copy.emptyTitle} body={emptyBody} />;
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: space.md, paddingVertical: space.xxl, paddingHorizontal: space.lg },
  centerText: { textAlign: 'center' },
  iconWrap: { width: 56, height: 56, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(colors.lavender400, 0.12) },
  error: { borderRadius: radius.lg, borderWidth: 1, borderColor: alpha(colors.danger, 0.3), backgroundColor: alpha(colors.danger, 0.06) },
  offline: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.warningBg },
});
