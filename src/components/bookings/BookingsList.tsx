import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { ListScreen } from '@/components/ui/Screen';
import { EmptyState, ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { list as copy } from '@/content/bookings';
import { bookingsApi } from '@/lib/bookings/api';
import type { BookingList, BookingListItem } from '@/lib/bookings/types';
import { errorView } from '@/lib/errors';
import { colors, space } from '@/theme';
import { BOOKING_ROW_HEIGHT, BookingRow } from './Parts';

type CustomerTab = 'upcoming' | 'past' | 'cancelled';
type CompanionTab = 'requests' | 'upcoming' | 'past' | 'cancelled';

/**
 * Bookings list for either side (Feature 4): tabs, a virtualised list with
 * fixed row heights, pull-to-refresh, offline banner over the last results,
 * and a ticking SLA countdown on requests.
 */
export function BookingsList({ viewer, title, subtitle }: { viewer: 'CUSTOMER' | 'COMPANION'; title: string; subtitle?: string }) {
  const router = useRouter();
  const tabs = (viewer === 'CUSTOMER' ? ['upcoming', 'past', 'cancelled'] : ['requests', 'upcoming', 'past', 'cancelled']) as (CustomerTab | CompanionTab)[];
  const labels: Record<string, string> = viewer === 'CUSTOMER' ? copy.tabs : copy.companionTabs;
  const [tab, setTab] = useState(tabs[0]);
  const [data, setData] = useState<Record<string, BookingListItem[]>>({});
  const [state, setState] = useState<{ loading: boolean; refreshing: boolean; error: string | null; offline: boolean }>({ loading: true, refreshing: false, error: null, offline: false });
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(
    async (t: string, mode: 'load' | 'refresh') => {
      setState((s) => ({ ...s, loading: mode === 'load' && !data[t], refreshing: mode === 'refresh', error: null }));
      try {
        const res: BookingList = viewer === 'CUSTOMER' ? await bookingsApi.list(t as CustomerTab) : await bookingsApi.companionList(t as CompanionTab);
        setData((d) => ({ ...d, [t]: res.items }));
        setState({ loading: false, refreshing: false, error: null, offline: false });
      } catch (err) {
        const v = errorView(err);
        setState({ loading: false, refreshing: false, error: v.offline ? null : v.message, offline: v.offline });
      }
    },
    [viewer, data],
  );

  // Reload when the tab opens again (after paying, cancelling, answering).
  useFocusEffect(
    useCallback(() => {
      void load(tab, 'load');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]),
  );
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const open = useCallback((id: string) => router.push({ pathname: '/booking/[id]', params: { id } }), [router]);
  const items = data[tab] ?? [];
  const emptyTitle = { upcoming: copy.emptyUpcoming, past: copy.emptyPast, cancelled: copy.emptyCancelled, requests: copy.emptyRequests }[tab];
  const emptyBody = tab === 'upcoming' && viewer === 'CUSTOMER' ? copy.emptyUpcomingBody : tab === 'requests' ? copy.emptyRequestsBody : undefined;

  return (
    <ListScreen
      header={
        <View style={{ gap: space.sm }}>
          <Title>{title}</Title>
          {subtitle ? <Text color={colors.textMuted}>{subtitle}</Text> : null}
          <ChipRow>
            {tabs.map((t) => (
              <Chip key={t} radio label={labels[t]} selected={tab === t} onPress={() => setTab(t)} />
            ))}
          </ChipRow>
          {state.offline ? <OfflineBanner onRetry={() => void load(tab, 'refresh')} /> : null}
        </View>
      }
    >
      {state.loading ? (
        <SkeletonList rows={4} />
      ) : state.error && !items.length ? (
        <ErrorState message={state.error} onRetry={() => void load(tab, 'load')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={{ height: BOOKING_ROW_HEIGHT }}>
              <BookingRow item={item} viewer={viewer} onPress={open} now={now} />
            </View>
          )}
          getItemLayout={(_, index) => ({ length: BOOKING_ROW_HEIGHT, offset: BOOKING_ROW_HEIGHT * index, index })}
          refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={() => void load(tab, 'refresh')} tintColor={colors.accent} />}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title={emptyTitle}
              body={emptyBody}
              action={viewer === 'CUSTOMER' && tab === 'upcoming' ? <Button variant="secondary" onPress={() => router.push('/discover')}>{copy.discover}</Button> : undefined}
            />
          }
          contentContainerStyle={{ paddingBottom: space.xl }}
        />
      )}
    </ListScreen>
  );
}
