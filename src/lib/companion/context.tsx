import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ApiError, authApi } from '../api';
import { useAuth } from '../auth';
import { startUploader, subscribe, type UploaderState } from '../uploads/uploader';
import { companionApi } from './api';
import type { Companion, CompanionOptions } from './types';

type Ctx = {
  companion: Companion | null;
  options: CompanionOptions | null;
  loading: boolean;
  error: string | null;
  uploads: UploaderState;
  /** Reloads the application and the signed-in user (route guards follow user.companion). */
  refresh: () => Promise<Companion | null>;
  /** Stores a view the API just returned, and refreshes the user if the status moved. */
  setCompanion: (c: Companion) => void;
};

const CompanionContext = createContext<Ctx | null>(null);

/** Shared state for every companion screen (src/app/companion/_layout.tsx). */
export function CompanionProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuth();
  const [companion, setCompanionState] = useState<Companion | null>(null);
  const [options, setOptions] = useState<CompanionOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploaderState>({ items: [], failures: [], companion: null });
  const lastStatus = useRef<string | null>(null);

  const syncUser = useCallback(async () => {
    try {
      const { user: me } = await authApi.me();
      setUser(me);
    } catch {
      // offline: the guards keep the last known state
    }
  }, [setUser]);

  const setCompanion = useCallback(
    (c: Companion) => {
      setCompanionState(c);
      if (lastStatus.current !== null && lastStatus.current !== c.status) void syncUser();
      lastStatus.current = c.status;
    },
    [syncUser],
  );

  const companionId = user?.companion?.id ?? null;
  const optionsRef = useRef<CompanionOptions | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [opts, me] = await Promise.all([
        optionsRef.current ? Promise.resolve(optionsRef.current) : companionApi.options(),
        companionId ? companionApi.me().catch((err) => (err instanceof ApiError && err.status === 404 ? null : Promise.reject(err))) : Promise.resolve(null),
      ]);
      optionsRef.current = opts;
      setOptions(opts);
      setError(null);
      if (me) setCompanion(me.companion);
      else setCompanionState(null);
      return me?.companion ?? null;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load your application.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [companionId, setCompanion]);

  // Reload when the companion record appears (after applying) or changes.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user?.companion) return undefined;
    startUploader();
    return subscribe((s) => {
      setUploads(s);
      if (s.companion) setCompanion(s.companion);
    });
  }, [user?.companion, setCompanion]);

  const value = useMemo(() => ({ companion, options, loading, error, uploads, refresh, setCompanion }), [companion, options, loading, error, uploads, refresh, setCompanion]);
  return <CompanionContext.Provider value={value}>{children}</CompanionContext.Provider>;
}

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx) throw new Error('useCompanion must be used inside <CompanionProvider>');
  return ctx;
}
