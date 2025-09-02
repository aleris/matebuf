import { useState, useEffect } from 'preact/hooks';
import { en } from '../locales/en';
import type { TranslationKeys } from '../locales/en';

type Translations = Record<TranslationKeys, string>;

// Cache for loaded translations
const translationCache = new Map<string, Translations>();

// Supported locales
const supportedLocales = ['en', 'es', 'fr', 'ro'];

// Get browser locale
const getBrowserLocale = (): string => {
  const locale = navigator.language || navigator.languages?.[0] || 'en';
  const languageCode = locale.split('-')[0].toLowerCase();
  return supportedLocales.includes(languageCode) ? languageCode : 'en';
};

// Load translation dynamically
const loadTranslation = async (locale: string): Promise<Translations> => {
  if (translationCache.has(locale)) {
    return translationCache.get(locale)!;
  }

  try {
    let translations: Translations;
    
    switch (locale) {
      case 'es':
        const { es } = await import('../locales/es');
        translations = es;
        break;
      case 'fr':
        const { fr } = await import('../locales/fr');
        translations = fr;
        break;
      case 'ro':
        const { ro } = await import('../locales/ro');
        translations = ro;
        break;
      default:
        translations = en;
    }
    
    translationCache.set(locale, translations);
    return translations;
  } catch (error) {
    console.warn(`Failed to load translation for locale: ${locale}`, error);
    return en;
  }
};

export const useTranslation = () => {
  const [translations, setTranslations] = useState<Translations>(en);
  const [locale, setLocale] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTranslation = async () => {
      setIsLoading(true);
      const browserLocale = getBrowserLocale();
      const loadedTranslations = await loadTranslation(browserLocale);
      
      setLocale(browserLocale);
      setTranslations(loadedTranslations);
      setIsLoading(false);
    };

    initializeTranslation();
  }, []);

  const t = (key: TranslationKeys): string => {
    return translations[key] || en[key] || key;
  };

  const changeLocale = async (newLocale: string) => {
    if (supportedLocales.includes(newLocale)) {
      setIsLoading(true);
      const loadedTranslations = await loadTranslation(newLocale);
      setLocale(newLocale);
      setTranslations(loadedTranslations);
      setIsLoading(false);
    }
  };

  return {
    t,
    locale,
    changeLocale,
    isLoading,
    supportedLocales,
  };
};