import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { springs, microInteractions } from '../../motion';

export const SwapButton: React.FC = () => {
  const { t } = useTranslation();
  const { swapLanguages, isSwapRotating } = useTranslatorStore();
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={swapLanguages}
      aria-label={t('ui.translator.swapLanguagesAria')}
      title={t('ui.translator.swapLanguagesTitle')}
      whileTap={shouldReduceMotion ? undefined : microInteractions.iconTap}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#E0E5E0] bg-white text-[#667085] hover:text-[#1F2933] hover:border-[#CCD5CC] hover:bg-[#FAFBF9] transition-colors duration-140 cursor-pointer shadow-[0_1px_3px_rgba(20,30,25,0.03)] shrink-0 focus:outline-hidden focus:ring-1 focus:ring-[#3B5B43]/30"
    >
      <motion.span
        animate={{ rotate: isSwapRotating ? 180 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : springs.swap}
        className="flex items-center justify-center"
      >
        <ArrowLeftRight size={15} strokeWidth={1.8} />
      </motion.span>
    </motion.button>
  );
};
