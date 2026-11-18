import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { PlaceholderNotice } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { EmptyState, ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { autopay as copy } from '@/content/membership';
import { MockMandateScenarioValues } from '@/lib/contract/enums';
import { errorView } from '@/lib/errors';
import { membershipApi } from '@/lib/membership/api';
import { autopayResult, pollMembership, type AutopayOutcome } from '@/lib/membership/helpers';
import type { Membership, MockMandate, MockMandateScenario } from '@/lib/membership/types';
import { formatINR } from '@/lib/money';
import { colors, space } from '@/theme';

type Phase = 'approve' | 'checking' | AutopayOutcome;

/**
 * Autopay approval (D12, app:/membership/autopay?mandate=…&provider=…).
 * The mock gateway's test autopay exists only in development builds (__DEV__)
 * and is labelled "Test autopay — no real money"; release builds never show
 * it. Whatever the test page says, the result comes from GET /subscriptions
 * (the gateway's answer reaches the API by webhook), polled every 1.5 s for up to 20 s.
 */
export default function Autopay() {
  const router = useRouter();
  const { mandate, provider } = useLocalSearchParams<{ mandate?: string; provider?: string }>();
  const testCheckout = __DEV__ && (provider ?? 'mock') === 'mock';
  const [info, setInfo] = useState<MockMandate | null>(null);
  const [load, setLoad] = useState<{ error: string | null; offline: boolean }>({ error: null, offline: false });
  const [scenario, setScenario] = useState<MockMandateScenario>('AUTHORIZED');
  const [phase, setPhase] = useState<Phase>('approve');
  const [member, setMember] = useState<Membership | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stop = useRef({ aborted: false });
  const sending = useRef(false);

  const check = useCallback((declined = false) => {
    stop.current.aborted = true;
    const signal = { aborted: false };
    stop.current = signal;
    setPhase('checking');
    void pollMembership(membershipApi.overview, { intervalMs: 1500, timeoutMs: 20_000, declined, signal }).then((r) => {
      if (signal.aborted) return;
      setMember(r.overview?.current ?? null);
      setPhase(r.outcome);
    });
  }, []);

  const start = useCallback(() => {
    if (!mandate || !testCheckout) return;
    membershipApi.mockMandate(mandate).then(
      (m) => {
        setInfo(m);
        setLoad({ error: null, offline: false });
        // Already approved or declined (e.g. the screen was reopened): just ask the API for the result.
        if (m.status !== 'CREATED') check(m.status === 'FAILED');
      },
      (err) => {
        const v = errorView(err);
        setLoad({ error: v.offline ? null : v.message, offline: v.offline });
      },
    );
  }, [mandate, testCheckout, check]);
  useEffect(() => {
    start();
    return () => {
      stop.current.aborted = true;
    };
  }, [start]);

  const approve = async () => {
    if (!mandate || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      await membershipApi.mockAuthorize(mandate, scenario);
      check(scenario === 'DECLINED');
    } catch (err) {
      const v = errorView(err);
      if (v.code === 'MANDATE_ALREADY_ATTEMPTED') check();
      else setError(v.message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  const back = () => (router.canGoBack() ? router.back() : router.replace('/membership' as Href));
  const backButton = <Button variant="secondary" onPress={back}>{copy.back}</Button>;

  if (!mandate) {
    return (
      <Screen>
        <BackBar />
        <Title>{copy.title}</Title>
        <Alert action={backButton}>{copy.missing}</Alert>
      </Screen>
    );
  }

  if (phase === 'checking') {
    return (
      <Screen>
        <Title>{copy.title}</Title>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
            <ActivityIndicator color={colors.accent} />
            <Text weight="600" color={colors.textStrong}>{copy.checking}</Text>
          </View>
          <Text variant="small" color={colors.textMuted}>{copy.checkingBody}</Text>
        </Card>
      </Screen>
    );
  }

  if (phase === 'pending') {
    return (
      <Screen>
        <Title>{copy.title}</Title>
        <EmptyState
          icon="hourglass-outline"
          title={copy.stillTitle}
          body={copy.stillBody}
          action={
            <View style={{ gap: space.sm }}>
              <Button onPress={() => check()}>{copy.refresh}</Button>
              <Button variant="ghost" onPress={back}>{copy.back}</Button>
            </View>
          }
        />
      </Screen>
    );
  }

  if (phase !== 'approve') {
    const r = autopayResult(phase, member);
    const icon = phase === 'trial' || phase === 'active' ? 'checkmark-circle-outline' : phase === 'past_due' ? 'alert-circle-outline' : 'close-circle-outline';
    return (
      <Screen>
        <Title>{copy.title}</Title>
        <EmptyState icon={icon} title={r.title} body={r.body} action={<Button onPress={back}>{copy.back}</Button>} />
      </Screen>
    );
  }

  if (!testCheckout) {
    return (
      <Screen footer={backButton}>
        <BackBar />
        <Title>{copy.title}</Title>
        <PlaceholderNotice title={copy.notOpenTitle} body={copy.notOpenBody} />
      </Screen>
    );
  }

  if (!info) {
    return (
      <Screen>
        <BackBar />
        <Title>{copy.title}</Title>
        {load.offline ? <OfflineBanner onRetry={start} /> : load.error ? <ErrorState message={load.error} onRetry={start} /> : <SkeletonList rows={3} />}
      </Screen>
    );
  }

  const scenarios = info.scenarios.length ? info.scenarios : [...MockMandateScenarioValues];
  return (
    <Screen footer={<Button onPress={approve} loading={busy}>{copy.approve}</Button>}>
      <BackBar />
      <Title>{copy.title}</Title>
      {error ? <Alert>{error}</Alert> : null}
      <Text color={colors.text}>{copy.intro(formatINR(info.max_amount_paise))}</Text>
      <Card tone="warn">
        <Text weight="600" color={colors.warningText}>{copy.testTitle}</Text>
        <Text variant="small" color={colors.text}>{copy.testBody}</Text>
        <ChipRow>
          {scenarios.map((s) => (
            <Chip key={s} radio label={copy.scenarios[s]} selected={scenario === s} onPress={() => setScenario(s)} />
          ))}
        </ChipRow>
      </Card>
    </Screen>
  );
}
