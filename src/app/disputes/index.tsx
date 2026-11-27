import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StepHeader } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { DataState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { disputes as copy } from '@/content/support';
import { supportApi } from '@/lib/support/api';
import { disputeStatus } from '@/lib/support/helpers';
import { formatDateTimeIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/** Disputes on my bookings (GET /disputes), either side. */
export default function Disputes() {
  const router = useRouter();
  const q = useLoad(() => supportApi.disputes());
  const items = q.data ?? [];
  return (
    <Screen>
      <StepHeader title={copy.title} subtitle={copy.intro} />
      <DataState loading={q.loading} hasData={q.data != null} error={q.error} offline={q.offline} onRetry={q.reload} empty={!!q.data && items.length === 0} emptyTitle={copy.empty} emptyBody={copy.emptyBody}>
        <View style={{ gap: space.sm }}>
          {items.map((d) => (
            <Card key={d.id} onPress={() => router.push({ pathname: '/disputes/[id]', params: { id: d.id } })} accessibilityLabel={`${copy.booking(d.booking_ref)}, ${disputeStatus[d.status].label}`}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.md }}>
                <Text weight="600" color={colors.textStrong}>{copy.booking(d.booking_ref)}</Text>
                <Badge kind={disputeStatus[d.status].badge} label={disputeStatus[d.status].label} />
              </View>
              {d.response_due_at && (d.status === 'OPEN' || d.status === 'AWAITING_RESPONSE') ? <Text variant="caption" color={colors.textMuted}>{copy.addBy(formatDateTimeIST(d.response_due_at))}</Text> : null}
            </Card>
          ))}
        </View>
      </DataState>
    </Screen>
  );
}
