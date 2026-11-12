import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StepHeader } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { DataState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { payout as copy } from '@/content/payouts';
import { formatINR } from '@/lib/money';
import { payoutsApi } from '@/lib/payouts/api';
import { maskAccount, payoutStatus } from '@/lib/payouts/helpers';
import { formatDateIST, formatDateTimeIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/**
 * One payout (GET /companion/payouts/:id): amounts, bank reference (UTR), the
 * account (last 4 digits) and every line it covers. The statement is shown
 * in-app: the app has no authenticated file-download pattern yet, so the
 * HTML/CSV statement endpoint is not opened from here.
 */
export default function PayoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useLoad(() => payoutsApi.payout(id ?? ''), id ?? '');
  const p = q.data;
  return (
    <Screen>
      <StepHeader title={copy.title} />
      <DataState loading={q.loading} error={q.error} offline={q.offline} onRetry={q.reload}>
        {p ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <Badge kind={payoutStatus[p.status].badge} label={payoutStatus[p.status].label} />
              <Text variant="caption" color={colors.textMuted}>{p.payout_ref}</Text>
            </View>
            {p.status === 'FAILED' || p.status === 'REVERSED' ? <Alert tone="info">{p.failure_reason ? `${copy.failed} ${p.failure_reason}` : copy.failed}</Alert> : null}
            <Card>
              <Line label={copy.gross} value={formatINR(p.gross_paise)} />
              {p.tds_paise ? <Line label={copy.tds} value={formatINR(-p.tds_paise)} /> : null}
              {p.deductions_paise ? <Line label={copy.deductions} value={formatINR(-p.deductions_paise)} /> : null}
              <Line label={copy.net} value={formatINR(p.net_paise)} strong />
            </Card>
            <Card>
              <Line label={copy.to} value={`${p.bank_name ? `${p.bank_name} ` : ''}${maskAccount(p.account_last4)}`} />
              {p.utr ? <Line label={copy.utr} value={p.utr} /> : null}
              {p.paid_at ? <Line label={copy.paidAt} value={formatDateTimeIST(p.paid_at)} /> : null}
            </Card>
            <View style={{ gap: space.sm }}>
              <Text variant="eyebrow" color={colors.textSubtle}>{copy.lines}</Text>
              <Card>
                {p.lines.map((l) => (
                  <Line key={l.id} label={[l.description ?? l.booking_ref ?? l.type, l.start_at ? formatDateIST(l.start_at) : null].filter(Boolean).join(' · ')} value={formatINR(l.amount_paise)} />
                ))}
              </Card>
            </View>
          </>
        ) : null}
      </DataState>
    </Screen>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text variant="small" color={colors.text} style={{ flexShrink: 1 }}>{label}</Text>
      <Text variant="small" weight={strong ? '600' : undefined} color={colors.textStrong}>{value}</Text>
    </View>
  );
}
