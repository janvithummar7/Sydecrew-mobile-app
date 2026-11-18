import { Text } from '@/components/ui/Text';
import { reviewList as copy } from '@/content/reviews';
import { reviewsApi } from '@/lib/reviews/api';
import { usePagedReviews } from '@/lib/reviews/usePagedReviews';
import { colors } from '@/theme';
import { ReviewFeed } from './ReviewList';

const PAGE = 5;

/**
 * The Reviews list on a companion's public profile (customers): the first
 * page of GET /discovery/companions/:id/reviews, then "Show more". Rendered
 * only when the profile has a public rating (the list is empty below the threshold).
 */
export function ProfileReviews({ companionId }: { companionId: string }) {
  const q = usePagedReviews((cursor) => reviewsApi.forCompanion(companionId, cursor, PAGE), companionId);
  return (
    <ReviewFeed
      items={q.items}
      loading={q.loading}
      more={q.loadingMore}
      hasMore={q.hasMore}
      error={q.error}
      offline={q.offline}
      onMore={q.loadMore}
      onRetry={q.reload}
      empty={<Text variant="small" color={colors.textMuted}>{copy.noPublic}</Text>}
    />
  );
}
