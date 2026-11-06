import { useCallback, useEffect } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusTimeline } from '@/components/ui/Misc';
import { Card, LinkRow, LoadState, Pill, Section, StepHeader, dateIn } from '@/components/companion/Bits';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useCompanion } from '@/lib/companion/context';
import { isApproved, routeForStep, statusLabel, timelineStages } from '@/lib/companion/steps';
import { colors } from '@/theme';

/** Application status: timeline, review time, what to fix (deep links), rejection reason, cooldown. */
export default function Status() {
  const router = useRouter();
  const { companion, loading, error, refresh } = useCompanion();

  // Fresh status whenever the screen is shown, and every 20 s while a check or review is running.
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );
  const waiting = companion && ['SUBMITTED', 'IN_REVIEW'].includes(companion.status);
  useEffect(() => {
    if (!waiting) return undefined;
    const t = setInterval(() => void refresh(), 20_000);
    return () => clearInterval(t);
  }, [waiting, refresh]);

  if (!companion) return <Screen><StepHeader title="Your application" /><LoadState loading={loading} error={error} onRetry={refresh} /></Screen>;
  const v = companion.verification;
  const fixes = v?.fix_items ?? [];
  const stages = timelineStages(companion.status);
  const next = companion.next_step;

  const footer = isApproved(companion.status) ? (
    <Button onPress={() => router.replace(routeForStep(next))}>{companion.status === 'LIVE' || companion.status === 'PAUSED' ? 'Open your dashboard' : 'Set up your profile'}</Button>
  ) : ['DRAFT', 'NEEDS_CHANGES', 'REVERIFICATION_REQUIRED'].includes(companion.status) && next !== 'COOLDOWN' && next !== 'WAITING' ? (
    <Button onPress={() => router.push(next === 'FIX_REQUIRED' ? routeForStep(fixes[0]?.step ?? 'SUBMIT') : routeForStep(next))}>Continue</Button>
  ) : undefined;

  return (
    <Screen footer={footer}>
      <StepHeader title="Your application" back={false} />
      {error ? <Alert action={<TextButton onPress={refresh}>Try again</TextButton>}>{error}</Alert> : null}
      <Card>
        <Pill label={statusLabel(companion.status)} tone={companion.status === 'REJECTED' || companion.status === 'SUSPENDED' ? 'warn' : isApproved(companion.status) ? 'ok' : 'info'} />
        <StatusTimeline stages={stages} />
        {waiting ? <Text variant="small" color={colors.fog300}>{`${companion.review_sla_text}. We will email you when there is a decision.`}</Text> : null}
        {companion.submitted_at ? <Text variant="caption" color={colors.fog400}>{`Submitted ${dateIn(companion.submitted_at)}`}</Text> : null}
      </Card>

      {fixes.length && ['NEEDS_CHANGES', 'DRAFT'].includes(companion.status) ? (
        <Section title="What to fix" hint={v?.note ?? undefined}>
          {fixes.map((f) => <LinkRow key={f.code} label={f.label} onPress={() => router.push(routeForStep(f.step))} />)}
        </Section>
      ) : null}

      {companion.retry_after ? <Alert tone="info">{`You have tried several times. You can try again after ${dateIn(companion.retry_after)}.`}</Alert> : null}
      {companion.manual_reopen_required ? <Alert tone="info">Our team needs to look at your application before you can try again. We will contact you.</Alert> : null}

      {companion.status === 'REJECTED' ? (
        <Alert>
          {`${v?.decision_reason?.text ?? 'Your application was not approved.'} ${companion.reapply_blocked ? 'You cannot apply again.' : companion.reapply_after ? `You can apply again after ${dateIn(companion.reapply_after)}.` : ''}`}
        </Alert>
      ) : null}
      {companion.status === 'SUSPENDED' ? <Alert>Your companion profile is suspended. Our Trust & Safety team will contact you.</Alert> : null}
      {companion.status === 'REVERIFICATION_REQUIRED' ? <Alert tone="info">Please verify your identity again. Your profile is hidden from search until you do.</Alert> : null}
    </Screen>
  );
}
