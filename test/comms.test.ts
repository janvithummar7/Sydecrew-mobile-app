// Chat, calls and safety (Feature 5): realtime client, message idempotency, call window, location throttle, SOS order.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RealtimeClient, backoffMs, realtimeUrl, type SocketLike } from '../src/lib/comms/realtime.ts';
import { CLIENT_MESSAGE_ID_RE, LocationThrottle, Outbox, PING_PROMPT_INITIAL, callWindow, mergeMessages, moderationView, newClientMessageId, nextPingPrompt, sosSections, telUrl } from '../src/lib/comms/helpers.ts';
import type { Message } from '../src/lib/comms/types.ts';

// ── Fakes ────────────────────────────────────────────────────────────────

class FakeSocket implements SocketLike {
  readyState = 0;
  sent: string[] = [];
  closed = false;
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: unknown }) => void) | null = null;
  onclose: ((e: { code: number }) => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  readonly url: string;
  constructor(url: string) {
    this.url = url;
  }
  send(d: string) {
    this.sent.push(d);
  }
  close() {
    this.closed = true;
    this.readyState = 3;
  }
  // test drivers
  open() {
    this.readyState = 1;
    this.onopen?.();
  }
  receive(obj: unknown) {
    this.onmessage?.({ data: JSON.stringify(obj) });
  }
  drop(code = 1006) {
    this.readyState = 3;
    this.onclose?.({ code });
  }
}

function fakeClock() {
  let now = 0;
  let seq = 0;
  const timers = new Map<number, { at: number; fn: () => void; ms: number }>();
  return {
    delays: [] as number[],
    setTimeout(fn: () => void, ms: number) {
      this.delays.push(ms);
      const id = ++seq;
      timers.set(id, { at: now + ms, fn, ms });
      return id;
    },
    clearTimeout(h: unknown) {
      timers.delete(h as number);
    },
    pending: () => timers.size,
    /** Runs every timer due within `ms`. */
    tick(ms: number) {
      now += ms;
      for (const [id, t] of [...timers]) if (t.at <= now) {
        timers.delete(id);
        t.fn();
      }
    },
  };
}

function setup(token: string | null = 'tok-1') {
  const sockets: FakeSocket[] = [];
  const clock = fakeClock();
  let current = token;
  let rejected = 0;
  const client = new RealtimeClient({
    url: 'ws://api.test/api/v1/realtime',
    getToken: () => current,
    factory: (url) => {
      const s = new FakeSocket(url);
      sockets.push(s);
      return s;
    },
    clock,
    onAuthRejected: () => {
      rejected += 1;
    },
  });
  return { client, sockets, clock, setToken: (t: string | null) => (current = t), rejected: () => rejected };
}

// ── Realtime ─────────────────────────────────────────────────────────────

test('realtime: the URL is ws(s) on the API host; the token never goes in it', () => {
  assert.equal(realtimeUrl('http://10.0.2.2:4000'), 'ws://10.0.2.2:4000/api/v1/realtime');
  assert.equal(realtimeUrl('https://api.sydecrew.in/'), 'wss://api.sydecrew.in/api/v1/realtime');
  const { client, sockets } = setup();
  client.start();
  assert.ok(!sockets[0].url.includes('tok-1'));
});

test('realtime: the first message is { type: "auth", token }; "ready" opens it and events reach listeners', () => {
  const { client, sockets } = setup();
  const seen: string[] = [];
  client.subscribe((e) => seen.push(e.type));
  client.start();
  assert.equal(client.status, 'connecting');
  sockets[0].open();
  assert.equal(sockets[0].sent.length, 1);
  assert.deepEqual(JSON.parse(sockets[0].sent[0]), { type: 'auth', token: 'tok-1' });
  assert.equal(client.shouldPoll, true, 'not open until the server says ready');
  sockets[0].receive({ type: 'ready', payload: { user_id: 'u1' } });
  assert.equal(client.status, 'open');
  assert.equal(client.shouldPoll, false);
  sockets[0].receive({ type: 'message.new', payload: { conversation_id: 'c1', message: {} } });
  sockets[0].onmessage?.({ data: 'not json' }); // ignored
  assert.deepEqual(seen, ['ready', 'message.new']);
});

