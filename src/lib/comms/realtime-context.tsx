import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { API_URL, getAccessToken, onAccessToken, refreshSession } from '../api';
import { useAuth } from '../auth';
import { registerPush } from './push';
import { RealtimeClient, realtimeUrl, type RealtimeStatus, type SocketLike } from './realtime';
import type { RealtimeEvent } from './types';

type Ctx = { client: RealtimeClient | null; status: RealtimeStatus };
const RealtimeCtx = createContext<Ctx>({ client: null, status: 'idle' });

/**
 * One realtime socket for the signed-in (non-staff) user: started on sign-in,
 * re-authenticated after every token refresh, paused while the app is in the
 * background and stopped on sign-out. Also registers the push token on
 * sign-in when notifications were already allowed.
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const [client] = useState(
    () =>
      new RealtimeClient({
        url: realtimeUrl(API_URL || 'http://localhost'),
        getToken: getAccessToken,
        factory: (url) => new WebSocket(url) as unknown as SocketLike,
        onAuthRejected: () => void refreshSession().catch(() => undefined),
      }),
  );
  const [rt, setRt] = useState<RealtimeStatus>('idle');
  const active = status === 'authenticated' && !!user && !user.is_staff && !!API_URL;
  const userId = user?.id;

  useEffect(() => client.onStatus(setRt), [client]);
  useEffect(() => {
    if (!active) return;
    client.start();
    void registerPush();
    const offToken = onAccessToken((t) => client.reauth(t));
    const sub = AppState.addEventListener('change', (s) => (s === 'active' ? client.resume() : client.pause()));
    return () => {
      offToken();
      sub.remove();
      client.stop();
    };
  }, [active, client, userId]);

  return <RealtimeCtx.Provider value={{ client: active ? client : null, status: active ? rt : 'idle' }}>{children}</RealtimeCtx.Provider>;
}

/** Realtime status: screens poll the API while it is not 'open'. */
export const useRealtimeStatus = () => useContext(RealtimeCtx).status;

/** Calls `fn` for every realtime event while the component is mounted (latest `fn`, one subscription). */
export function useRealtimeEvents(fn: (e: RealtimeEvent) => void) {
  const { client } = useContext(RealtimeCtx);
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => (client ? client.subscribe((e) => ref.current(e)) : undefined), [client]);
}

/**
 * Polls `fn` every `ms` while the socket is not open (and once when it opens
 * again, to catch up). Stops in the background with the socket.
 */
export function usePollingFallback(fn: () => void, ms = 5000) {
  const status = useRealtimeStatus();
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  const prev = useRef(status);
  useEffect(() => {
    if (prev.current !== 'open' && status === 'open') ref.current(); // catch up after a reconnect
    prev.current = status;
    if (status === 'open' || status === 'paused') return;
    const t = setInterval(() => ref.current(), ms);
    return () => clearInterval(t);
  }, [status, ms]);
}
