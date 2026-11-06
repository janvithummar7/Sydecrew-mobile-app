import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CardList } from '@/components/discovery/CardList';
import { FiltersSheet } from '@/components/discovery/FiltersSheet';
import { Waitlist } from '@/components/discovery/Waitlist';
import { Button, IconButton } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ListScreen } from '@/components/ui/Screen';
import { EmptyState, ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { categoryNames } from '@/content/common';
import { discover as copy } from '@/content/discovery';
import { useAuth } from '@/lib/auth';
import { discoveryApi } from '@/lib/discovery/api';
import { EMPTY_FILTERS, PAGE_SIZE, activeFilterCount, filtersToQuery, queryToFilters, withCategory, type DiscoveryFilters } from '@/lib/discovery/filters';
import { discoverView } from '@/lib/discovery/list';
import { applyPage, emptyPaged, nextCursor, type Paged } from '@/lib/discovery/paging';
import type { DiscoveryCard, DiscoveryList, DiscoveryOptions } from '@/lib/discovery/types';
import { errorView } from '@/lib/errors';
import { track } from '@/lib/track';
import { colors, space } from '@/theme';

type Meta = Pick<DiscoveryList, 'in_pilot' | 'city' | 'waitlist'>;
/** Results for one query string (the filters they were loaded with). */
type Result = { query: string; paged: Paged<DiscoveryCard>; meta: Meta };
type Failure = { query: string; offline: boolean; message: string | null };

/**
 * Last good results and options, kept for the app session: going offline (or
 * coming back to the tab) shows them under the offline banner instead of an empty screen.
 */
let lastOptions: DiscoveryOptions | null = null;
let lastResult: Result | null = null;

/**
 * Discover (Feature 3, artboard "Discover companions"): LIVE companions in the
 * customer's city from GET /discovery/companions. Quick category chips, a
 * filters sheet, a virtualised list with cursor paging and pull-to-refresh.
 * Outside a pilot area it is the waitlist. Filters can arrive as route params
 * (e.g. /discover?category=…), so a filtered view is linkable.
 *
 * Results and failures are stored with the query they belong to, so a filter
 * change needs no state reset: until the new page arrives the previous results
 * stay on screen with the refresh spinner, and a late answer for old filters is ignored.
 */
export default function Discover() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const { user } = useAuth();
  const [filters, setFilters] = useState<DiscoveryFilters>(() => (Object.keys(params).length ? queryToFilters(params) : lastResult ? queryToFilters(lastResult.query) : { ...EMPTY_FILTERS }));
  const [options, setOptions] = useState<DiscoveryOptions | null>(lastOptions);
  const [result, setResult] = useState<Result | null>(lastResult);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [pulling, setPulling] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sheet, setSheet] = useState(false);
  const query = filtersToQuery(filters);
  const latest = useRef(query);
  useEffect(() => {
    latest.current = query; // runs before the load effect below (effects run in order)
  }, [query]);

  const loadOptions = useCallback(
    () =>
      discoveryApi.options().then(
        (o) => {
          lastOptions = o;
          setOptions(o);
        },
        () => undefined, // the filters button stays disabled until options load; the list shows its own error
      ),
    [],
  );

  /** First page for a query; the answer is dropped if the filters changed meanwhile. */
  const loadFirst = useCallback(
    (q: string) =>
      discoveryApi
        .list(`${q ? `${q}&` : '?'}limit=${PAGE_SIZE}`)
        .then(
          (res) => {
            if (q !== latest.current) return;
            const next: Result = { query: q, paged: applyPage(emptyPaged<DiscoveryCard>(), res, 'reset'), meta: { in_pilot: res.in_pilot, city: res.city, waitlist: res.waitlist } };
            lastResult = next;
            setResult(next);
            setFailure(null);
          },
          (err) => {
            if (q !== latest.current) return;
            const v = errorView(err);
            setFailure({ query: q, offline: v.offline, message: v.offline ? null : v.message });
          },
        )
        .finally(() => setPulling(false)),
    [],
  );

  // Load on open (unless these exact results are cached) and whenever the filters change.
  const skipCached = useRef(lastResult?.query === query);
  useEffect(() => {
    if (skipCached.current) {
      skipCached.current = false;
      return;
    }
    void loadFirst(query);
  }, [query, loadFirst]);
  useEffect(() => {
    if (!lastOptions) void loadOptions();
  }, [loadOptions]);

  const stale = !result || result.query !== query;
  const failedNow = failure?.query === query ? failure : null;
  const refreshing = pulling || (stale && !!result && !failedNow);
  const paged = result?.paged ?? emptyPaged<DiscoveryCard>();

  const loadMore = async () => {
    if (!result || stale) return;
    const cursor = nextCursor(result.paged, loadingMore || refreshing);
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const res = await discoveryApi.list(filtersToQuery(filters, { cursor, limit: PAGE_SIZE }));
      if (result.query !== latest.current) return;
      const next = { ...result, paged: applyPage(result.paged, res, 'append') };
      lastResult = next;
      setResult(next);
      setFailure(null);
    } catch (err) {
      const v = errorView(err);
      setFailure({ query: result.query, offline: v.offline, message: v.offline ? null : v.message });
    } finally {
      setLoadingMore(false);
    }
  };

  const apply = (f: DiscoveryFilters) => {
    setSheet(false);
    setFilters(f);
    track('discovery.filters_applied', { count: activeFilterCount(f), sort: f.sort });
  };
  const refresh = () => {
    setPulling(true);
    void loadOptions();
    void loadFirst(query);
  };

  const offline = !!failure?.offline;
  const view = discoverView({ list: result?.meta ?? null, optionsInPilot: options?.in_pilot ?? null, items: paged.items.length, loaded: !stale && paged.loaded, failed: !!failedNow });
  const n = activeFilterCount(filters);
  // The waitlist city comes from the discovery options; the user's own city only when options have none.
  const waitCity = options?.city_id ?? user?.city_id ?? null;

  const header = (
    <>
      <View style={styles.titleRow}>
        <Title style={{ flex: 1 }}>{copy.title}</Title>
        <IconButton icon="bookmark-outline" label={copy.saved} onPress={() => router.push('/companions/saved')} />
        <IconButton icon="time-outline" label={copy.recent} onPress={() => router.push('/companions/recent')} />
      </View>
      <Text variant="small" color={colors.textMuted}>{copy.subtitle}</Text>
      {view !== 'waitlist' ? (
        <View style={styles.controls}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quick} style={{ flex: 1 }}>
            <Chip radio label={copy.all} selected={!filters.category} onPress={() => setFilters((f) => withCategory(f, null))} />
            {(options?.categories ?? []).map((c) => (
              <Chip key={c.id} radio label={categoryNames[c.code] ?? c.name} selected={filters.category === c.id} onPress={() => setFilters((f) => withCategory(f, f.category === c.id ? null : c.id))} />
            ))}
          </ScrollView>
          <Button variant="secondary" onPress={() => setSheet(true)} disabled={!options} icon={<Ionicons name="options-outline" size={18} color={colors.textStrong} />} accessibilityLabel={copy.filtersCount(n)}>
            {copy.filtersCount(n)}
          </Button>
        </View>
      ) : null}
      {offline ? (
        <View style={{ gap: space.xs }}>
          <OfflineBanner onRetry={refresh} />
          {paged.items.length ? <Text variant="caption" color={colors.textMuted}>{copy.offlineKept}</Text> : null}
        </View>
      ) : null}
    </>
  );

  const empty =
    view === 'waitlist' ? (
      <Waitlist
        city={result?.meta.city ?? options?.city ?? null}
        cityId={waitCity}
        zoneId={waitCity && waitCity === user?.city_id ? (user?.zone_id ?? null) : null}
        categoryId={filters.category}
        joined={!!result?.meta.waitlist?.joined}
      />
    ) : view === 'loading' ? (
      <SkeletonList rows={4} />
    ) : view === 'error' ? (
      failedNow?.offline ? null : <ErrorState message={failedNow?.message ?? ''} onRetry={refresh} />
    ) : (
      <EmptyState
        icon="search-outline"
        title={copy.emptyTitle}
        body={copy.emptyBody}
        action={n ? <Button variant="secondary" onPress={() => setFilters((f) => ({ ...EMPTY_FILTERS, sort: f.sort }))}>{copy.clearFilters}</Button> : null}
      />
    );

  const footer =
    view !== 'results' ? null : failure && !failure.offline && failure.message ? (
      <ErrorState message={failure.message} onRetry={() => void loadMore()} />
    ) : paged.done && !stale ? (
      <Text variant="caption" color={colors.textMuted}>{copy.end}</Text>
    ) : null;

  return (
    <ListScreen header={header}>
      <CardList
        testID="discover-list"
        items={view === 'waitlist' ? [] : paged.items}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={() => void loadMore()}
        loadingMore={loadingMore}
        empty={empty}
        footer={footer}
      />
      {options ? <FiltersSheet visible={sheet} onClose={() => setSheet(false)} options={options} value={filters} onApply={apply} /> : null}
    </ListScreen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  controls: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  quick: { gap: space.sm, paddingRight: space.sm },
});
