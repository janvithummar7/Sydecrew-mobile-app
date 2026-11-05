import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, space, touchTarget, alpha } from '@/theme';
import { Text } from './Text';

/** Selectable chip (categories, activities, boundaries, languages, filters). */
export function Chip({ label, selected, onPress, disabled, note, radio }: { label: string; selected: boolean; onPress: () => void; disabled?: boolean; note?: string; radio?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={radio ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: selected, disabled: !!disabled }}
      accessibilityLabel={note ? `${label}, ${note}` : label}
      style={({ pressed }) => [styles.chip, selected && styles.on, disabled && { opacity: 0.45 }, pressed && { opacity: 0.8 }]}
    >
      {selected ? <Ionicons name="checkmark" size={14} color={colors.onAccent} /> : null}
      <Text variant="small" weight="600" color={selected ? colors.onAccent : colors.text}>{label}</Text>
      {note ? <Text variant="caption" color={selected ? colors.onAccent : colors.textMuted}>{note}</Text> : null}
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

/** A larger single-choice option with a second line (e.g. a zone and whether it is live). */
export function OptionCard({ title, detail, selected, onPress, disabled, accessibilityLabel }: { title: string; detail?: string; selected: boolean; onPress: () => void; disabled?: boolean; accessibilityLabel?: string }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [styles.option, selected && styles.optionOn, disabled && { opacity: 0.45 }, pressed && { opacity: 0.85 }]}
    >
      <Text weight="600" color={colors.textStrong}>{title}</Text>
      {detail ? <Text variant="caption" color={selected ? colors.lime300 : colors.textMuted}>{detail}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: touchTarget, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  on: { backgroundColor: colors.accent, borderColor: colors.accent },
  option: { gap: 2, minHeight: touchTarget, paddingHorizontal: space.lg, paddingVertical: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  optionOn: { borderColor: alpha(colors.lime400, 0.7), backgroundColor: alpha(colors.lime400, 0.07) },
});
