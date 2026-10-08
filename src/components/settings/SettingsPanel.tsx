import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { SpeechCadence } from '../../types';
import { springs, microInteractions, cardEntryVariants, staggerFeedVariants, getMotionSafeVariants } from '../../motion';

export const SettingsPanel: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useTranslatorStore();
  const shouldReduceMotion = !!useReducedMotion();

  const safeFeed = getMotionSafeVariants(staggerFeedVariants, shouldReduceMotion);
  const safeItem = getMotionSafeVariants(cardEntryVariants, shouldReduceMotion);

  const cadences: { id: SpeechCadence; label: string }[] = [
    { id: 'deliberate', label: t('ui.settings.deliberate') },
    { id: 'natural', label: t('ui.settings.natural') },
    { id: 'brisk', label: t('ui.settings.brisk') },
  ];

  return (
    <div className="flex-1 w-full overflow-y-auto px-8 md:px-12 lg:px-16 py-8" role="tabpanel" aria-label={t('ui.settings.panelAria')}>
      <motion.div
        variants={safeFeed}
        initial="initial"
        animate="animate"
        className="w-full max-w-5xl space-y-8"
      >
        <header className="pb-4 border-b border-[#E8ECE8]">
          <h2 className="text-[18px] font-medium text-[#1F2933] tracking-tight">{t('ui.settings.title')}</h2>
          <p className="text-[13px] text-[#667085] mt-0.5">
            {t('ui.settings.subtitle')}
          </p>
        </header>

        {/* Section 1: Audio Input */}
        <motion.div variants={safeItem} className="space-y-4">
          <h3 className="text-[12px] font-semibold text-[#667085] tracking-wider uppercase">
            {t('ui.settings.audioInput')}
          </h3>

          <div className="bg-white border border-[#E8ECE8] rounded-[16px] divide-y divide-[#E8ECE8]/60">
            <div className="p-4 flex items-center justify-between">
              <div>
                <label htmlFor="deviceSelect" className="text-[14px] font-medium text-[#1F2933]">
                  {t('ui.settings.microphoneSource')}
                </label>
                <p className="text-[12.5px] text-[#667085]">
                  {t('ui.settings.microphoneDescription')}
                </p>
              </div>
              <select
                id="deviceSelect"
                value={settings.audioDevice}
                onChange={(e) => updateSettings({ audioDevice: e.target.value })}
                className="text-[13px] bg-[#F8FAF8] border border-[#E8ECE8] rounded-[8px] px-3 py-1.5 text-[#1F2933] focus:outline-hidden focus:ring-1 focus:ring-[#3B5B43]/30"
              >
                <option value="Default System Microphone">{t('ui.settings.defaultMicrophone')}</option>
                <option value="Studio USB Microphone">{t('ui.settings.studioMicrophone')}</option>
                <option value="Built-in Array">{t('ui.settings.builtInArray')}</option>
              </select>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[14px] font-medium text-[#1F2933]">
                  {t('ui.settings.ambientCancellation')}
                </span>
                <p className="text-[12.5px] text-[#667085]">
                  {t('ui.settings.ambientDescription')}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.ambientCancellation}
                onChange={(e) => updateSettings({ ambientCancellation: e.target.checked })}
                className="w-4 h-4 accent-[#3B5B43] cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* Section 2: Speech Flow */}
        <motion.div variants={safeItem} className="space-y-4">
          <h3 className="text-[12px] font-semibold text-[#667085] tracking-wider uppercase">
            {t('ui.settings.speechFlow')}
          </h3>

          <div className="bg-white border border-[#E8ECE8] rounded-[16px] divide-y divide-[#E8ECE8]/60">
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[14px] font-medium text-[#1F2933]">
                  {t('ui.settings.autoPlay')}
                </span>
                <p className="text-[12.5px] text-[#667085]">
                  {t('ui.settings.autoPlayDescription')}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoPlayTranslation}
                onChange={(e) => updateSettings({ autoPlayTranslation: e.target.checked })}
                className="w-4 h-4 accent-[#3B5B43] cursor-pointer"
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[14px] font-medium text-[#1F2933]">
                  {t('ui.settings.speechCadence')}
                </span>
                <p className="text-[12.5px] text-[#667085]">
                  {t('ui.settings.speechCadenceDescription')}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-[#F2F5F2] p-1 rounded-full border border-[#E0E7E0]">
                {cadences.map((c) => {
                  const isSelected = settings.speechCadence === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateSettings({ speechCadence: c.id })}
                      className={`relative px-3 py-1 rounded-full text-[12px] cursor-pointer transition-colors duration-140 ${
                        isSelected
                          ? 'text-[#1F2933] font-medium'
                          : 'text-[#667085] hover:text-[#1F2933]'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="active-cadence-pill"
                          className="absolute inset-0 rounded-full bg-white shadow-2xs z-0"
                          transition={shouldReduceMotion ? { duration: 0 } : springs.pill}
                        />
                      )}
                      <span className="relative z-10">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Typography */}
        <motion.div variants={safeItem} className="space-y-4">
          <h3 className="text-[12px] font-semibold text-[#667085] tracking-wider uppercase">
            {t('ui.settings.typography')}
          </h3>

          <div className="bg-white border border-[#E8ECE8] rounded-[16px] p-4 flex items-center justify-between">
            <div>
              <span className="text-[14px] font-medium text-[#1F2933]">
                {t('ui.settings.nativeTypography')}
              </span>
              <p className="text-[12.5px] text-[#667085]">
                {t('ui.settings.nativeTypographyDescription')}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.nativeTypography}
              onChange={(e) => updateSettings({ nativeTypography: e.target.checked })}
              className="w-4 h-4 accent-[#3B5B43] cursor-pointer"
            />
          </div>
        </motion.div>

        {/* Section 4: Universal Backend Integration */}
        <motion.div variants={safeItem} className="space-y-4">
          <h3 className="text-[12px] font-semibold text-[#667085] tracking-wider uppercase">
            {t('ui.settings.backend')}
          </h3>

          <div className="bg-white border border-[#E8ECE8] rounded-[16px] divide-y divide-[#E8ECE8]/60">
            <div className="p-4 flex items-center justify-between">
              <div>
                <label htmlFor="backendModeSelect" className="text-[14px] font-medium text-[#1F2933]">
                  {t('ui.settings.pipelineEngine')}
                </label>
                <p className="text-[12.5px] text-[#667085]">
                  {t('ui.settings.pipelineDescription')}
                </p>
              </div>
              <select
                id="backendModeSelect"
                value={settings.backendMode}
                onChange={(e) => updateSettings({ backendMode: e.target.value as any })}
                className="text-[13px] bg-[#F8FAF8] border border-[#E8ECE8] rounded-[8px] px-3 py-1.5 text-[#1F2933] focus:outline-hidden focus:ring-1 focus:ring-[#3B5B43]/30"
              >
                <option value="simulation">{t('ui.settings.simulationMode')}</option>
                <option value="websocket">{t('ui.settings.websocketMode')}</option>
                <option value="webspeech">{t('ui.settings.webspeechMode')}</option>
              </select>
            </div>

            {settings.backendMode === 'websocket' && (
              <div className="p-4 flex flex-col gap-2">
                <label htmlFor="endpointInput" className="text-[14px] font-medium text-[#1F2933]">
                  {t('ui.settings.endpoint')}
                </label>
                <p className="text-[12.5px] text-[#667085]">
                  {t('ui.settings.endpointDescription')}
                </p>
                <input
                  id="endpointInput"
                  type="text"
                  value={settings.backendEndpoint}
                  onChange={(e) => updateSettings({ backendEndpoint: e.target.value })}
                  placeholder={t('ui.settings.endpointPlaceholder')}
                  className="w-full text-[13px] font-mono bg-[#F8FAF8] border border-[#E8ECE8] rounded-[8px] px-3 py-2 text-[#1F2933] focus:outline-hidden focus:ring-1 focus:ring-[#3B5B43]/30"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
