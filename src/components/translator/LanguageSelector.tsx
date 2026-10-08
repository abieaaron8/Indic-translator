import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from './Dropdown';
import { SwapButton } from './SwapButton';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { SUPPORTED_LANGUAGES, TARGET_LANGUAGES } from '../../constants/languages';
import { LanguageCode } from '../../types';

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { fromLang, toLang, setFromLang, setToLang } = useTranslatorStore();

  return (
    <div
      className="flex items-center justify-center gap-4 py-5 px-6 border-b border-[#E8ECE8] bg-[#F8FAF8] select-none"
      aria-label={t('layout.topBar.languageSelector')}
    >
      {/* FROM Dropdown */}
      <Dropdown
        label={t('translator.language.from')}
        value={fromLang}
        options={SUPPORTED_LANGUAGES}
        onChange={(val) => setFromLang(val as LanguageCode)}
        ariaLabel={t('layout.topBar.selectSourceLanguage')}
      />

      {/* Circular Swap Button */}
      <SwapButton />

      {/* TO Dropdown */}
      <Dropdown
        label={t('translator.language.to')}
        value={toLang}
        options={TARGET_LANGUAGES}
        onChange={(val) => setToLang(val as LanguageCode)}
        ariaLabel={t('layout.topBar.selectDestinationLanguage')}
      />
    </div>
  );
};
