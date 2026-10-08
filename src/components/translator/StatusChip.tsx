import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SystemStatus } from '../../types';
import { transitions } from '../../motion';

interface StatusChipProps {
  status: SystemStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const { t } = useTranslation();
  const isListening = status === 'Listening';
  const isTranslating = status === 'Translating';
  const isConnected = status === 'Connected';
  const shouldReduceMotion = !!useReducedMotion();

  const isLive = isListening || isTranslating;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-tight bg-white border border-[#E8ECE8] text-[#667085] shadow-xs select-none"
      role="status"
      aria-live="polite"
    >
      <motion.span
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
          isListening
            ? 'bg-[#3B5B43]'
            : isTranslating
            ? 'bg-[#486581]'
            : isConnected
            ? 'bg-[#3B5B43]'
            : 'bg-[#94A3B8]'
        }`}
        animate={
          !shouldReduceMotion && isLive
            ? { opacity: [1, 0.45, 1] }
            : { opacity: 1 }
        }
        transition={
          !shouldReduceMotion && isLive
            ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0 }
        }
        aria-hidden="true"
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transitions.fadeQuick}
        >
          {t(`translator.status.${status.toLowerCase()}`)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
