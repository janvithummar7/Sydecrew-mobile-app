import { CardsScreen } from '@/components/discovery/CardsScreen';
import { lists as copy } from '@/content/discovery';
import { discoveryApi } from '@/lib/discovery/api';

/** Saved companions (GET /discovery/saved). Reached from Discover and the Profile tab. */
export default function SavedCompanions() {
  return <CardsScreen testID="saved-list" title={copy.savedTitle} load={discoveryApi.saved} emptyTitle={copy.savedEmptyTitle} emptyBody={copy.savedEmptyBody} />;
}
