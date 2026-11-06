/**
 * Pure chat / call / safety helpers (Feature 5). No React Native imports, so
 * they run under `node --test`.
 */
import type { Message, Moderation, PendingPing } from './types';

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

export type CallButton = { show: boolean; opensAt: Date; closesAt: Date; reason: 'NOT_YET' | 'ENDED' | 'NOT_AVAILABLE' | null };
type CallBooking = { status: string; actions: { can_call: boolean }; call_window: { opens_at: string; closes_at: string } };

/**
 * The masked Call button, driven by the API: `actions.can_call` decides
 * (CONFIRMED / IN_PROGRESS, inside [start - 2 h, end + 2 h), not blocked).
 * `call_window` only adds what the snapshot cannot know: the window closing
 * while the screen is open (hidden at closes_at, half-open like the API), and
 * the "Calls open at …" hint for a confirmed booking before opens_at.
 */
export function callButton(b: CallBooking, now = new Date()): CallButton {
  const opensAt = new Date(b.call_window.opens_at);
  const closesAt = new Date(b.call_window.closes_at);
  if (now >= closesAt) return { show: false, opensAt, closesAt, reason: 'ENDED' };
  if (b.actions.can_call) return { show: true, opensAt, closesAt, reason: null };
  if (now < opensAt && ['CONFIRMED', 'IN_PROGRESS'].includes(b.status)) return { show: false, opensAt, closesAt, reason: 'NOT_YET' };
  return { show: false, opensAt, closesAt, reason: 'NOT_AVAILABLE' };
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

// ── Safety ping ("Are you OK?") ─────────────────────────────────────────

/** Which ping the prompt shows (null = hidden), and the pings already answered on this device. */
export type PingPromptState = { pingId: string | null; answered: string[] };
export type PingPromptEvent =
  | { type: 'fetched'; res: PendingPing } // GET /bookings/:id/safety-ping (screen open, app resume)
  | { type: 'realtime'; pingId: string } // safety.ping over the socket
  | { type: 'answered' }; // POST /bookings/:id/safety-ping succeeded

export const PING_PROMPT_INITIAL: PingPromptState = { pingId: null, answered: [] };

/**
 * The prompt shows when the API says a ping is pending (also after opening the
 * app from the push) or one arrives over realtime, and hides once answered.
 * An answered ping never comes back, even if a stale fetch still reports it.
 */
export function nextPingPrompt(s: PingPromptState, e: PingPromptEvent): PingPromptState {
  if (e.type === 'answered') return { pingId: null, answered: s.pingId ? [...s.answered, s.pingId] : s.answered };
  const id = e.type === 'realtime' ? e.pingId : e.res.pending && e.res.ping ? e.res.ping.id : null;
  if (id && s.answered.includes(id)) return { ...s, pingId: null };
  return { ...s, pingId: id };
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
