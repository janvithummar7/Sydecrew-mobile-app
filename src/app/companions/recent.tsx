import { CardsScreen } from '@/components/discovery/CardsScreen';
import { lists as copy } from '@/content/discovery';
import { discoveryApi } from '@/lib/discovery/api';

/** Recently viewed profiles (GET /discovery/recent). Reached from Discover and the Profile tab. */
export default function RecentCompanions() {
  return <CardsScreen testID="recent-list" title={copy.recentTitle} load={discoveryApi.recent} emptyTitle={copy.recentEmptyTitle} emptyBody={copy.recentEmptyBody} />;
}
