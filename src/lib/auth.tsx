import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError, authApi, clearSession, refreshSession, setAccountOnHoldHandler, setSessionLostHandler, storeSession } from './api';
import { unregisterPush } from './comms/push';
import { markOnHold } from './enforcement/helpers';
import type { Me, SessionResponse } from './types';

type Status = 'loading' | 'authenticated' | 'anonymous';

type AuthContextValue = {
  status: Status;
  user: Me | null;
  /** True when the stored session could not be checked because the API was unreachable. */
  offline: boolean;
  signIn: (session: SessionResponse) => Promise<void>;
  setUser: (user: Me) => void;
  /** Reloads the user from GET /auth/me (e.g. to see whether a hold has ended). Never signs out on failure. */
  refreshUser: () => Promise<Me | null>;
  signOut: (opts?: SignOutOptions) => Promise<void>;
  retry: () => void;
};

/** `sessionEnded`: the server has already ended the session, so sign out locally without calling the API. */
export type SignOutOptions = { sessionEnded?: boolean };

const AuthContext = createContext<AuthContextValue | null>(null);

/** Restores the session from the stored refresh token at launch and keeps the signed-in user. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUserState] = useState<Me | null>(null);
  const [offline, setOffline] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setSessionLostHandler(() => {
      setUserState(null);
      setStatus('anonymous');
    });
    // 403 ACCOUNT_ON_HOLD from any request: mark the user on hold at once (the route guards then
    // show Account status), and confirm with GET /auth/me, which still works while on hold.
    setAccountOnHoldHandler((details) => {
      setUserState((u) => (u ? markOnHold(u, details) : u));
      authApi
        .me()
        .then(({ user: fresh }) => setUserState((u) => (u ? fresh : u)))
        .catch(() => undefined);
    });
    refreshSession()
      .then((session) => {
        if (!alive) return;
        setOffline(false);
        setUserState(session?.user ?? null);
        setStatus(session ? 'authenticated' : 'anonymous');
      })
      .catch((err) => {
        if (!alive) return;
        // Unreachable or failing API (offline, 429, 5xx): keep the token and offer a retry
        // instead of silently signing the user out. Only a 401 means the session is over.
        setOffline(!(err instanceof ApiError) || err.status !== 401);
        setStatus('anonymous');
      });
    return () => {
      alive = false;
      setSessionLostHandler(null);
      setAccountOnHoldHandler(null);
    };
  }, [attempt]);

  const signIn = useCallback(async (session: SessionResponse) => {
    await storeSession(session);
    setUserState(session.user);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async (opts?: SignOutOptions) => {
    if (opts?.sessionEnded) {
      // The server already ended every session (e.g. account deletion): no API calls, just forget the tokens here.
      await clearSession().catch(() => undefined);
    } else {
      await unregisterPush(); // while the session is still valid: this device stops getting pushes
      await authApi.logout().catch(() => clearSession());
    }
    setUserState(null);
    setStatus('anonymous');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { user: fresh } = await authApi.me();
      setUserState((u) => (u ? fresh : u)); // ignore an answer that arrives after sign-out
      return fresh;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      offline,
      signIn,
      setUser: setUserState,
      refreshUser,
      signOut,
      retry: () => {
        setStatus('loading');
        setAttempt((n) => n + 1);
      },
    }),
    [status, user, offline, signIn, signOut, refreshUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
