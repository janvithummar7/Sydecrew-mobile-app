import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, space, alpha } from '@/theme';
import { Text } from './Text';

/** Badge kinds shared with web: the status vocabulary of the product. */
export type BadgeKind = 'verified' | 'pending' | 'needs-changes' | 'live' | 'paused' | 'suspended' | 'neutral' | 'info';

const KIND: Record<BadgeKind, { fg: string; bg: string; icon?: keyof typeof Ionicons.glyphMap }> = {
  verified: { fg: colors.lime300, bg: alpha(colors.lime400, 0.14), icon: 'shield-checkmark' },
  live: { fg: colors.lime300, bg: alpha(colors.lime400, 0.14), icon: 'radio-button-on' },
  pending: { fg: colors.lavender300, bg: alpha(colors.lavender400, 0.14), icon: 'time-outline' },
  info: { fg: colors.lavender300, bg: alpha(colors.lavender400, 0.14) },
  'needs-changes': { fg: colors.warningText, bg: colors.warningBg, icon: 'create-outline' },
  paused: { fg: colors.textMuted, bg: colors.surfaceStrong, icon: 'pause' },
  suspended: { fg: colors.dangerText, bg: colors.dangerBg, icon: 'ban-outline' },
  neutral: { fg: colors.textMuted, bg: colors.surfaceStrong },
};

export function Badge({ kind = 'neutral', label }: { kind?: BadgeKind; label: string }) {
  const k = KIND[kind];
  return (
    <View style={[styles.badge, { backgroundColor: k.bg }]} accessible accessibilityLabel={label}>
      {k.icon ? <Ionicons name={k.icon} size={12} color={k.fg} /> : null}
      <Text variant="caption" weight="600" color={k.fg}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: space.xs, alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 3 },
});
