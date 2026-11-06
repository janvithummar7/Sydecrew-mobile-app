/**
 * Pure chat / call / safety helpers (Feature 5). No React Native imports, so
 * they run under `node --test`.
 */
import type { Message, Moderation } from './types';

// ── Chat ─────────────────────────────────────────────────────────────────

export const CLIENT_MESSAGE_ID_RE = /^[A-Za-z0-9_.:-]{8,64}$/;

/** A client message id (the send's Idempotency-Key): unique per message, reused on every retry of it. */
export function newClientMessageId(now = Date.now(), random: () => number = Math.random): string {
  const rand = Array.from({ length: 3 }, () => Math.floor(random() * 0xffffffff).toString(36).padStart(7, '0')).join('');
  return `msg-${now.toString(36)}-${rand}`.slice(0, 64);
}

export type Pending = { localId: string; clientMessageId: string; body: string; status: 'sending' | 'failed'; error?: string };

/**
 * Messages typed but not yet confirmed by the API. A retry of a failed send
 * keeps its clientMessageId, so the API returns the same message instead of a
 * second copy (POST /conversations/:id/messages is idempotent per id).
 */
export class Outbox {
  private items: Pending[] = [];
  private readonly makeId: () => string;
  constructor(makeId: () => string = () => newClientMessageId()) {
    this.makeId = makeId;
  }
  add(body: string): Pending {
    const id = this.makeId();
    const p: Pending = { localId: id, clientMessageId: id, body, status: 'sending' };
    this.items = [...this.items, p];
    return p;
  }
  /** The same pending item, marked sending again, with the SAME key. */
  retry(localId: string): Pending | null {
    const p = this.items.find((x) => x.localId === localId);
    if (!p) return null;
    const next = { ...p, status: 'sending' as const, error: undefined };
    this.items = this.items.map((x) => (x.localId === localId ? next : x));
    return next;
  }
  fail(localId: string, error: string) {
    this.items = this.items.map((x) => (x.localId === localId ? { ...x, status: 'failed' as const, error } : x));
  }
  done(localId: string) {
    this.items = this.items.filter((x) => x.localId !== localId);
  }
  list(): Pending[] {
    return this.items;
  }
}

/** Adds or replaces messages by id, oldest first (realtime events and pages can overlap). */
export function mergeMessages(current: Message[], incoming: Message[]): Message[] {
  const byId = new Map(current.map((m) => [m.id, m]));
  for (const m of incoming) byId.set(m.id, m);
  return [...byId.values()].sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export type ModerationView = { label: string | null; tone: 'muted' | 'warning' | 'danger' };
export function moderationView(m: Moderation, mine: boolean, copy: { masked: string; held: string; rejected: string }): ModerationView {
  if (m === 'MASKED') return { label: copy.masked, tone: 'warning' };
  if (m === 'HELD') return { label: mine ? copy.held : null, tone: 'warning' };
  if (m === 'REJECTED') return { label: mine ? copy.rejected : null, tone: 'danger' };
  return { label: null, tone: 'muted' };
}

// ── Calls ────────────────────────────────────────────────────────────────

const H = 3_600_000;
export type CallWindow = { open: boolean; opensAt: Date; closesAt: Date; reason: 'NOT_CONFIRMED' | 'NOT_YET' | 'ENDED' | null };

/**
 * Masked calls: CONFIRMED or IN_PROGRESS only, from 2 h before the start until
 * 2 h after the end (half-open, like the API). The API has the final say.
 */
export function callWindow(b: { status: string; start_at: string; end_at: string }, now = new Date(), beforeH = 2, afterH = 2): CallWindow {
  const opensAt = new Date(new Date(b.start_at).getTime() - beforeH * H);
  const closesAt = new Date(new Date(b.end_at).getTime() + afterH * H);
  if (!['CONFIRMED', 'IN_PROGRESS'].includes(b.status)) return { open: false, opensAt, closesAt, reason: 'NOT_CONFIRMED' };
  if (now < opensAt) return { open: false, opensAt, closesAt, reason: 'NOT_YET' };
  if (now >= closesAt) return { open: false, opensAt, closesAt, reason: 'ENDED' };
  return { open: true, opensAt, closesAt, reason: null };
}

/** "+918000001234" -> "tel:+918000001234" (digits and a leading + only). */
export const telUrl = (n: string) => `tel:${String(n).replace(/[^\d+]/g, '')}`;

// ── Location ─────────────────────────────────────────────────────────────

/** At most one point every 30 s (the API refuses closer ones with LOCATION_TOO_FREQUENT). */
export class LocationThrottle {
  private last = -Infinity;
  private readonly minMs: number;
  constructor(minMs = 30_000) {
    this.minMs = minMs;
  }
  due(now = Date.now()): boolean {
    return now - this.last >= this.minMs;
  }
  mark(now = Date.now()) {
    this.last = now;
  }
  /** Milliseconds until the next point may be sent. */
  waitMs(now = Date.now()): number {
    return Math.max(0, this.minMs - (now - this.last));
  }
  reset() {
    this.last = -Infinity;
  }
}

// ── SOS ──────────────────────────────────────────────────────────────────

export type SosSection = 'CALL_112' | 'STATUS' | 'SHARE_LOCATION' | 'SEND_ALERT' | 'IM_SAFE' | 'LEAVE';

/**
 * The SOS screen, top to bottom. "Call 112" is ALWAYS first, whatever the
 * state; the in-app alert never replaces it.
 */
export function sosSections(state: { alertSent: boolean; markedSafe: boolean }): SosSection[] {
  if (!state.alertSent) return ['CALL_112', 'SHARE_LOCATION', 'SEND_ALERT', 'LEAVE'];
  return state.markedSafe ? ['CALL_112', 'STATUS', 'LEAVE'] : ['CALL_112', 'STATUS', 'IM_SAFE', 'LEAVE'];
}