test('realtime: reauth after a token refresh sends a fresh auth on the open socket', () => {
  const { client, sockets } = setup();
  client.start();
  sockets[0].open();
  sockets[0].receive({ type: 'ready', payload: { user_id: 'u1' } });
  client.reauth('tok-2');
  assert.deepEqual(JSON.parse(sockets[0].sent[1]), { type: 'auth', token: 'tok-2' });
  assert.equal(sockets.length, 1, 'same socket');
  client.reauth(null); // signed out
  assert.equal(client.status, 'idle');
  assert.equal(sockets[0].closed, true);
});

test('realtime: reconnects with exponential back-off capped at 30 s, and falls back to polling', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 10].map(backoffMs), [1000, 2000, 4000, 8000, 16000, 30000, 30000, 30000]);
  const { client, sockets, clock } = setup();
  const statuses: string[] = [];
  client.onStatus((s) => statuses.push(s));
  client.start();
  sockets[0].drop();
  assert.equal(client.status, 'connecting', 'one failure: still trying');
  assert.equal(clock.delays.at(-1), 1000);
  clock.tick(999);
  assert.equal(sockets.length, 1, 'waits the full back-off');
  clock.tick(1);
  assert.equal(sockets.length, 2);
  sockets[1].drop();
  assert.equal(client.status, 'polling', 'two failures: screens poll the API');
  assert.equal(client.shouldPoll, true);
  assert.equal(clock.delays.at(-1), 2000);
  clock.tick(2000);
  sockets[2].drop();
  assert.equal(clock.delays.at(-1), 4000);
  clock.tick(4000);
  sockets[3].open();
  sockets[3].receive({ type: 'ready', payload: { user_id: 'u1' } });
  assert.equal(client.status, 'open', 'back from polling once the socket is ready');
  sockets[3].drop();
  assert.equal(clock.delays.at(-1), 1000, 'back-off restarts after a good connection');
  assert.deepEqual(statuses, ['connecting', 'polling', 'open', 'connecting']);
});

test('realtime: a 4401 close asks the app to refresh the session', () => {
  const t = setup();
  t.client.start();
  t.sockets[0].open();
  t.sockets[0].drop(4401);
  assert.equal(t.rejected(), 1);
  t.sockets.length = 0;
  t.client.reauth('tok-2'); // the refresh finished while reconnecting: connect now with the new token
  assert.equal(t.sockets.length, 1);
});

test('realtime: paused in the background (no socket, no timers), resumed in the foreground', () => {
  const { client, sockets, clock } = setup();
  client.start();
  sockets[0].drop();
  client.pause();
  assert.equal(client.status, 'paused');
  assert.equal(clock.pending(), 0, 'no reconnect timer while paused');
  clock.tick(60_000);
  assert.equal(sockets.length, 1);
  client.resume();
  assert.equal(sockets.length, 2);
  assert.equal(client.status, 'connecting');
  sockets[1].open();
  client.pause();
  assert.equal(sockets[1].closed, true, 'socket closed in the background');
  client.stop();
  client.resume(); // stopped: resume does nothing
  assert.equal(sockets.length, 2);
});

test('realtime: no token yet -> polling and retry later, never a socket without auth', () => {
  const { client, sockets, clock, setToken } = setup(null);
  client.start();
  assert.equal(sockets.length, 0);
  clock.tick(1000);
  assert.equal(client.status, 'polling');
  setToken('tok-1');
  clock.tick(2000);
  assert.equal(sockets.length, 1);
});

// ── Chat ─────────────────────────────────────────────────────────────────

test('chat: client message ids match the API pattern and are unique', () => {
  const ids = new Set(Array.from({ length: 200 }, () => newClientMessageId()));
  assert.equal(ids.size, 200);
  for (const id of ids) assert.match(id, CLIENT_MESSAGE_ID_RE);
  assert.match(newClientMessageId(0, () => 0), CLIENT_MESSAGE_ID_RE);
  assert.match(newClientMessageId(Number.MAX_SAFE_INTEGER, () => 0.999999), CLIENT_MESSAGE_ID_RE);
});

