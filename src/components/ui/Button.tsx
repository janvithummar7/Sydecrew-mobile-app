import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';
import { Text } from './Text';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

export function Button({ children, onPress, variant = 'primary', loading, disabled, icon, style, accessibilityHint }: Props) {
  const inactive = disabled || loading;
  const fg = variant === 'primary' ? colors.ink950 : colors.fog50;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      // Explicit name so icon glyphs are not read out as part of it.
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
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

/** Inline text button (links such as "Forgot password?"). */
export function TextButton({ children, onPress, color = colors.lime300, disabled }: { children: ReactNode; onPress: () => void; color?: string; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="link" hitSlop={10} style={({ pressed }) => [{ opacity: pressed || disabled ? 0.6 : 1 }]}>
      <Text variant="small" weight="600" color={color}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radius.pill, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primary: { backgroundColor: colors.lime400 },
  primaryPressed: { backgroundColor: colors.lime300 },
  secondary: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: colors.surface },
  ghost: { backgroundColor: 'transparent', paddingHorizontal: 8 },
  pressed: { backgroundColor: colors.surfaceStrong },
  inactive: { opacity: 0.55 },
});
