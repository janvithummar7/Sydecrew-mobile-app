import { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StepHeader } from '@/components/companion/Bits';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { TextField } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Feedback';
import { SafetyCallout } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { complaint as copy } from '@/content/support';
import { ComplaintTypeValues } from '@/lib/contract/enums';
import { errorView } from '@/lib/errors';
import { supportApi } from '@/lib/support/api';
import { COMPLAINT_MAX, complaintError, complaintLabels, isSafetyComplaint } from '@/lib/support/helpers';
import type { ComplaintCreated, ComplaintType } from '@/lib/support/types';
import { colors } from '@/theme';

/**
 * Report a problem (POST /complaints), from Help and support or from a
 * booking's "Report an issue" (?booking=<id>). Safety types alert the safety
 * desk at once; the screen says so and shows 112.
 */
export default function Report() {
  const router = useRouter();
  const { booking } = useLocalSearchParams<{ booking?: string }>();
  const [type, setType] = useState<ComplaintType | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<ComplaintCreated | null>(null);
  const sending = useRef(false);

  const submit = async () => {
    if (sending.current) return;
    const problem = complaintError(type, description);
    setError(problem);
    if (problem || !type) return;
    sending.current = true;
    setBusy(true);
    try {
      setDone(await supportApi.complain({ type, description: description.trim(), ...(booking ? { booking_id: booking } : {}) }));
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  if (done) {
    const safety = done.routed_to_safety || isSafetyComplaint(done.type);
    return (
      <Screen>
        <StepHeader title={copy.doneTitle} />
        {safety ? <Alert tone="info">{copy.safetyAlert}</Alert> : null}
        {safety ? <SafetyCallout compact /> : null}
        <Text color={colors.text}>{copy.done(done.complaint_ref)}</Text>
        {done.dispute_id ? <Button onPress={() => router.replace({ pathname: '/disputes/[id]', params: { id: done.dispute_id! } })}>{copy.openDispute}</Button> : null}
        <Button variant={done.dispute_id ? 'secondary' : 'primary'} onPress={() => router.replace({ pathname: '/support/[id]', params: { id: done.support_ticket_id } })}>{copy.openSupport}</Button>
      </Screen>
    );
  }

  return (
    <Screen footer={<Button onPress={submit} loading={busy}>{copy.send}</Button>}>
      <StepHeader title={copy.title} subtitle={copy.intro} />
      {error ? <Alert>{error}</Alert> : null}
      <Text variant="small" weight="600" color={colors.textStrong}>{copy.type}</Text>
      <ChipRow>
        {ComplaintTypeValues.map((t) => (
          <Chip key={t} radio label={complaintLabels[t]} selected={type === t} onPress={() => setType(t)} />
        ))}
      </ChipRow>
      {isSafetyComplaint(type) ? (
        <Card tone="warn">
          <Text variant="small" color={colors.textStrong}>{copy.safetyBefore}</Text>
        </Card>
      ) : null}
      <TextField label={copy.description} hint={copy.descriptionHint} value={description} onChangeText={setDescription} maxLength={COMPLAINT_MAX} multiline />
    </Screen>
  );
}
