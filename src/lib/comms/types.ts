/** Chat, call and safety API shapes (Feature 5), from the generated contract (src/lib/contract/schema.ts). */
import type { components } from '../contract/schema';

type S = components['schemas'];

export type Conversations = S['ConversationsResponse'];
export type ConversationItem = Conversations['items'][number];
export type MessagesPage = S['MessagesResponse'];
export type ConversationMeta = MessagesPage['conversation'];
export type Message = S['MessageView'];
export type MessageSent = S['MessageSentResponse'];
export type Moderation = S['MessageModeration'];
export type ChatClosedReason = S['ChatClosedReason'];
export type ReportReason = S['ProfileReportReason'];
export type ReportInput = S['postMessagesByIdReportBody'];
export type Reported = S['ReportedResponse'];
export type UploadUrl = S['UploadUrlResponse'];

export type CallNumber = S['CallNumberResponse'];
export type LocationSharing = S['LocationSharingResponse'];
export type Sos = S['SosResponse'];
export type SosCurrent = S['SosCurrentResponse'];
export type SosIncident = Sos['incident'];
export type SosInput = S['postSafetySosBody'];
export type PingAnswered = S['PingAnsweredResponse'];
export type TrustedContacts = S['TrustedContactsResponse'];
export type TrustedContact = TrustedContacts['items'][number];
export type TrustedContactInput = S['postSafetyTrustedContactsBody'];
export type TrustedContactAdded = S['TrustedContactAddedResponse'];

/** Events on the realtime socket (src/lib/comms/realtime.ts). */
export type RealtimeEvent =
  | { type: 'ready'; payload: { user_id: string } }
  | { type: 'message.new' | 'message.updated'; payload: { conversation_id: string; message: Message } }
  | { type: 'read'; payload: { conversation_id: string; read_at: string } }
  | { type: 'booking.status'; payload: { booking_id: string; status?: string; chat_closed?: boolean; conversation_blocked?: boolean } }
  | { type: 'safety.ping'; payload: { booking_id: string; ping_id: string } }
  | { type: 'incident.update'; payload: { id: string; acknowledged?: boolean } }
  | { type: 'pong'; payload?: undefined };
