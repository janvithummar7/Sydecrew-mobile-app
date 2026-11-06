import { useRef, useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { Modal, Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { chat as copy } from '@/content/comms';
import { commsApi } from '@/lib/comms/api';
import type { Message, ReportReason } from '@/lib/comms/types';
import { ProfileReportReasonValues } from '@/lib/contract/enums';
import { errorView } from '@/lib/errors';
import { colors, space } from '@/theme';

/** Report one message from the other person (POST /messages/:id/report). */
export function ReportSheet({ message, onClose, onDone }: { message: Message | null; onClose: () => void; onDone: (already: boolean) => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  // A new message to report starts a fresh form (reset while rendering, not in an effect).
  const [forId, setForId] = useState<string | null>(null);
  if (message && message.id !== forId) {
    setForId(message.id);
    setReason(null);
    setNote('');
    setError(null);
  }
  const send = async () => {
    if (!message || !reason || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      const res = await commsApi.report(message.id, { reason_code: reason, ...(note.trim() ? { note: note.trim() } : {}) });
      onDone(res.already_reported);
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };
  return (
    <Sheet visible={!!message} onClose={onClose} title={copy.reportTitle}>
      <View style={{ gap: space.md }}>
        <Text variant="small" color={colors.textMuted}>{copy.reportBody}</Text>
        {message?.body ? <Text variant="small" color={colors.text} numberOfLines={3}>{`“${message.body}”`}</Text> : null}
        <ChipRow>
          {ProfileReportReasonValues.map((r) => (
            <Chip key={r} radio label={copy.reportReasons[r]} selected={reason === r} onPress={() => setReason(r)} />
          ))}
        </ChipRow>
        <TextField label={copy.reportNote} value={note} onChangeText={setNote} maxLength={500} multiline />
        {error ? <Alert>{error}</Alert> : null}
        <Button variant="danger" onPress={send} loading={busy} disabled={!reason}>{copy.reportSend}</Button>
      </View>
    </Sheet>
  );
}

/** Block the chat (POST /conversations/:id/block), after a confirmation. */
export function BlockDialog({ conversationId, visible, onClose, onDone }: { conversationId: string; visible: boolean; onClose: () => void; onDone: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <Modal visible={visible} onClose={onClose} title={copy.blockTitle}>
      <View style={{ gap: space.md }}>
        <Text variant="small" color={colors.text}>{copy.blockBody}</Text>
        {error ? <Alert>{error}</Alert> : null}
        <Button
          variant="danger"
          loading={busy}
          onPress={async () => {
            setBusy(true);
            setError(null);
            try {
              await commsApi.block(conversationId);
              onDone();
            } catch (err) {
              setError(errorView(err).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {copy.blockConfirm}
        </Button>
        <Button variant="ghost" onPress={onClose}>{copy.cancel}</Button>
      </View>
    </Modal>
  );
}
