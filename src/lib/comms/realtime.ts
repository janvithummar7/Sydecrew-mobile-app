/**
 * Realtime client (Feature 5): the authenticated WebSocket at
 * /api/v1/realtime. Pure TypeScript (the socket factory and clock are
 * injected), so the reconnect and fallback logic runs under `node --test`.
 *
 *  - The first message is { type: 'auth', token }. The server answers 'ready'.
 *  - After a token refresh, reauth() sends a fresh auth on the open socket.
 *  - A close reconnects with exponential back-off (1 s, 2 s, 4 s … 30 s).
 *  - After POLL_AFTER_FAILURES failed attempts the status is 'polling':
 *    screens then poll the API until the socket is back.
 *  - pause() (app in the background) closes the socket; resume() reconnects.
 *  - A 4401 close (token expired or session ended) asks the app to refresh.
 */
import type { RealtimeEvent } from './types';

export type SocketLike = {
  readonly readyState: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  onopen: (() => void) | null;
  onmessage: ((e: { data: unknown }) => void) | null;
  onclose: ((e: { code: number }) => void) | null;
  onerror: ((e: unknown) => void) | null;
};
export type SocketFactory = (url: string) => SocketLike;
export type Clock = { setTimeout: (fn: () => void, ms: number) => unknown; clearTimeout: (h: unknown) => void };
export type RealtimeStatus = 'idle' | 'connecting' | 'open' | 'polling' | 'paused';

export type RealtimeOptions = {
  url: string;
  getToken: () => string | null;
  factory: SocketFactory;
  clock?: Clock;
  /** The server closed with 4401 (bad or expired token): refresh the session; reauth() follows. */
  onAuthRejected?: () => void;
};

export const POLL_AFTER_FAILURES = 2;
export const MAX_BACKOFF_MS = 30_000;
export const backoffMs = (failures: number) => Math.min(MAX_BACKOFF_MS, 1000 * 2 ** Math.max(0, failures - 1));
/** http(s)://host -> ws(s)://host/api/v1/realtime */
export const realtimeUrl = (apiUrl: string) => `${apiUrl.replace(/^http/, 'ws').replace(/\/$/, '')}/api/v1/realtime`;

const OPEN = 1;

export class RealtimeClient {
  private socket: SocketLike | null = null;
  private timer: unknown = null;
  private failures = 0;
  private stopped = true;
  private _status: RealtimeStatus = 'idle';
  private listeners = new Set<(e: RealtimeEvent) => void>();
  private statusListeners = new Set<(s: RealtimeStatus) => void>();

  private readonly opts: RealtimeOptions;
  constructor(opts: RealtimeOptions) {
    this.opts = opts;
  }

  private get clock(): Clock {
    return this.opts.clock ?? { setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout: (h) => clearTimeout(h as ReturnType<typeof setTimeout>) };
  }

  get status() {
    return this._status;
  }

  /** True when screens should poll instead of waiting for events. */
  get shouldPoll() {
    return this._status !== 'open';
  }

  private setStatus(s: RealtimeStatus) {
    if (s === this._status) return;
    this._status = s;
    for (const l of this.statusListeners) l(s);
  }

  subscribe(fn: (e: RealtimeEvent) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  onStatus(fn: (s: RealtimeStatus) => void) {
    this.statusListeners.add(fn);
    return () => {
      this.statusListeners.delete(fn);
    };
  }

  start() {
    this.stopped = false;
    this.failures = 0;
    this.connect();
  }

  stop() {
    this.stopped = true;
    this.teardown();
    this.setStatus('idle');
  }

  pause() {
    if (this.stopped) return;
    this.teardown();
    this.setStatus('paused');
  }

  resume() {
    if (this.stopped) return;
    this.failures = 0;
    this.connect();
  }

  /** A refreshed access token: authenticate the open socket again (or connect now). */
  reauth(token: string | null) {
    if (this.stopped) return;
    if (!token) return this.stop();
    if (this.socket && this.socket.readyState === OPEN) this.socket.send(JSON.stringify({ type: 'auth', token }));
    else if (this._status === 'polling' || this._status === 'connecting') {
      this.teardown();
      this.connect();
    }
  }

  private teardown() {
    if (this.timer) this.clock.clearTimeout(this.timer);
    this.timer = null;
    const s = this.socket;
    this.socket = null;
    if (s) {
      s.onopen = s.onmessage = s.onerror = null;
      s.onclose = null;
      try {
        s.close(1000, 'client');
      } catch {
        // already closed
      }
    }
  }

  private connect() {
    const token = this.opts.getToken();
    if (!token) return this.fail(); // nothing to authenticate with yet: poll and try again later
    this.setStatus(this.failures >= POLL_AFTER_FAILURES ? 'polling' : 'connecting');
    let s: SocketLike;
    try {
      s = this.opts.factory(this.opts.url);
    } catch {
      return this.fail();
    }
    this.socket = s;
    s.onopen = () => s.send(JSON.stringify({ type: 'auth', token: this.opts.getToken() ?? token }));
    s.onmessage = (e) => {
      let evt: RealtimeEvent;
      try {
        evt = JSON.parse(String(e.data));
      } catch {
        return;
      }
      if (evt.type === 'ready') {
        this.failures = 0;
        this.setStatus('open');
      }
      for (const l of this.listeners) l(evt);
    };
    s.onerror = () => {};
    s.onclose = (e) => {
      if (this.socket !== s) return;
      this.socket = null;
      if (e?.code === 4401) this.opts.onAuthRejected?.();
      this.fail();
    };
  }

  private fail() {
    if (this.stopped || this._status === 'paused') return;
    this.failures += 1;
    this.setStatus(this.failures >= POLL_AFTER_FAILURES ? 'polling' : 'connecting');
    if (this.timer) this.clock.clearTimeout(this.timer);
    this.timer = this.clock.setTimeout(() => {
      this.timer = null;
      this.connect();
    }, backoffMs(this.failures));
  }
}
