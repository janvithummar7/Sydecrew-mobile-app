import { useRef, useState } from 'react';
import { View, type TextInputInstance } from 'react-native';
import { useRouter } from 'expo-router';
import { ChipRow, Chip, LoadState, Section, StepHeader } from '@/components/companion/Bits';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert, DevHint } from '@/components/ui/Feedback';
import { Checkbox, TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError, authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import type { ApplyInput } from '@/lib/companion/types';
import { ageFrom, toIsoDate } from '@/lib/dates';
import { colors } from '@/theme';

type ConsentKey = keyof ApplyInput['consents'];
const CONSENTS: [ConsentKey, string][] = [
  ['terms', 'I accept the Sydecrew terms of use.'],
  ['privacy', 'I accept the privacy policy.'],
  ['community_guidelines', 'I accept the community guidelines.'],
  ['dpdp_data_processing', 'I consent to Sydecrew processing my personal data to run my account.'],
  ['companion_terms', 'I accept the companion terms: public approved venues only, payments only through Sydecrew.'],
  ['companion_conduct', 'I accept the companion code of conduct: strictly platonic, respectful company.'],
  ['kyc_biometric_processing', 'I consent to identity checks: my ID document and a selfie are checked by a verification provider and a Sydecrew reviewer.'],
];

/** Companion terms + consents. DOB and area are asked only if the account does not have them yet. */
export default function Apply() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { options, loading, error, refresh } = useCompanion();
  const [consents, setConsents] = useState<Record<ConsentKey, boolean>>(Object.fromEntries(CONSENTS.map(([k]) => [k, false])) as Record<ConsentKey, boolean>);
  const [adult, setAdult] = useState(false);
  const [dob, setDob] = useState({ d: '', m: '', y: '' });
  const [zone, setZone] = useState<{ city_id: string; zone_id: string } | null>(user?.city_id && user.zone_id ? { city_id: user.city_id, zone_id: user.zone_id } : null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState<{ sent?: boolean; devLink?: string }>({});
  const submitting = useRef(false);
  const monthRef = useRef<TextInputInstance>(null);
  const yearRef = useRef<TextInputInstance>(null);

  if (!user) return null;
  const needDob = !user.age_confirmed;
  const needZone = !user.zone_id;

  const submit = async () => {
    if (submitting.current) return;
    const e: Record<string, string> = {};
    const iso = toIsoDate(dob.d, dob.m, dob.y);
    if (needDob && (!iso || ageFrom(iso) > 120)) e.dob = 'Enter a valid date of birth.';
    else if (needDob && iso && ageFrom(iso) < 18) e.dob = 'You must be 18 or older to be a companion.';
    if (!adult) e.confirm_18_plus = 'Please confirm you are 18 or older.';
    if (!zone) e.zone_id = 'Choose the area you will work in.';
    for (const [k] of CONSENTS) if (!consents[k]) e[`consents.${k}`] = 'Required to apply.';
    setErrors(e);
    setFormError(null);
    if (Object.keys(e).length) return;
    submitting.current = true;
    setBusy(true);
    try {
      const res = await companionApi.apply({
        ...(needDob && iso ? { dob: iso } : {}),
        ...(zone ?? {}),
        confirm_18_plus: true,
        consents: consents as ApplyInput['consents'],
      });
      setUser(res.user);
      router.replace('/companion/profile');
    } catch (err) {
      if (!(err instanceof ApiError)) setFormError('Something went wrong. Please try again.');
      else if (err.status === 422) {
        setErrors(err.fields);
        if (!Object.keys(err.fields).length) setFormError(err.message);
      } else if (err.code === 'INELIGIBLE_AGE') setFormError('Sydecrew is only for adults aged 18 and over.');
      else if (err.code === 'REAPPLY_COOLDOWN') {
        const after = err.details?.reapply_after as string | undefined;
        setFormError(`You can apply again${after ? ` after ${new Date(after).toLocaleDateString('en-IN', { dateStyle: 'long' })}` : ' later'}.`);
      } else setFormError(err.message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button onPress={submit} loading={busy} disabled={!user.email_verified}>Apply</Button>}>
      <StepHeader title="Companion terms" subtitle="Read and accept the rules every Sydecrew companion follows." />
      <LoadState loading={loading && !options} error={error} onRetry={refresh} />
      {!user.email_verified ? (
        <Alert
          tone="info"
          action={
            email.sent ? <Text variant="small" color={colors.fog50}>Link sent. Open it, then come back.</Text> : (
              <TextButton
                onPress={async () => {
                  const r = await authApi.resendEmail().catch(() => null);
                  setEmail({ sent: true, devLink: r?.dev_link });
                }}
              >
                Send the link again
              </TextButton>
            )
          }
        >
          {`Verify your email (${user.email}) before you apply.`}
        </Alert>
      ) : null}
      {email.devLink ? <DevHint>{email.devLink}</DevHint> : null}
      {formError ? <Alert>{formError}</Alert> : null}

      {needDob ? (
        <Section title="Date of birth" hint="It must match your ID document.">
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextField label="Day" value={dob.d} keyboardType="number-pad" maxLength={2} placeholder="DD" onChangeText={(d) => { setDob({ ...dob, d }); if (d.length === 2) monthRef.current?.focus(); }} />
            </View>
            <View style={{ flex: 1 }}>
              <TextField ref={monthRef} label="Month" value={dob.m} keyboardType="number-pad" maxLength={2} placeholder="MM" onChangeText={(m) => { setDob({ ...dob, m }); if (m.length === 2) yearRef.current?.focus(); }} />
            </View>
            <View style={{ flex: 1.4 }}>
              <TextField ref={yearRef} label="Year" value={dob.y} keyboardType="number-pad" maxLength={4} placeholder="YYYY" onChangeText={(y) => setDob({ ...dob, y })} />
            </View>
          </View>
          {errors.dob ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors.dob}</Text> : null}
        </Section>
      ) : null}

      {needZone && options ? (
        <Section title="Your area" hint="Sydecrew is live in these areas.">
          {options.cities.map((c) => (
            <View key={c.id} style={{ gap: 8 }}>
              <Text variant="small" color={colors.fog300}>{c.name}</Text>
              <ChipRow>
                {c.zones.map((z) => (
                  <Chip key={z.id} label={z.name} selected={zone?.zone_id === z.id} onPress={() => setZone({ city_id: c.id, zone_id: z.id })} />
                ))}
              </ChipRow>
            </View>
          ))}
          {errors.zone_id ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{errors.zone_id}</Text> : null}
        </Section>
      ) : null}

      <Section title="Agreements">
        <Checkbox checked={adult} onChange={setAdult} error={errors.confirm_18_plus}>I am 18 or older.</Checkbox>
        {CONSENTS.map(([k, label]) => (
          <Checkbox key={k} checked={consents[k]} onChange={(v) => setConsents({ ...consents, [k]: v })} error={errors[`consents.${k}`]}>
            {label}
          </Checkbox>
        ))}
      </Section>
    </Screen>
  );
}
