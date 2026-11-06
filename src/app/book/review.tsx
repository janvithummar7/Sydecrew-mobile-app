import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { PolicyCard, PriceLines } from '@/components/bookings/Parts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { Checkbox } from '@/components/ui/Field';
import { SafetyCallout } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { review as copy } from '@/content/bookings';
import { bookingsApi } from '@/lib/bookings/api';
import { attempt, clearDraft, getDraft } from '@/lib/bookings/draft';
import { REQUOTE_CODES, countdown, customerLines, durationLabel } from '@/lib/bookings/helpers';
import { errorView } from '@/lib/errors';
import { formatINR } from '@/lib/money';
import { formatDateTimeIST } from '@/lib/time';
import { colors, space } from '@/theme';

/**
 * Review and pay (artboard "Review and pay"): the quote's full breakdown in
 * paise (shown with formatINR), the cancellation policy that will be applied,
 * the guidelines consent, then POST /bookings with one Idempotency-Key per
 * attempt (a double tap or retry gets the same booking).
 */
export default function Review() {
  const router = useRouter();
  const draft = getDraft();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<{ message: string; requote: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const sending = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(t);
  }, []);

  if (!draft) {
    return (
      <Screen>
        <BackBar />
        <EmptyState icon="time-outline" title={copy.expired} action={<Button variant="secondary" onPress={() => router.back()}>{copy.getNew}</Button>} />
      </Screen>
    );
  }
  const q = draft.quote;
  const left = countdown(q.expires_at, now);
  const instant = q.booking_mode === 'INSTANT';

  const submit = async () => {
    if (sending.current) return;
    if (!consent) {
      setError({ message: copy.consentNeeded, requote: false });
      return;
    }
    if (left.expired) {
      setError({ message: copy.expired, requote: true });
      return;
    }
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      const booking = await bookingsApi.create({ quote_id: q.quote_id, ...(draft.notes ? { notes: draft.notes } : {}) }, attempt.keyFor(q.quote_id));
      clearDraft();
      if (booking.status === 'PAYMENT_PENDING') router.replace({ pathname: '/booking/[id]/pay', params: { id: booking.id } });
      else router.replace({ pathname: '/booking/[id]', params: { id: booking.id } });
    } catch (err) {
      const v = errorView(err);
      // Offline / timeout: keep the same key, so trying again cannot create a second booking.
      setError({ message: v.message, requote: !!v.code && REQUOTE_CODES.has(v.code) });
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        error?.requote ? (
          <Button variant="secondary" onPress={() => router.back()}>{copy.getNew}</Button>
        ) : (
          <Button onPress={submit} loading={busy} disabled={left.expired}>{instant ? copy.pay(formatINR(q.breakdown.total_paise)) : copy.send}</Button>
        )
      }
    >
      <BackBar />
      <Title>{instant ? copy.title : copy.titleRequest}</Title>
      {error ? <Alert>{error.message}</Alert> : null}
      <Card>
        <Text weight="600" color={colors.textStrong}>{`${q.activity.name} · ${q.companion.display_name}`}</Text>
        <Text variant="small" color={colors.textMuted}>{`${formatDateTimeIST(q.start_at)} · ${durationLabel(q.duration_minutes)}`}</Text>
        <Text variant="small" color={colors.textMuted}>{q.venue.name}</Text>
      </Card>
      {q.forced_request_reason ? <Alert tone="info">{copy.venuePending}</Alert> : null}
      <View style={{ gap: space.sm }}>
        <Text variant="eyebrow" color={colors.textSubtle}>{copy.breakdown}</Text>
        <PriceLines lines={customerLines(q.breakdown, q.duration_minutes)} />
        <Text variant="caption" color={left.expired ? colors.warningText : colors.textMuted}>{left.expired ? copy.expired : copy.expires(left.label.replace(' left', ''))}</Text>
      </View>
      {!instant ? <Alert tone="info">{copy.requestNote}</Alert> : null}
      <View style={{ gap: space.sm }}>
        <Text variant="eyebrow" color={colors.textSubtle}>{copy.cancellation}</Text>
        <PolicyCard policy={q.cancellation} />
      </View>
      <Card tone="ok">
        <Text variant="small" color={colors.text}>{copy.held}</Text>
      </Card>
      <Checkbox checked={consent} onChange={setConsent} label={copy.consent}>
        <Text variant="small" color={colors.text}>{copy.consent}</Text>
      </Checkbox>
      <SafetyCallout compact />
    </Screen>
  );
}
