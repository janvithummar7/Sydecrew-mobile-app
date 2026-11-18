/** Membership (customer subscriptions, D12) API shapes, from the generated contract (src/lib/contract/schema.ts). */
import type { components } from '../contract/schema';

type S = components['schemas'];

export type SubscriptionStatus = S['SubscriptionStatus'];
export type MembershipPlan = S['MembershipPlan'];
export type Membership = S['Membership'];
/** GET /subscriptions: plans, the current (live) membership, trial eligibility and receipts. */
export type MembershipOverview = S['MembershipOverviewResponse'];
export type MembershipReceipt = MembershipOverview['receipts'][number];
/** POST /subscriptions: the INCOMPLETE membership and the autopay mandate to approve. */
export type MembershipStart = S['MembershipStartResponse'];
/** POST /subscriptions/me/change and /me/cancel and /me/resume (subscription is null when it ended at once). */
export type MembershipChange = S['MembershipChangeResponse'];
export type MockMandate = S['MockMandateResponse'];
export type MockMandateScenario = S['MockMandateScenario'];
export type MockMandateAuthorized = S['MockMandateAuthorizeResponse'];
export type PlanBody = S['postSubscriptionsBody'];
export type CancelBody = S['postSubscriptionsMeCancelBody'];
