/** Privacy rights (Feature 7: DPDP export, deletion, consents), from the generated contract. */
import type { components } from '../contract/schema';

type S = components['schemas'];
export type DataExportState = S['DataExportStateResponse'];
export type DataExport = NonNullable<DataExportState['export']>;
export type DataExportLink = S['DataExportLinkResponse'];
export type DeletionState = S['DeletionStateResponse'];
export type DeletionRequest = NonNullable<DeletionState['request']>;
export type DeletionBlocker = DeletionState['blockers'][number];
export type Consents = S['ConsentsResponse'];
export type Consent = Consents['consents'][number];
export type GrievanceOfficer = S['GrievanceOfficerResponse'];
export type DeleteAccountInput = S['postMeDeleteAccountBody'];
