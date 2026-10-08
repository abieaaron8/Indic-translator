import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Dropdown } from '../translator/Dropdown';
import { CreateConversationCard } from './CreateConversationCard';
import { JoinConversationCard } from './JoinConversationCard';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { LanguageCode } from '../../types';
import { AnimatedTranslation } from '../../i18n/AnimatedTranslation';

const easeOut = 'easeOut' as const;

export const SessionSetupView: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { myLanguage, setMyLanguage, createSession, joinSession } = useTranslatorStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const shouldReduceMotion = !!useReducedMotion();

  const handleCreate = () => {
    setIsCreating(true);
    const code = createSession();
    setTimeout(() => {
      setIsCreating(false);
      navigate(`/waiting/${code}`);
    }, 200);
  };

  const handleJoin = async (code: string) => {
    setIsJoining(true);
    const success = await joinSession(code);
    if (success) {
      setTimeout(() => {
        setIsJoining(false);
        navigate(`/translate/${code}`);
      }, 350);
    } else {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex-1 w-full overflow-y-auto px-6 py-6 sm:py-8 flex flex-col items-center justify-center select-none" role="main" aria-label={t('setup.aria.main')}>
      <div className="w-full max-w-[900px] flex flex-col items-center space-y-5">
        
        {/* Compact Header: Quiet & editorial */}
        <header className="text-center space-y-3 max-w-[520px]">
          <motion.h1
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 12, letterSpacing: '0.1em' }
            }
            animate={{ opacity: 1, y: 0, letterSpacing: '-0.025em' }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="relative inline-block text-[32px] sm:text-[40px] font-semibold text-[#1F2933] leading-[1.15] pb-2"
          >
            <AnimatedTranslation>{t('app.name')}</AnimatedTranslation>
            <motion.span
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.15, ease: easeOut }}
              className="absolute left-0 bottom-0 h-px w-full origin-left bg-[#3B5B43]/45"
            />
          </motion.h1>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
            className="space-y-2"
          >
            <p className="text-[18px] sm:text-[20px] font-medium tracking-tight text-[#1F2933] leading-snug">
              <AnimatedTranslation>{t('setup.tagline.line1')}</AnimatedTranslation>
              <br />
              <AnimatedTranslation>{t('setup.tagline.line2')}</AnimatedTranslation>
            </p>
            <p className="text-[14px] sm:text-[15px] text-[#667085] leading-relaxed">
              <AnimatedTranslation>{t('setup.subtitle')}</AnimatedTranslation>
            </p>
          </motion.div>
        </header>

        {/* Language Selection: "My Language" with exact translator page Dropdown */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: easeOut }}
          className="flex flex-col items-center gap-2"
        >
          <Dropdown
            label={t('setup.myLanguage.label')}
            value={myLanguage}
            options={SUPPORTED_LANGUAGES}
            onChange={(val) => setMyLanguage(val as LanguageCode)}
            ariaLabel={t('setup.myLanguage.aria')}
          />
        </motion.div>

        {/* Action Section: Two Equal Cards */}
        <section
          className="w-full flex flex-col sm:flex-row gap-6 items-stretch justify-center"
          aria-label={t('setup.aria.conversationOptions')}
        >
          <CreateConversationCard
            onCreate={handleCreate}
            isLoading={isCreating}
          />
          <JoinConversationCard
            onJoin={handleJoin}
            isConnecting={isJoining}
          />
        </section>

      </div>
    </div>
  );
};
