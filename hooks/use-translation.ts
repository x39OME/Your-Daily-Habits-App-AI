import { translations, type TranslationKey } from '@/constants/translations';
import { useLanguagePreference } from '@/hooks/language-preference';

export function useTranslation() {
  const { language } = useLanguagePreference();
  const dict = translations[language] ?? translations.en;

  const t = (
    key: TranslationKey,
    params?: Record<string, string | number>
  ): string => {
    let str: string = (dict as Record<string, string>)[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  };

  return { t, language };
}
