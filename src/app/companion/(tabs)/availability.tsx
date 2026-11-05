import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Chip, ChipRow, Section, StepHeader } from '@/components/companion/Bits';
import { Button, IconButton, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError } from '@/lib/api';
import { DAYS, normaliseTime, slotErrors, todayIst, type Slot } from '@/lib/companion/availability';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import type { Availability } from '@/lib/companion/types';
import { colors } from '@/theme';

type Settings = Availability['settings'];
const SETTING_FIELDS: [keyof Settings, string, string][] = [
  ['buffer_minutes', 'Break between bookings (minutes)', '0 to 120, in 15-minute steps.'],
  ['min_notice_hours', 'Minimum notice (hours)', 'How soon before a meeting someone can book you.'],
  ['max_advance_days', 'Book up to (days ahead)', '1 to 90 days.'],
  ['min_duration_minutes', 'Shortest booking (minutes)', ''],
  ['max_duration_minutes', 'Longest booking (minutes)', ''],
];

/** Availability (D3): weekly slots in IST, date exceptions, buffer and booking limits. */
export default function Setup() {
  const router = useRouter();
  const { refresh } = useCompanion();
  const [data, setData] = useState<Availability | null>(null);
  const [rules, setRules] = useState<Slot[]>([]);
  const [settings, setSettings] = useState<Record<keyof Settings, string> | null>(null);
  const [exc, setExc] = useState({ date: '', type: 'BLOCKED' as 'BLOCKED' | 'EXTRA', start: '', end: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const acting = useRef(false);

  const apply = (a: Availability) => {
    setData(a);
    setRules(a.rules.map(({ day_of_week, start_time, end_time }) => ({ day_of_week, start_time, end_time })));
    setSettings(Object.fromEntries(Object.entries(a.settings).map(([k, v]) => [k, String(v)])) as Record<keyof Settings, string>);
  };
  const fetchAvailability = () =>
    companionApi.availability().then(apply).catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load your availability.'));
  const load = () => {
    setLoadError(null);
    void fetchAvailability();
  };
  useEffect(() => {
    void fetchAvailability();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || !settings) {
    return (
      <Screen>
        <StepHeader title="Availability" />
        {loadError ? <Alert action={<TextButton onPress={load}>Try again</TextButton>}>{loadError}</Alert> : <ActivityIndicator color={colors.fog400} />}
      </Screen>
    );
  }

  const act = async (key: string, fn: () => Promise<void>) => {
    if (acting.current) return;
    acting.current = true;
    setBusy(key);
    setFormError(null);
    setSaved(false);
    try {
      await fn();
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.fields);
        setFormError(err.message);
      } else setFormError(err instanceof ApiError ? err.message : 'Could not save. Check your connection.');
    } finally {
      acting.current = false;
      setBusy(null);
    }
  };

  const save = () => {
    const normal = rules.map((r) => ({ ...r, start_time: normaliseTime(r.start_time), end_time: normaliseTime(r.end_time) }));
    const slotErr = slotErrors(normal);
    const e: Record<string, string> = Object.fromEntries(Object.entries(slotErr).map(([i, m]) => [`rules.${i}`, m]));
    const nums = Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, Number(v)])) as Settings;
    for (const [k] of SETTING_FIELDS) if (!Number.isInteger(nums[k])) e[`settings.${k}`] = 'Enter a whole number.';
    setErrors(e);
    if (Object.keys(e).length) return;
    void act('save', async () => {
      apply(await companionApi.putAvailability({ rules: normal, settings: nums }));
      await refresh();
      setSaved(true);
    });
  };

  const addException = () => {
    const e: Record<string, string> = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(exc.date) || exc.date < todayIst()) e.exception_date = 'Enter a date from today, as YYYY-MM-DD.';
    if (exc.type === 'EXTRA' && (!exc.start || !exc.end)) e.exception_time = 'An extra slot needs a start and end time.';
    setErrors(e);
    if (Object.keys(e).length) return;
    void act('exc', async () => {
      apply(await companionApi.addException({ date: exc.date, type: exc.type, ...(exc.start ? { start_time: normaliseTime(exc.start), end_time: normaliseTime(exc.end) } : {}) }));
      setExc({ date: '', type: 'BLOCKED', start: '', end: '' });
      await refresh();
    });
  };

  const setRule = (i: number, patch: Partial<Slot>) => setRules(rules.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  return (
    <Screen footer={<Button onPress={save} loading={busy === 'save'}>Save availability</Button>}>
      <StepHeader title="When you are available" subtitle="Weekly hours in India time (IST). Customers can book only inside these slots, at public approved venues." />
      {formError ? <Alert>{formError}</Alert> : null}
      {saved ? <Alert tone="success" action={<TextButton onPress={() => router.push('/companion/rates')}>Next: your rates</TextButton>}>Saved.</Alert> : null}

      {DAYS.map((day, d) => {
        const mine = rules.map((r, i) => ({ r, i })).filter((x) => x.r.day_of_week === d);
        return (
          <Section key={day} title={day}>
            {mine.map(({ r, i }) => (
              <View key={i} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
                  <View style={{ flex: 1 }}>
                    <TextField label="From" value={r.start_time} onChangeText={(t) => setRule(i, { start_time: t })} placeholder="10:00" keyboardType="numbers-and-punctuation" maxLength={5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField label="To" value={r.end_time} onChangeText={(t) => setRule(i, { end_time: t })} placeholder="14:00" keyboardType="numbers-and-punctuation" maxLength={5} />
                  </View>
                  <IconButton icon="trash-outline" label={`Remove ${day} slot`} onPress={() => setRules(rules.filter((_, j) => j !== i))} />
                </View>
                {errors[`rules.${i}`] ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors[`rules.${i}`]}</Text> : null}
              </View>
            ))}
            <TextButton onPress={() => setRules([...rules, { day_of_week: d, start_time: '10:00', end_time: '14:00' }])}>{`Add a ${day} slot`}</TextButton>
          </Section>
        );
      })}

      <Section title="Booking settings">
        {SETTING_FIELDS.map(([k, label, hint]) => (
          <TextField key={k} label={label} hint={hint || undefined} value={settings[k]} keyboardType="number-pad" error={errors[`settings.${k}`]} onChangeText={(v) => setSettings({ ...settings, [k]: v.replace(/\D/g, '') })} />
        ))}
      </Section>

      <Section title="Days off and extra slots" hint="Block a date (whole day or some hours), or add hours outside your weekly slots.">
        {data.exceptions.map((x) => (
          <Card key={x.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ flex: 1 }} color={colors.fog50}>{`${x.date} · ${x.type === 'BLOCKED' ? 'Not available' : 'Extra slot'}${x.start_time ? ` ${x.start_time}–${x.end_time}` : ' (all day)'}`}</Text>
              <TextButton onPress={() => void act(`del-${x.id}`, async () => apply(await companionApi.deleteException(x.id)))}>Remove</TextButton>
            </View>
          </Card>
        ))}
        <ChipRow>
          <Chip label="Not available" selected={exc.type === 'BLOCKED'} onPress={() => setExc({ ...exc, type: 'BLOCKED' })} />
          <Chip label="Extra slot" selected={exc.type === 'EXTRA'} onPress={() => setExc({ ...exc, type: 'EXTRA' })} />
        </ChipRow>
        <TextField label="Date" value={exc.date} onChangeText={(date) => setExc({ ...exc, date })} placeholder="YYYY-MM-DD" maxLength={10} keyboardType="numbers-and-punctuation" error={errors.exception_date} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><TextField label="From (optional)" value={exc.start} onChangeText={(start) => setExc({ ...exc, start })} placeholder="HH:MM" maxLength={5} /></View>
          <View style={{ flex: 1 }}><TextField label="To (optional)" value={exc.end} onChangeText={(end) => setExc({ ...exc, end })} placeholder="HH:MM" maxLength={5} /></View>
        </View>
        {errors.exception_time ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors.exception_time}</Text> : null}
        <Button variant="secondary" onPress={addException} loading={busy === 'exc'}>Add</Button>
      </Section>
    </Screen>
  );
}
