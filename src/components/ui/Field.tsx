import { forwardRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, space, alpha } from '@/theme';
import { Text } from './Text';

type FieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string;
  hint?: string;
  /** Fixed text inside the input on the left, e.g. "+91". */
  prefix?: string;
  trailing?: ReactNode;
};

/** Labelled input. The label is also the accessible name; errors are announced. */
export const TextField = forwardRef<TextInputInstance, FieldProps>(function TextField(
  { label, error, hint, prefix, trailing, onFocus, onBlur, ...input },
  ref,
) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text variant="small" weight="600" color={colors.fog100}>
        {label}
      </Text>
      <View
        style={[
          styles.box,
          focused && styles.boxFocused,
          error ? styles.boxError : null,
        ]}
      >
        {prefix ? (
          <Text variant="body" color={colors.fog400} style={styles.prefix}>
            {prefix}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
          aria-invalid={error ? true : undefined}
          placeholderTextColor={colors.fog500}
          selectionColor={colors.lime400}
          cursorColor={colors.lime400}
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...input}
        />
        {trailing}
      </View>
      {error ? (
        <Text variant="caption" color={colors.red300} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color={colors.fog400}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

export const PasswordField = forwardRef<TextInputInstance, Omit<FieldProps, 'secureTextEntry' | 'trailing'>>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      ref={ref}
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      trailing={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          hitSlop={8}
          style={styles.eye}
        >
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.fog400} />
        </Pressable>
      }
    />
  );
});

type CheckboxProps = { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string; label?: string };

/** Checkbox row; the whole row is the touch target. */
export function Checkbox({ checked, onChange, children, error, label }: CheckboxProps) {
  return (
    <View style={{ gap: 6 }}>
      <Pressable
        onPress={() => onChange(!checked)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={label}
        style={styles.checkRow}
      >
        <View style={[styles.check, checked && styles.checkOn, error ? styles.boxError : null]}>
          {checked ? <Ionicons name="checkmark" size={14} color={colors.ink950} /> : null}
        </View>
        <View style={{ flex: 1 }}>{typeof children === 'string' ? <Text variant="small" color={colors.fog100}>{children}</Text> : children}</View>
      </Pressable>
      {error ? (
        <Text variant="caption" color={colors.red300} style={{ paddingLeft: 32 }} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.sm },
  box: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  boxFocused: { borderColor: alpha(colors.lime400, 0.7), backgroundColor: colors.surfaceStrong },
  boxError: { borderColor: alpha(colors.red400, 0.75) },
  prefix: { paddingLeft: 16 },
  input: { flex: 1, minHeight: 50, paddingHorizontal: 16, color: colors.fog50, fontSize: 16 },
  eye: { paddingHorizontal: 14, height: 50, justifyContent: 'center' },
  checkRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 4 },
  check: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.lime400, borderColor: colors.lime400 },
});
