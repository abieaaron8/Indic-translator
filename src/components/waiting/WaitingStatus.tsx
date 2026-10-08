import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

export const WaitingStatus: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <div
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#E8ECE8] shadow-xs select-none"
      role="status"
      aria-live="polite"
    >
      {/* Calm, understated status indicator communicating state without flashy effects */}
      <span className="relative flex h-2 w-2 items-center justify-center">
        <motion.span
          className="w-2 h-2 rounded-full bg-[#3B5B43]"
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
      <span className="text-[13px] font-medium text-[#1F2933] tracking-tight">
        {t('ui.waiting.waitingForParticipant')}
      </span>
    </div>
  );
};
