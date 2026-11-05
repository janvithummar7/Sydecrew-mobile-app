import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, space, alpha } from '@/theme';

type Props = {
  children: ReactNode;
  tone?: 'default' | 'ok' | 'warn' | 'accent';
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Surface for grouped content. Tappable when `onPress` is given (then it is announced as a button). */
export function Card({ children, tone = 'default', onPress, accessibilityLabel, style }: Props) {
  const toneStyle = tone === 'ok' ? styles.ok : tone === 'warn' ? styles.warn : tone === 'accent' ? styles.accent : null;
  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={({ pressed }) => [styles.card, toneStyle, pressed && styles.pressed, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, toneStyle, style]} accessibilityLabel={accessibilityLabel}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { gap: space.md, padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  ok: { borderColor: alpha(colors.lime400, 0.35) },
  warn: { borderColor: alpha(colors.danger, 0.35) },
  accent: { borderColor: alpha(colors.lavender400, 0.35), backgroundColor: alpha(colors.lavender400, 0.06) },
  pressed: { opacity: 0.85 },
});
