import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinkRow, LoadState, StepHeader, dateIn } from '@/components/companion/Bits';
import { RoleSwitch } from '@/components/nav/Shell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import { companionStateKey, ctaRoute, isApproved } from '@/lib/companion/steps';
import { errorView } from '@/lib/errors';
import { companionStates } from '@/content/companion';
import { nav } from '@/content/common';
import { colors, space } from '@/theme';

/**
 * Companion Dashboard: the one status-driven screen state + call to action per
 * profile status (content/companion.ts), pause / resume, re-verification date,
 * the public-profile preview and the role switcher.
 */
export default function Dashboard() {
  const router = useRouter();
  const toast = useToast();
  const { companion, loading, error, refresh, setCompanion } = useCompanion();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const acting = useRef(false);

  if (!companion) {
    return (
      <Screen>
        <StepHeader title={nav.companion.dashboard} back={false} />
        <LoadState loading={loading} error={error} onRetry={refresh} />
      </Screen>
    );
  }
  const key = companionStateKey(companion.status, companion.next_step);
  const state = companionStates[key];
  const live = companion.status === 'LIVE';
  const paused = companion.status === 'PAUSED';
  const cta = ctaRoute(companion.status, companion.next_step, companion.verification?.fix_items[0]?.step);

  const toggle = async () => {
    if (acting.current) return;
    acting.current = true;
    setBusy(true);
    setFormError(null);
    try {
      const res = live ? await companionApi.pause(reason.trim() || undefined) : await companionApi.resume();
      setCompanion(res.companion);
      setReason('');
      toast(live ? 'Profile paused' : 'You are live again');
    } catch (err) {
      setFormError(errorView(err).message);
    } finally {
      acting.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen>
      <StepHeader title={nav.companion.dashboard} back={false} />
      {formError ? <Alert>{formError}</Alert> : null}
      <Card tone={live ? 'ok' : key === 'SUSPENDED' || key === 'REJECTED' ? 'warn' : 'default'}>
        <Badge kind={state.badge} label={state.label} />
        <Text variant="heading" color={colors.textStrong}>{state.title}</Text>
        <Text color={colors.text}>{state.body}</Text>
        {paused && companion.paused_reason ? <Text variant="caption" color={colors.textMuted}>{`Reason: ${companion.paused_reason}`}</Text> : null}
        {key === 'COOLDOWN' && companion.retry_after ? <Text variant="small" color={colors.textMuted}>{`Try again after ${dateIn(companion.retry_after)}.`}</Text> : null}
        {live ? <TextField label="Reason for pausing (optional)" value={reason} onChangeText={setReason} maxLength={300} /> : null}
        {live ? <Button variant="secondary" onPress={toggle} loading={busy}>Pause my profile</Button> : null}
        {paused ? <Button onPress={toggle} loading={busy}>{state.cta ?? 'Resume'}</Button> : null}
        {!paused && cta && state.cta ? <Button onPress={() => router.push(cta)}>{state.cta}</Button> : null}
      </Card>
      {companion.bank_details_reminder ? (
        <Alert tone="info" action={<Button variant="secondary" onPress={() => router.push('/companion/payout-account')}>Add bank account</Button>}>
          Add your bank account to receive payouts. You do not need it to go live.
        </Alert>
      ) : null}
      {isApproved(companion.status) ? (
        <Card>
          <Text variant="small" color={colors.text}>{`Identity re-verification due ${dateIn(companion.reverify_due_at)}. We remind you 14 days before.`}</Text>
          {companion.live_at ? <Text variant="caption" color={colors.textMuted}>{`Live since ${dateIn(companion.live_at)}`}</Text> : null}
        </Card>
      ) : null}
      <View style={{ gap: space.xs }}>
        <LinkRow label={nav.previewProfile} detail="This is how customers will see you" onPress={() => router.push('/companion/preview')} />
        <LinkRow label="Photos" onPress={() => router.push('/companion/photos')} />
        <LinkRow label="Categories and boundaries" onPress={() => router.push('/companion/categories')} />
        <LinkRow label={nav.sos} detail={nav.sosDetail} onPress={() => router.push('/safety/sos')} />
        <LinkRow label={nav.safetyContacts} detail={nav.safetyContactsDetail} onPress={() => router.push('/safety/contacts')} />
        <LinkRow label={nav.settings} onPress={() => router.push('/settings')} />
      </View>
      <RoleSwitch to="customer" />
    </Screen>
  );
}
