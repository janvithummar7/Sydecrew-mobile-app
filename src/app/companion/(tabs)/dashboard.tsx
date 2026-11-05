import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, LinkRow, LoadState, Pill, StepHeader, dateIn } from '@/components/companion/Bits';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError } from '@/lib/api';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import { routeForStep, statusLabel } from '@/lib/companion/steps';
import { colors } from '@/theme';

/** Companion dashboard (stub until bookings): status, pause / resume, re-verification date, bank reminder. */
export default function Dashboard() {
  const router = useRouter();
  const { companion, loading, error, refresh, setCompanion } = useCompanion();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const acting = useRef(false);

  if (!companion) return <Screen><StepHeader title="Dashboard" /><LoadState loading={loading} error={error} onRetry={refresh} /></Screen>;
  const live = companion.status === 'LIVE';
  const paused = companion.status === 'PAUSED';

  const toggle = async () => {
    if (acting.current) return;
    acting.current = true;
    setBusy(true);
    setFormError(null);
    try {
      const res = live ? await companionApi.pause(reason.trim() || undefined) : await companionApi.resume();
      setCompanion(res.companion);
      setReason('');
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not update. Check your connection.');
    } finally {
      acting.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen>
      <StepHeader title="Your companion profile" />
      {formError ? <Alert>{formError}</Alert> : null}
      <Card tone={live ? 'ok' : undefined}>
        <Pill label={statusLabel(companion.status)} tone={live ? 'ok' : 'info'} />
        <Text color={colors.fog100}>{live ? 'Customers can find and book you.' : paused ? 'You are hidden from search. Existing bookings stay as they are.' : 'Finish your setup to go live.'}</Text>
        {paused && companion.paused_reason ? <Text variant="caption" color={colors.fog400}>{`Reason: ${companion.paused_reason}`}</Text> : null}
        {live ? <TextField label="Reason for pausing (optional)" value={reason} onChangeText={setReason} maxLength={300} /> : null}
        {live || paused ? <Button variant={live ? 'secondary' : 'primary'} onPress={toggle} loading={busy}>{live ? 'Pause my profile' : 'Go live again'}</Button> : (
          <Button onPress={() => router.push(routeForStep(companion.next_step))}>Continue setup</Button>
        )}
      </Card>
      {companion.bank_details_reminder ? <Alert tone="info">Add your bank account so we can pay you. Payouts arrive weekly.</Alert> : null}
      <Card>
        <Text variant="small" color={colors.fog300}>{`Identity re-verification due ${dateIn(companion.reverify_due_at)}. We remind you 14 days before.`}</Text>
        {companion.live_at ? <Text variant="caption" color={colors.fog400}>{`Live since ${dateIn(companion.live_at)}`}</Text> : null}
      </Card>
      <View>
        <LinkRow label="Availability" onPress={() => router.push('/companion/setup')} />
        <LinkRow label="Rates" onPress={() => router.push('/companion/rates')} />
        <LinkRow label="Profile basics" onPress={() => router.push('/companion/profile')} />
        <LinkRow label="Photos" onPress={() => router.push('/companion/photos')} />
        <LinkRow label="Categories and boundaries" onPress={() => router.push('/companion/categories')} />
      </View>
    </Screen>
  );
}
