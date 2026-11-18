import { api } from '../api';
import type { CancelBody, MembershipChange, MembershipOverview, MembershipStart, MockMandate, MockMandateAuthorized, MockMandateScenario } from './types';

const enc = encodeURIComponent;

/**
 * Customer membership (D12). Plans and prices always come from the API.
 * Starting returns an autopay mandate to approve; the result reaches the API
 * by webhook, so the app then polls GET /subscriptions (see pollMembership).
 */
export const membershipApi = {
  /** Plans, the current live membership (TRIALING / ACTIVE / PAST_DUE) or null, trial eligibility, receipts. */
  overview: () => api<MembershipOverview>('/subscriptions'),
  /** Errors: SUBSCRIPTION_EXISTS (409), PLAN_NOT_FOUND (404). */
  start: (planId: string) => api<MembershipStart>('/subscriptions', { method: 'POST', body: { plan_id: planId } }),
  /** Upgrade now (prorated), downgrade at renewal, or the current plan to drop a booked downgrade. */
  change: (planId: string) => api<MembershipChange>('/subscriptions/me/change', { method: 'POST', body: { plan_id: planId } }),
  /** Autopay off, benefits until the period ends (ends at once when PAST_DUE: subscription is null). */
  cancel: (body: CancelBody) => api<MembershipChange>('/subscriptions/me/cancel', { method: 'POST', body }),
  /** "Keep my membership". Error: SUBSCRIPTION_NOT_CANCELLING. */
  resume: () => api<MembershipChange>('/subscriptions/me/resume', { method: 'POST' }),
  /** TEST AUTOPAY (development builds, mock gateway only). */
  mockMandate: (mandateId: string) => api<MockMandate>(`/payments/mock/mandates/${enc(mandateId)}`),
  mockAuthorize: (mandateId: string, scenario: MockMandateScenario) =>
    api<MockMandateAuthorized>(`/payments/mock/mandates/${enc(mandateId)}/authorize`, { method: 'POST', body: { scenario } }),
};