test('chat: a retry reuses the same Idempotency-Key; a new message gets a new one', () => {
  let n = 0;
  const box = new Outbox(() => `msg-test-${++n}`);
  const a = box.add('Hello');
  box.fail(a.localId, 'NETWORK_ERROR');
  assert.equal(box.list()[0].status, 'failed');
  const again = box.retry(a.localId);
  assert.ok(again);
  assert.equal(again.clientMessageId, a.clientMessageId, 'same key on retry');
  assert.equal(again.status, 'sending');
  assert.equal(box.retry(a.localId)?.clientMessageId, 'msg-test-1', 'and on every retry after');
  const b = box.add('Second');
  assert.notEqual(b.clientMessageId, a.clientMessageId);
  box.done(a.localId);
  assert.deepEqual(box.list().map((p) => p.body), ['Second']);
  assert.equal(box.retry('missing'), null);
});

test('chat: merge replaces by id (realtime + page overlap) and sorts oldest first', () => {
  const m = (id: string, at: string, body = id) => ({ id, created_at: at, body }) as unknown as Message;
  const merged = mergeMessages([m('b', '2026-11-06T10:01:00Z'), m('a', '2026-11-06T10:00:00Z')], [m('b', '2026-11-06T10:01:00Z', 'edited'), m('c', '2026-11-06T10:02:00Z')]);
  assert.deepEqual(merged.map((x) => x.id), ['a', 'b', 'c']);
  assert.equal((merged[1] as unknown as { body: string }).body, 'edited');
});

test('chat: moderation labels (held / rejected only shown to the sender)', () => {
  const copy = { masked: 'M', held: 'H', rejected: 'R' };
  assert.deepEqual(moderationView('DELIVERED', true, copy), { label: null, tone: 'muted' });
  assert.equal(moderationView('MASKED', false, copy).label, 'M');
  assert.equal(moderationView('HELD', true, copy).label, 'H');
  assert.equal(moderationView('HELD', false, copy).label, null);
  assert.equal(moderationView('REJECTED', true, copy).tone, 'danger');
});

// ── Calls ────────────────────────────────────────────────────────────────

test('calls: the Call button only shows inside [start - 2 h, end + 2 h) for CONFIRMED / IN_PROGRESS', () => {
  const b = { status: 'CONFIRMED', start_at: '2026-11-06T12:00:00Z', end_at: '2026-11-06T14:00:00Z' };
  const at = (iso: string) => new Date(iso);
  assert.equal(callWindow(b, at('2026-11-06T09:59:59Z')).reason, 'NOT_YET');
  assert.equal(callWindow(b, at('2026-11-06T10:00:00Z')).open, true, 'opens exactly 2 h before');
  assert.equal(callWindow({ ...b, status: 'IN_PROGRESS' }, at('2026-11-06T13:00:00Z')).open, true);
  assert.equal(callWindow(b, at('2026-11-06T15:59:59Z')).open, true);
  assert.equal(callWindow(b, at('2026-11-06T16:00:00Z')).reason, 'ENDED', 'closed exactly 2 h after the end');
  for (const status of ['REQUESTED', 'ACCEPTED', 'PAYMENT_PENDING', 'COMPLETED', 'CANCELLED_BY_CUSTOMER', 'DISPUTED']) {
    assert.equal(callWindow({ ...b, status }, at('2026-11-06T13:00:00Z')).reason, 'NOT_CONFIRMED', status);
  }
  assert.equal(callWindow(b, at('2026-11-06T10:00:00Z')).opensAt.toISOString(), '2026-11-06T10:00:00.000Z');
});

test('calls: tel: URLs keep only digits and +', () => {
  assert.equal(telUrl('+91 80000 01234'), 'tel:+918000001234');
  assert.equal(telUrl('112'), 'tel:112');
  assert.equal(telUrl('1;2,3#'), 'tel:123');
});

