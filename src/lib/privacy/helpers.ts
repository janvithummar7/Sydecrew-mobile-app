/** Privacy screen decisions (Feature 7). Pure: unit-tested in test/feature7.test.ts. */
import type { Consent, DataExportState, DeletionState } from './types';

/** The consents the API lets a user withdraw (the rest are needed to use Sydecrew). */
export const WITHDRAWABLE_CONSENTS = ['MARKETING', 'LOCATION_SHARING', 'KYC_BIOMETRIC_PROCESSING'] as const;

export const canWithdraw = (c: Pick<Consent, 'type' | 'granted' | 'withdrawable'>) =>
  c.granted && c.withdrawable && (WITHDRAWABLE_CONSENTS as readonly string[]).includes(c.type);

/** Withdrawing face-check consent hides a companion's profile until they verify again. */
export const hidesProfile = (type: string, isCompanion: boolean) => isCompanion && type === 'KYC_BIOMETRIC_PROCESSING';

export type ExportView =
  | { kind: 'none'; canRequest: true }
  | { kind: 'preparing'; canRequest: false }
  | { kind: 'ready'; id: string; expiresAt: string | null; canRequest: boolean; nextAt: string | null }
  | { kind: 'expired' | 'failed'; canRequest: boolean; nextAt: string | null };

/** What the data-export card shows. A new request is allowed once `next_request_at` has passed. */
export function exportView(s: DataExportState, now = Date.now()): ExportView {
  const nextAt = s.next_request_at;
  const canRequest = !nextAt || new Date(nextAt).getTime() <= now;
  const e = s.export;
  if (!e) return { kind: 'none', canRequest: true };
  if (e.status === 'QUEUED') return { kind: 'preparing', canRequest: false };
  if (e.status === 'READY') {
    const expired = !!e.expires_at && new Date(e.expires_at).getTime() <= now;
    if (!expired) return { kind: 'ready', id: e.id, expiresAt: e.expires_at, canRequest, nextAt: canRequest ? null : nextAt };
    return { kind: 'expired', canRequest, nextAt: canRequest ? null : nextAt };
  }
  return { kind: e.status === 'FAILED' ? 'failed' : 'expired', canRequest, nextAt: canRequest ? null : nextAt };
}

export type DeletionView =
  | { kind: 'scheduled'; scheduledFor: string; blocked: DeletionState['blockers'] }
  | { kind: 'blocked'; blockers: DeletionState['blockers'] }
  | { kind: 'available' };

/** Delete-account card: a pending request (cancellable), blockers to finish first, or the start button. */
export function deletionView(s: DeletionState): DeletionView {
  if (s.request) return { kind: 'scheduled', scheduledFor: s.request.scheduled_for, blocked: s.request.blocked };
  if (s.blockers.length) return { kind: 'blocked', blockers: s.blockers };
  return { kind: 'available' };
}

/** Optional deletion reason: trimmed, at most 500 characters (the API limit), or omitted. */
export function deletionReason(text: string): string | undefined {
  const t = text.trim();
  return t ? t.slice(0, 500) : undefined;
}
