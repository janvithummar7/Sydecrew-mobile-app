import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackBar } from '@/components/account/BackBar';
import { Badge, type BadgeKind } from '@/components/ui/Badge';
import { Card as UiCard } from '@/components/ui/Card';
import { Stepper } from '@/components/ui/Misc';
import { ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { formatDateIST } from '@/lib/time';
import { colors, space, touchTarget } from '@/theme';

/**
 * Companion-screen building blocks. They are thin wrappers over the shared
 * component vocabulary in components/ui (same names and states as web).
 */
export { Chip, ChipRow } from '@/components/ui/Chip';

/** Screen heading with a back control and an optional step progress ("Step 2 of 5"). */
export function StepHeader({ title, step, total, subtitle, back = true }: { title: string; step?: number; total?: number; subtitle?: string; back?: boolean }) {
  return (
    <View style={{ gap: space.md }}>
      {back ? <BackBar /> : null}
      {step && total ? <Stepper step={step} total={total} /> : null}
      <Title>{title}</Title>
      {subtitle ? <Text color={colors.textMuted}>{subtitle}</Text> : null}
    </View>
  );
}

export function Section({ title, children, hint }: { title: string; children: ReactNode; hint?: string }) {
  return (
    <View style={{ gap: space.md }}>
      <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{title}</Text>
      {hint ? <Text variant="small" color={colors.textMuted}>{hint}</Text> : null}
      {children}
    </View>
  );
}

export function Card({ children, tone }: { children: ReactNode; tone?: 'ok' | 'warn' }) {
  return <UiCard tone={tone ?? 'default'}>{children}</UiCard>;
}

/** Status pill: a Badge with the companion screens' tone names. */
export function Pill({ label, tone = 'neutral' }: { label: string; tone?: 'ok' | 'neutral' | 'warn' | 'info' }) {
  const kind: BadgeKind = { ok: 'verified', neutral: 'neutral', warn: 'suspended', info: 'pending' }[tone] as BadgeKind;
  return <Badge kind={kind} label={label} />;
}

/** Loading (skeleton), offline banner or error with retry. Renders nothing once loaded. */
export function LoadState({ loading, error, onRetry, offline }: { loading: boolean; error: string | null; onRetry: () => void; offline?: boolean }) {
  if (offline) return <OfflineBanner onRetry={onRetry} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading) return <SkeletonList />;
  return null;
}

/** A tappable list row that links somewhere (44 pt minimum target). */
export function LinkRow({ label, detail, done, onPress }: { label: string; detail?: string; done?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}${done === undefined ? '' : done ? ', done' : ', to do'}`} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      {done !== undefined ? <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={done ? colors.accent : colors.textSubtle} /> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" color={colors.textStrong}>{label}</Text>
        {detail ? <Text variant="caption" color={colors.textMuted}>{detail}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
    </Pressable>
  );
}

/** IST date ("5 November 2026"). */
export const dateIn = formatDateIST;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: touchTarget + 8, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
});
