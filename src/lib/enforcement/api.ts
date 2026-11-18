import { api } from '../api';
import type { AppealInput, AppealSubmitted, Standing } from './types';

const enc = encodeURIComponent;

/**
 * Account status (D22): warnings, suspensions and bans on your own account.
 * These routes keep working while the account is on hold (every other route
 * answers 403 ACCOUNT_ON_HOLD).
 */
export const enforcementApi = {
  /** Whether the account is on hold, until when, and every decision with its appeal. */
  standing: () => api<Standing>('/account/standing'),
  /**
   * Appeal one decision (once, within the window). Errors: APPEAL_EXISTS, APPEAL_WINDOW_CLOSED,
   * ENFORCEMENT_NOT_ACTIVE (409), ENFORCEMENT_NOT_FOUND (404), VALIDATION_FAILED (422).
   */
  appeal: (id: string, body: AppealInput) => api<AppealSubmitted>(`/account/standing/${enc(id)}/appeal`, { method: 'POST', body }),
};
