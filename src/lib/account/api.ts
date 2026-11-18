import { api } from '../api';
import type { DeletionInput, DeletionPreview, DeletionScheduled } from './types';

/**
 * Deleting your own account (customers and companions; staff get STAFF_ACCOUNT).
 * A successful POST ends every session on the server, including this app's
 * refresh token, so the caller signs out locally straight after.
 */
export const accountApi = {
  /** Whether the account can be deleted now, what blocks it, and the grace period in days. */
  deletionPreview: () => api<DeletionPreview>('/account/deletion'),
  /** Schedules the deletion. Errors: INVALID_PASSWORD (401), ACCOUNT_DELETION_BLOCKED, ACCOUNT_NOT_DELETABLE (409). */
  requestDeletion: (body: DeletionInput) => api<DeletionScheduled>('/account/deletion', { method: 'POST', body }),
};
