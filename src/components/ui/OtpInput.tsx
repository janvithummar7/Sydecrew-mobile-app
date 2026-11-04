import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';
import { colors, radius } from '@/theme';
import { Text } from './Text';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
  /** Change this number to put the cursor back in the field (e.g. after a wrong code). */
  focusSignal?: number;
};

/**
 * One real text input drawn as six boxes. A single input keeps SMS autofill
 * (iOS one-time-code, Android sms-otp), paste and screen readers simple.
 */
export function OtpInput({ value, onChange, onComplete, length = 6, invalid, disabled, focusSignal = 0 }: Props) {
  const ref = useRef<TextInputInstance>(null);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (focusSignal > 0) ref.current?.focus();
  }, [focusSignal]);

  return (
    <Pressable onPress={() => ref.current?.focus()} accessible={false} style={styles.wrap}>
      <View style={styles.row} pointerEvents="none">
        {Array.from({ length }, (_, i) => {
          const active = focused && (i === value.length || (i === length - 1 && value.length === length));
          return (
            <View key={i} style={[styles.box, active && styles.boxActive, invalid && styles.boxError]}>
              <Text variant="title" color={colors.fog50} style={styles.digit}>
                {value[i] ?? ''}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={ref}
        value={value}
        autoFocus
        // Not `editable={!disabled}`: that would dismiss the Android keyboard while a code is checked.
        onChangeText={(text) => {
          if (disabled) return;
          const clean = text.replace(/\D/g, '').slice(0, length);
          if (clean === value) return; // autofill can fire twice with the same text
          onChange(clean);
          if (clean.length === length) onComplete?.(clean);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        inputMode="numeric"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        accessibilityLabel="One-time code"
        caretHidden
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  row: { flexDirection: 'row', gap: 8 },
  box: {
    flex: 1,
    height: 58,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: 'rgba(212,255,79,0.8)', backgroundColor: colors.surfaceStrong },
  boxError: { borderColor: 'rgba(248,113,113,0.75)' },
  digit: { fontVariant: ['tabular-nums'] },
  // Covers the boxes so taps focus it, but is invisible.
  hidden: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.011, color: 'transparent' },
});
