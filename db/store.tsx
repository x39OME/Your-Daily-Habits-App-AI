import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';

type StoreContextValue = {
  revision: number;
  bump: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function HabitStoreProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0);
  const bump = useCallback(() => setRevision((r) => r + 1), []);
  return (
    <StoreContext.Provider value={{ revision, bump }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useHabitStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useHabitStore must be used within HabitStoreProvider');
  return ctx;
}

export function useDb() {
  return useSQLiteContext();
}

export function useQuery<T>(
  loader: (db: ReturnType<typeof useSQLiteContext>) => Promise<T>,
  deps: ReadonlyArray<unknown> = []
): { data: T | null; loading: boolean; refresh: () => void } {
  const db = useSQLiteContext();
  const { revision } = useHabitStore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [localRev, setLocalRev] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loader(db).then((value) => {
      if (cancelled) return;
      setData(value);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, revision, localRev, ...deps]);

  const refresh = useCallback(() => setLocalRev((r) => r + 1), []);
  return { data, loading, refresh };
}
