import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { CallAndChat, LocationShare, PingPrompt } from '@/components/comms/BookingComms';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { SafetyCallout, useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { day as copy, detail as detailCopy } from '@/content/bookings';
import { bookingsApi } from '@/lib/bookings/api';
import { statusView } from '@/lib/bookings/helpers';
import type { Booking } from '@/lib/bookings/types';
import { errorView } from '@/lib/errors';
import { formatDateTimeIST, formatTimeIST } from '@/lib/time';
import { colors, space } from '@/theme';

/**
 * Booking day and check-in (artboard "Booking day and check-in"): check in
 * (a tap, no location) from 30 minutes before to 30 after the start, check
 * out, the agreed boundaries and the venue. Feature 5: message and masked
 * call, live location sharing with safety contacts (foreground only), the
 * "Are you OK?" check-in, and SOS (/safety/sos?booking=<id>; Call 112 first).
 */
export default function BookingDay() {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [b, setB] = useState<Booking | null>(null);
  const [state, setState] = useState<{ error: string | null; offline: boolean }>({ error: null, offline: false });
  const [busy, setBusy] = useState<'in' | 'out' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const acting = useRef(false);

  const load = useCallback(() => {
    if (!id) return;
    bookingsApi.detail(id).then(
      (x) => {
        setB(x);
        setState({ error: null, offline: false });
      },
      (err) => {
        const v = errorView(err);
        setState({ error: v.offline ? null : v.message, offline: v.offline });
      },
    );
  }, [id]);
  useFocusEffect(load);

  if (!b) {
    return (
      <Screen>
        <BackBar />
        {state.offline ? <OfflineBanner onRetry={load} /> : state.error ? <ErrorState message={state.error} onRetry={load} /> : <SkeletonList rows={4} />}
      </Screen>
    );
  }

  const act = async (kind: 'in' | 'out') => {
    if (acting.current) return;
    acting.current = true;
    setBusy(kind);
    setError(null);
    try {
      const next = kind === 'in' ? await bookingsApi.checkIn(b.id) : await bookingsApi.checkOut(b.id);
      setB(next);
      toast(statusView(next.status, next.viewer).label);
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      acting.current = false;
      setBusy(null);
    }
  };

  const mine = b.viewer === 'CUSTOMER' ? { in: b.check_in.customer_in_at, out: b.check_in.customer_out_at } : { in: b.check_in.companion_in_at, out: b.check_in.companion_out_at };
  const theirs = b.viewer === 'CUSTOMER' ? { in: b.check_in.companion_in_at, who: b.companion.display_name } : { in: b.check_in.customer_in_at, who: b.customer.first_name };
  const s = statusView(b.status, b.viewer);
  const live = b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS';

  return (
    <Screen footer={<Button variant="danger" onPress={() => router.push({ pathname: '/safety/sos', params: { booking: b.id } })}>{copy.sos}</Button>}>
      <BackBar />
      <Title>{copy.title}</Title>
      {error ? <Alert>{error}</Alert> : null}
      <PingPrompt bookingId={b.id} onHelp={() => router.push({ pathname: '/safety/sos', params: { booking: b.id } })} />
      <Card>
        <Badge kind={s.badge} label={s.label} />
        <Text variant="heading" color={colors.textStrong}>{`${b.activity.name} · ${b.viewer === 'CUSTOMER' ? b.companion.display_name : b.customer.first_name}`}</Text>
        <Text variant="small" color={colors.textMuted}>{`${formatDateTimeIST(b.start_at)}${b.venue ? ` · ${b.venue.name}` : ''}`}</Text>
      </Card>

      <Card>
        <Text weight="600" color={colors.textStrong}>{copy.arrived}</Text>
        <Text variant="small" color={colors.textMuted}>{copy.checkInBody}</Text>
        {!b.actions.can_check_in && !mine.in ? <Text variant="caption" color={colors.textMuted}>{`${copy.opens(formatTimeIST(b.check_in.opens_at))} ${copy.closes(formatTimeIST(b.check_in.closes_at))}`}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="small" color={colors.text}>{copy.you}</Text>
          <Text variant="small" color={mine.in ? colors.textStrong : colors.textMuted}>{mine.in ? copy.checkedIn : copy.notYet}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="small" color={colors.text}>{copy.other(theirs.who)}</Text>
          <Text variant="small" color={theirs.in ? colors.textStrong : colors.textMuted}>{theirs.in ? copy.checkedIn : copy.notYet}</Text>
        </View>
        {b.status === 'IN_PROGRESS' ? <Text variant="small" color={colors.text}>{copy.inProgress}</Text> : mine.in ? <Text variant="small" color={colors.text}>{copy.checkedIn2}</Text> : null}
        {b.actions.can_check_in ? <Button onPress={() => act('in')} loading={busy === 'in'}>{detailCopy.actions.check_in}</Button> : null}
        {b.actions.can_check_out ? <Button variant="secondary" onPress={() => act('out')} loading={busy === 'out'}>{detailCopy.actions.check_out}</Button> : null}
      </Card>

      {live ? <LocationShare bookingId={b.id} onAddContacts={() => router.push('/safety/contacts')} /> : null}
      <CallAndChat booking={b} now={now} />

      {b.boundaries.length ? (
        <View style={{ gap: space.sm }}>
          <Text variant="eyebrow" color={colors.textSubtle}>{copy.boundaries}</Text>
          <Card>
            {b.boundaries.map((x) => (
              <Text key={x} variant="small" color={colors.text}>{`• ${x}`}</Text>
            ))}
          </Card>
        </View>
      ) : null}
      {b.actions.can_report_issue ? <Button variant="ghost" onPress={() => router.push({ pathname: '/support/report', params: { booking: b.id } })}>{detailCopy.actions.report_issue}</Button> : null}
      <SafetyCallout sos />
    </Screen>
  );
}
