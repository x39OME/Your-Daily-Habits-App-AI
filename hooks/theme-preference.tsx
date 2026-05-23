import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { getSetting, setSetting } from '@/db';

export type ThemeMode = 'system' | 'light' | 'dark';

const THEME_KEY = 'theme_mode';

type ThemePreferenceContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  hydrated: boolean;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(
  null
);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSetting(db, THEME_KEY).then((value) => {
      if (cancelled) return;
      if (value === 'light' || value === 'dark' || value === 'system') {
        setModeState(value);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [db]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      setSetting(db, THEME_KEY, next);
    },
    [db]
  );

  return (
    <ThemePreferenceContext.Provider value={{ mode, setMode, hydrated }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error(
      'useThemePreference must be used within a ThemePreferenceProvider'
    );
  }
  return ctx;
}
