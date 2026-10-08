import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Waveform } from './Waveform';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { springs, microInteractions, transitions } from '../../motion';

export const MicrophoneControl: React.FC = () => {
  const { t } = useTranslation();
  const {
    micState,
    toggleMute,
    simulateStreamingSpeech,
  } = useTranslatorStore();

  const isMuted = micState === 'muted';
  const isProcessing = micState === 'processing';
  const isListening = micState === 'listening';
  const shouldReduceMotion = !!useReducedMotion();

  // Support Spacebar shortcut to quickly toggle mute/on
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only if not focusing on an input or select
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'SELECT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute]);

  return (
    <footer className="w-full h-[76px] min-h-[76px] max-h-[76px] px-8 lg:px-12 border-t border-[#E8ECE8] bg-[#F8FAF8] flex items-center justify-between shrink-0 select-none z-10">
      {/* Left: Quiet, understated interaction hint */}
      <div className="w-[180px] hidden sm:flex items-center text-[12px] text-[#8C98A4] font-normal">
        <span>{t('ui.translator.micHint')}</span>
      </div>

      {/* Center: The Primary Microphone Toggle (Mute / On) */}
      <div className="flex items-center gap-4">
        {/* Subtle Waveform right beside the mic */}
        <div className="w-[120px] flex items-center justify-end">
          <AnimatePresence mode="wait">
            {!isMuted ? (
              <motion.div
                key="active-waveform"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transitions.fadeQuick}
              >
                <Waveform isActive={true} />
              </motion.div>
            ) : (
              <motion.div
                key="muted-bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transitions.fadeQuick}
                className="h-[2px] w-20 bg-[#E0E5E0] rounded-full"
              />
            )}
          </AnimatePresence>
        </div>

        {/* The Direct Mic Toggle Button: On <-> Muted */}
        <motion.button
          type="button"
          onClick={toggleMute}
          aria-label={
            isMuted
              ? t('ui.translator.micMutedAria')
              : t('ui.translator.micActiveAria')
          }
          aria-pressed={!isMuted}
          title={isMuted ? t('ui.translator.turnMicrophoneOn') : t('ui.translator.muteMicrophone')}
          whileTap={shouldReduceMotion ? undefined : microInteractions.iconTap}
          className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full border transition-colors duration-160 cursor-pointer shadow-xs ${
            isMuted
              ? 'bg-[#FDF2F2] border-[#F1D5D5] text-[#A24444] hover:bg-[#FBEAEA]'
              : isProcessing
              ? 'bg-[#EFF4F9] border-[#D4E1ED] text-[#486581]'
              : 'bg-[#EBF2EB] border-[#CFDDCF] text-[#3B5B43] hover:bg-[#E2EDE2]'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center justify-center gap-0.5 text-[#486581]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#486581]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#486581]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#486581]" />
              </motion.div>
            ) : isMuted ? (
              <motion.div
                key="muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transitions.fadeQuick}
              >
                <MicOff size={20} strokeWidth={1.8} />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transitions.fadeQuick}
              >
                <Mic size={20} strokeWidth={1.8} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* State Descriptor Text */}
        <div className="min-w-[100px] flex items-center gap-1.5">
          <motion.span
            className={`w-1.5 h-1.5 rounded-full ${
              isMuted
                ? 'bg-[#A24444]'
                : isProcessing
                ? 'bg-[#486581]'
                : 'bg-[#3B5B43]'
            }`}
            animate={
              !shouldReduceMotion && !isMuted
                ? { opacity: [1, 0.45, 1] }
                : { opacity: 1 }
            }
            transition={
              !shouldReduceMotion && !isMuted
                ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0 }
            }
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={micState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitions.fadeQuick}
              className="text-[13px] font-medium text-[#1F2933]"
            >
              {isMuted ? t('ui.translator.micMuted') : isProcessing ? t('ui.translator.translating') : t('ui.translator.listening')}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Quick Action to simulate next conversational speech turn */}
      <div className="w-[180px] flex items-center justify-end">
        <motion.button
          type="button"
          onClick={simulateStreamingSpeech}
          whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
          className="text-[12.5px] px-3.5 py-1.5 rounded-full text-[#3B5B43] bg-[#E8EFE8] hover:bg-[#DEE7DE] transition-colors cursor-pointer font-medium"
          title={t('ui.translator.simulateSpeechTitle')}
        >
          {t('ui.translator.nextTurn')}
        </motion.button>
      </div>
    </footer>
  );
};
