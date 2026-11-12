import { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StepHeader } from '@/components/companion/Bits';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { TextField } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Feedback';
import { useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { support as copy } from '@/content/support';
import { errorView } from '@/lib/errors';
import { supportApi } from '@/lib/support/api';
import { TicketCategoryValues, ticketCategories } from '@/lib/support/helpers';
import type { TicketCategory } from '@/lib/support/types';
import { colors } from '@/theme';

/** A new support request (POST /support/tickets). Optional ?booking=<id>. */
export default function NewTicket() {
  const router = useRouter();
  const toast = useToast();
  const { booking } = useLocalSearchParams<{ booking?: string }>();
  const [category, setCategory] = useState<TicketCategory | null>(booking ? 'BOOKING' : null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  const submit = async () => {
    if (sending.current) return;
    const f: Record<string, string> = {};
    if (subject.trim().length < 3) f.subject = 'Add a short subject.';
    if (body.trim().length < 10) f.body = 'Tell us a little more (at least 10 characters).';
    setFields(f);
    setError(category ? null : 'Choose what it is about.');
    if (!category || Object.keys(f).length) return;
    sending.current = true;
    setBusy(true);
    try {
      const t = await supportApi.openTicket({ category, subject: subject.trim(), body: body.trim(), ...(booking ? { booking_id: booking } : {}) });
      toast(copy.sent);
      router.replace({ pathname: '/support/[id]', params: { id: t.id } });
    } catch (err) {
      const v = errorView(err);
      setFields(v.fields);
      setError(v.message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button onPress={submit} loading={busy}>{copy.send}</Button>}>
      <StepHeader title={copy.newTicket} />
      {error ? <Alert>{error}</Alert> : null}
      <Text variant="small" weight="600" color={colors.textStrong}>{copy.category}</Text>
      <ChipRow>
        {TicketCategoryValues.map((c) => (
          <Chip key={c} radio label={ticketCategories[c]} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </ChipRow>
      <TextField label={copy.subject} value={subject} onChangeText={setSubject} maxLength={150} error={fields.subject} />
      <TextField label={copy.body} value={body} onChangeText={setBody} maxLength={4000} multiline error={fields.body} />
    </Screen>
  );
}
