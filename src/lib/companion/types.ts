/** Companion API shapes from the generated contract (src/lib/contract/schema.ts). */
import type { components } from '../contract/schema';

type S = components['schemas'];

export type FixItem = S['FixItemView'];
export type Companion = S['CompanionView'];
export type CompanionPhoto = Companion['photos'][number];
export type Verification = S['VerificationView'];
export type Checklist = S['Checklist'];
export type SetupState = S['SetupState'];
export type CompanionOptions = S['CompanionOptions'];
export type UploadTarget = S['UploadTarget'];
export type UploadUrlResponse = S['UploadUrlResponse'];
export type ApplyInput = S['postCompanionApplyBody'];
export type Availability = S['AvailabilityResponse'];
export type AvailabilityInput = S['putCompanionAvailabilityBody'];
export type ExceptionInput = S['postCompanionAvailabilityExceptionsBody'];
export type Rate = S['RatesResponse']['rates'][number];
export type RatesInput = S['putCompanionRatesBody'];
export type ProfileInput = S['patchCompanionProfileBody'];
export type GoLiveResponse = S['GoLiveResponse'];
export type LivenessSession = S['LivenessSessionResponse'];
export type DigiLockerStart = S['DigiLockerStartResponse'];

/**
 * The contract types `limits` as a generic record (numbers and the upload MIME
 * list); this reads the numeric limits the app uses, with a safe fallback.
 */
const NUMERIC_LIMITS = ['photos_min', 'photos_max', 'photo_min_px', 'photo_max_bytes', 'radius_km_min', 'radius_km_max', 'display_name_max_chars', 'intro_min_chars', 'intro_max_chars', 'boundary_text_max_chars', 'max_languages', 'max_activities'] as const;
export type CompanionLimits = Record<(typeof NUMERIC_LIMITS)[number], number> & { upload_mimes: string[] };
export function limitsOf(o: CompanionOptions): CompanionLimits {
  const out = { upload_mimes: Array.isArray(o.limits.upload_mimes) ? o.limits.upload_mimes : [] } as CompanionLimits;
  for (const k of NUMERIC_LIMITS) out[k] = Number(o.limits[k] ?? 0);
  return out;
}
