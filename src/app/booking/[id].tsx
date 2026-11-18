import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { PolicyCard, PriceLines, Timeline } from '@/components/bookings/Parts';
import { CancelSheet, RejectSheet } from '@/components/bookings/Sheets';
import { CallAndChat } from '@/components/comms/BookingComms';
import { BookingReviewSection } from '@/components/reviews/BookingReview';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { Avatar, useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { detail as copy } from '@/content/bookings';
import { bookingsApi } from '@/lib/bookings/api';
import { actionList, companionLines, countdown, customerMoneyLines, durationLabel, isBookingDay, statusView, type ActionKey } from '@/lib/bookings/helpers';
import type { Booking } from '@/lib/bookings/types';
import { errorView } from '@/lib/errors';
import { hasReceipt } from '@/lib/support/helpers';
import { receipt as receiptCopy } from '@/content/support';
import { formatINR } from '@/lib/money';
import { customerRatingText } from '@/lib/reviews/helpers';
import { formatDateTimeIST } from '@/lib/time';
import { colors, space } from '@/theme';

/**
 * Booking detail (artboard "Booking details"), for the customer and the
 * companion: status, when and where, money, the timeline and the actions the
 * API allows (`actions`): pay, accept / decline, check-in, cancel with the
 * refund preview, report an issue. Feature 5: Message (the booking chat) and,
 * inside the call window, a masked Call. Reviews: once completed, each side
 * reviews once (BookingReviewSection); a companion sees the customer's average
 * from companions (only from the public threshold, never made up).
 */
export default function BookingDetail() {
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [b, setB] = useState<Booking | null>(null);
  const [state, setState] = useState<{ error: string | null; offline: boolean; gone: boolean }>({ error: null, offline: false, gone: false });
  const [sheet, setSheet] = useState<'cancel' | 'reject' | null>(null);
  const [busy, setBusy] = useState<ActionKey | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const acting = useRef(false);

  const load = useCallback(() => {
    if (!id) return;
    bookingsApi.detail(id).then(
      (x) => {
        setB(x);
        setState({ error: null, offline: false, gone: false });
      },
      (err) => {
        const v = errorView(err);
        setState({ error: v.offline || v.code === 'BOOKING_NOT_FOUND' ? null : v.message, offline: v.offline, gone: v.code === 'BOOKING_NOT_FOUND' });
      },
    );
  }, [id]);
  useFocusEffect(load);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!b) {
    return (
      <Screen>
        <BackBar />
        {state.gone ? <ErrorState message={errorView({ code: 'BOOKING_NOT_FOUND' }).message} /> : state.offline ? <OfflineBanner onRetry={load} /> : state.error ? <ErrorState message={state.error} onRetry={load} /> : <SkeletonList rows={5} />}
      </Screen>
    );
  }

  const s = statusView(b.status, b.viewer);
  const other = b.viewer === 'CUSTOMER' ? b.companion.display_name : b.customer.first_name;
  const answer = b.status === 'AWAITING_COMPANION' ? countdown(b.due.companion_response_due_at, now) : null;
  const payDue = b.status === 'PAYMENT_PENDING' ? countdown(b.due.payment_due_at, now) : null;
  const actions = actionList(b.actions);
  const customerRating = b.viewer === 'COMPANION' ? customerRatingText(b.customer.rating) : null;

  const run = async (key: ActionKey) => {
    if (acting.current) return;
    if (key === 'pay') return router.push({ pathname: '/booking/[id]/pay', params: { id: b.id } });
    if (key === 'check_in' || key === 'check_out') return router.push({ pathname: '/booking/[id]/day', params: { id: b.id } });
    if (key === 'cancel' || key === 'reject') return setSheet(key);
    // Feature 6: the complaint form (POST /complaints); the old report-issue endpoint stays as a wrapper on the API.
    if (key === 'report_issue') return router.push({ pathname: '/support/report', params: { booking: b.id } });
    // accept
    acting.current = true;
    setBusy(key);
    try {
      setB(await bookingsApi.accept(b.id));
      toast(copy.accepted);
    } catch (err) {
      toast(errorView(err).message, 'error');
      load();
    } finally {
      acting.current = false;
      setBusy(null);
    }
  };

  return (
    <Screen
      footer={
        actions.length ? (
          <View style={{ gap: space.sm }}>
            {actions.map((k, i) => (
              <Button key={k} variant={k === 'cancel' || k === 'reject' ? 'ghost' : i === 0 ? 'primary' : 'secondary'} onPress={() => run(k)} loading={busy === k}>
                {copy.actions[k]}
              </Button>
            ))}
          </View>
        ) : undefined
      }
    >
      <BackBar />
      {state.offline ? <OfflineBanner onRetry={load} /> : null}
      <Title>{`${b.activity.name}`}</Title>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <Badge kind={s.badge} label={s.label} />
        <Text variant="caption" color={colors.textMuted}>{b.ref}</Text>
      </View>
      {answer && !answer.expired ? <Alert tone="info">{b.viewer === 'COMPANION' ? copy.youAnswerBy(answer.label.replace(' left', '')) : copy.answerBy(answer.label.replace(' left', ''))}</Alert> : null}
      {payDue && !payDue.expired && b.viewer === 'CUSTOMER' ? <Alert tone="info">{copy.payBy(payDue.label.replace(' left', ''))}</Alert> : null}
      {b.venue?.pending_approval ? <Alert tone="info">{copy.venuePending}</Alert> : null}
      {b.status === 'DISPUTED' ? <Alert tone="info">{copy.issue}</Alert> : null}

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
          <Avatar name={other} uri={b.viewer === 'CUSTOMER' ? b.companion.photo_url : null} size={44} />
          <View style={{ flex: 1 }}>
            <Text variant="caption" color={colors.textMuted}>{copy.with}</Text>
            <Text weight="600" color={colors.textStrong}>{other}</Text>
            {customerRating ? <Text variant="caption" color={colors.textMuted} testID="customer-rating">{customerRating}</Text> : null}
          </View>
        </View>
        <Text variant="caption" color={colors.textMuted}>{copy.when}</Text>
        <Text color={colors.textStrong}>{`${formatDateTimeIST(b.start_at)} · ${durationLabel(b.duration_minutes)}`}</Text>
        {b.venue ? (
          <>
            <Text variant="caption" color={colors.textMuted}>{copy.venue}</Text>
            <Text color={colors.textStrong}>{`${b.venue.name}${b.venue.zone ? ` · ${b.venue.zone}` : ''}`}</Text>
          </>
        ) : null}
        {b.notes ? (
          <>
            <Text variant="caption" color={colors.textMuted}>{copy.notes}</Text>
            <Text color={colors.text}>{b.notes}</Text>
            {b.notes_masked ? <Text variant="caption" color={colors.textMuted}>{copy.notesMasked}</Text> : null}
          </>
        ) : null}
      </Card>

      <CallAndChat booking={b} now={now} />

      <BookingReviewSection booking={b} onDone={setB} onStale={load} />

      {isBookingDay(b) ? <Button variant="secondary" onPress={() => router.push({ pathname: '/booking/[id]/day', params: { id: b.id } })}>{copy.day}</Button> : null}

      <View style={{ gap: space.sm }}>
        <Text variant="eyebrow" color={colors.textSubtle}>{copy.money}</Text>
        <PriceLines lines={b.viewer === 'CUSTOMER' ? customerMoneyLines(b.money, b.duration_minutes) : companionLines(b.money)} />
        {b.viewer === 'CUSTOMER' && ['CONFIRMED', 'IN_PROGRESS'].includes(b.status) ? <Text variant="caption" color={colors.textMuted}>{copy.held}</Text> : null}
      </View>

      {hasReceipt(b) ? <Button variant="secondary" onPress={() => router.push({ pathname: '/booking/[id]/receipt', params: { id: b.id } })}>{receiptCopy.open}</Button> : null}
      {b.status === 'DISPUTED' ? <Button variant="ghost" onPress={() => router.push('/disputes')}>See the dispute</Button> : null}

      {b.refunds.length ? (
        <View style={{ gap: space.sm }}>
          <Text variant="eyebrow" color={colors.textSubtle}>{copy.refunds}</Text>
          <Card>
            {b.refunds.map((r) => (
              <View key={r.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="small" color={colors.text}>{r.status === 'SUCCEEDED' ? copy.refundDone(formatDateTimeIST(r.processed_at)) : r.status === 'PENDING_APPROVAL' ? copy.refundApproval : copy.refundProcessing}</Text>
                <Text variant="small" weight="600" color={colors.textStrong}>{formatINR(r.amount_paise)}</Text>
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      <View style={{ gap: space.sm }}>
        <Text variant="eyebrow" color={colors.textSubtle}>{copy.timeline}</Text>
        <Timeline entries={b.timeline} />
      </View>

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

      <View style={{ gap: space.sm }}>
        <Text variant="eyebrow" color={colors.textSubtle}>{copy.cancellation}</Text>
        <PolicyCard policy={b.cancellation} />
      </View>

      <CancelSheet booking={b} visible={sheet === 'cancel'} onClose={() => setSheet(null)} onDone={setB} />
      <RejectSheet booking={b} visible={sheet === 'reject'} onClose={() => setSheet(null)} onDone={(x) => (setB(x), toast(copy.declined))} />
    </Screen>
  );
}
