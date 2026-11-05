import { EmptyState } from '@/components/ui/States';
import { PlaceholderNotice } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Title } from '@/components/ui/Text';
import { messages as copy } from '@/content/customer';

/** Messages (PLACEHOLDER): chat opens with bookings. No messaging API. */
export default function Messages() {
  return (
    <Screen>
      <Title>{copy.title}</Title>
      <PlaceholderNotice />
      <EmptyState icon="chatbubbles-outline" title={copy.emptyTitle} body={copy.emptyBody} />
    </Screen>
  );
}
