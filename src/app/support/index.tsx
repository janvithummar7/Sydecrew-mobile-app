import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinkRow, StepHeader } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SafetyCallout } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { DataState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { support as copy } from '@/content/support';
import { supportApi } from '@/lib/support/api';
import { ticketStatus } from '@/lib/support/helpers';
import { formatDateIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/** Support inbox (GET /support/tickets): ask for help, report a problem, see replies. */
export default function SupportInbox() {
  const router = useRouter();
  const q = useLoad(() => supportApi.tickets());
  const items = q.data ?? [];
  return (
    <Screen>
      <StepHeader title={copy.title} subtitle={copy.intro} />
      <Button onPress={() => router.push('/support/new')}>{copy.newTicket}</Button>
      <LinkRow label={copy.report} detail={copy.reportDetail} onPress={() => router.push('/support/report')} />
      <DataState loading={q.loading} error={q.error} offline={q.offline} onRetry={q.reload} empty={!!q.data && items.length === 0} emptyTitle={copy.empty} emptyBody={copy.emptyBody}>
        <View style={{ gap: space.sm }}>
          {items.map((t) => (
            <Card key={t.id} onPress={() => router.push({ pathname: '/support/[id]', params: { id: t.id } })} accessibilityLabel={`${t.subject}, ${ticketStatus[t.status].label}`}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.md }}>
                <Text weight="600" color={colors.textStrong} style={{ flexShrink: 1 }} numberOfLines={1}>{t.subject}</Text>
                <Badge kind={ticketStatus[t.status].badge} label={ticketStatus[t.status].label} />
              </View>
              <Text variant="caption" color={colors.textMuted}>{`${t.ticket_ref} · ${formatDateIST(t.updated_at)}`}</Text>
            </Card>
          ))}
        </View>
      </DataState>
      <SafetyCallout compact />
    </Screen>
  );
}
