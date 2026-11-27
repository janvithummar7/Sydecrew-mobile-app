import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { result as copy } from '@/content/bookings';
import { bookingsApi } from '@/lib/bookings/api';
import { pollPayment, type PaymentOutcome } from '@/lib/bookings/helpers';
import { colors, space } from '@/theme';

/**
 * Payment result. Polls GET /bookings/:id: the booking is confirmed only
 * when the API says so (a verified gateway webhook, or reconciliation),
 * never because the checkout returned.
 */
export default function PaymentResult() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [outcome, setOutcome] = useState<PaymentOutcome | 'checking'>('checking');
  const stop = useRef({ aborted: false });

  const run = useCallback(() => {
    if (!id) return;
    stop.current = { aborted: false };
    const signal = stop.current;
    void pollPayment(() => bookingsApi.detail(id), { intervalMs: 2000, timeoutMs: 45_000, signal }).then((r) => {
      if (!signal.aborted) setOutcome(r.outcome);
    });
  }, [id]);
  useEffect(() => {
    run();
    return () => {
      stop.current.aborted = true;
    };
  }, [run]);
  const check = () => {
    setOutcome('checking');
    run();
  };

  // Back to the booking already under the payment screens (not a second copy of it); opens it if it is not there.
  const view = () => id && router.dismissTo({ pathname: '/booking/[id]', params: { id } });
  return (
    <Screen>
      <Title>{copy.title}</Title>
      {outcome === 'checking' ? (
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
            <ActivityIndicator color={colors.accent} />
            <Text weight="600" color={colors.textStrong}>{copy.checking}</Text>
          </View>
          <Text variant="small" color={colors.textMuted}>{copy.checkingBody}</Text>
        </Card>
      ) : outcome === 'confirmed' ? (
        <EmptyState icon="checkmark-circle-outline" title={copy.confirmedTitle} body={copy.confirmedBody} action={<Button onPress={view}>{copy.viewBooking}</Button>} />
      ) : outcome === 'failed' ? (
        <EmptyState
          icon="close-circle-outline"
          title={copy.failedTitle}
          body={copy.failedBody}
          action={
            <View style={{ gap: space.sm }}>
              <Button onPress={() => id && router.replace({ pathname: '/booking/[id]/pay', params: { id } })}>{copy.tryAgain}</Button>
              <Button variant="ghost" onPress={view}>{copy.viewBooking}</Button>
            </View>
          }
        />
      ) : outcome === 'closed' ? (
        <EmptyState icon="time-outline" title={copy.closedTitle} body={copy.closedBody} action={<Button variant="secondary" onPress={view}>{copy.viewBooking}</Button>} />
      ) : (
        <EmptyState
          icon="hourglass-outline"
          title={copy.stillTitle}
          body={copy.stillBody}
          action={
            <View style={{ gap: space.sm }}>
              <Button onPress={check}>{copy.refresh}</Button>
              <Button variant="ghost" onPress={view}>{copy.viewBooking}</Button>
            </View>
          }
        />
      )}
    </Screen>
  );
}
