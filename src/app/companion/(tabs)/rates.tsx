import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Pill, StepHeader } from '@/components/companion/Bits';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Checkbox, TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError } from '@/lib/api';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import type { Rate } from '@/lib/companion/types';
import { formatPaise, paiseToInput, parseRupees } from '@/lib/money';
import { rates as ratesCopy } from '@/content/companion';
import { colors } from '@/theme';

type Group = { category_id: string; category: string; approved: boolean; band: Rate['band']; activities: string[]; rate: number | null; outOfBand: boolean; instant: boolean };

/** Hourly rate per category, inside the admin price band (shown inline). Typed in rupees, sent as paise. */
export default function Rates() {
  const router = useRouter();
  const { refresh } = useCompanion();
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [instant, setInstant] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const submitting = useRef(false);

  const apply = (rates: Rate[]) => {
    const map = new Map<string, Group>();
    for (const r of rates) {
      const g = map.get(r.category_id) ?? { category_id: r.category_id, category: r.category, approved: r.category_status === 'APPROVED', band: r.band, activities: [], rate: null, outOfBand: false, instant: true };
      g.instant &&= r.booking_mode === 'INSTANT';
      g.activities.push(r.activity);
      if (r.rate_set && r.hourly_rate_paise !== null) g.rate = r.hourly_rate_paise;
      g.outOfBand ||= r.out_of_band;
      map.set(r.category_id, g);
    }
    const list = [...map.values()];
    setGroups(list);
    setValues(Object.fromEntries(list.map((g) => [g.category_id, paiseToInput(g.rate)])));
    setInstant(Object.fromEntries(list.map((g) => [g.category_id, g.instant])));
  };
  const fetchRates = () =>
    companionApi.rates().then((r) => apply(r.rates)).catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load your rates.'));
  const load = () => {
    setLoadError(null);
    void fetchRates();
  };
  useEffect(() => {
    void fetchRates();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!groups) {
    return (
      <Screen>
        <StepHeader title="Your rates" />
        {loadError ? <Alert action={<TextButton onPress={load}>Try again</TextButton>}>{loadError}</Alert> : <ActivityIndicator color={colors.fog400} />}
      </Screen>
    );
  }

  const save = async () => {
    if (submitting.current) return;
    const e: Record<string, string> = {};
    const rates: { category_id: string; hourly_rate_paise: number; booking_mode: 'INSTANT' | 'REQUEST' }[] = [];
    for (const g of groups.filter((x) => x.approved)) {
      const raw = values[g.category_id] ?? '';
      if (!raw.trim()) continue;
      const p = parseRupees(raw);
      if (p === null) e[g.category_id] = 'Enter an amount in rupees, e.g. 800 or 850.50.';
      else if (p < g.band.min_paise || p > g.band.max_paise) e[g.category_id] = `Choose between ${formatPaise(g.band.min_paise)} and ${formatPaise(g.band.max_paise)}.`;
      else rates.push({ category_id: g.category_id, hourly_rate_paise: p, booking_mode: instant[g.category_id] ? 'INSTANT' : 'REQUEST' });
    }
    setErrors(e);
    setFormError(null);
    setSaved(false);
    if (Object.keys(e).length) return;
    if (!rates.length) {
      setFormError('Set a rate for at least one category.');
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      apply((await companionApi.putRates(rates)).rates);
      await refresh();
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'RATE_OUT_OF_BAND') {
        const d = err.details as { min_paise?: number; max_paise?: number; category?: { id: string; name: string } } | undefined;
        if (d?.category) setErrors({ [d.category.id]: `Choose between ${formatPaise(d.min_paise)} and ${formatPaise(d.max_paise)}.` });
        setFormError(err.message);
        load(); // the band may have just changed
      } else setFormError(err instanceof ApiError ? err.message : 'Could not save. Check your connection.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button onPress={save} loading={busy}>Save rates</Button>}>
      <StepHeader title="Your hourly rates" subtitle="Customers see your rate per hour. Sydecrew's commission is taken from it; payouts are weekly." />
      {formError ? <Alert>{formError}</Alert> : null}
      {saved ? <Alert tone="success" action={<TextButton onPress={() => router.push('/companion/go-live')}>Next: go live</TextButton>}>Saved.</Alert> : null}
      {groups.map((g) => (
        <Card key={g.category_id} tone={g.outOfBand ? 'warn' : undefined}>
          <Text variant="heading" color={colors.fog50}>{g.category}</Text>
          <Text variant="caption" color={colors.fog400}>{g.activities.join(' · ')}</Text>
          {!g.approved ? <Pill label="Waiting for approval" tone="info" /> : null}
          {g.outOfBand ? <Pill label="Paused: the allowed range changed" tone="warn" /> : null}
          <TextField
            label="Rate per hour (₹)"
            prefix="₹"
            value={values[g.category_id] ?? ''}
            onChangeText={(v) => setValues({ ...values, [g.category_id]: v })}
            keyboardType="decimal-pad"
            editable={g.approved}
            error={errors[g.category_id]}
            hint={`Allowed: ${formatPaise(g.band.min_paise)} to ${formatPaise(g.band.max_paise)} an hour.`}
          />
          {g.approved ? (
            <Checkbox checked={!!instant[g.category_id]} onChange={(v) => setInstant({ ...instant, [g.category_id]: v })} label={ratesCopy.instant}>
              <Text variant="small" color={colors.fog100}>{ratesCopy.instant}</Text>
              <Text variant="caption" color={colors.fog400}>{ratesCopy.instantHint}</Text>
            </Checkbox>
          ) : null}
        </Card>
      ))}
    </Screen>
  );
}
