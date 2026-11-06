import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Misc';
import { Text } from '@/components/ui/Text';
import { detail as detailCopy, list as listCopy } from '@/content/bookings';
import { countdown, durationLabel, statusView, type PriceLine } from '@/lib/bookings/helpers';
import type { BookingListItem, CancellationPolicy, TimelineEntry } from '@/lib/bookings/types';
import { formatINR } from '@/lib/money';
import { formatDateTimeIST } from '@/lib/time';
import { colors, space } from '@/theme';

/** Price lines; amounts only through formatINR (paise in). */
export function PriceLines({ lines }: { lines: PriceLine[] }) {
  return (
    <Card>
      {lines.map((l) => (
        <View key={l.key} style={[styles.row, l.strong && styles.strongRow]} accessible accessibilityLabel={`${l.label}: ${formatINR(l.paise)}`}>
          <Text variant={l.strong ? 'body' : 'small'} weight={l.strong ? '600' : undefined} color={l.strong ? colors.textStrong : colors.text} style={{ flex: 1 }}>{l.label}</Text>
          <Text variant={l.strong ? 'body' : 'small'} weight={l.strong ? '600' : undefined} color={l.strong ? colors.textStrong : colors.text}>{formatINR(l.paise)}</Text>
        </View>
      ))}
    </Card>
  );
}

export function PolicyCard({ policy }: { policy: CancellationPolicy }) {
  return (
    <Card>
      {policy.lines.map((l) => (
        <Text key={l} variant="small" color={colors.text}>{`• ${l}`}</Text>
      ))}
      <Text variant="small" color={colors.textMuted}>{policy.companion_cancels}</Text>
    </Card>
  );
}

/** One list row (fixed height for the virtualised list). */
export const BOOKING_ROW_HEIGHT = 104;
export const BookingRow = memo(function BookingRow({ item, viewer, onPress, now }: { item: BookingListItem; viewer: 'CUSTOMER' | 'COMPANION'; onPress: (id: string) => void; now: number }) {
  const s = statusView(item.status, viewer);
  const due = item.status === 'AWAITING_COMPANION' ? countdown(item.companion_response_due_at, now) : item.status === 'PAYMENT_PENDING' ? countdown(item.payment_due_at, now) : null;
  return (
    <Card onPress={() => onPress(item.id)} accessibilityLabel={`${item.activity} with ${item.other_party}, ${formatDateTimeIST(item.start_at)}, ${s.label}`} style={{ height: BOOKING_ROW_HEIGHT - space.sm }}>
      <View style={styles.rowTop}>
        <Avatar name={item.other_party} uri={item.photo_url} size={40} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text weight="600" color={colors.textStrong} numberOfLines={1}>{`${item.activity} · ${item.other_party}`}</Text>
          <Text variant="caption" color={colors.textMuted} numberOfLines={1}>{`${formatDateTimeIST(item.start_at)} · ${durationLabel(item.duration_minutes)}${item.venue ? ` · ${item.venue}` : ''}`}</Text>
        </View>
        <Text variant="small" weight="600" color={colors.textStrong}>{formatINR(item.amount_paise)}</Text>
      </View>
      <View style={styles.rowBottom}>
        <Badge kind={s.badge} label={s.label} />
        {due && !due.expired ? <Text variant="caption" color={colors.warningText}>{item.status === 'AWAITING_COMPANION' ? listCopy.answerBy(due.label.replace(' left', '')) : listCopy.payBy(due.label.replace(' left', ''))}</Text> : null}
        {item.venue_pending_approval ? <Text variant="caption" color={colors.textMuted}>{listCopy.venuePending}</Text> : null}
      </View>
    </Card>
  );
});

/** The booking's status history, oldest first. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Card>
      {entries.map((e, i) => (
        <View key={`${e.to}-${i}`} style={styles.tl}>
          <View style={styles.dot} />
          <View style={{ flex: 1 }}>
            <Text variant="small" weight="600" color={colors.textStrong}>{statusView(e.to).label}</Text>
            <Text variant="caption" color={colors.textMuted}>{`${formatDateTimeIST(e.at)} · ${detailCopy.actor[e.actor_type]}`}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  strongRow: { marginTop: space.xs, paddingTop: space.sm, borderTopWidth: 1, borderTopColor: colors.border },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  rowBottom: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  tl: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: colors.accent },
});
