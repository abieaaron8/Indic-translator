import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { StatusChip } from '../translator/StatusChip';
import { Dropdown } from '../translator/Dropdown';
import { SwapButton } from '../translator/SwapButton';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { SUPPORTED_LANGUAGES, TARGET_LANGUAGES } from '../../constants/languages';
import { LanguageCode } from '../../types';
import { quietFadeVariants, getMotionSafeVariants } from '../../motion';
import { AnimatedTranslation } from '../../i18n/AnimatedTranslation';

export const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { systemStatus, fromLang, toLang, setFromLang, setToLang, currentSessionId } = useTranslatorStore();
  const shouldReduceMotion = !!useReducedMotion();
  const safeFade = getMotionSafeVariants(quietFadeVariants, shouldReduceMotion);

  const isTranslatePage = location.pathname.startsWith('/translate');
  const isSessionsPage = location.pathname.startsWith('/sessions');
  const isSettingsPage = location.pathname.startsWith('/settings');
  const isWaitingPage = location.pathname.startsWith('/waiting');

  const getTitle = () => {
    if (isSessionsPage) return t('layout.topBar.recentSessions');
    if (isSettingsPage) return t('layout.topBar.settings');
    if (isWaitingPage) return t('layout.topBar.waitingRoom');
    return t('app.name');
  };

  const showLanguageSelector = isTranslatePage;
  const activeCode = sessionId || currentSessionId;

  return (
    <header
      className={`relative w-full px-8 lg:px-12 flex flex-col justify-center border-b border-[#E8ECE8] bg-[#F8FAF8] shrink-0 select-none z-10 transition-all duration-200 ${
        showLanguageSelector ? 'h-[114px] min-h-[114px]' : 'h-[68px] min-h-[68px]'
      }`}
    >
      {/* Top Row: Page Title + Right Status Chip */}
      <div className="relative flex items-center justify-center w-full">
        <div className="flex items-center gap-2">
          <h1 className="text-[17px] lg:text-[18px] font-semibold tracking-tight text-[#1F2933]">
            <AnimatedTranslation>{getTitle()}</AnimatedTranslation>
          </h1>
          <AnimatePresence>
            {activeCode && isTranslatePage && (
              <motion.span
                variants={safeFade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-[11.5px] font-mono tracking-wider px-2 py-0.5 rounded-md bg-[#EEF2EE] text-[#4A6B53]"
              >
                #{activeCode}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <StatusChip status={systemStatus} />
        </div>
      </div>

      {/* Bottom Row: Language Selectors on Translate workspace */}
      <AnimatePresence>
        {showLanguageSelector && (
          <motion.div
            variants={safeFade}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center justify-center gap-5 sm:gap-6 mt-3"
            aria-label={t('layout.topBar.languageSelector')}
          >
            <Dropdown
              label={t('translator.language.from')}
              value={fromLang}
              options={SUPPORTED_LANGUAGES}
              onChange={(val) => setFromLang(val as LanguageCode)}
              ariaLabel={t('layout.topBar.selectSourceLanguage')}
            />

            <SwapButton />

            <Dropdown
              label={t('translator.language.to')}
              value={toLang}
              options={TARGET_LANGUAGES}
              onChange={(val) => setToLang(val as LanguageCode)}
              ariaLabel={t('layout.topBar.selectDestinationLanguage')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
