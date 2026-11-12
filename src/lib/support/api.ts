import { api } from '../api';
import type { ComplaintCreated, ComplaintInput, Dispute, DisputeItem, EvidenceUpload, Receipt, Ticket, TicketInput, TicketItem } from './types';

const enc = encodeURIComponent;

/** Complaints, disputes, the support inbox and the customer receipt (Feature 6). Both roles. */
export const supportApi = {
  complain: (body: ComplaintInput) => api<{ complaint: ComplaintCreated }>('/complaints', { method: 'POST', body }).then((r) => r.complaint),

  disputes: () => api<{ disputes: DisputeItem[] }>('/disputes').then((r) => r.disputes),
  dispute: (id: string) => api<{ dispute: Dispute }>(`/disputes/${enc(id)}`).then((r) => r.dispute),
  addStatement: (id: string, body: { body: string; media_asset_ids?: string[] }) =>
    api<{ dispute: Dispute }>(`/disputes/${enc(id)}/statements`, { method: 'POST', body }).then((r) => r.dispute),
  evidenceUploadUrl: (id: string, body: { mime: 'image/jpeg' | 'image/png' | 'image/webp'; bytes: number; sha256: string }) =>
    api<EvidenceUpload>(`/disputes/${enc(id)}/evidence-upload-url`, { method: 'POST', body }),
  appeal: (id: string, statement: string) => api<{ dispute: Dispute }>(`/disputes/${enc(id)}/appeal`, { method: 'POST', body: { statement } }).then((r) => r.dispute),

  tickets: () => api<{ tickets: TicketItem[] }>('/support/tickets').then((r) => r.tickets),
  ticket: (id: string) => api<{ ticket: Ticket }>(`/support/tickets/${enc(id)}`).then((r) => r.ticket),
  openTicket: (body: TicketInput) => api<{ ticket: Ticket }>('/support/tickets', { method: 'POST', body }).then((r) => r.ticket),
  reply: (id: string, body: string) => api<{ ticket: Ticket }>(`/support/tickets/${enc(id)}/messages`, { method: 'POST', body: { body } }).then((r) => r.ticket),

  receipt: (bookingId: string) => api<{ receipt: Receipt }>(`/bookings/${enc(bookingId)}/receipt`).then((r) => r.receipt),
};
