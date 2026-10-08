import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslatorStore } from '../store/useTranslatorStore';
import { UI_LOCALE_STORAGE_KEY, toUiLocale } from './index';

/**
 * Keeps react-i18next in sync with the existing language dropdown (`myLanguage`).
 * No page reload — changing the dropdown updates all `t(...)` strings immediately.
 */
export const LanguageSync: React.FC = () => {
  const { i18n } = useTranslation();
  const myLanguage = useTranslatorStore((state) => state.myLanguage);

  useEffect(() => {
    const locale = toUiLocale(myLanguage);
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
    window.localStorage.setItem(UI_LOCALE_STORAGE_KEY, locale);
  }, [myLanguage, i18n]);

  return null;
};
