import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, space, touchTarget } from '@/theme';
import { Sheet } from './Sheet';
import { Text } from './Text';

type Option = { value: string; label: string; note?: string };

/** A labelled picker that opens a sheet of options (same props as the web Select). */
export function Select({ label, value, options, onChange, placeholder = 'Choose', error, disabled }: {
  label: string;
  value: string | null;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <View style={{ gap: 6 }}>
      <Text variant="small" weight="600" color={colors.textStrong}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current?.label ?? placeholder}`}
        accessibilityHint="Opens a list to choose from"
        style={({ pressed }) => [styles.field, error ? styles.error : null, pressed && { opacity: 0.8 }, disabled && { opacity: 0.5 }]}
      >
        <Text color={current ? colors.text : colors.textSubtle} style={{ flex: 1 }}>{current?.label ?? placeholder}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      {error ? <Text variant="caption" color={colors.dangerText} accessibilityLiveRegion="polite">{error}</Text> : null}
      <Sheet visible={open} onClose={() => setOpen(false)} title={label}>
        <FlatList
          data={options}
          keyExtractor={(o) => o.value}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onChange(item.value);
                setOpen(false);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: item.value === value }}
              style={({ pressed }) => [styles.option, pressed && { opacity: 0.7 }]}
            >
              <View style={{ flex: 1 }}>
                <Text color={colors.textStrong}>{item.label}</Text>
                {item.note ? <Text variant="caption" color={colors.textMuted}>{item.note}</Text> : null}
              </View>
              {item.value === value ? <Ionicons name="checkmark" size={20} color={colors.accent} /> : null}
            </Pressable>
          )}
        />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  error: { borderColor: colors.danger },
  option: { minHeight: touchTarget + 8, flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
});
