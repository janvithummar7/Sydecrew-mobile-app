/** Complaints, disputes, support tickets and receipts (Feature 6), from the generated contract. */
import type { components } from '../contract/schema';

type S = components['schemas'];
export type ComplaintType = S['ComplaintType'];
export type ComplaintInput = S['postComplaintsBody'];
export type ComplaintCreated = S['ComplaintCreatedResponse']['complaint'];
export type DisputeItem = S['DisputesResponse']['disputes'][number];
export type Dispute = S['DisputeResponse']['dispute'];
export type DisputeStatus = S['DisputeStatus'];
export type EvidenceUpload = S['EvidenceUploadResponse'];
export type TicketItem = S['TicketsResponse']['tickets'][number];
export type Ticket = S['TicketResponse']['ticket'];
export type TicketStatus = S['TicketStatus'];
export type TicketInput = S['postSupportTicketsBody'];
export type TicketCategory = TicketInput['category'];
export type Receipt = S['ReceiptResponse']['receipt'];
