import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View, type TextInputInstance } from 'react-native';
import { BackBar } from '@/components/account/BackBar';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Checkbox, TextField } from '@/components/ui/Field';
import { Chip, OptionCard } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { ApiError, authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { ageFrom, toIsoDate } from '@/lib/dates';
import type { OnboardingInput, OnboardingOptions } from '@/lib/types';

import { colors, radius, alpha } from '@/theme';

/** Form state: the same fields as the request, before the required boxes are ticked. */
type OnboardingForm = Omit<OnboardingInput, 'dob' | 'confirm_18_plus' | 'consents'> & { confirm_18_plus: boolean; consents: Record<keyof OnboardingInput['consents'], boolean> };

const STEPS = ['About you', 'Your area', 'Interests', 'Agreements'] as const;
const RULES = [
  'Strictly platonic company. Anything sexual ends the account.',
  'Meet only at approved public venues. No homes or hotel rooms.',
  'Pay only inside Sydecrew. Never pay anyone by QR or bank transfer.',
  'Calls and chat stay inside Sydecrew. Numbers are never shared.',
];

type Errors = Record<string, string | undefined>;

const shortName = (full: string) => {
  const parts = full.trim().split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined;
  return last ? `${parts[0]} ${last[0]?.toUpperCase()}.` : (parts[0] ?? '');
};

/** D5 after mobile verification: 18+ and DOB → area → interests and privacy → consents. */
export default function Onboarding() {
  const { user, setUser, signOut } = useAuth();
  const [options, setOptions] = useState<OnboardingOptions | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [dob, setDob] = useState({ d: '', m: '', y: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ineligible, setIneligible] = useState(false);
  const [form, setForm] = useState<OnboardingForm>({
    confirm_18_plus: false,
    city_id: '',
    zone_id: '',
    interest_ids: [],
    privacy: { hide_last_name: true },
    consents: { terms: false, privacy: false, community_guidelines: false, dpdp_data_processing: false, marketing: false },
  });
  const monthRef = useRef<TextInputInstance>(null);
  const yearRef = useRef<TextInputInstance>(null);

  const load = () => {
    authApi
      .onboardingOptions()
      .then((o) => {
        setOptions(o);
        const only = o.cities.length === 1 ? o.cities[0] : undefined;
        if (only) setForm((f) => ({ ...f, city_id: f.city_id || only.id }));
      })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load the form.'));
  };
  useEffect(load, []);

  // Android back goes to the previous step (on the first step it leaves, as usual).
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 0) return false;
      setStep(step - 1);
      return true;
    });
    return () => sub.remove();
  }, [step]);

  const patch = (p: Partial<typeof form>) => {
    setForm((f) => ({ ...f, ...p }));
    setErrors({});
    setFormError(null);
  };
  const consent = (key: keyof OnboardingInput['consents']) => (v: boolean) => patch({ consents: { ...form.consents, [key]: v } });

  const city = options?.cities.find((c) => c.id === form.city_id);
  const isoDob = toIsoDate(dob.d, dob.m, dob.y);

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (!isoDob || ageFrom(isoDob) > 120) e.dob = 'Enter a valid date of birth.';
      else if (options && ageFrom(isoDob) < options.min_age) e.dob = `You must be ${options.min_age} or older to use Sydecrew.`;
      if (!form.confirm_18_plus) e.confirm_18_plus = 'Please confirm you are 18 or older.';
    }
    if (s === 1 && !form.zone_id) e.zone_id = 'Choose the area you are in most often.';
    if (s === 3) {
      if (!form.consents.terms) e['consents.terms'] = 'Please accept the terms of use.';
      if (!form.consents.privacy) e['consents.privacy'] = 'Please accept the privacy policy.';
      if (!form.consents.community_guidelines) e['consents.community_guidelines'] = 'Please accept the community guidelines.';
      if (!form.consents.dpdp_data_processing) e['consents.dpdp_data_processing'] = 'Please consent to data processing.';
    }
    return e;
  };

  const next = async () => {
    const found = validate(step);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setBusy(true);
    try {
      // The API makes the final age check and blocks the account if under 18 (D5).
      // The checks above make every required consent true; the API type requires the literal.
      const { user: updated } = await authApi.completeOnboarding({ ...form, dob: isoDob! } as OnboardingInput);
      setUser(updated); // the route guard now moves to /home
    } catch (err) {
      if (err instanceof ApiError && err.code === 'INELIGIBLE_AGE') setIneligible(true);
      else if (err instanceof ApiError && err.status === 422) {
        setErrors(err.fields);
        const keys = Object.keys(err.fields);
        const shown = ['dob', 'confirm_18_plus', 'zone_id', 'consents.terms', 'consents.privacy', 'consents.community_guidelines', 'consents.dpdp_data_processing'];
        const unshown = keys.filter((k) => !shown.includes(k)).map((k) => err.fields[k]);
        if (unshown.length || keys.length === 0) setFormError(unshown[0] ?? err.message);
        setStep(keys.some((k) => k === 'dob' || k === 'confirm_18_plus') ? 0 : keys.some((k) => k === 'zone_id' || k === 'city_id') ? 1 : step);
      } else setFormError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (ineligible) {
    return (
      <Screen footer={<Button onPress={signOut}>Close</Button>}>
        <Title>Sydecrew is for adults only</Title>
        <Text color={colors.fog300}>
          You must be 18 or older to use Sydecrew, so we can&apos;t complete your registration. If you entered your date of birth by
          mistake, contact support.
        </Text>
      </Screen>
    );
  }

  if (!options) {
    return (
      <Screen>
        {loadError ? (
          <Alert action={<TextButton onPress={() => { setLoadError(null); load(); }}>Try again</TextButton>}>{loadError}</Alert>
        ) : (
          <ActivityIndicator color={colors.fog400} style={{ marginTop: 48 }} accessibilityLabel="Loading" />
        )}
      </Screen>
    );
  }

  const last = step === STEPS.length - 1;
  return (
    <Screen
      header={
        <View style={styles.progressWrap}>
          <View style={styles.headerRow}>
            {step > 0 ? <BackBar onPress={() => setStep(step - 1)} /> : <TextButton onPress={signOut} color={colors.fog400}>Log out</TextButton>}
            <Text variant="eyebrow" color={colors.fog500}>Step {step + 1} of {STEPS.length}</Text>
          </View>
          <View style={styles.progress} accessible accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: STEPS.length, now: step + 1 }} accessibilityLabel={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
            {STEPS.map((s, i) => (
              <View key={s} style={[styles.bar, i <= step && styles.barOn]} />
            ))}
          </View>
        </View>
      }
      footer={
        <View style={{ gap: 12 }}>
          {formError ? <Alert>{formError}</Alert> : null}
          <Button onPress={next} loading={busy}>
            {last ? 'Finish' : step === 2 && form.interest_ids.length === 0 ? 'Skip' : 'Continue'}
          </Button>
        </View>
      }
    >
      {step === 0 ? (
        <>
          <Heading title={`Welcome, ${user?.full_name.split(' ')[0] ?? ''}`}>A few details to set up your account. This takes about a minute.</Heading>
          <View style={{ gap: 8 }}>
            <Text variant="small" weight="600" color={colors.fog100}>Date of birth</Text>
            <View style={styles.dobRow}>
              <View style={{ flex: 1 }}>
                <TextField label="Day" placeholder="DD" value={dob.d} maxLength={2} keyboardType="number-pad"
                  onChangeText={(v) => { setDob((x) => ({ ...x, d: v.replace(/\D/g, '') })); setErrors({}); if (v.length === 2) monthRef.current?.focus(); }} />
              </View>
              <View style={{ flex: 1 }}>
                <TextField ref={monthRef} label="Month" placeholder="MM" value={dob.m} maxLength={2} keyboardType="number-pad"
                  onChangeText={(v) => { setDob((x) => ({ ...x, m: v.replace(/\D/g, '') })); setErrors({}); if (v.length === 2) yearRef.current?.focus(); }} />
              </View>
              <View style={{ flex: 1.4 }}>
                <TextField ref={yearRef} label="Year" placeholder="YYYY" value={dob.y} maxLength={4} keyboardType="number-pad"
                  onChangeText={(v) => { setDob((x) => ({ ...x, y: v.replace(/\D/g, '') })); setErrors({}); }} />
              </View>
            </View>
            <Text variant="caption" color={errors.dob ? colors.red300 : colors.fog400} accessibilityLiveRegion="polite">
              {errors.dob ?? 'Used only to confirm you are an adult. It is never shown on your profile.'}
            </Text>
          </View>
          <Checkbox checked={form.confirm_18_plus} onChange={(v) => patch({ confirm_18_plus: v })} error={errors.confirm_18_plus}>
            I confirm I am 18 or older. Some bookings, such as Plus-One, also need an ID check before the first booking.
          </Checkbox>
        </>
      ) : null}

      {step === 1 ? (
        <>
          <Heading title="Where are you based?">We pilot in selected areas so every meeting has nearby approved venues and fast support.</Heading>
          {options.cities.length > 1 ? (
            <View style={styles.wrapRow} accessibilityRole="radiogroup">
              {options.cities.map((c) => (
                <Chip key={c.id} label={c.name} selected={form.city_id === c.id} radio onPress={() => patch({ city_id: c.id, zone_id: '' })} />
              ))}
            </View>
          ) : (
            <Text color={colors.fog100}>City: <Text weight="600" color={colors.fog50}>{city?.name ?? '—'}</Text></Text>
          )}
          <View style={{ gap: 10 }} accessibilityRole="radiogroup" accessibilityLabel="Area you are in most often">
            <Text variant="small" weight="600" color={colors.fog100}>Area you are in most often</Text>
            {city?.zones.map((z) => {
              const soon = z.status === 'COMING_SOON';
              const selected = form.zone_id === z.id;
              return (
                <OptionCard
                  key={z.id}
                  title={z.name}
                  detail={soon ? 'Coming next' : 'Live now'}
                  selected={selected}
                  disabled={soon}
                  onPress={() => patch({ zone_id: z.id })}
                  accessibilityLabel={`${z.name}, ${soon ? 'coming next' : 'live now'}`}
                />
              );
            })}
            {errors.zone_id ? (
              <Text variant="caption" color={colors.red300} accessibilityRole="alert" accessibilityLiveRegion="polite">
                {errors.zone_id}
              </Text>
            ) : null}
          </View>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Heading title="What do you enjoy?">
            Optional. We use these to suggest companions with shared interests. Choose up to {options.max_interests}.
          </Heading>
          <View style={styles.wrapRow}>
            {options.interests.map((i) => {
              const on = form.interest_ids.includes(i.id);
              const full = !on && form.interest_ids.length >= options.max_interests;
              return (
                <Chip
                  key={i.id}
                  label={i.name}
                  selected={on}
                  disabled={full}
                  onPress={() => patch({ interest_ids: on ? form.interest_ids.filter((x) => x !== i.id) : [...form.interest_ids, i.id] })}
                />
              );
            })}
          </View>
          <View style={styles.panel}>
            <Text variant="heading" color={colors.fog50}>Privacy</Text>
            <Checkbox checked={form.privacy.hide_last_name} onChange={(v) => patch({ privacy: { hide_last_name: v } })}>
              <Text variant="small" color={colors.fog100}>
                Show companions only my first name and last initial
                {user ? <Text variant="small" color={colors.fog400}> (for example, “{shortName(user.full_name)}”)</Text> : null}
              </Text>
            </Checkbox>
          </View>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <Heading title="Our community rules">Every booking on Sydecrew follows these, for your safety and your companion&apos;s.</Heading>
          <View style={[styles.panel, { gap: 10 }]}>
            {RULES.map((r) => (
              <View key={r} style={{ flexDirection: 'row', gap: 10 }}>
                <View style={styles.dot} />
                <Text variant="small" color={colors.fog100} style={{ flex: 1 }}>{r}</Text>
              </View>
            ))}
          </View>
          <View style={{ gap: 12 }}>
            <Checkbox checked={form.consents.terms} onChange={consent('terms')} error={errors['consents.terms']}>I accept the terms of use.</Checkbox>
            <Checkbox checked={form.consents.privacy} onChange={consent('privacy')} error={errors['consents.privacy']}>I accept the privacy policy.</Checkbox>
            <Checkbox checked={form.consents.community_guidelines} onChange={consent('community_guidelines')} error={errors['consents.community_guidelines']}>
              I agree to the community guidelines above.
            </Checkbox>
            <Checkbox checked={form.consents.dpdp_data_processing} onChange={consent('dpdp_data_processing')} error={errors['consents.dpdp_data_processing']}>
              I consent to Sydecrew processing my personal data to run my account, bookings and safety features, under India&apos;s Digital
              Personal Data Protection Act.
            </Checkbox>
            <Checkbox checked={form.consents.marketing} onChange={consent('marketing')}>Send me occasional offers and news. (Optional)</Checkbox>
          </View>
          {/* PLACEHOLDER: link the published documents once legal has approved them. */}
          <Text variant="caption" color={colors.fog500}>
            Document versions: terms {options.legal.terms_version ?? '—'}, privacy {options.legal.privacy_version ?? '—'}, guidelines{' '}
            {options.legal.guidelines_version ?? '—'}.
          </Text>
        </>
      ) : null}
    </Screen>
  );
}

function Heading({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Title>{title}</Title>
      <Text color={colors.fog300}>{children}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  progressWrap: { paddingHorizontal: 24, paddingTop: 8, gap: 12, width: '100%', maxWidth: 528, alignSelf: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 28 },
  progress: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  barOn: { backgroundColor: colors.lime400 },
  dobRow: { flexDirection: 'row', gap: 10 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  zone: {
    gap: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  zoneOn: { borderColor: alpha(colors.lime400, 0.7), backgroundColor: alpha(colors.lime400, 0.07) },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.lime400, borderColor: colors.lime400 },
  panel: { gap: 12, padding: 18, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime400, marginTop: 8 },
});
