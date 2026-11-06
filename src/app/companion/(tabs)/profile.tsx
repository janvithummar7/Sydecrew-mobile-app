import { limitsOf } from '@/lib/companion/types';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Chip, ChipRow, LoadState, Section, StepHeader } from '@/components/companion/Bits';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Checkbox, TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { companionProfile as extra } from '@/content/discovery';
import { ApiError } from '@/lib/api';
import { toggleIn } from '@/lib/discovery/filters';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import { isApproved } from '@/lib/companion/steps';
import type { Companion, CompanionOptions } from '@/lib/companion/types';
import { contactWarning } from '@/lib/contentWarning';
import { colors } from '@/theme';

/** PATCH /companion/profile accepts up to 20 interest_ids; used when options.limits has no max_interests. */
const MAX_INTERESTS = 20;

/** Profile basics (brief §6.2), plus interests and "show my age" (Feature 3). On an approved profile, name and intro changes wait for moderation. */
export default function ProfileBasics() {
  const { companion, options, loading, error, refresh } = useCompanion();
  if (!companion || !options) {
    return <Screen><StepHeader title="Profile" /><LoadState loading={loading} error={error} onRetry={refresh} /></Screen>;
  }
  return <ProfileForm key={companion.id} companion={companion} options={options} />;
}

function ProfileForm({ companion, options }: { companion: Companion; options: CompanionOptions }) {
  const router = useRouter();
  const { setCompanion } = useCompanion();
  const [name, setName] = useState(companion.display_name);
  const [intro, setIntro] = useState(companion.intro ?? '');
  const [languages, setLanguages] = useState<string[]>(companion.languages.map((x) => x.id));
  const [zone, setZone] = useState<{ city_id: string; zone_id: string } | null>(companion.zone_id ? { city_id: companion.city_id, zone_id: companion.zone_id } : null);
  const [radius, setRadius] = useState(String(companion.service_radius_km));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  // Interests and "show my age" (Feature 3): current values from the companion view, choices from the companion options.
  const [interests, setInterests] = useState<string[]>(companion.interests.map((i) => i.id));
  const [showAge, setShowAge] = useState(companion.show_age);

  const l = limitsOf(options);
  const maxInterests = Number(options.limits.max_interests ?? 0) || MAX_INTERESTS;
  const warning = contactWarning(intro) ?? contactWarning(name);
  const approved = isApproved(companion.status);

  const save = async () => {
    if (submitting.current) return;
    const e: Record<string, string> = {};
    const r = Number(radius);
    if (name.trim().length < 2) e.display_name = 'Use at least 2 characters.';
    if (intro.trim().length < l.intro_min_chars) e.intro = `Write at least ${l.intro_min_chars} characters.`;
    if (!languages.length) e.language_ids = 'Choose at least one language.';
    if (!zone) e.zone_id = 'Choose your area.';
    if (!(r >= l.radius_km_min && r <= l.radius_km_max) || Math.round(r * 2) !== r * 2) e.service_radius_km = `Choose ${l.radius_km_min} to ${l.radius_km_max} km.`;
    setErrors(e);
    setFormError(null);
    setSaved(false);
    if (Object.keys(e).length) return;
    submitting.current = true;
    setBusy(true);
    try {
      const res = await companionApi.updateProfile({
        display_name: name.trim(),
        intro: intro.trim(),
        language_ids: languages,
        ...zone!,
        service_radius_km: r,
        interest_ids: interests,
        show_age: showAge,
      });
      setCompanion(res.companion);
      if (approved) setSaved(true);
      else router.push('/companion/photos');
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.fields);
        if (!Object.keys(err.fields).length) setFormError(err.message);
      } else setFormError(err instanceof ApiError ? err.message : 'Could not save. Check your connection and try again.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button onPress={save} loading={busy}>{approved ? 'Save changes' : 'Save and continue'}</Button>}>
      <StepHeader title="Profile basics" step={approved ? undefined : 1} total={approved ? undefined : 5} subtitle="This is what customers see first. Keep it friendly and honest." />
      {formError ? <Alert>{formError}</Alert> : null}
      {saved ? <Alert tone="success">Saved. Name and intro changes show once our team approves them; your profile stays live meanwhile.</Alert> : null}
      {companion.pending_changes.length ? <Alert tone="info">{`Waiting for approval: ${companion.pending_changes.map((c) => c.field.toLowerCase().replace('_', ' ')).join(', ')}.`}</Alert> : null}

      <TextField label="Display name" value={name} onChangeText={setName} maxLength={l.display_name_max_chars} error={errors.display_name} hint="First name and last initial work well, e.g. Priya S." autoCapitalize="words" />
      <View style={{ gap: 6 }}>
        <TextField
          label="Intro"
          value={intro}
          onChangeText={setIntro}
          multiline
          maxLength={l.intro_max_chars}
          error={errors.intro}
          numberOfLines={6}
          textAlignVertical="top"
          placeholder="What you enjoy, the occasions you are good at, the languages you speak."
        />
        <Text variant="caption" color={intro.trim().length < l.intro_min_chars ? colors.fog400 : colors.lime300} accessibilityLiveRegion="polite">
          {`${intro.trim().length} / ${l.intro_max_chars} characters (at least ${l.intro_min_chars})`}
        </Text>
        {warning ? <Alert tone="info">{warning}</Alert> : null}
      </View>

      <Section title="Languages" hint={`Up to ${l.max_languages}.`}>
        <ChipRow>
          {options.languages.map((lang) => {
            const on = languages.includes(lang.id);
            return (
              <Chip
                key={lang.id}
                label={lang.name}
                selected={on}
                disabled={!on && languages.length >= l.max_languages}
                onPress={() => setLanguages(on ? languages.filter((x) => x !== lang.id) : [...languages, lang.id])}
              />
            );
          })}
        </ChipRow>
        {errors.language_ids ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors.language_ids}</Text> : null}
      </Section>

      <Section title="Area" hint="Pilot areas where Sydecrew is live.">
        {options.cities.map((c) => (
          <ChipRow key={c.id}>
            {c.zones.map((z) => (
              <Chip key={z.id} label={z.name} selected={zone?.zone_id === z.id} onPress={() => setZone({ city_id: c.id, zone_id: z.id })} />
            ))}
          </ChipRow>
        ))}
        {errors.zone_id ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors.zone_id}</Text> : null}
      </Section>

      <TextField
        label="How far you will travel (km)"
        value={radius}
        onChangeText={setRadius}
        keyboardType="decimal-pad"
        error={errors.service_radius_km}
        hint={`${l.radius_km_min} to ${l.radius_km_max} km, in half-km steps.`}
      />

      {options.interests.length ? (
        <Section title={extra.interests} hint={extra.interestsHint(maxInterests)}>
          <ChipRow>
            {options.interests.map((i) => {
              const on = interests.includes(i.id);
              return <Chip key={i.id} label={i.name} selected={on} disabled={!on && interests.length >= maxInterests} onPress={() => setInterests(toggleIn(interests, i.id))} />;
            })}
          </ChipRow>
          {errors.interest_ids ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors.interest_ids}</Text> : null}
        </Section>
      ) : null}
      <View style={{ gap: 4 }}>
        <Checkbox checked={showAge} onChange={setShowAge} label={extra.showAge}>{extra.showAge}</Checkbox>
        <Text variant="caption" color={colors.textMuted} style={{ paddingLeft: 32 }}>{extra.showAgeHint}</Text>
      </View>
    </Screen>
  );
}
