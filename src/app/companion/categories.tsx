import { limitsOf } from '@/lib/companion/types';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Chip, ChipRow, LoadState, Pill, Section, StepHeader } from '@/components/companion/Bits';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError } from '@/lib/api';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import { isApproved } from '@/lib/companion/steps';
import type { Companion, CompanionOptions } from '@/lib/companion/types';
import { contactWarning } from '@/lib/contentWarning';
import { colors } from '@/theme';

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

/** Categories -> activities -> boundaries (D3). Platform boundaries are always on. */
export default function Categories() {
  const { companion, options, loading, error, refresh } = useCompanion();
  if (!companion || !options) {
    return <Screen><StepHeader title="Categories" /><LoadState loading={loading} error={error} onRetry={refresh} /></Screen>;
  }
  return <CategoriesForm key={companion.id} companion={companion} options={options} />;
}

function CategoriesForm({ companion, options }: { companion: Companion; options: CompanionOptions }) {
  const router = useRouter();
  const { setCompanion } = useCompanion();
  const [cats, setCats] = useState<string[]>(companion.categories.filter((c) => c.status === 'PENDING' || c.status === 'APPROVED').map((c) => c.category_id));
  const [acts, setActs] = useState<string[]>(companion.activities.map((a) => a.activity_id));
  const [bounds, setBounds] = useState<string[]>(companion.boundaries.filter((b) => b.boundary_option_id && !b.mandatory).map((b) => b.boundary_option_id!));
  const [custom, setCustom] = useState<string[]>(companion.boundaries.filter((b) => b.custom).map((b) => b.text));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const submitting = useRef(false);

  const approved = isApproved(companion.status);
  const ineligible = new Set(companion.categories.filter((c) => c.status === 'INELIGIBLE').map((c) => c.category_id));
  const chosen = options.categories.filter((c) => cats.includes(c.id));
  const boundaryOptions = options.boundary_options.filter((b) => !b.mandatory && (!b.category_id || cats.includes(b.category_id)));
  const mandatory = options.boundary_options.filter((b) => b.mandatory);
  const customWarning = custom.map(contactWarning).find(Boolean);

  const save = async () => {
    if (submitting.current) return;
    const e: Record<string, string> = {};
    const validActs = acts.filter((a) => chosen.some((c) => c.activities.some((x) => x.id === a)));
    if (!cats.length) e.category_ids = 'Choose at least one category.';
    if (!validActs.length) e.activity_ids = 'Choose at least one activity.';
    setErrors(e);
    setFormError(null);
    setSaved(false);
    if (Object.keys(e).length) return;
    submitting.current = true;
    setBusy(true);
    try {
      await companionApi.setCategories(cats);
      await companionApi.setActivities(validActs);
      const res = await companionApi.setBoundaries(bounds.filter((b) => boundaryOptions.some((o) => o.id === b)), custom.map((c) => c.trim()).filter(Boolean));
      setCompanion(res.companion);
      if (approved) setSaved(true);
      else router.push('/companion/identity');
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.fields);
        setFormError(err.message);
      } else setFormError(err instanceof ApiError ? err.message : 'Could not save. Check your connection.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button onPress={save} loading={busy}>{approved ? 'Save changes' : 'Save and continue'}</Button>}>
      <StepHeader title="What you offer" step={approved ? undefined : 3} total={approved ? undefined : 5} subtitle="Choose categories, then the activities you are happy to do, then your boundaries." />
      {formError ? <Alert>{formError}</Alert> : null}
      {saved ? <Alert tone="success">Saved. New categories and boundaries show once our team approves them.</Alert> : null}

      <Section title="Categories">
        <View style={{ gap: 10 }}>
          {options.categories.map((c) => {
            const on = cats.includes(c.id);
            const blocked = ineligible.has(c.id);
            return (
              <Card key={c.id} tone={on ? 'ok' : undefined}>
                <Chip label={c.name} selected={on} disabled={blocked} note={c.min_age > 18 ? `${c.min_age}+` : undefined} onPress={() => setCats(toggle(cats, c.id))} />
                {c.tagline ? <Text variant="small" color={colors.fog300}>{c.tagline}</Text> : null}
                {c.min_age > 18 ? <Text variant="caption" color={colors.lavender300}>{`${c.name} companions must be ${c.min_age} or older; your ID is checked.`}</Text> : null}
                {blocked ? <Pill label={`Not available: below ${c.min_age}`} tone="warn" /> : null}
              </Card>
            );
          })}
        </View>
        {errors.category_ids ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors.category_ids}</Text> : null}
      </Section>

      {chosen.length ? (
        <Section title="Activities" hint={`Up to ${limitsOf(options).max_activities}.`}>
          {chosen.map((c) => (
            <View key={c.id} style={{ gap: 8 }}>
              <Text variant="small" color={colors.fog300}>{c.name}</Text>
              <ChipRow>
                {c.activities.map((a) => (
                  <Chip key={a.id} label={a.name} selected={acts.includes(a.id)} onPress={() => setActs(toggle(acts, a.id))} />
                ))}
              </ChipRow>
            </View>
          ))}
          {errors.activity_ids ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors.activity_ids}</Text> : null}
        </Section>
      ) : null}

      <Section title="Boundaries" hint="Every Sydecrew companion follows these:">
        {mandatory.map((b) => <Text key={b.id} variant="small" color={colors.fog100}>{`• ${b.text}`}</Text>)}
        <Text variant="small" color={colors.fog400}>Add any of these:</Text>
        <ChipRow>
          {boundaryOptions.map((b) => (
            <Chip key={b.id} label={b.text} selected={bounds.includes(b.id)} onPress={() => setBounds(toggle(bounds, b.id))} />
          ))}
        </ChipRow>
        {custom.map((text, i) => (
          <TextField
            key={i}
            label={`Your boundary ${i + 1}`}
            value={text}
            maxLength={limitsOf(options).boundary_text_max_chars}
            error={errors[`custom.${i}`]}
            onChangeText={(v) => setCustom(custom.map((c, j) => (j === i ? v : c)))}
            trailing={<TextButton onPress={() => setCustom(custom.filter((_, j) => j !== i))}>Remove</TextButton>}
          />
        ))}
        {customWarning ? <Alert tone="info">{customWarning}</Alert> : null}
        {custom.length < 3 ? <TextButton onPress={() => setCustom([...custom, ''])}>Add your own boundary</TextButton> : null}
      </Section>
    </Screen>
  );
}
