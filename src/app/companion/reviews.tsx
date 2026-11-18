import { View } from 'react-native';
import { StepHeader } from '@/components/companion/Bits';
import { ReviewFeed } from '@/components/reviews/ReviewList';
import { RatingLine } from '@/components/reviews/Stars';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { ownReviews as copy } from '@/content/reviews';
import { reviewsApi } from '@/lib/reviews/api';
import { usePagedReviews } from '@/lib/reviews/usePagedReviews';
import { colors, space } from '@/theme';

const PAGE = 10;

/**
 * The companion's own reviews (GET /companion/reviews): their average (from
 * the first visible review), whether customers can see it yet (from
 * `min_count` reviews), and the released reviews with "Show more" and Report.
 */
export default function CompanionReviews() {
  const q = usePagedReviews((cursor) => reviewsApi.mine(cursor, PAGE), 'mine');
  const head = q.head;
  const count = head?.rating?.count ?? 0;
  return (
    <Screen>
      <StepHeader title={copy.title} subtitle={copy.subtitle} />
      {head ? (
        <Card>
          <Text variant="caption" color={colors.textMuted}>{copy.average}</Text>
          {head.rating ? <RatingLine rating={head.rating} size={18} /> : null}
          <Text variant="small" color={colors.text} testID="reviews-public-note">{head.public ? copy.publicYes : copy.publicNo(head.min_count, count)}</Text>
        </Card>
      ) : null}
      <View style={{ gap: space.sm }}>
        <ReviewFeed
          items={q.items}
          loading={q.loading}
          more={q.loadingMore}
          hasMore={q.hasMore}
          error={q.error}
          offline={q.offline}
          onMore={q.loadMore}
          onRetry={q.reload}
          empty={<EmptyState icon="star-outline" title={copy.emptyTitle} body={copy.emptyBody} />}
        />
      </View>
    </Screen>
  );
}
