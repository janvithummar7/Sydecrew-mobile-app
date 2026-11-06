import { memo, useCallback, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Misc';
import { ListScreen } from '@/components/ui/Screen';
import { EmptyState, ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { chatList as copy } from '@/content/comms';
import { commsApi } from '@/lib/comms/api';
import { usePollingFallback, useRealtimeEvents, useRealtimeStatus } from '@/lib/comms/realtime-context';
import type { ConversationItem } from '@/lib/comms/types';
import { errorView } from '@/lib/errors';
import { formatTimeIST } from '@/lib/time';
import { alpha, colors, radius, space } from '@/theme';
import { PushPrompt } from './PushPrompt';

export const CONVERSATION_ROW_HEIGHT = 88;

/**
 * Messages tab for either side (Feature 5): one row per booking chat, newest
 * activity first, unread counts, closed / blocked chats marked. Updates on
 * realtime events; polls every 10 s while the socket is down.
 */
export function ConversationsList({ viewer }: { viewer: 'CUSTOMER' | 'COMPANION' }) {
  const router = useRouter();
  const rt = useRealtimeStatus();
  const [items, setItems] = useState<ConversationItem[] | null>(null);
  const [state, setState] = useState<{ refreshing: boolean; error: string | null; offline: boolean }>({ refreshing: false, error: null, offline: false });
  const loading = useRef(false);

  const load = useCallback(async (mode: 'load' | 'refresh' = 'load') => {
    if (loading.current) return;
    loading.current = true;
    if (mode === 'refresh') setState((s) => ({ ...s, refreshing: true }));
    try {
      const res = await commsApi.conversations();
      setItems(res.items);
      setState({ refreshing: false, error: null, offline: false });
    } catch (err) {
      const v = errorView(err);
      setState({ refreshing: false, error: v.offline ? null : v.message, offline: v.offline });
    } finally {
      loading.current = false;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  useRealtimeEvents((e) => {
    if (e.type === 'message.new' || e.type === 'message.updated' || e.type === 'read' || e.type === 'booking.status') void load();
  });
  usePollingFallback(() => void load(), 10_000);

  const open = useCallback((id: string) => router.push({ pathname: '/chat/[id]', params: { id } }), [router]);

  return (
    <ListScreen
      header={
        <View style={{ gap: space.sm }}>
          <Title>{copy.title}</Title>
          <Text variant="small" color={colors.textMuted}>{copy.subtitle}</Text>
          {state.offline ? <OfflineBanner onRetry={() => void load('refresh')} /> : rt === 'polling' ? <Text variant="caption" color={colors.textSubtle}>{copy.polling}</Text> : null}
        </View>
      }
    >
      {items === null ? (
        state.error ? <ErrorState message={state.error} onRetry={() => void load()} /> : state.offline ? null : <SkeletonList rows={4} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <ConversationRow item={item} onPress={open} />}
          getItemLayout={(_, index) => ({ length: CONVERSATION_ROW_HEIGHT, offset: CONVERSATION_ROW_HEIGHT * index, index })}
          refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={() => void load('refresh')} tintColor={colors.accent} />}
          ListEmptyComponent={
            <EmptyState
              icon="chatbubbles-outline"
              title={copy.emptyTitle}
              body={viewer === 'CUSTOMER' ? copy.emptyBody : copy.emptyCompanionBody}
              action={viewer === 'CUSTOMER' ? <Button variant="secondary" onPress={() => router.push('/discover')}>{copy.discover}</Button> : undefined}
            />
          }
          contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: space.xl }}
        />
      )}
      <PushPrompt />
    </ListScreen>
  );
}

const ConversationRow = memo(function ConversationRow({ item, onPress }: { item: ConversationItem; onPress: (id: string) => void }) {
  const last = item.last_message;
  const preview = last ? `${last.from === 'ME' ? copy.you : ''}${last.type === 'IMAGE' ? copy.photo : (last.preview ?? '')}` : '';
  const closed = !item.can_send;
  const label = [item.other_party, item.booking.ref, preview, item.unread ? copy.unread(item.unread) : null, closed ? copy.closed : null].filter(Boolean).join(', ');
  return (
    <View style={{ height: CONVERSATION_ROW_HEIGHT }} testID={`conversation-${item.id}`}>
      <Card onPress={() => onPress(item.id)} accessibilityLabel={label} style={{ height: CONVERSATION_ROW_HEIGHT - space.sm }}>
        <View style={styles.row}>
          <Avatar name={item.other_party} size={40} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={styles.top}>
              <Text weight="600" color={colors.textStrong} numberOfLines={1} style={{ flex: 1 }}>{item.other_party}</Text>
              {last ? <Text variant="caption" color={colors.textSubtle}>{formatTimeIST(last.at)}</Text> : null}
            </View>
            <View style={styles.top}>
              <Text variant="small" color={item.unread ? colors.textStrong : colors.textMuted} numberOfLines={1} style={{ flex: 1 }}>{preview || item.booking.ref}</Text>
              {closed ? <Text variant="caption" color={colors.textSubtle}>{copy.closed}</Text> : null}
              {item.unread ? (
                <View style={styles.unread}>
                  <Text variant="caption" weight="600" color={colors.onAccent}>{item.unread > 99 ? '99+' : String(item.unread)}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  unread: { minWidth: 22, height: 22, paddingHorizontal: 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, borderWidth: 1, borderColor: alpha(colors.accent, 0.4) },
});
