import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { Role } from './routing';

/** The shell a user with both roles last chose (customer / companion), remembered across launches. */
const KEY = 'sydecrew.role';

type Value = { preferred: Role | null; ready: boolean; setPreferred: (r: Role) => void };
const Ctx = createContext<Value>({ preferred: null, ready: true, setPreferred: () => {} });

async function read(): Promise<Role | null> {
  const v = Platform.OS === 'web' ? globalThis.localStorage?.getItem(KEY) : await SecureStore.getItemAsync(KEY).catch(() => null);
  return v === 'customer' || v === 'companion' ? v : null;
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [preferred, setState] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    read().then((r) => {
      setState(r);
      setReady(true);
    });
  }, []);
  const setPreferred = useCallback((r: Role) => {
    setState(r);
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(KEY, r);
    else SecureStore.setItemAsync(KEY, r).catch(() => undefined);
  }, []);
  const value = useMemo(() => ({ preferred, ready, setPreferred }), [preferred, ready, setPreferred]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useRole = () => useContext(Ctx);
