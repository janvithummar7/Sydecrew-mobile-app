/**
 * Pending uploads, as plain data (pure: no native modules, unit-tested).
 *
 * A photo or ID image goes through: prepared on the device (JPEG + SHA-256)
 * -> upload URL requested (the API returns an asset_id) -> bytes uploaded ->
 * confirmed. The list is persisted (uploader.ts), so if the app is
 * backgrounded, killed or offline, the next run retries the SAME asset_id:
 * the API re-issues a URL for it, and confirm is idempotent.
 */
export type UploadKind = 'PHOTO' | 'DOCUMENT';
export type Side = 'FRONT' | 'BACK' | 'SELFIE';
export type Stage = 'PREPARED' | 'URL_ISSUED' | 'UPLOADED';

export type PendingUpload = {
  /** Local id (until the API gives an asset id). */
  id: string;
  kind: UploadKind;
  side?: Side;
  localUri: string;
  mime: 'image/jpeg';
  bytes: number;
  sha256: string;
  assetId: string | null;
  stage: Stage;
  attempts: number;
  nextAttemptAt: number;
  createdAt: number;
  lastError?: string;
};

export const MAX_ATTEMPTS = 8;
const BASE_MS = 2_000;
const CAP_MS = 5 * 60_000;

/** 2 s, 4 s, 8 s ... capped at 5 minutes. */
export const backoffMs = (attempts: number) => Math.min(CAP_MS, BASE_MS * 2 ** Math.max(0, attempts - 1));

/**
 * Errors that will not get better by retrying: the file itself was refused
 * (wrong type, too small, changed bytes) or the application no longer
 * accepts uploads. Network errors, timeouts, 429 and 5xx are retried.
 */
const PERMANENT_CODES = new Set([
  'VALIDATION_FAILED',
  'IMAGE_TOO_SMALL',
  'UNSUPPORTED_IMAGE_TYPE',
  'IMAGE_UNREADABLE',
  'FILE_TOO_LARGE',
  'UPLOAD_CORRUPTED',
  'UPLOAD_MISMATCH',
  'UPLOAD_NOT_PENDING',
  'UPLOAD_NOT_FOUND',
  'PHOTO_LIMIT',
  'APPLICATION_LOCKED',
  'VERIFICATION_NOT_OPEN',
  'AADHAAR_IMAGE_NOT_ALLOWED',
  'AUTO_CHECK_COOLDOWN',
  'MANUAL_REVIEW_REQUIRED',
  'DOCUMENT_TYPE_REQUIRED',
  'PROFILE_LOCKED',
]);

export function isRetryable(status: number, code?: string): boolean {
  if (code && PERMANENT_CODES.has(code)) return false;
  if (status === 0 || status === 408 || status === 429 || status >= 500) return true;
  return false;
}

/** After a failure: schedule the next attempt, or give up (returns null). */
export function afterFailure(item: PendingUpload, now: number, status: number, code?: string, message?: string): PendingUpload | null {
  const attempts = item.attempts + 1;
  if (!isRetryable(status, code) || attempts >= MAX_ATTEMPTS) return null;
  return { ...item, attempts, nextAttemptAt: now + backoffMs(attempts), lastError: message ?? code };
}

/**
 * The upload link expired or the API lost our upload (e.g. after a long
 * background stretch): start again from the URL step with the same asset id.
 */
export function restartFromUrl(item: PendingUpload): PendingUpload {
  return { ...item, stage: 'PREPARED' };
}

/** Items whose next attempt is due, oldest first. */
export function due(items: PendingUpload[], now: number): PendingUpload[] {
  return items.filter((i) => i.nextAttemptAt <= now).sort((a, b) => a.createdAt - b.createdAt);
}

export function upsert(items: PendingUpload[], item: PendingUpload): PendingUpload[] {
  const i = items.findIndex((x) => x.id === item.id);
  if (i < 0) return [...items, item];
  const next = items.slice();
  next[i] = item;
  return next;
}

export const remove = (items: PendingUpload[], id: string) => items.filter((x) => x.id !== id);

/** A newer document for the same side replaces an older pending one. */
export const replaceSide = (items: PendingUpload[], side: Side) => items.filter((x) => !(x.kind === 'DOCUMENT' && x.side === side));

/** Parses the persisted JSON, dropping anything malformed. */
export function parseQueue(json: string | null): PendingUpload[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (x): x is PendingUpload =>
        x && typeof x.id === 'string' && (x.kind === 'PHOTO' || x.kind === 'DOCUMENT') && typeof x.localUri === 'string' && typeof x.sha256 === 'string',
    );
  } catch {
    return [];
  }
}
