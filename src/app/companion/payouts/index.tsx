import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StepHeader } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { DataState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { earnings as copy } from '@/content/payouts';
import { formatINR } from '@/lib/money';
import { payoutsApi } from '@/lib/payouts/api';
import { payoutStatus } from '@/lib/payouts/helpers';
import { formatDateIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/** Payouts list (GET /companion/payouts): newest first, net amount and status. */
export default function Payouts() {
  const router = useRouter();
  const q = useLoad(() => payoutsApi.payouts());
  const items = q.data?.payouts ?? [];
  return (
    <Screen>
      <StepHeader title={copy.payouts} />
      <DataState loading={q.loading} hasData={q.data != null} error={q.error} offline={q.offline} onRetry={q.reload} empty={!!q.data && items.length === 0} emptyTitle={copy.noPayouts} emptyBody={copy.noPayoutsBody}>
        <View style={{ gap: space.sm }}>
          {items.map((p) => {
            const st = payoutStatus[p.status];
            return (
              <Card key={p.id} onPress={() => router.push({ pathname: '/companion/payouts/[id]', params: { id: p.id } })} accessibilityLabel={`${formatINR(p.net_paise)}, ${st.label}, ${formatDateIST(p.paid_at ?? p.cycle_date ?? p.created_at)}`}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text weight="600" color={colors.textStrong}>{formatINR(p.net_paise)}</Text>
                  <Badge kind={st.badge} label={st.label} />
                </View>
                <Text variant="caption" color={colors.textMuted}>{`${p.payout_ref} · ${formatDateIST(p.paid_at ?? p.cycle_date ?? p.created_at)}`}</Text>
              </Card>
            );
          })}
        </View>
      </DataState>
    </Screen>
  );
}
