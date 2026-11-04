import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError, authApi, clearSession, refreshSession, setSessionLostHandler, storeSession } from './api';
import type { Me, SessionResponse } from './types';

type Status = 'loading' | 'authenticated' | 'anonymous';

type AuthContextValue = {
  status: Status;
  user: Me | null;
  /** True when the stored session could not be checked because the API was unreachable. */
  offline: boolean;
  signIn: (session: SessionResponse) => Promise<void>;
  setUser: (user: Me) => void;
  signOut: () => Promise<void>;
  retry: () => void;
};

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
    refreshSession()
      .then((session) => {
        if (!alive) return;
        setOffline(false);
        setUserState(session?.user ?? null);
        setStatus(session ? 'authenticated' : 'anonymous');
      })
      .catch((err) => {
        if (!alive) return;
        // Unreachable API: keep the token and let the user retry, rather than signing them out.
        setOffline(!(err instanceof ApiError) || err.status === 0);
        setStatus('anonymous');
      });
    return () => {
      alive = false;
      setSessionLostHandler(null);
    };
  }, [attempt]);

  const signIn = useCallback(async (session: SessionResponse) => {
    await storeSession(session);
    setUserState(session.user);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout().catch(() => clearSession());
    setUserState(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      offline,
      signIn,
      setUser: setUserState,
      signOut,
      retry: () => {
        setStatus('loading');
        setAttempt((n) => n + 1);
      },
    }),
    [status, user, offline, signIn, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
