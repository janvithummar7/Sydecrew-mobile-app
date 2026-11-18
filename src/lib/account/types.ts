/** Account deletion API shapes, from the generated contract (src/lib/contract/schema.ts). */
import type { components } from '../contract/schema';

type S = components['schemas'];

export type DeletionBlockerCode = S['DeletionBlocker'];
/** GET /account/deletion */
export type DeletionPreview = S['DeletionPreviewResponse'];
export type DeletionBlocker = DeletionPreview['blockers'][number];
/** POST /account/deletion */
export type DeletionInput = S['postAccountDeletionBody'];
export type DeletionScheduled = S['DeletionScheduledResponse'];
