import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { Button } from '@/components/ui/Button';
import { ListScreen } from '@/components/ui/Screen';
import { EmptyState, ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Title } from '@/components/ui/Text';
import { lists as copy } from '@/content/discovery';
import type { DiscoveryCards, DiscoveryCard } from '@/lib/discovery/types';
import { errorView } from '@/lib/errors';
import { CardList } from './CardList';

/**
 * Saved / Recently viewed: one short list (no paging) of the same cards as
 * Discover. Reloads when the screen regains focus (a save on a profile shows
 * up straight away); offline keeps what was loaded under the offline banner.
 */
export function CardsScreen({ title, load, emptyTitle, emptyBody, testID }: { title: string; load: () => Promise<DiscoveryCards>; emptyTitle: string; emptyBody: string; testID?: string }) {
  const router = useRouter();
  const [items, setItems] = useState<DiscoveryCard[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const fetchList = useCallback(async (pull = false) => {
    if (pull) setRefreshing(true);
    try {
      const res = await load();
      setItems(res.items);
      setError(null);
      setOffline(false);
    } catch (err) {
      const v = errorView(err);
      setOffline(v.offline);
      setError(v.offline ? null : v.message);
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      fetchList();
    }, [fetchList]),
  );

  const empty =
    items === null ? (offline ? null : error ? <ErrorState message={error} onRetry={() => fetchList()} /> : <SkeletonList rows={4} />) : (
      <EmptyState icon="bookmark-outline" title={emptyTitle} body={emptyBody} action={<Button variant="secondary" onPress={() => router.push('/discover')}>{copy.browse}</Button>} />
    );

  return (
    <ListScreen
      header={
        <>
          <BackBar />
          <Title>{title}</Title>
          {offline ? <OfflineBanner onRetry={() => fetchList()} /> : null}
          {items !== null && error ? <ErrorState message={error} onRetry={() => fetchList()} /> : null}
        </>
      }
    >
      <CardList testID={testID} items={items ?? []} refreshing={refreshing} onRefresh={() => fetchList(true)} empty={empty} />
    </ListScreen>
  );
}
