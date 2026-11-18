/**
 * Account deletion helpers (pure, unit-tested in test/account.test.ts): what
 * each blocker says and where it is fixed, reading blockers from an
 * ACCOUNT_DELETION_BLOCKED error, the form's checks and request body, and the
 * deletion date in IST.
 */
import { deleteAccount as copy } from '../../content/account';
import { DeletionBlockerValues } from '../contract/enums';
import type { Role } from '../routing';
import { formatDateIST } from '../time';
import type { DeletionBlocker, DeletionBlockerCode, DeletionInput } from './types';

export const REASON_MAX = 500;
/** Used until GET /account/deletion answers (the API's account.deletion_grace_days). */
export const DEFAULT_GRACE_DAYS = 30;

// ── Blockers ────────────────────────────────────────────────────────────

/** Where each blocker is fixed. Open bookings depend on the shell: customers and companions have their own lists. */
export function blockerRoute(code: DeletionBlockerCode, role: Role): string {
  switch (code) {
    case 'OPEN_BOOKINGS':
      return role === 'companion' ? '/companion/bookings' : '/bookings';
    case 'OPEN_DISPUTES':
      return '/disputes';
    case 'UNPAID_EARNINGS':
      return '/companion/earnings';
    case 'PENDING_REFUNDS':
    default:
      return '/support';
  }
}

export type BlockerView = { code: DeletionBlockerCode; message: string; action: string; route: string };

/** One sentence, a button label and a route per blocker (in the API's order; unknown codes are skipped). */
export function blockerViews(blockers: readonly DeletionBlocker[], role: Role): BlockerView[] {
  return blockers
    .filter((b) => (DeletionBlockerValues as readonly string[]).includes(b.code))
    .map((b) => {
      const c = copy.blockers[b.code];
      return { code: b.code, message: c.message(Math.max(1, b.count)), action: c.action, route: blockerRoute(b.code, role) };
    });
}

/** details.blockers from an ACCOUNT_DELETION_BLOCKED error, or [] when missing or malformed. */
export function blockersFromDetails(details: unknown): DeletionBlocker[] {
  const list = details && typeof details === 'object' ? (details as { blockers?: unknown }).blockers : null;
  if (!Array.isArray(list)) return [];
  return list.filter(
    (b): b is DeletionBlocker =>
      !!b && typeof b === 'object' && (DeletionBlockerValues as readonly string[]).includes((b as DeletionBlocker).code) && typeof (b as DeletionBlocker).count === 'number',
  );
}

// ── Form ────────────────────────────────────────────────────────────────

export type DeletionDraft = { password: string; reason: string; confirmed: boolean };
export const emptyDeletionDraft = (): DeletionDraft => ({ password: '', reason: '', confirmed: false });

/** Inline messages for what is missing or too long (empty object when the form can be sent). */
export function deletionDraftErrors(d: DeletionDraft): Partial<Record<'password' | 'reason' | 'confirmed', string>> {
  const errors: Partial<Record<'password' | 'reason' | 'confirmed', string>> = {};
  if (!d.password) errors.password = copy.passwordNeeded;
  if (d.reason.trim().length > REASON_MAX) errors.reason = copy.reasonTooLong(REASON_MAX);
  if (!d.confirmed) errors.confirmed = copy.confirmNeeded;
  return errors;
}

export const canRequestDeletion = (d: DeletionDraft) => Object.keys(deletionDraftErrors(d)).length === 0;

/** POST body: the password as typed; the reason trimmed and left out when empty. */
export function deletionBody(d: DeletionDraft): DeletionInput {
  const reason = d.reason.trim();
  return reason ? { password: d.password, reason } : { password: d.password };
}

// ── Date ────────────────────────────────────────────────────────────────

/** The deletion date in India time, like other dates in the app: "17 December 2026". */
export const deletionDate = (iso: string | null | undefined) => formatDateIST(iso);
