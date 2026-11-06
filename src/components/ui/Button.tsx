import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, space, touchTarget, alpha } from '@/theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  accessibilityLabel?: string;
};

const FG: Record<ButtonVariant, string> = { primary: colors.onAccent, secondary: colors.textStrong, ghost: colors.textStrong, danger: colors.dangerText };

/** The one button (same variants and states as the web Button). Loading also blocks double submits. */
export function Button({ children, onPress, variant = 'primary', loading, disabled, icon, style, accessibilityHint, accessibilityLabel }: Props) {
  const inactive = disabled || loading;
  const fg = FG[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !inactive && (variant === 'primary' ? styles.primaryPressed : styles.pressed),
        inactive && styles.inactive,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator size="small" color={fg} /> : icon}
        <Text variant="body" weight="600" color={fg}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

/** Inline text button (links such as "Forgot password?"). 44 pt target via hitSlop. */
export function TextButton({ children, onPress, color = colors.lime300, disabled }: { children: ReactNode; onPress: () => void; color?: string; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="link" hitSlop={14} style={({ pressed }) => [{ opacity: pressed || disabled ? 0.6 : 1 }]}>
      <Text variant="small" weight="600" color={color}>
        {children}
      </Text>
    </Pressable>
  );
}

/** Icon-only button: always needs a spoken label. */
export function IconButton({ icon, label, onPress, disabled }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.icon, pressed && styles.pressed, disabled && styles.inactive]}
    >
      <Ionicons name={icon} size={22} color={colors.textStrong} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: Math.max(touchTarget, 52), borderRadius: radius.pill, paddingHorizontal: space.xl, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  primary: { backgroundColor: colors.accent },
  primaryPressed: { backgroundColor: colors.lime300 },
  secondary: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  ghost: { backgroundColor: 'transparent', paddingHorizontal: space.sm },
  danger: { borderWidth: 1, borderColor: alpha(colors.danger, 0.5), backgroundColor: alpha(colors.danger, 0.08) },
  pressed: { backgroundColor: colors.surfaceStrong },
  inactive: { opacity: 0.55 },
  icon: { width: touchTarget, height: touchTarget, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
