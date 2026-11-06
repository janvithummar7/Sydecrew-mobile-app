import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { SkeletonList } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { cancel as cancelCopy, issue as issueCopy, reject as rejectCopy } from '@/content/bookings';
import { bookingsApi } from '@/lib/bookings/api';
import type { Booking, CancellationPreview } from '@/lib/bookings/types';
import { BookingCancelReasonValues, BookingIssueValues, BookingRejectReasonValues } from '@/lib/contract/enums';
import { errorView } from '@/lib/errors';
import { formatINR } from '@/lib/money';
import { colors, space } from '@/theme';

type Done = (b: Booking) => void;

/** Cancel with the refund preview first (D17): the refund shown is the refund the API applies. */
export function CancelSheet({ booking, visible, onClose, onDone }: { booking: Booking; visible: boolean; onClose: () => void; onDone: Done }) {
  const [preview, setPreview] = useState<CancellationPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<(typeof BookingCancelReasonValues)[number] | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  useEffect(() => {
    if (!visible) return;
    let live = true;
    bookingsApi.cancellationPreview(booking.id).then(
      (p) => live && (setPreview(p), setError(null)),
      (err) => live && setError(errorView(err).message),
    );
    return () => {
      live = false;
    };
  }, [visible, booking.id]);

  const submit = async () => {
    if (!reason || sending.current) return;
    sending.current = true;
    setBusy(true);
    try {
      const r = await bookingsApi.cancel(booking.id, { reason_code: reason, ...(note.trim() ? { note: note.trim() } : {}) });
      onDone(r.booking);
      onClose();
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={cancelCopy.title}>
      <ScrollView contentContainerStyle={{ gap: space.md }}>
        {error ? <Alert>{error}</Alert> : null}
        {!preview && !error ? <SkeletonList rows={2} /> : null}
        {preview ? (
          <View style={{ gap: space.xs }} accessibilityRole="summary">
            <Text variant="eyebrow" color={colors.textSubtle}>{cancelCopy.refund}</Text>
            <Text variant="title" color={colors.textStrong}>{formatINR(preview.refund_paise)}</Text>
            <Text variant="small" color={colors.text}>{preview.rule.text}</Text>
            {preview.companion_keeps_paise > 0 && booking.viewer === 'CUSTOMER' ? <Text variant="small" color={colors.textMuted}>{cancelCopy.keeps(formatINR(preview.companion_keeps_paise))}</Text> : null}
            {preview.companion_penalty && booking.viewer === 'COMPANION' ? <Alert tone="error">{cancelCopy.penalty}</Alert> : null}
          </View>
        ) : null}
        <Text variant="small" weight="600" color={colors.textStrong}>{cancelCopy.reason}</Text>
        <ChipRow>
          {BookingCancelReasonValues.map((r) => (
            <Chip key={r} radio label={cancelCopy.reasons[r]} selected={reason === r} onPress={() => setReason(r)} />
          ))}
        </ChipRow>
        <TextField label={cancelCopy.note} value={note} onChangeText={setNote} maxLength={1000} multiline />
        <Button variant="danger" onPress={submit} loading={busy} disabled={!reason || !preview}>{cancelCopy.confirm}</Button>
        <Button variant="ghost" onPress={onClose}>{cancelCopy.keep}</Button>
      </ScrollView>
    </Sheet>
  );
}

export function IssueSheet({ booking, visible, onClose, onDone }: { booking: Booking; visible: boolean; onClose: () => void; onDone: Done }) {
  const [reason, setReason] = useState<(typeof BookingIssueValues)[number] | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const submit = async () => {
    if (!reason || sending.current) return;
    sending.current = true;
    setBusy(true);
    try {
      onDone(await bookingsApi.reportIssue(booking.id, { issue_code: reason, ...(note.trim() ? { note: note.trim() } : {}) }));
      onClose();
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };
  return (
    <Sheet visible={visible} onClose={onClose} title={issueCopy.title}>
      <ScrollView contentContainerStyle={{ gap: space.md }}>
        <Text variant="small" color={colors.text}>{issueCopy.body}</Text>
        {error ? <Alert>{error}</Alert> : null}
        <Text variant="small" weight="600" color={colors.textStrong}>{issueCopy.reason}</Text>
        <ChipRow>
          {BookingIssueValues.map((r) => (
            <Chip key={r} radio label={issueCopy.reasons[r]} selected={reason === r} onPress={() => setReason(r)} />
          ))}
        </ChipRow>
        <TextField label={issueCopy.note} value={note} onChangeText={setNote} maxLength={1000} multiline />
        <Button onPress={submit} loading={busy} disabled={!reason}>{issueCopy.submit}</Button>
      </ScrollView>
    </Sheet>
  );
}

export function RejectSheet({ booking, visible, onClose, onDone }: { booking: Booking; visible: boolean; onClose: () => void; onDone: Done }) {
  const [reason, setReason] = useState<(typeof BookingRejectReasonValues)[number] | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const submit = async () => {
    if (!reason || sending.current) return;
    sending.current = true;
    setBusy(true);
    try {
      onDone(await bookingsApi.reject(booking.id, { reason_code: reason, ...(note.trim() ? { note: note.trim() } : {}) }));
      onClose();
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };
  return (
    <Sheet visible={visible} onClose={onClose} title={rejectCopy.title}>
      <ScrollView contentContainerStyle={{ gap: space.md }}>
        {error ? <Alert>{error}</Alert> : null}
        <Text variant="small" weight="600" color={colors.textStrong}>{rejectCopy.reason}</Text>
        <ChipRow>
          {BookingRejectReasonValues.map((r) => (
            <Chip key={r} radio label={rejectCopy.reasons[r]} selected={reason === r} onPress={() => setReason(r)} />
          ))}
        </ChipRow>
        <TextField label={rejectCopy.note} value={note} onChangeText={setNote} maxLength={1000} multiline />
        <Button variant="danger" onPress={submit} loading={busy} disabled={!reason}>{rejectCopy.confirm}</Button>
      </ScrollView>
    </Sheet>
  );
}
