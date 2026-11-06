import { api } from '../api';
import type {
  CallNumber,
  Conversations,
  LocationSharing,
  MessageSent,
  MessagesPage,
  PendingPing,
  PingAnswered,
  ReportInput,
  Reported,
  Sos,
  SosCurrent,
  SosInput,
  TrustedContactAdded,
  TrustedContactInput,
  TrustedContacts,
  UploadUrl,
} from './types';

const enc = encodeURIComponent;

/**
 * Chat (D14), masked calls (D15), location sharing, safety pings and SOS
 * (D16, D21). Everything is booking-scoped; no response ever carries a phone
 * number or email of the other person, and trusted contacts come back masked.
 */
export const commsApi = {
  conversations: () => api<Conversations>('/conversations'),
  messages: (id: string, before?: string | null) => api<MessagesPage>(`/conversations/${enc(id)}/messages?limit=30${before ? `&before=${enc(before)}` : ''}`),
  /** The client message id is the Idempotency-Key: a retry sends the same one and gets the same message. */
  send: (id: string, body: { body?: string; asset_id?: string }, clientMessageId: string) =>
    api<MessageSent>(`/conversations/${enc(id)}/messages`, { method: 'POST', body, headers: { 'Idempotency-Key': clientMessageId } }),
  read: (id: string) => api<{ read_at: string }>(`/conversations/${enc(id)}/read`, { method: 'POST', body: {} }),
  block: (id: string) => api<{ blocked: true }>(`/conversations/${enc(id)}/block`, { method: 'POST', body: {} }),
  imageUploadUrl: (id: string, body: { mime: 'image/jpeg' | 'image/png' | 'image/webp'; bytes: number; sha256: string }) =>
    api<UploadUrl>(`/conversations/${enc(id)}/images/upload-url`, { method: 'POST', body }),
  report: (messageId: string, body: ReportInput) => api<Reported>(`/messages/${enc(messageId)}/report`, { method: 'POST', body }),

  call: (bookingId: string) => api<CallNumber>(`/bookings/${enc(bookingId)}/call`, { method: 'POST', body: {} }),
  locationState: (bookingId: string) => api<LocationSharing>(`/bookings/${enc(bookingId)}/location-sharing`),
  setLocationSharing: (bookingId: string, enabled: boolean) => api<LocationSharing>(`/bookings/${enc(bookingId)}/location-sharing`, { method: 'POST', body: { enabled } }),
  sendLocation: (bookingId: string, p: { latitude: number; longitude: number; accuracy_meters?: number }) =>
    api<{ stored: true }>(`/bookings/${enc(bookingId)}/location`, { method: 'POST', body: p }),
  /** The unanswered "Are you OK?" check-in for this booking, if any (opening the app from the push). */
  pendingPing: (bookingId: string) => api<PendingPing>(`/bookings/${enc(bookingId)}/safety-ping`),
  answerPing: (bookingId: string, ok: boolean) => api<PingAnswered>(`/bookings/${enc(bookingId)}/safety-ping`, { method: 'POST', body: { ok } }),

  sos: (body: SosInput & { booking_id?: string | null }) => {
    const { booking_id: bookingId, ...rest } = body;
    return bookingId ? api<Sos>(`/bookings/${enc(bookingId)}/sos`, { method: 'POST', body: rest }) : api<Sos>('/safety/sos', { method: 'POST', body: rest });
  },
  currentSos: () => api<SosCurrent>('/safety/sos/current'),
  safe: (incidentId: string) => api<SosCurrent>(`/safety/sos/${enc(incidentId)}/safe`, { method: 'POST', body: {} }),

  contacts: () => api<TrustedContacts>('/safety/trusted-contacts'),
  addContact: (body: TrustedContactInput) => api<TrustedContactAdded>('/safety/trusted-contacts', { method: 'POST', body }),
  resendContact: (id: string) => api<TrustedContactAdded>(`/safety/trusted-contacts/${enc(id)}/resend`, { method: 'POST', body: {} }),
  removeContact: (id: string) => api<{ removed: true }>(`/safety/trusted-contacts/${enc(id)}`, { method: 'DELETE' }),

  registerPush: (token: string, platform: 'ANDROID' | 'IOS') => api<{ registered: boolean }>('/devices/push-token', { method: 'POST', body: { token, platform } }),
  unregisterPush: () => api<{ registered: boolean }>('/devices/push-token', { method: 'DELETE' }),

  // Development builds only (the API does not serve it in production).
  simulateCall: (bookingId: string) => api<{ call_id: string; delivered: number[] }>('/calls/mock/simulate', { method: 'POST', body: { booking_id: bookingId } }),
};
