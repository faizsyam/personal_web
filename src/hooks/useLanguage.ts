import { useState, useCallback, useEffect } from 'react';

type Language = 'en' | 'id';
const STORAGE_KEY = 'faiz-portfolio-language';

/**
 * Hook to manage language preference with localStorage persistence.
 * Falls back to 'en' if no stored preference or invalid value.
 */
export function useLanguage(): {
  lang: Language;
  toggleLang: () => void;
} {
  const getInitialLang = (): Language => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'id') {
        return stored;
      }
    } catch {
      // localStorage not available (SSR, private mode, etc.)
    }
    return 'en';
  };

  const [lang, setLang] = useState<Language>(getInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'id' : 'en'));
  }, []);

  return { lang, toggleLang };
}
