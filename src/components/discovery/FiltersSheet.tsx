import { useMemo, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { categoryNames } from '@/content/common';
import { filtersSheet as copy, sortLabels, windowLabels } from '@/content/discovery';
import { DURATION_CHOICES, EMPTY_FILTERS, nextDates, overallBand, priceBuckets, toggleIn, withCategory, withDate, type DiscoveryFilters } from '@/lib/discovery/filters';
import { shortDay } from '@/lib/discovery/list';
import type { DiscoveryOptions } from '@/lib/discovery/types';
import { formatPaise } from '@/lib/money';
import { colors, space } from '@/theme';

/**
 * Discover filters in a bottom sheet: category, activity, area, languages,
 * interests, date + time of day, duration, price, sort. Edits a draft; nothing
 * changes until "Show companions". Values come from GET /discovery/options.
 */
export function FiltersSheet({ visible, onClose, options, value, onApply }: {
  visible: boolean;
  onClose: () => void;
  options: DiscoveryOptions;
  value: DiscoveryFilters;
  onApply: (f: DiscoveryFilters) => void;
}) {
  const [draft, setDraft] = useState(value);
  // Each time the sheet opens, the draft starts from the applied filters (state reset during render, not in an effect).
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft(value);
  }

  const category = options.categories.find((c) => c.id === draft.category) ?? null;
  const dates = useMemo(() => nextDates(options.today, 14), [options.today]);
  const buckets = priceBuckets(category?.price_band ?? overallBand(options.categories.map((c) => c.price_band)));
  const set = (patch: Partial<DiscoveryFilters>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <Sheet visible={visible} onClose={onClose} title={copy.title}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" testID="filters-sheet">
        <Group title={copy.category}>
          {options.categories.map((c) => (
            <Chip key={c.id} radio label={categoryNames[c.code] ?? c.name} selected={draft.category === c.id} onPress={() => setDraft((d) => withCategory(d, d.category === c.id ? null : c.id))} />
          ))}
        </Group>

        <Group title={copy.activity} hint={category ? undefined : copy.activityHint}>
          {(category?.activities ?? []).map((a) => (
            <Chip key={a.id} radio label={a.name} selected={draft.activity === a.id} onPress={() => set({ activity: draft.activity === a.id ? null : a.id })} />
          ))}
        </Group>

        {options.zones.length > 1 ? (
          <Group title={copy.zone}>
            <Chip radio label={copy.anyZone} selected={!draft.zone} onPress={() => set({ zone: null })} />
            {options.zones.map((z) => <Chip key={z.id} radio label={z.name} selected={draft.zone === z.id} onPress={() => set({ zone: z.id })} />)}
          </Group>
        ) : null}

        <Group title={copy.languages}>
          {options.languages.map((l) => <Chip key={l.id} label={l.name} selected={draft.languages.includes(l.id)} onPress={() => set({ languages: toggleIn(draft.languages, l.id) })} />)}
        </Group>

        <Group title={copy.interests}>
          {options.interests.map((i) => <Chip key={i.id} label={i.name} selected={draft.interests.includes(i.id)} onPress={() => set({ interests: toggleIn(draft.interests, i.id) })} />)}
        </Group>

        <Group title={copy.date}>
          <Chip radio label={copy.anyDate} selected={!draft.date} onPress={() => setDraft((d) => withDate(d, null))} />
          {dates.map((d, i) => {
            const s = shortDay(d);
            return <Chip key={d} radio label={i === 0 ? copy.today : `${s.weekday} ${s.day} ${s.month}`} selected={draft.date === d} onPress={() => setDraft((x) => withDate(x, d))} />;
          })}
        </Group>

        <Group title={copy.time} hint={draft.date ? undefined : copy.timeHint}>
          <Chip radio label={copy.anyTime} selected={!draft.timeWindow} disabled={!draft.date} onPress={() => set({ timeWindow: null })} />
          {options.time_windows.map((w) => (
            <Chip key={w.key} radio label={windowLabels[w.key]} note={`${w.start}–${w.end}`} selected={draft.timeWindow === w.key} disabled={!draft.date} onPress={() => set({ timeWindow: w.key })} />
          ))}
        </Group>

        <Group title={copy.duration}>
          <Chip radio label={copy.anyDuration} selected={!draft.durationMinutes} onPress={() => set({ durationMinutes: null })} />
          {DURATION_CHOICES.map((m) => <Chip key={m} radio label={copy.hours(m)} selected={draft.durationMinutes === m} onPress={() => set({ durationMinutes: m })} />)}
        </Group>

        {buckets.length ? (
          <Group title={copy.price}>
            <Chip radio label={copy.anyPrice} selected={draft.minPaise === null && draft.maxPaise === null} onPress={() => set({ minPaise: null, maxPaise: null })} />
            {buckets.map((b) => {
              const label = b.minPaise === null ? copy.priceUpTo(formatPaise(b.maxPaise)) : b.maxPaise === null ? copy.priceFrom(formatPaise(b.minPaise)) : copy.priceBetween(formatPaise(b.minPaise), formatPaise(b.maxPaise));
              return <Chip key={b.key} radio label={label} selected={draft.minPaise === b.minPaise && draft.maxPaise === b.maxPaise} onPress={() => set({ minPaise: b.minPaise, maxPaise: b.maxPaise })} />;
            })}
          </Group>
        ) : null}

        <Group title={copy.sort}>
          {options.sorts.map((s) => <Chip key={s} radio label={sortLabels[s]} selected={draft.sort === s} onPress={() => set({ sort: s })} />)}
        </Group>
      </ScrollView>
      <View style={styles.actions}>
        <Button variant="secondary" onPress={() => setDraft({ ...EMPTY_FILTERS })} style={{ flex: 1 }}>{copy.reset}</Button>
        <Button onPress={() => onApply(draft)} style={{ flex: 2 }} accessibilityLabel={copy.apply}>{copy.apply}</Button>
      </View>
    </Sheet>
  );
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={{ gap: space.sm }}>
      <Text variant="eyebrow" color={colors.textSubtle} accessibilityRole="header">{title}</Text>
      {hint ? <Text variant="caption" color={colors.textMuted}>{hint}</Text> : null}
      <ChipRow>{children}</ChipRow>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  body: { gap: space.xl, paddingBottom: space.lg },
  actions: { flexDirection: 'row', gap: space.md },
});
