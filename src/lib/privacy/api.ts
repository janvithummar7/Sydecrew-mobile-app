import { api } from '../api';
import type { Challenge } from '../types';
import type { Consents, DataExportLink, DataExportState, DeleteAccountInput, DeletionState, GrievanceOfficer } from './types';

const enc = encodeURIComponent;

/** /api/v1/me privacy rights and the public grievance officer (Feature 7). */
export const privacyApi = {
  exportState: () => api<DataExportState>('/me/data-export'),
  requestExport: () => api<DataExportState>('/me/data-export', { method: 'POST' }),
  /** A short-lived link that downloads the ZIP without a bearer token. */
  exportLink: (id: string) => api<DataExportLink>(`/me/data-export/${enc(id)}/link`, { method: 'POST' }),
  deletionState: () => api<DeletionState>('/me/delete-account'),
  /** Step 1: password -> a one-time code to the verified phone (or email). */
  startDeletion: (password: string) => api<{ challenge: Challenge }>('/me/delete-account/start', { method: 'POST', body: { password } }),
  /** Step 2: the code; the account is deleted after the cooling period unless cancelled. */
  confirmDeletion: (body: DeleteAccountInput) => api<DeletionState>('/me/delete-account', { method: 'POST', body }),
  cancelDeletion: () => api<DeletionState>('/me/delete-account/cancel', { method: 'POST' }),
  consents: () => api<Consents>('/me/consents'),
  withdraw: (type: string) => api<Consents>(`/me/consents/${enc(type)}/withdraw`, { method: 'POST' }),
  grievanceOfficer: () => api<GrievanceOfficer>('/legal/grievance-officer'),
};
