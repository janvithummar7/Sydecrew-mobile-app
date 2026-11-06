import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { PlaceholderNotice, PriceTag, SafetyCallout } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { pay as copy, result as resultCopy, review as reviewCopy } from '@/content/bookings';
import { bookingsApi } from '@/lib/bookings/api';
import type { MockScenario, PaymentStart } from '@/lib/bookings/types';
import { MockPaymentScenarioValues } from '@/lib/contract/enums';
import { errorView } from '@/lib/errors';
import { formatINR } from '@/lib/money';
import { formatDateTimeIST } from '@/lib/time';
import { colors } from '@/theme';

/**
 * Payment (artboard "Review and pay", the pay step). POST /bookings/:id/pay
 * opens (or resumes) the gateway order for this attempt. The mock gateway's
 * test checkout exists only in development builds (__DEV__) and is labelled
 * "Test payment — no real money"; release builds never show it. Whatever the
 * checkout says, the result screen asks the API.
 */
export default function Pay() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<PaymentStart | null>(null);
  const [state, setState] = useState<{ error: string | null; offline: boolean; closed: boolean }>({ error: null, offline: false, closed: false });
  const [scenario, setScenario] = useState<MockScenario>('SUCCESS');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paying = useRef(false);

  const start = useCallback(() => {
    if (!id) return;
    bookingsApi.pay(id).then(
      (o) => {
        setOrder(o);
        setState({ error: null, offline: false, closed: false });
      },
      (err) => {
        const v = errorView(err);
        const closed = v.code === 'PAYMENT_WINDOW_CLOSED' || v.code === 'NOT_PAYABLE';
        if (v.code === 'PAYMENT_IN_PROGRESS') router.replace({ pathname: '/booking/[id]/result', params: { id } });
        setState({ error: v.offline || closed ? null : v.message, offline: v.offline, closed });
      },
    );
  }, [id, router]);
  useEffect(start, [start]);

  const testPay = async () => {
    if (!order || !id || paying.current) return;
    paying.current = true;
    setBusy(true);
    setError(null);
    try {
      await bookingsApi.mockComplete(order.order_id, scenario);
      router.replace({ pathname: '/booking/[id]/result', params: { id } });
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      paying.current = false;
      setBusy(false);
    }
  };

  if (!order) {
    return (
      <Screen>
        <BackBar />
        <Title>{copy.title}</Title>
        {state.closed ? (
          <>
            <Alert tone="info">{copy.closed}</Alert>
            <Button variant="secondary" onPress={() => id && router.replace({ pathname: '/booking/[id]', params: { id } })}>{resultCopy.viewBooking}</Button>
          </>
        ) : state.offline ? (
          <OfflineBanner onRetry={start} />
        ) : state.error ? (
          <ErrorState message={state.error} onRetry={start} />
        ) : (
          <SkeletonList rows={3} />
        )}
      </Screen>
    );
  }

  const testCheckout = __DEV__ && order.client?.provider === 'mock';
  return (
    <Screen footer={testCheckout ? <Button onPress={testPay} loading={busy}>{`${copy.testTitle} · ${formatINR(order.amount_paise)}`}</Button> : undefined}>
      <BackBar />
      <Title>{copy.title}</Title>
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        <PriceTag paise={order.amount_paise} size="title" />
        {order.due_at ? <Text variant="small" color={colors.textMuted}>{copy.due(formatDateTimeIST(order.due_at))}</Text> : null}
      </Card>
      <Card tone="ok">
        <Text variant="small" color={colors.text}>{reviewCopy.held}</Text>
      </Card>
      {testCheckout ? (
        <Card tone="warn">
          <Text weight="600" color={colors.warningText}>{copy.testTitle}</Text>
          <Text variant="small" color={colors.text}>{copy.testBody}</Text>
          <ChipRow>
            {MockPaymentScenarioValues.map((s) => (
              <Chip key={s} radio label={copy.scenarios[s]} selected={scenario === s} onPress={() => setScenario(s)} />
            ))}
          </ChipRow>
        </Card>
      ) : (
        <PlaceholderNotice title={copy.notOpenTitle} body={copy.notOpenBody} />
      )}
      <SafetyCallout compact />
    </Screen>
  );
}
