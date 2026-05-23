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

const HAPTIC_KEY = 'hapticsEnabled';

type HapticPreferenceContextValue = {
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
};

const HapticPreferenceContext =
  createContext<HapticPreferenceContextValue | null>(null);

export function HapticPreferenceProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [hapticsEnabled, setHapticsState] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSetting(db, HAPTIC_KEY).then((value) => {
      if (cancelled) return;
      if (value === 'false') setHapticsState(false);
    });
    return () => { cancelled = true; };
  }, [db]);

  const setHapticsEnabled = useCallback(
    (enabled: boolean) => {
      setHapticsState(enabled);
      setSetting(db, HAPTIC_KEY, String(enabled));
    },
    [db]
  );

  return (
    <HapticPreferenceContext.Provider value={{ hapticsEnabled, setHapticsEnabled }}>
      {children}
    </HapticPreferenceContext.Provider>
  );
}

export function useHapticPreference() {
  const ctx = useContext(HapticPreferenceContext);
  if (!ctx) {
    throw new Error('useHapticPreference must be used within a HapticPreferenceProvider');
  }
  return ctx;
}
