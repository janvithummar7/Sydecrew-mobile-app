/** Account status API shapes (D22), from the generated contract (src/lib/contract/schema.ts). */
import type { components } from '../contract/schema';

type S = components['schemas'];

/** GET /account/standing */
export type Standing = S['AccountStandingResponse'];
export type StandingAction = Standing['actions'][number];
export type StandingAppeal = NonNullable<StandingAction['appeal']>;
/** POST /account/standing/{id}/appeal */
export type AppealInput = S['postAccountStandingByIdAppealBody'];
export type AppealSubmitted = S['AppealSubmittedResponse'];
