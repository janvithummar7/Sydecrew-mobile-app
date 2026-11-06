import { useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { Card, Chip, ChipRow, LoadState, Pill, Section, StepHeader } from '@/components/companion/Bits';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert, DevHint } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError } from '@/lib/api';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import { isEditable } from '@/lib/companion/steps';
import { colors } from '@/theme';

type Side = 'FRONT' | 'BACK' | 'SELFIE';
const SIDE_LABEL: Record<Side, string> = { FRONT: 'Front of your ID', BACK: 'Back of your ID', SELFIE: 'Selfie' };
/** Development only: outcomes of the mock identity provider. */
const MOCK_SCENARIOS = ['PASS', 'FAKE_DOCUMENT', 'LIVENESS_FAIL', 'NAME_MISMATCH', 'UNDER_CATEGORY_MIN', 'ASYNC'];

/**
 * Identity check (D4): an ID document photographed in the app, then a
 * selfie. Aadhaar is accepted only through DigiLocker: no photo of an
 * Aadhaar card is ever taken or uploaded. Reached from the web by the
 * "continue on phone" QR (sydecrew://companion/identity).
 */
export default function Identity() {
  const router = useRouter();
  const { companion, options, loading, error, refresh, setCompanion, uploads } = useCompanion();
  const [busy, setBusy] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [scenario, setScenario] = useState('PASS');
  const [digilockerStarted, setDigilockerStarted] = useState(false);
  const acting = useRef(false);

  if (!companion || !options) {
    return <Screen><StepHeader title="Identity check" /><LoadState loading={loading} error={error} onRetry={refresh} /></Screen>;
  }
  if (!isEditable(companion.status)) {
    return (
      <Screen footer={<Button onPress={() => router.replace('/companion/status')}>See your application</Button>}>
        <StepHeader title="Identity check" />
        <Alert tone="info">Your documents are with our team. You can change them again after the decision.</Alert>
      </Screen>
    );
  }
  const v = companion.verification;
  const docType = v?.document_type ?? null;
  const rule = options.document_types.find((d) => d.code === docType);
  const sides = v?.required_sides ?? [];
  const pendingSides = new Set(uploads.items.filter((i) => i.kind === 'DOCUMENT').map((i) => i.side));

  const act = async <T,>(key: string, fn: () => Promise<T>) => {
    if (acting.current) return undefined;
    acting.current = true;
    setBusy(key);
    setFormError(null);
    try {
      return await fn();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'AUTO_CHECK_COOLDOWN') setFormError('You have tried several times. You can try again later; see your application status.');
      else setFormError(err instanceof ApiError ? err.message : 'Something went wrong. Check your connection and try again.');
      return undefined;
    } finally {
      acting.current = false;
      setBusy(null);
    }
  };

  const choose = (code: string) =>
    act(`type-${code}`, async () => {
      const res = await companionApi.startVerification({ document_type: code, ...(__DEV__ ? { mock_scenario: scenario } : {}) });
      setCompanion(res.companion);
    });

  const capture = (side: Side) =>
    act(`capture-${side}`, async () => {
      if (side === 'SELFIE') {
        const s = await companionApi.livenessSession();
        if (s.mode === 'SDK') {
          // A provider liveness SDK plugs in here (needs a development build); the mock uses a photo.
          setFormError('This version of the app cannot run the selfie check yet. Please update the app.');
          return;
        }
      }
      router.push({ pathname: '/companion/capture', params: { side } });
    });

  const digilocker = () =>
    act('digilocker', async () => {
      const s = await companionApi.digilockerStart();
      setDigilockerStarted(true);
      if (!s.url) return; // mock provider: no external page
      const res = await WebBrowser.openAuthSessionAsync(s.url, 'sydecrew://companion/identity');
      const code = res.type === 'success' ? new URL(res.url).searchParams.get('code') : null;
      if (code) setCompanion((await companionApi.digilockerComplete(code)).companion);
    });

  const sideState = (side: Side) =>
    pendingSides.has(side) ? 'UPLOADING' : v?.documents[side] ? 'DONE' : 'NEEDED';
  const complete = !!docType && sides.every((s) => sideState(s) === 'DONE') && (!rule?.via_digilocker || v?.digilocker_completed);

  return (
    <Screen footer={<Button onPress={() => router.push('/companion/review')} disabled={!complete}>{complete ? 'Continue' : 'Finish the identity check'}</Button>}>
      <StepHeader title="Identity check" step={4} total={5} subtitle="We check that you are a real adult and that your account is only yours. Your documents are encrypted and seen only by our verification team." />
      {formError ? <Alert>{formError}</Alert> : null}
      {uploads.failures.filter((f) => f.kind === 'DOCUMENT').map((f) => <Alert key={f.id}>{`${SIDE_LABEL[f.side ?? 'FRONT']} was not accepted: ${f.message}`}</Alert>)}
      {v?.fix_items.filter((f) => f.step === 'DOCUMENTS').map((f) => <Alert key={f.code} tone="info">{f.label}</Alert>)}

      {__DEV__ ? (
        <Section title="Test outcome (development only)">
          <ChipRow>
            {MOCK_SCENARIOS.map((s) => <Chip key={s} label={s} selected={scenario === s} onPress={() => setScenario(s)} />)}
          </ChipRow>
          <DevHint>applies when you choose the document type below</DevHint>
        </Section>
      ) : null}

      <Section title="1. Choose your document">
        <ChipRow>
          {options.document_types.map((d) => (
            <Chip key={d.code} label={d.label} selected={docType === d.code} disabled={!!busy} onPress={() => void choose(d.code)} />
          ))}
        </ChipRow>
        {busy?.startsWith('type-') ? <ActivityIndicator color={colors.fog400} /> : null}
      </Section>

      {docType ? (
        <Section title="2. Photograph it" hint={rule?.via_digilocker ? undefined : 'Place the document on a dark surface, all four corners visible, no glare.'}>
          {rule?.via_digilocker ? (
            <Card tone={v?.digilocker_completed ? 'ok' : undefined}>
              <Text variant="small" color={colors.fog100}>Share your Aadhaar from DigiLocker. We never take or keep a photo of your Aadhaar card; we keep only the last 4 digits.</Text>
              {v?.digilocker_completed ? <Pill label="Received from DigiLocker" tone="ok" /> : (
                <Button variant="secondary" onPress={digilocker} loading={busy === 'digilocker'}>Continue with DigiLocker</Button>
              )}
              {__DEV__ && digilockerStarted && !v?.digilocker_completed ? (
                <TextButton onPress={() => void act('dl-mock', async () => setCompanion((await companionApi.digilockerComplete('MOCK_OK')).companion))}>
                  Complete test DigiLocker consent (development)
                </TextButton>
              ) : null}
            </Card>
          ) : null}
          {sides.filter((s) => s !== 'SELFIE').map((s) => <SideRow key={s} side={s} state={sideState(s)} onPress={() => void capture(s)} />)}
        </Section>
      ) : null}

      {docType ? (
        <Section title="3. Take a selfie" hint="Face the camera in good light, no glasses or mask. It is compared with your ID and your profile photos.">
          <SideRow side="SELFIE" state={sideState('SELFIE')} onPress={() => void capture('SELFIE')} />
        </Section>
      ) : null}
    </Screen>
  );
}

function SideRow({ side, state, onPress }: { side: Side; state: 'DONE' | 'UPLOADING' | 'NEEDED'; onPress: () => void }) {
  return (
    <Card tone={state === 'DONE' ? 'ok' : undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Ionicons name={side === 'SELFIE' ? 'person-circle-outline' : 'card-outline'} size={24} color={state === 'DONE' ? colors.lime400 : colors.fog300} />
        <Text variant="body" color={colors.fog50} style={{ flex: 1 }}>{SIDE_LABEL[side]}</Text>
        {state === 'UPLOADING' ? <ActivityIndicator color={colors.fog400} accessibilityLabel="Uploading" /> : state === 'DONE' ? <Pill label="Received" tone="ok" /> : null}
      </View>
      <Button variant="secondary" onPress={onPress} disabled={state === 'UPLOADING'}>{state === 'NEEDED' ? 'Take photo' : 'Retake'}</Button>
    </Card>
  );
}
