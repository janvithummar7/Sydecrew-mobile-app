/** Discovery API shapes, from the generated contract (src/lib/contract/schema.ts). */
import type { components, operations } from '../contract/schema';

type S = components['schemas'];

export type DiscoveryCard = S['DiscoveryCard'];
export type DiscoveryList = S['DiscoveryListResponse'];
export type DiscoveryCards = S['DiscoveryCardsResponse'];
export type DiscoveryOptions = S['DiscoveryOptions'];
export type PublicProfile = S['PublicProfile'];
export type AvailabilityDay = PublicProfile['availability'][number];
export type SavedResponse = S['SavedResponse'];
export type ReportedResponse = S['ReportedResponse'];
export type WaitlistResponse = S['WaitlistResponse'];
export type ReportInput = S['postDiscoveryCompanionsByIdReportBody'];
export type WaitlistInput = S['postDiscoveryWaitlistBody'];
export type DiscoveryQuery = NonNullable<operations['getDiscoveryCompanions']['parameters']['query']>;
