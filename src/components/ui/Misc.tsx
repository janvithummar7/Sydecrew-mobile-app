import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, space, alpha } from '@/theme';
import { formatINR } from '@/lib/money';
import { safety, placeholders } from '@/content/common';
import { Button } from './Button';
import { Text } from './Text';

// ── Avatar ───────────────────────────────────────────────────────────────
import { Image } from 'expo-image';

/** Photo, or initials when there is none ("Aditi Mehra" -> "AM"). */
export function Avatar({ name, uri, size = 48 }: { name: string; uri?: string | null; size?: number }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
  const box = { width: size, height: size, borderRadius: size / 2 };
  if (uri) return <Image source={{ uri }} style={box} accessibilityLabel={name} contentFit="cover" />;
  return (
    <View style={[box, styles.initials]} accessible accessibilityLabel={name}>
      <Text variant={size >= 64 ? 'title' : 'small'} weight="600" color={colors.onBrand}>{initials || '?'}</Text>
    </View>
  );
}

// ── PriceTag ─────────────────────────────────────────────────────────────

/** Money in paise in, rupees out: `₹1,200` (+ an optional unit such as "/ hour"). */
export function PriceTag({ paise, unit, size = 'body' }: { paise: number; unit?: string; size?: 'body' | 'heading' | 'title' }) {
  return (
    <Text variant={size} weight="600" color={colors.textStrong} accessibilityLabel={`${formatINR(paise)}${unit ? ` ${unit}` : ''}`}>
      {formatINR(paise)}
      {unit ? <Text variant="small" color={colors.textMuted}>{` ${unit}`}</Text> : null}
    </Text>
  );
}

// ── SafetyCallout ────────────────────────────────────────────────────────

/** The safety promise: public approved venues, platonic, pay only in the app. `sos` adds one-tap 112. */
export function SafetyCallout({ sos, compact }: { sos?: boolean; compact?: boolean }) {
  return (
    <View style={styles.safety} accessibilityRole="summary">
      <View style={styles.safetyHead}>
        <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} />
        <Text variant="small" weight="600" color={colors.textStrong}>{safety.title}</Text>
      </View>
      {(compact ? safety.points.slice(0, 2) : safety.points).map((p) => (
        <Text key={p} variant="small" color={colors.textMuted}>{`• ${p}`}</Text>
      ))}
      {sos ? (
        <Button variant="danger" icon={<Ionicons name="call" size={18} color={colors.dangerText} />} onPress={() => Linking.openURL('tel:112')} accessibilityHint={safety.call112Hint}>
          {safety.call112}
        </Button>
      ) : null}
    </View>
  );
}

// ── PlaceholderNotice ────────────────────────────────────────────────────

/** Honest marker on screens whose feature is not built yet. Never hidden, never dismissible. */
export function PlaceholderNotice({ title = placeholders.title, body = placeholders.body }: { title?: string; body?: string }) {
  return (
    <View style={styles.placeholder} accessibilityRole="alert">
      <Ionicons name="construct-outline" size={18} color={colors.warningText} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="small" weight="600" color={colors.warningText}>{title}</Text>
        <Text variant="caption" color={colors.text}>{body}</Text>
      </View>
    </View>
  );
}

// ── Stepper ──────────────────────────────────────────────────────────────

/** "Step 2 of 5" with a progress bar. */
export function Stepper({ step, total, label }: { step: number; total: number; label?: string }) {
  return (
    <View style={{ gap: 6 }} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: total, now: step }} accessibilityLabel={label ?? `Step ${step} of ${total}`}>
      <Text variant="eyebrow" color={colors.textSubtle}>{label ?? `Step ${step} of ${total}`}</Text>
      <View style={styles.track}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.seg, i < step && { backgroundColor: colors.accent }]} />
        ))}
      </View>
    </View>
  );
}

// ── StatusTimeline ───────────────────────────────────────────────────────

export type TimelineStage = { label: string; done: boolean; current: boolean; detail?: string };

/** Vertical timeline (Submitted -> Checks -> In review -> Decision). */
export function StatusTimeline({ stages }: { stages: TimelineStage[] }) {
  return (
    <View accessibilityRole="list">
      {stages.map((s, i) => (
        <View key={s.label} style={styles.stage} accessible accessibilityLabel={`${s.label}${s.done ? ', done' : s.current ? ', in progress' : ''}`}>
          <View style={styles.rail}>
            <View style={[styles.dot, s.done && styles.dotDone, s.current && styles.dotCurrent]}>
              {s.done ? <Ionicons name="checkmark" size={12} color={colors.onAccent} /> : null}
            </View>
            {i < stages.length - 1 ? <View style={[styles.line, s.done && { backgroundColor: colors.accent }]} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: space.lg }}>
            <Text weight={s.current ? '600' : undefined} color={s.done || s.current ? colors.textStrong : colors.textSubtle}>{s.label}</Text>
            {s.detail ? <Text variant="caption" color={colors.textMuted}>{s.detail}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────

type ToastMsg = { id: number; text: string; tone: 'ok' | 'error' };
const ToastCtx = createContext<(text: string, tone?: 'ok' | 'error') => void>(() => {});

/** Short confirmation that disappears by itself; announced to screen readers. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<ToastMsg | null>(null);
  const show = useCallback((text: string, tone: 'ok' | 'error' = 'ok') => setMsg({ id: Date.now(), text, tone }), []);
  useEffect(() => {
    if (!msg) return undefined;
    const t = setTimeout(() => setMsg(null), 3500);
    return () => clearTimeout(t);
  }, [msg]);
  const value = useMemo(() => show, [show]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      {msg ? (
        <View pointerEvents="none" style={styles.toastWrap}>
          <View style={[styles.toast, msg.tone === 'error' && { borderColor: colors.danger }]} accessibilityLiveRegion="polite" accessibilityRole="alert">
            <Ionicons name={msg.tone === 'ok' ? 'checkmark-circle' : 'alert-circle'} size={18} color={msg.tone === 'ok' ? colors.accent : colors.dangerText} />
            <Text variant="small" color={colors.textStrong} style={{ flex: 1 }}>{msg.text}</Text>
          </View>
        </View>
      ) : null}
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

const styles = StyleSheet.create({
  initials: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand },
  safety: { gap: space.sm, padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: alpha(colors.lime400, 0.25), backgroundColor: alpha(colors.lime400, 0.05) },
  safetyHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  placeholder: { flexDirection: 'row', gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: alpha(colors.warningText, 0.4), backgroundColor: colors.warningBg },
  track: { flexDirection: 'row', gap: 4 },
  seg: { flex: 1, height: 4, borderRadius: radius.pill, backgroundColor: colors.surfaceStrong },
  stage: { flexDirection: 'row', gap: space.md },
  rail: { alignItems: 'center', width: 20 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  dotCurrent: { borderColor: colors.brand },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  toastWrap: { position: 'absolute', left: space.lg, right: space.lg, bottom: space.xxxl, zIndex: 80 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgRaised },
});
