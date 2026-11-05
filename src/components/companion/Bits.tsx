import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackBar } from '@/components/account/BackBar';
import { TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Text, Title } from '@/components/ui/Text';
import { colors, radius } from '@/theme';

/** Selectable chip (categories, activities, boundaries, languages). */
export function Chip({ label, selected, onPress, disabled, note }: { label: string; selected: boolean; onPress: () => void; disabled?: boolean; note?: string }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled: !!disabled }}
      accessibilityLabel={note ? `${label}, ${note}` : label}
      style={({ pressed }) => [styles.chip, selected && styles.chipOn, disabled && { opacity: 0.45 }, pressed && { opacity: 0.8 }]}
    >
      {selected ? <Ionicons name="checkmark" size={14} color={colors.ink950} /> : null}
      <Text variant="small" weight="600" color={selected ? colors.ink950 : colors.fog100}>{label}</Text>
      {note ? <Text variant="caption" color={selected ? colors.ink950 : colors.fog400}>{note}</Text> : null}
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.chips}>{children}</View>;
}

/** Screen heading with a back control and an optional step counter ("Step 2 of 5"). */
export function StepHeader({ title, step, total, subtitle, back = true }: { title: string; step?: number; total?: number; subtitle?: string; back?: boolean }) {
  return (
    <View style={{ gap: 10 }}>
      {back ? <BackBar /> : null}
      {step && total ? <Text variant="eyebrow" color={colors.fog500}>{`Step ${step} of ${total}`}</Text> : null}
      <Title>{title}</Title>
      {subtitle ? <Text color={colors.fog300}>{subtitle}</Text> : null}
    </View>
  );
}

export function Section({ title, children, hint }: { title: string; children: ReactNode; hint?: string }) {
  return (
    <View style={{ gap: 10 }}>
      <Text variant="heading" color={colors.fog50} accessibilityRole="header">{title}</Text>
      {hint ? <Text variant="small" color={colors.fog400}>{hint}</Text> : null}
      {children}
    </View>
  );
}

export function Card({ children, tone }: { children: ReactNode; tone?: 'ok' | 'warn' }) {
  return <View style={[styles.card, tone === 'ok' && { borderColor: 'rgba(212,255,79,0.35)' }, tone === 'warn' && { borderColor: 'rgba(248,113,113,0.35)' }]}>{children}</View>;
}

/** Status pill (moderation state, checklist state). */
export function Pill({ label, tone = 'neutral' }: { label: string; tone?: 'ok' | 'neutral' | 'warn' | 'info' }) {
  const bg = { ok: 'rgba(212,255,79,0.15)', neutral: 'rgba(255,255,255,0.06)', warn: 'rgba(248,113,113,0.15)', info: 'rgba(178,159,255,0.15)' }[tone];
  const fg = { ok: colors.lime300, neutral: colors.fog400, warn: colors.red300, info: colors.lavender300 }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text variant="caption" color={fg}>{label}</Text>
    </View>
  );
}

/** Loading spinner or a load error with "Try again" (offline-friendly). */
export function LoadState({ loading, error, onRetry }: { loading: boolean; error: string | null; onRetry: () => void }) {
  if (error) return <Alert action={<TextButton onPress={onRetry}>Try again</TextButton>}>{error}</Alert>;
  if (loading) return <ActivityIndicator color={colors.fog400} style={{ marginTop: 48 }} accessibilityLabel="Loading" />;
  return null;
}

/** A tappable list row that links somewhere. */
export function LinkRow({ label, detail, done, onPress }: { label: string; detail?: string; done?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}${done === undefined ? '' : done ? ', done' : ', to do'}`} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      {done !== undefined ? <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={done ? colors.lime400 : colors.fog500} /> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" color={colors.fog50}>{label}</Text>
        {detail ? <Text variant="caption" color={colors.fog400}>{detail}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.fog500} />
    </Pressable>
  );
}

export const dateIn = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }) : '—';

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.lime400, borderColor: colors.lime400 },
  card: { gap: 10, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.03)' },
  pill: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.divider },
});
