import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { Text } from './Text';

const tones = {
  error: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)', icon: 'alert-circle-outline', color: colors.red300 },
  success: { bg: 'rgba(212,255,79,0.08)', border: 'rgba(212,255,79,0.3)', icon: 'checkmark-circle-outline', color: colors.lime300 },
  info: { bg: 'rgba(178,159,255,0.08)', border: 'rgba(178,159,255,0.3)', icon: 'information-circle-outline', color: colors.lavender300 },
} as const;

/** Form-level message. Errors are announced to screen readers straight away. */
export function Alert({ tone = 'error', children, action }: { tone?: keyof typeof tones; children: ReactNode; action?: ReactNode }) {
  const t = tones[tone];
  return (
    <View
      accessibilityRole={tone === 'error' ? 'alert' : 'summary'}
      accessibilityLiveRegion="polite"
      style={[styles.box, { backgroundColor: t.bg, borderColor: t.border }]}
    >
      <Ionicons name={t.icon} size={18} color={t.color} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: 8 }}>
        {typeof children === 'string' ? <Text variant="small" color={colors.fog100}>{children}</Text> : children}
        {action}
      </View>
    </View>
  );
}

/** Development only: shows the OTP code or email link that the API echoed back. */
export function DevHint({ children }: { children: ReactNode }) {
  if (!__DEV__) return null;
  return (
    <View style={styles.dev}>
      <Text variant="caption" color={colors.fog400} selectable style={{ fontFamily: 'monospace' }}>
        dev · {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 12 },
  dev: { borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.15)', borderRadius: radius.sm, padding: 8 },
});
