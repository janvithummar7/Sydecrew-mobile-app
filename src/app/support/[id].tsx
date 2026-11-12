import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StepHeader } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { DataState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { support as copy } from '@/content/support';
import { errorView } from '@/lib/errors';
import { supportApi } from '@/lib/support/api';
import { ticketStatus } from '@/lib/support/helpers';
import { formatDateTimeIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/** One support conversation (GET /support/tickets/:id) and a reply (POST /:id/messages). */
export default function TicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useLoad(() => supportApi.ticket(id ?? ''), id ?? '');
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const t = q.data;
  const closed = t?.status === 'CLOSED';

  const send = async () => {
    if (!t || sending.current || !reply.trim()) return;
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      q.setData(await supportApi.reply(t.id, reply.trim()));
      setReply('');
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen>
      <StepHeader title={t?.subject ?? copy.title} />
      <DataState loading={q.loading} error={q.error} offline={q.offline} onRetry={q.reload}>
        {t ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <Badge kind={ticketStatus[t.status].badge} label={ticketStatus[t.status].label} />
              <Text variant="caption" color={colors.textMuted}>{t.ticket_ref}</Text>
            </View>
            <View style={{ gap: space.sm }}>
              {t.messages
                .filter((m) => !m.internal)
                .map((m) => (
                  <Card key={m.id} tone={m.from === 'SUPPORT' ? 'accent' : 'default'} accessibilityLabel={`${m.from === 'USER' ? copy.you : copy.team}: ${m.body}`}>
                    <Text variant="caption" color={colors.textMuted}>{`${m.from === 'USER' ? copy.you : (m.author_name ?? copy.team)} · ${formatDateTimeIST(m.created_at)}`}</Text>
                    <Text color={colors.text}>{m.body}</Text>
                  </Card>
                ))}
            </View>
            {closed ? (
              <Alert tone="info">{copy.closed}</Alert>
            ) : (
              <View style={{ gap: space.sm }}>
                {error ? <Alert>{error}</Alert> : null}
                <TextField label={copy.reply} value={reply} onChangeText={setReply} maxLength={4000} multiline />
                <Button onPress={send} loading={busy} disabled={!reply.trim()}>{copy.replySend}</Button>
              </View>
            )}
          </>
        ) : null}
      </DataState>
    </Screen>
  );
}
