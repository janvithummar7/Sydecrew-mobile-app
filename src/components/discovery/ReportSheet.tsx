import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { OptionCard } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Misc';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { report as copy } from '@/content/discovery';
import { ProfileReportReasonValues, type ProfileReportReason } from '@/lib/contract/enums';
import { discoveryApi } from '@/lib/discovery/api';
import { errorView } from '@/lib/errors';
import { colors, space } from '@/theme';

/**
 * "Report this profile" (POST /discovery/companions/:id/report). Private: the
 * companion is not told who reported. A repeat report is accepted and says so;
 * the API limits reports to 10 an hour (RATE_LIMITED shows the shared message).
 */
export function ReportSheet({ visible, onClose, companionId, reasons }: { visible: boolean; onClose: () => void; companionId: string; reasons?: ProfileReportReason[] }) {
  const toast = useToast();
  const [reason, setReason] = useState<ProfileReportReason | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [noteError, setNoteError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  // A fresh form each time the sheet opens (state reset during render, not in an effect).
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setReason(null);
      setNote('');
      setError(null);
      setNoteError(undefined);
    }
  }

  const send = async () => {
    if (!reason || sending.current) return;
    if (reason === 'OTHER' && !note.trim()) {
      setNoteError(copy.noteRequired);
      return;
    }
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      const res = await discoveryApi.report(companionId, { reason_code: reason, ...(note.trim() ? { note: note.trim() } : {}) });
      toast(res.already_reported ? copy.already : copy.thanks);
      onClose();
    } catch (err) {
      const v = errorView(err);
      if (v.fields.note) setNoteError(v.fields.note);
      setError(v.message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  const list = reasons?.length ? reasons : [...ProfileReportReasonValues];
  return (
    <Sheet visible={visible} onClose={onClose} title={copy.title}>
      <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" testID="report-sheet">
        <Text variant="small" color={colors.textMuted}>{copy.intro}</Text>
        {error ? <Alert>{error}</Alert> : null}
        <View style={{ gap: space.sm }} accessibilityRole="radiogroup" accessibilityLabel={copy.reason}>
          <Text variant="eyebrow" color={colors.textSubtle} accessibilityRole="header">{copy.reason}</Text>
          {list.map((r) => <OptionCard key={r} title={copy.reasons[r]} selected={reason === r} onPress={() => setReason(r)} />)}
        </View>
        <TextField label={copy.note} value={note} onChangeText={(t) => { setNote(t); setNoteError(undefined); }} multiline numberOfLines={3} maxLength={1000} error={noteError} textAlignVertical="top" />
        <Text variant="caption" color={colors.warningText}>{copy.emergency}</Text>
      </ScrollView>
      <Button variant="danger" onPress={send} loading={busy} disabled={!reason}>{copy.submit}</Button>
    </Sheet>
  );
}

const styles = StyleSheet.create({ body: { gap: space.lg, paddingBottom: space.md } });
