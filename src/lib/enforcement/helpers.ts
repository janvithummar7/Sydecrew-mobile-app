/**
 * Account status helpers (pure, unit-tested in test/enforcement.test.ts):
 * labels, the hold banner, each decision's appeal state, the appeal
 * statement's checks, and the on-hold routing decision used by the root
 * layout and the API client.
 */
import { enforcement as copy } from '../../content/enforcement';
import type { AppealStatus, EnforcementAction, EnforcementStatus, UserStatus } from '../contract/enums';
import { formatDateIST } from '../time';
import type { Standing, StandingAction } from './types';

/** The Account status screen (also the push deep link path, entity type enforcement_actions). */
export const ACCOUNT_STATUS_PATH = '/account-status';
/** POST /account/standing/{id}/appeal: statement length, after trimming. */
export const STATEMENT_MIN = 20;
export const STATEMENT_MAX = 2000;

// ── On-hold routing ─────────────────────────────────────────────────────

type HoldUser = { is_staff: boolean; on_hold?: boolean | null };

/**
 * A suspended or banned customer or companion: signed in, but every route
 * except /auth/me, logout and /account/standing answers 403 ACCOUNT_ON_HOLD.
 * They see only the Account status screen. Staff never get here.
 */
export const isOnHold = (u: HoldUser | null | undefined): boolean => !!u && !u.is_staff && u.on_hold === true;

/** Where an on-hold user must be: the Account status screen; null when the normal routing applies. */
export const onHoldRoute = (u: HoldUser | null | undefined): string | null => (isOnHold(u) ? ACCOUNT_STATUS_PATH : null);

/** True for the API's 403 ACCOUNT_ON_HOLD (it must route to Account status, never sign out). */
export function isOnHoldError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { status?: unknown; code?: unknown };
  return e.code === 'ACCOUNT_ON_HOLD' && (e.status === undefined || e.status === 403);
}

/**
 * The signed-in user marked as on hold after a 403 ACCOUNT_ON_HOLD (details
 * { status, suspended_until }), until GET /auth/me confirms it.
 */
export function markOnHold<T extends { on_hold: boolean; status: UserStatus }>(u: T, details: unknown): T {
  const s = details && typeof details === 'object' ? (details as { status?: unknown }).status : undefined;
  const status: UserStatus = s === 'BANNED' || s === 'SUSPENDED' ? s : u.status === 'BANNED' ? 'BANNED' : 'SUSPENDED';
  return { ...u, on_hold: true, status };
}

/** The hold just ended (timed suspension over, lifted or overturned): send the user to their normal home. */
export const holdEnded = (before: boolean, now: boolean) => before && !now;

// ── Labels ──────────────────────────────────────────────────────────────

export const actionLabel = (a: EnforcementAction | string): string => (copy.actions as Record<string, string>)[a] ?? copy.actions.WARNING;
export const statusLabel = (s: EnforcementStatus | string): string => (copy.statuses as Record<string, string>)[s] ?? s;

/** Pill tone for a decision: in place = warn, overturned = ok, the rest neutral. */
export function statusTone(a: Pick<StandingAction, 'status'>): 'warn' | 'ok' | 'neutral' {
  if (a.status === 'ACTIVE') return 'warn';
  if (a.status === 'OVERTURNED') return 'ok';
  return 'neutral';
}

// ── Hold banner ─────────────────────────────────────────────────────────

export type HoldView = { kind: 'suspended' | 'banned' | 'clear'; title: string; body: string; note: string | null };

/** The banner at the top: suspended until {date}, closed, or no hold (with a note when a warning is in place). */
export function holdView(s: Pick<Standing, 'status' | 'on_hold' | 'suspended_until'> & { actions?: Standing['actions'] }): HoldView {
  if (s.on_hold && s.status === 'BANNED') return { kind: 'banned', title: copy.hold.bannedTitle, body: copy.hold.banned, note: copy.hold.whileOnHold };
  if (s.on_hold) {
    return {
      kind: 'suspended',
      title: copy.hold.suspendedTitle,
      body: holdSentence(s),
      note: copy.hold.whileOnHold,
    };
  }
  const warned = (s.actions ?? []).some((a) => a.action === 'WARNING' && a.status === 'ACTIVE');
  return { kind: 'clear', title: copy.hold.clearTitle, body: copy.hold.clear, note: warned ? copy.hold.warningsNote : null };
}

/** One sentence: until when the account is on hold, or that it is closed, or that there is no hold. */
export function holdSentence(s: Pick<Standing, 'status' | 'on_hold' | 'suspended_until'>): string {
  if (!s.on_hold) return copy.hold.clear;
  if (s.status === 'BANNED') return copy.hold.banned;
  return s.suspended_until ? copy.hold.suspendedUntil(formatDateIST(s.suspended_until)) : copy.hold.suspendedOpen;
}

// ── One decision ────────────────────────────────────────────────────────

/** "From" and "Until" for a decision: a ban that is in place lasts until lifted; a warning has no end. */
export function actionDates(a: Pick<StandingAction, 'action' | 'status' | 'starts_at' | 'ends_at'>): { from: string | null; until: string | null } {
  const from = a.starts_at ? formatDateIST(a.starts_at) : null;
  if (a.ends_at) return { from, until: formatDateIST(a.ends_at) };
  if (a.action === 'PERMANENT_BAN' && a.status === 'ACTIVE') return { from, until: copy.endsNever };
  return { from, until: null };
}

/** What can be done about the appeal, or how it went, in one sentence. */
export function appealStateText(a: Pick<StandingAction, 'can_appeal' | 'appeal_deadline_at' | 'appeal'>, now: Date = new Date()): string {
  if (a.appeal) {
    const st = a.appeal.status as AppealStatus;
    const when = st === 'UPHELD' || st === 'OVERTURNED' ? a.appeal.decided_at : a.appeal.submitted_at;
    const fn = copy.appeal.states[st] ?? copy.appeal.states.SUBMITTED;
    return fn(formatDateIST(when));
  }
  if (a.can_appeal) return a.appeal_deadline_at ? copy.appeal.canAppeal(formatDateIST(a.appeal_deadline_at)) : copy.appeal.canAppealOpen;
  if (a.appeal_deadline_at && new Date(a.appeal_deadline_at).getTime() <= now.getTime()) return copy.appeal.windowClosed(formatDateIST(a.appeal_deadline_at));
  return copy.appeal.notAppealable;
}

// ── Appeal form ─────────────────────────────────────────────────────────

/** Inline message for the statement, or null when it can be sent. */
export function statementError(text: string): string | null {
  const n = text.trim().length;
  if (n < STATEMENT_MIN) return copy.appeal.tooShort(STATEMENT_MIN);
  if (n > STATEMENT_MAX) return copy.appeal.tooLong(STATEMENT_MAX);
  return null;
}

export const canSendStatement = (text: string) => statementError(text) === null;

/** POST body: the statement trimmed. */
export const appealBody = (text: string) => ({ statement: text.trim() });
