import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';

export const UI_LOCALES = ['en', 'hi', 'ta', 'te', 'kn', 'ml'] as const;
export type UiLocale = (typeof UI_LOCALES)[number];
export const UI_LOCALE_STORAGE_KEY = 'indic-translator-locale';

/** Map store language codes (including `auto`) to a supported UI locale. */
export function toUiLocale(code: string | undefined | null): UiLocale {
  if (code && (UI_LOCALES as readonly string[]).includes(code)) {
    return code as UiLocale;
  }
  return 'en';
}

function getSavedLocale(): UiLocale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  return toUiLocale(window.localStorage.getItem(UI_LOCALE_STORAGE_KEY));
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    ta: { translation: ta },
    te: { translation: te },
    kn: { translation: kn },
    ml: { translation: ml },
  },
  lng: getSavedLocale(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
