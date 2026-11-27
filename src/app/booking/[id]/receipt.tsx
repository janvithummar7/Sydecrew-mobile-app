import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StepHeader } from '@/components/companion/Bits';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { DataState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { receipt as copy } from '@/content/support';
import { durationLabel } from '@/lib/bookings/helpers';
import { formatINR } from '@/lib/money';
import { supportApi } from '@/lib/support/api';
import { formatDateTimeIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/** Customer receipt (§5.4, GET /bookings/:id/receipt). Always labelled "Receipt" (never a tax invoice), with the API's note. */
export default function ReceiptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useLoad(() => supportApi.receipt(id ?? ''), id ?? '');
  const r = q.data;
  return (
    <Screen>
      <StepHeader title={copy.title} />
      <DataState loading={q.loading} hasData={q.data != null} error={q.error} offline={q.offline} onRetry={q.reload}>
        {r ? (
          <>
            <Card>
              <Row label={copy.number} value={r.receipt_number} />
              {r.paid_at ? <Row label={copy.paidOn} value={formatDateTimeIST(r.paid_at)} /> : null}
              {r.method ? <Row label={copy.method} value={r.method} /> : null}
            </Card>
            <Card>
              <Row label={copy.meeting} value={[r.activity, `${formatDateTimeIST(r.start_at)} · ${durationLabel(r.duration_minutes)}`].filter(Boolean).join(' · ')} />
              {r.companion ? <Row label={copy.with} value={r.companion} /> : null}
              {r.venue ? <Row label={copy.venue} value={r.venue} /> : null}
            </Card>
            <Card>
              {r.lines.map((l) => (
                <Row key={l.label} label={l.label} value={formatINR(l.amount_paise)} />
              ))}
              <Row label={copy.total} value={formatINR(r.total_paise)} strong />
              {r.refunds.map((x, i) => (
                <Row key={i} label={`${copy.refunded}${x.processed_at ? ` · ${formatDateTimeIST(x.processed_at)}` : ''}`} value={formatINR(-x.amount_paise)} />
              ))}
              {r.refunds.length ? <Row label={copy.net} value={formatINR(r.net_paid_paise)} strong /> : null}
            </Card>
            <Text variant="caption" color={colors.textMuted}>{r.note}</Text>
            <Text variant="caption" color={colors.textMuted}>{r.booking_ref}</Text>
          </>
        ) : null}
      </DataState>
    </Screen>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text variant="small" color={colors.textMuted} style={{ flexShrink: 1 }}>{label}</Text>
      <Text variant="small" weight={strong ? '600' : undefined} color={colors.textStrong} style={{ flexShrink: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}
