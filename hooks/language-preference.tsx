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
import type { Language } from '@/constants/translations';

const LANG_KEY = 'language';

type LanguagePreferenceContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  hydrated: boolean;
};

const LanguagePreferenceContext =
  createContext<LanguagePreferenceContextValue | null>(null);

export function LanguagePreferenceProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [language, setLanguageState] = useState<Language>('en');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSetting(db, LANG_KEY).then((value) => {
      if (cancelled) return;
      if (value === 'en' || value === 'ar') {
        setLanguageState(value);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [db]);

  const setLanguage = useCallback(
    (next: Language) => {
      setLanguageState(next);
      setSetting(db, LANG_KEY, next);
    },
    [db]
  );

  return (
    <LanguagePreferenceContext.Provider
      value={{ language, setLanguage, hydrated }}>
      {children}
    </LanguagePreferenceContext.Provider>
  );
}

export function useLanguagePreference() {
  const ctx = useContext(LanguagePreferenceContext);
  if (!ctx) {
    throw new Error(
      'useLanguagePreference must be used within a LanguagePreferenceProvider'
    );
  }
  return ctx;
}
