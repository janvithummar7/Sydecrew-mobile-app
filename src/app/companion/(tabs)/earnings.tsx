import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinkRow } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { DataState, EmptyState } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { earnings as copy } from '@/content/payouts';
import { errorView } from '@/lib/errors';
import { formatINR } from '@/lib/money';
import { payoutsApi } from '@/lib/payouts/api';
import { earningStatus, maskAccount, payoutStatus } from '@/lib/payouts/helpers';
import type { Earning, EarningStatus } from '@/lib/payouts/types';
import { formatDateIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

const FILTERS: (EarningStatus | null)[] = [null, 'PENDING', 'AVAILABLE', 'PAID', 'ON_HOLD'];

/**
 * Earnings (Feature 6): balances from GET /companion/earnings/summary, how
 * payouts work, the payout account (last 4 digits only), the last payout, and
 * the earnings list (GET /companion/earnings, cursor `before`).
 */
export default function Earnings() {
  const router = useRouter();
  const summary = useLoad(() => payoutsApi.summary());
  const [filter, setFilter] = useState<EarningStatus | null>(null);
  const list = useLoad(() => payoutsApi.earnings({ status: filter }), filter ?? 'all');
  // Extra pages continue one particular first page. When that page reloads (returning to the tab,
  // pull-to-refresh, another filter) they no longer line up, so they are dropped instead of duplicated.
  type More = { base: unknown; items: Earning[]; next: string | null; busy: boolean; error: string | null };
  const [moreState, setMore] = useState<More>({ base: null, items: [], next: null, busy: false, error: null });
  const more = moreState.base === list.data ? moreState : { base: list.data, items: [], next: null, busy: false, error: null };

  const firstNext = list.data?.next_before ?? null;
  const next = more.items.length ? more.next : firstNext;
  const items = [...(list.data?.earnings ?? []), ...more.items];
  const loadMore = async () => {
    if (!next || more.busy) return;
    const base = list.data;
    setMore({ ...more, base, busy: true, error: null });
    try {
      const page = await payoutsApi.earnings({ status: filter, before: next });
      setMore((m) => (m.base === base ? { base, items: [...m.items, ...page.earnings], next: page.next_before, busy: false, error: null } : m));
    } catch (err) {
      setMore((m) => (m.base === base ? { ...m, busy: false, error: errorView(err).message } : m));
    }
  };
  const choose = (f: EarningStatus | null) => {
    setMore({ base: null, items: [], next: null, busy: false, error: null });
    setFilter(f);
  };

  const s = summary.data;
  return (
    <Screen>
      <Title>{copy.title}</Title>
      <DataState loading={summary.loading} hasData={summary.data != null} error={summary.error} offline={summary.offline} onRetry={summary.reload}>
        {s ? (
          <>
            {s.on_hold ? <Alert tone="info">{copy.heldNotice}</Alert> : null}
            <Card tone="accent" accessibilityLabel={`${copy.available}: ${formatINR(s.balances.available)}`}>
              <Text variant="caption" color={colors.textMuted}>{copy.available}</Text>
              <Text variant="title" color={colors.textStrong} testID="earnings-available">{formatINR(s.balances.available)}</Text>
              <Text variant="small" color={colors.text}>{copy.nextPayout(formatDateIST(s.next_payout_date))}</Text>
              <Text variant="caption" color={colors.textMuted}>{copy.minimum(formatINR(s.min_payout_paise))}</Text>
            </Card>
            <Card>
              {(['pending', 'on_hold', 'in_batch', 'paid', 'clawback'] as const)
                .filter((k) => k !== 'clawback' || s.balances.clawback !== 0)
                .map((k) => (
                  <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }} accessible accessibilityLabel={`${copy.balances[k]}: ${formatINR(s.balances[k])}`}>
                    <Text variant="small" color={colors.text} style={{ flexShrink: 1 }}>{copy.balances[k]}</Text>
                    <Text variant="small" weight="600" color={colors.textStrong}>{formatINR(s.balances[k])}</Text>
                  </View>
                ))}
            </Card>
            {s.account ? (
              <LinkRow label={copy.account(maskAccount(s.account.last4), s.account.bank_name)} detail="Change or check your payout account" onPress={() => router.push('/companion/payout-account')} />
            ) : (
              <Alert tone="info" action={<Button variant="secondary" onPress={() => router.push('/companion/payout-account')}>{copy.addAccount}</Button>}>{copy.noAccount}</Alert>
            )}
            {s.last_payout ? (
              <Card onPress={() => router.push({ pathname: '/companion/payouts/[id]', params: { id: s.last_payout!.id } })} accessibilityLabel={`${copy.lastPayout}: ${formatINR(s.last_payout.net_paise)}, ${payoutStatus[s.last_payout.status].label}`}>
                <Text variant="caption" color={colors.textMuted}>{copy.lastPayout}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text weight="600" color={colors.textStrong}>{formatINR(s.last_payout.net_paise)}</Text>
                  <Badge kind={payoutStatus[s.last_payout.status].badge} label={payoutStatus[s.last_payout.status].label} />
                </View>
              </Card>
            ) : null}
            <LinkRow label={copy.payouts} detail="Every payout, with bank reference" onPress={() => router.push('/companion/payouts')} />
            <View style={{ gap: space.sm }}>
              <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{copy.howTitle}</Text>
              {copy.how.map((h) => (
                <Text key={h} variant="small" color={colors.text}>{`• ${h}`}</Text>
              ))}
            </View>
          </>
        ) : null}
      </DataState>

      <View style={{ gap: space.md }}>
        <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{copy.history}</Text>
        <ChipRow>
          {FILTERS.map((f) => (
            <Chip key={f ?? 'all'} radio label={f ? earningStatus[f].label : copy.filterAll} selected={filter === f} onPress={() => choose(f)} />
          ))}
        </ChipRow>
        <DataState loading={list.loading} hasData={list.data != null} error={list.error} offline={list.offline} onRetry={list.reload}>
          {items.length === 0 ? (
            <EmptyState icon="wallet-outline" title={copy.empty} body={copy.emptyBody} />
          ) : (
            <View style={{ gap: space.sm }}>
              {items.map((e) => (
                <EarningRow key={e.id} e={e} />
              ))}
              {more.error ? <Alert>{more.error}</Alert> : null}
              {next ? <Button variant="secondary" loading={more.busy} onPress={loadMore}>{copy.more}</Button> : null}
            </View>
          )}
        </DataState>
      </View>
    </Screen>
  );
}

function EarningRow({ e }: { e: Earning }) {
  const st = earningStatus[e.status];
  const when = e.paid_at ?? e.available_at ?? e.start_at ?? e.created_at;
  return (
    <Card accessibilityLabel={`${formatINR(e.amount_paise)}, ${st.label}${e.booking_ref ? `, booking ${e.booking_ref}` : ''}`}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.md }}>
        <Text weight="600" color={colors.textStrong}>{formatINR(e.amount_paise)}</Text>
        <Badge kind={st.badge} label={st.label} />
      </View>
      <Text variant="caption" color={colors.textMuted}>{[e.booking_ref, formatDateIST(when)].filter(Boolean).join(' · ')}</Text>
      {e.on_hold_reason ? <Text variant="caption" color={colors.text}>{e.on_hold_reason}</Text> : null}
    </Card>
  );
}