// ── Location ─────────────────────────────────────────────────────────────

test('location: at most one point every 30 s', () => {
  const t = new LocationThrottle();
  assert.equal(t.due(0), true, 'the first point goes at once');
  t.mark(0);
  assert.equal(t.due(1_000), false);
  assert.equal(t.due(29_999), false);
  assert.equal(t.waitMs(20_000), 10_000);
  assert.equal(t.due(30_000), true);
  t.mark(30_000);
  // a burst of watcher callbacks sends exactly one point per 30 s
  let sent = 0;
  for (let now = 30_001; now <= 150_000; now += 1_000) if (t.due(now)) {
    t.mark(now);
    sent += 1;
  }
  assert.equal(sent, 3, "60.001 s, 90.001 s, 120.001 s");
  t.reset();
  assert.equal(t.due(150_001), true, 'reset when sharing is turned on again');
  assert.equal(new LocationThrottle().waitMs(0), 0, "nothing sent yet: no wait");
});

// ── Safety ping ──────────────────────────────────────────────────────────

test('ping: a pending ping from GET /bookings/:id/safety-ping shows the prompt (app opened from the push)', () => {
  const s = nextPingPrompt(PING_PROMPT_INITIAL, { type: 'fetched', res: { pending: true, ping: { id: 'p1', sent_at: '2026-11-06T13:00:00Z' } } });
  assert.equal(s.pingId, 'p1');
  assert.equal(nextPingPrompt(PING_PROMPT_INITIAL, { type: 'fetched', res: { pending: false, ping: null } }).pingId, null, 'nothing pending: hidden');
  assert.equal(nextPingPrompt(s, { type: 'fetched', res: { pending: false, ping: null } }).pingId, null, 'answered elsewhere / timed out: hidden on resume');
});

test('ping: realtime shows it too; once answered it stays hidden even if a stale fetch still reports it', () => {
  let s = nextPingPrompt(PING_PROMPT_INITIAL, { type: 'realtime', pingId: 'p1' });
  assert.equal(s.pingId, 'p1');
  s = nextPingPrompt(s, { type: 'answered' });
  assert.equal(s.pingId, null);
  assert.deepEqual(s.answered, ['p1']);
  s = nextPingPrompt(s, { type: 'fetched', res: { pending: true, ping: { id: 'p1', sent_at: '2026-11-06T13:00:00Z' } } });
  assert.equal(s.pingId, null, 'stale pending p1 ignored');
  s = nextPingPrompt(s, { type: 'realtime', pingId: 'p2' });
  assert.equal(s.pingId, 'p2', 'a new ping shows');
  assert.deepEqual(nextPingPrompt(PING_PROMPT_INITIAL, { type: 'answered' }), PING_PROMPT_INITIAL);
});

// ── SOS ──────────────────────────────────────────────────────────────────

test('SOS: "Call 112" is always first, in every state', () => {
  for (const alertSent of [false, true]) for (const markedSafe of [false, true]) {
    const s = sosSections({ alertSent, markedSafe });
    assert.equal(s[0], 'CALL_112', JSON.stringify({ alertSent, markedSafe }));
    assert.equal(s.filter((x) => x === 'CALL_112').length, 1);
  }
  assert.deepEqual(sosSections({ alertSent: false, markedSafe: false }), ['CALL_112', 'SHARE_LOCATION', 'SEND_ALERT', 'LEAVE']);
  assert.deepEqual(sosSections({ alertSent: true, markedSafe: false }), ['CALL_112', 'STATUS', 'IM_SAFE', 'LEAVE']);
  assert.deepEqual(sosSections({ alertSent: true, markedSafe: true }), ['CALL_112', 'STATUS', 'LEAVE']);
  const before = sosSections({ alertSent: false, markedSafe: false });
  assert.ok(before.indexOf('SHARE_LOCATION') < before.indexOf('SEND_ALERT'), 'the location choice comes before the alert');
});
