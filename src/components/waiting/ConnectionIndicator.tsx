import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

export const ConnectionIndicator: React.FC = () => {
  const { t } = useTranslation();
  const { myLanguage, systemStatus } = useTranslatorStore();
  const languageName = SUPPORTED_LANGUAGES.find((l) => l.code === myLanguage)?.nativeName || t('common.language.englishFallback');

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 select-none text-[12.5px]" aria-label={t('ui.waiting.connectionAria')}>
      {/* Connection tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8ECE8] text-[#667085] shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3B5B43]" aria-hidden="true" />
        <span className="font-medium text-[#1F2933]">{t('ui.waiting.connection')}</span>
        <span className="text-[#667085]">{t('ui.waiting.connected')}</span>
      </div>

      {/* Microphone tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8ECE8] text-[#667085] shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3B5B43]" aria-hidden="true" />
        <span className="font-medium text-[#1F2933]">{t('ui.waiting.microphone')}</span>
        <span className="text-[#667085]">{t('ui.waiting.ready')}</span>
      </div>

      {/* Language tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8ECE8] text-[#667085] shadow-xs">
        <span className="font-medium text-[#1F2933]">{t('ui.waiting.language')}</span>
        <span className="text-[#3B5B43] font-medium">{languageName}</span>
      </div>
    </div>
  );
};
