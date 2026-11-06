import { ConversationsList } from '@/components/comms/ConversationsList';

/** Messages tab (Feature 5): the companion's booking chats from GET /conversations. */
export default function CompanionMessages() {
  return <ConversationsList viewer="COMPANION" />;
}
