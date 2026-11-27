import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { StepHeader } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Feedback';
import { useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { DataState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { disputes as copy } from '@/content/support';
import { uploadImage } from '@/lib/comms/chatImage';
import { errorView } from '@/lib/errors';
import { formatINR } from '@/lib/money';
import { supportApi } from '@/lib/support/api';
import { APPEAL_MIN, MAX_EVIDENCE, STATEMENT_MIN, disputeStatus } from '@/lib/support/helpers';
import type { Dispute } from '@/lib/support/types';
import { formatDateTimeIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, radius, space } from '@/theme';

type Photo = { uri: string; width?: number; height?: number };

/**
 * One dispute (GET /disputes/:id): the deadline, statements, my statement with
 * up to 5 photos (the same upload pipeline as chat photos, via
 * POST /:id/evidence-upload-url), the decision and an appeal while allowed.
 */
export default function DisputeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useLoad(() => supportApi.dispute(id ?? ''), id ?? '');
  const d = q.data;
  return (
    <Screen>
      <StepHeader title={d ? copy.booking(d.booking_ref) : copy.title} />
      <DataState loading={q.loading} hasData={q.data != null} error={q.error} offline={q.offline} onRetry={q.reload}>
        {d ? <Body d={d} onChange={q.setData} /> : null}
      </DataState>
    </Screen>
  );
}

function Body({ d, onChange }: { d: Dispute; onChange: (d: Dispute) => void }) {
  const st = disputeStatus[d.status];
  const who = (p: string) => (p === d.my_party ? copy.you : p === 'CUSTOMER' ? copy.customer : copy.companion);
  return (
    <>
      <Badge kind={st.badge} label={st.label} />
      {d.can_add_statement && d.response_due_at ? <Alert tone="info">{copy.addBy(formatDateTimeIST(d.response_due_at))}</Alert> : null}
      {d.other_party_responded ? <Text variant="small" color={colors.textMuted}>{copy.otherResponded}</Text> : null}

      {d.statements.length ? (
        <View style={{ gap: space.sm }}>
          <Text variant="eyebrow" color={colors.textSubtle}>{copy.statements}</Text>
          {d.statements.map((s, i) => (
            <Card key={`${s.party}-${i}`} accessibilityLabel={`${who(s.party)}: ${s.body}`}>
              <Text variant="caption" color={colors.textMuted}>{`${who(s.party)} · ${formatDateTimeIST(s.created_at)}${s.image_count ? ` · ${copy.photos(s.image_count)}` : ''}`}</Text>
              <Text color={colors.text}>{s.body}</Text>
            </Card>
          ))}
        </View>
      ) : null}

      {d.can_add_statement ? <StatementForm d={d} onChange={onChange} /> : null}

      {d.decision_text ? (
        <View style={{ gap: space.sm }}>
          <Text variant="eyebrow" color={colors.textSubtle}>{copy.decision}</Text>
          <Card tone="accent">
            <Text color={colors.textStrong}>{d.decision_text}</Text>
            {d.refund_paise ? <Text variant="small" color={colors.text}>{copy.refund(formatINR(d.refund_paise))}</Text> : null}
            {d.resolution_notes ? <Text variant="small" color={colors.text}>{d.resolution_notes}</Text> : null}
            {d.resolved_at ? <Text variant="caption" color={colors.textMuted}>{formatDateTimeIST(d.resolved_at)}</Text> : null}
          </Card>
        </View>
      ) : null}
      {d.appeal ? (
        <Card>
          <Text weight="600" color={colors.textStrong}>{copy.appealStatus[d.appeal.status] ?? d.appeal.status}</Text>
          {d.appeal.decision_reason ? <Text variant="small" color={colors.text}>{d.appeal.decision_reason}</Text> : null}
        </Card>
      ) : null}
      {d.can_appeal ? <AppealForm d={d} onChange={onChange} /> : null}
    </>
  );
}

function StatementForm({ d, onChange }: { d: Dispute; onChange: (d: Dispute) => void }) {
  const toast = useToast();
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1, allowsMultipleSelection: true, selectionLimit: MAX_EVIDENCE - photos.length });
    if (res.canceled) return;
    setPhotos((cur) => [...cur, ...res.assets.map((a) => ({ uri: a.uri, width: a.width, height: a.height }))].slice(0, MAX_EVIDENCE));
  };

  const send = async () => {
    if (sending.current) return;
    if (body.trim().length < STATEMENT_MIN) return setError(`Tell us a little more (at least ${STATEMENT_MIN} characters).`);
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      const ids: string[] = [];
      for (const p of photos) ids.push(await uploadImage(p, (b) => supportApi.evidenceUploadUrl(d.id, b), 'evidence'));
      onChange(await supportApi.addStatement(d.id, { body: body.trim(), media_asset_ids: ids }));
      toast(copy.sent);
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <View style={{ gap: space.md }}>
      <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{copy.yourStatement}</Text>
      {error ? <Alert>{error}</Alert> : null}
      <TextField label={copy.yourStatement} hint={copy.statementHint} value={body} onChangeText={setBody} maxLength={4000} multiline />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
        {photos.map((p, i) => (
          <View key={p.uri}>
            <Image source={{ uri: p.uri }} style={{ width: 72, height: 72, borderRadius: radius.sm }} accessibilityIgnoresInvertColors />
            <Pressable onPress={() => setPhotos((cur) => cur.filter((_, j) => j !== i))} accessibilityRole="button" accessibilityLabel={`${copy.removePhoto} ${i + 1}`} hitSlop={8} style={{ position: 'absolute', top: 2, right: 2 }}>
              <Ionicons name="close-circle" size={22} color={colors.textStrong} />
            </Pressable>
          </View>
        ))}
      </View>
      <Text variant="caption" color={colors.textMuted}>{copy.photoCount(photos.length, MAX_EVIDENCE)}</Text>
      {photos.length < MAX_EVIDENCE ? <Button variant="secondary" onPress={pick} icon={<Ionicons name="image-outline" size={18} color={colors.textStrong} />}>{copy.addPhotos}</Button> : null}
      <Button onPress={send} loading={busy}>{copy.send}</Button>
    </View>
  );
}

function AppealForm({ d, onChange }: { d: Dispute; onChange: (d: Dispute) => void }) {
  const toast = useToast();
  const [statement, setStatement] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const send = async () => {
    if (sending.current) return;
    if (statement.trim().length < APPEAL_MIN) return setError(`Tell us a little more (at least ${APPEAL_MIN} characters).`);
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      onChange(await supportApi.appeal(d.id, statement.trim()));
      toast(copy.appealSent);
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };
  return (
    <View style={{ gap: space.md }}>
      <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{copy.appeal}</Text>
      {d.appeal_deadline_at ? <Text variant="small" color={colors.textMuted}>{copy.appealBy(formatDateTimeIST(d.appeal_deadline_at))}</Text> : null}
      {error ? <Alert>{error}</Alert> : null}
      <TextField label={copy.appeal} hint={copy.appealHint} value={statement} onChangeText={setStatement} maxLength={4000} multiline />
      <Button onPress={send} loading={busy}>{copy.appealSend}</Button>
    </View>
  );
}
