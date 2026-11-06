import { ConversationsList } from '@/components/comms/ConversationsList';

/** Messages tab (Feature 5): the customer's booking chats from GET /conversations. */
export default function Messages() {
  return <ConversationsList viewer="CUSTOMER" />;
}
