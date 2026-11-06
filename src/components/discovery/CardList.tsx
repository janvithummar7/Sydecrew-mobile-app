import { useCallback, type ReactElement } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View, type ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { CompanionCard } from './CompanionCard';
import { discover as copy } from '@/content/discovery';
import { CARD_GAP, getItemLayout } from '@/lib/discovery/list';
import type { DiscoveryCard } from '@/lib/discovery/types';
import { colors, space } from '@/theme';

const keyOf = (c: DiscoveryCard) => c.id;
const Gap = () => <View style={{ height: CARD_GAP }} />;

/** Opens a public profile; stable across renders so memoised rows do not re-render. */
export function useOpenProfile() {
  const router = useRouter();
  return useCallback((id: string) => router.push({ pathname: '/companions/[id]', params: { id } }), [router]);
}

/**
 * The virtualised companion list used by Discover, Saved and Recent:
 * fixed-height rows (getItemLayout, no measuring), memoised cards, small
 * render batches, pull-to-refresh and an optional end-reached callback for
 * cursor paging. `footer` / `empty` render below / instead of the rows.
 */
export function CardList({ items, refreshing, onRefresh, onEndReached, loadingMore, empty, footer, testID }: {
  items: DiscoveryCard[];
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  empty?: ReactElement | null;
  footer?: ReactElement | null;
  testID?: string;
}) {
  const open = useOpenProfile();
  const renderItem: ListRenderItem<DiscoveryCard> = useCallback(({ item }) => <CompanionCard card={item} onOpen={open} />, [open]);
  return (
    <FlatList
      testID={testID}
      data={items}
      keyExtractor={keyOf}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={Gap}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={7}
      removeClippedSubviews
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} progressBackgroundColor={colors.bgRaised} />}
      ListEmptyComponent={empty ?? undefined}
      ListFooterComponent={
        <View style={styles.footer}>
          {loadingMore ? <ActivityIndicator color={colors.brand} accessibilityLabel={copy.loadingMore} /> : null}
          {footer}
        </View>
      }
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: space.xl, paddingBottom: space.xxl },
  footer: { paddingVertical: space.lg, gap: space.md, alignItems: 'center' },
});
