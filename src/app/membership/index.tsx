import { useState } from 'react';
import { Alert as NativeAlert, Platform, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { LoadState } from '@/components/companion/Bits';
import { Badge, type BadgeKind } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { PriceTag, useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Sheet } from '@/components/ui/Sheet';
import { Text, Title } from '@/components/ui/Text';
import { membership as copy } from '@/content/membership';
import { errorView } from '@/lib/errors';
import { membershipApi } from '@/lib/membership/api';
import {
  cancelBody,
  cancelRequest,
  canCancel,
  canResume,
  changeResultText,
  confirmFor,
  isLive,
  nextChargeSentence,
  pendingSentence,
  periodEnd,
  planAction,
  planBenefits,
  startNote,
  statusLabel,
  statusMessage,
  statusTone,
  type Confirm,
  type PlanAction,
} from '@/lib/membership/helpers';
import type { Membership, MembershipOverview, MembershipPlan } from '@/lib/membership/types';
import { formatINR } from '@/lib/money';
import { formatDateIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

const REASON_MAX = 500;
const TONE_BADGE: Record<ReturnType<typeof statusTone>, BadgeKind> = { ok: 'live', warn: 'needs-changes', info: 'pending' };

/** Native confirm (react-native-web has no buttons on Alert: the development preview uses window.confirm). */
function ask(c: Confirm, back: string, onYes: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${c.title}\n\n${c.body}`)) onYes();
    return;
  }
  NativeAlert.alert(c.title, c.body, [
    { text: back, style: 'cancel' },
    { text: c.confirm, onPress: onYes },
  ]);
}

/**
 * Membership (D12, app:/membership). Plans and prices from GET /subscriptions;
 * the current membership's status, next charge, booked downgrade, cancelling
 * ("Keep my membership") and PAST_DUE grace; start (then autopay), upgrade
 * (now, prorated), downgrade (at renewal), cancel (benefits until the period
 * ends), and receipts.
 */
export default function MembershipScreen() {
  const router = useRouter();
  const toast = useToast();
  const data = useLoad(membershipApi.overview);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');

  const o = data.data;
  const current = o && isLive(o.current) ? o.current : null;

  const refresh = (next?: Partial<MembershipOverview>) => {
    if (next && o) data.setData({ ...o, ...next });
    data.reload();
  };

  const run = async (key: string, fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(key);
    setError(null);
    try {
      await fn();
    } catch (err) {
      const v = errorView(err);
      setError(v.message);
      if (v.code && v.code.startsWith('SUBSCRIPTION_')) data.reload();
    } finally {
      setBusy(null);
    }
  };

  const onPlan = (plan: MembershipPlan, action: PlanAction) => {
    if (!o) return;
    const c = confirmFor(action, plan, current, o.trial_eligible);
    if (!c) return;
    ask(c, copy.alertBack, () => {
      if (action.kind === 'start') {
        void run(plan.id, async () => {
          const r = await membershipApi.start(plan.id);
          router.push(`/membership/autopay?mandate=${encodeURIComponent(r.checkout.mandate_id)}&provider=${encodeURIComponent(r.checkout.provider)}` as Href);
        });
      } else if (action.kind === 'upgrade' || action.kind === 'downgrade' || action.kind === 'stay') {
        void run(plan.id, async () => {
          const r = await membershipApi.change(plan.id);
          toast(changeResultText(action.kind as 'upgrade' | 'downgrade' | 'stay', plan, r));
          refresh({ current: r.subscription });
        });
      }
    });
  };

  const resume = () =>
    run('resume', async () => {
      const r = await membershipApi.resume();
      toast(copy.resumed);
      refresh({ current: r.subscription });
    });

  const cancel = () =>
    run('cancel', async () => {
      const r = await membershipApi.cancel(cancelRequest(reason));
      setCancelling(false);
      setReason('');
      const end = r.subscription ? periodEnd(r.subscription) : null;
      toast(r.subscription && end ? copy.cancelled(formatDateIST(end)) : copy.endedNow);
      refresh({ current: r.subscription });
    });

  return (
    <Screen>
      <BackBar />
      <Title>{copy.title}</Title>
      <Text color={colors.textMuted}>{copy.intro}</Text>
      <LoadState loading={data.loading} error={data.error} offline={data.offline} onRetry={data.reload} />
      {error ? <Alert>{error}</Alert> : null}

      {o && current ? <StatusCard m={current} busy={busy} onResume={resume} onCancel={() => setCancelling(true)} /> : null}

      {o ? (
        <View style={{ gap: space.md }}>
          <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{copy.plansTitle}</Text>
          <Card tone={current ? 'default' : 'accent'}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <Text weight="600" color={colors.textStrong} style={{ flex: 1 }}>{copy.freeName}</Text>
              {!current ? <Badge kind="verified" label={copy.yourPlan} /> : null}
            </View>
            <PriceTag paise={0} />
            <Bullets lines={copy.freeBenefits} />
          </Card>
          {o.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} overview={o} current={current} busy={busy} onPress={onPlan} />
          ))}
          <Text variant="caption" color={colors.textMuted}>{copy.discountNote}</Text>
          <Text variant="caption" color={colors.textMuted}>{copy.confirmedNote}</Text>
        </View>
      ) : null}

      {o ? <Receipts receipts={o.receipts} /> : null}

      <Sheet visible={cancelling && !!current} onClose={() => setCancelling(false)} title={copy.cancelTitle}>
        {current ? (
          <View style={{ gap: space.md }}>
            <Text color={colors.text}>{cancelBody(current)}</Text>
            <Text variant="small" color={colors.textMuted}>{copy.confirmedNote}</Text>
            <TextField label={copy.reason} hint={copy.reasonHint} value={reason} onChangeText={setReason} multiline maxLength={REASON_MAX} />
            <Button variant="danger" loading={busy === 'cancel'} onPress={cancel}>{copy.cancelConfirm}</Button>
            <Button variant="ghost" onPress={() => setCancelling(false)}>{copy.cancelBack}</Button>
          </View>
        ) : null}
      </Sheet>
    </Screen>
  );
}

function StatusCard({ m, busy, onResume, onCancel }: { m: Membership; busy: string | null; onResume: () => void; onCancel: () => void }) {
  const tone = statusTone(m);
  const next = nextChargeSentence(m);
  const pending = pendingSentence(m);
  return (
    <Card tone={tone === 'warn' ? 'warn' : 'ok'}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <Text variant="heading" color={colors.textStrong} style={{ flex: 1 }}>{m.plan.name}</Text>
        <Badge kind={TONE_BADGE[tone]} label={statusLabel(m)} />
      </View>
      <Text color={m.status === 'PAST_DUE' ? colors.warningText : colors.text}>{statusMessage(m)}</Text>
      {next ? <Text variant="small" color={colors.text}>{next}</Text> : null}
      {next ? <Text variant="caption" color={colors.textMuted}>{copy.preDebit}</Text> : null}
      {pending ? <Text variant="small" color={colors.textMuted}>{pending}</Text> : null}
      {canResume(m) ? <Button loading={busy === 'resume'} onPress={onResume}>{copy.keep}</Button> : null}
      {canCancel(m) ? <Button variant="ghost" onPress={onCancel}>{copy.cancel}</Button> : null}
    </Card>
  );
}

function PlanCard({ plan, overview, current, busy, onPress }: {
  plan: MembershipPlan;
  overview: MembershipOverview;
  current: Membership | null;
  busy: string | null;
  onPress: (plan: MembershipPlan, action: PlanAction) => void;
}) {
  const action = planAction(plan, current, overview.trial_eligible);
  const mine = action.kind === 'current' || action.kind === 'stay';
  return (
    <Card tone={mine ? 'accent' : 'default'}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <Text weight="600" color={colors.textStrong} style={{ flex: 1 }}>{plan.name}</Text>
        {mine ? <Badge kind="verified" label={copy.yourPlan} /> : null}
        {action.kind === 'pending' && current?.current_period_end ? <Badge kind="pending" label={copy.startsOn(formatDateIST(current.current_period_end))} /> : null}
      </View>
      <Text weight="600" color={colors.textStrong}>{copy.perMonth(formatINR(plan.price_paise))}</Text>
      {plan.description ? <Text variant="small" color={colors.textMuted}>{plan.description}</Text> : null}
      <Bullets lines={planBenefits(plan)} />
      {action.kind === 'start' ? <Text variant="small" color={colors.text}>{startNote(plan, overview.trial_eligible)}</Text> : null}
      {action.kind === 'start' || action.kind === 'upgrade' || action.kind === 'downgrade' || action.kind === 'stay' ? (
        <Button variant={action.kind === 'downgrade' || action.kind === 'stay' ? 'secondary' : 'primary'} loading={busy === plan.id} disabled={!!busy && busy !== plan.id} onPress={() => onPress(plan, action)}>
          {action.label}
        </Button>
      ) : null}
      {action.kind === 'blocked' ? <Text variant="caption" color={colors.textMuted}>{action.reason}</Text> : null}
    </Card>
  );
}

function Bullets({ lines }: { lines: readonly string[] }) {
  return (
    <View style={{ gap: space.xs }}>
      {lines.map((line) => (
        <View key={line} style={{ flexDirection: 'row', gap: space.sm }}>
          <Text color={colors.textSubtle}>•</Text>
          <Text variant="small" color={colors.text} style={{ flex: 1 }}>{line}</Text>
        </View>
      ))}
    </View>
  );
}

function Receipts({ receipts }: { receipts: MembershipOverview['receipts'] }) {
  return (
    <View style={{ gap: space.md }}>
      <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{copy.receiptsTitle}</Text>
      {receipts.length === 0 ? (
        <Text variant="small" color={colors.textMuted}>{copy.receiptsEmpty}</Text>
      ) : (
        <Card>
          {receipts.map((r) => (
            <View key={r.payment_id} style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="small" color={colors.textStrong}>{r.description}</Text>
                <Text variant="caption" color={colors.textMuted}>
                  {[formatDateIST(r.paid_at), r.receipt_number ? copy.receipt(r.receipt_number) : null].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <Text variant="small" weight="600" color={colors.textStrong}>{formatINR(r.amount_paise)}</Text>
            </View>
          ))}
        </Card>
      )}
    </View>
  );
}
