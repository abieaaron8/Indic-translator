import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { springs, microInteractions, transitions } from '../../motion';

interface CopyCodeButtonProps {
  code: string;
}

export const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({ code }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const showToast = useTranslatorStore((state) => state.showToast);
  const shouldReduceMotion = !!useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showToast(t('toast.conversationCodeCopied'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(t('toast.codeCopiedFallback'));
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
      className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[#1F2933] bg-white border border-[#E0E5E0] rounded-[10px] hover:border-[#CCD5CC] hover:bg-[#FAFBF9] transition-colors duration-140 cursor-pointer shadow-xs"
      aria-label={t('ui.waiting.copyCodeAria')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied-check"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : springs.snappy}
            className="flex items-center"
          >
            <Check size={14} className="text-[#3B5B43]" strokeWidth={2.2} />
          </motion.span>
        ) : (
          <motion.span
            key="copy-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.fadeQuick}
            className="flex items-center"
          >
            <Copy size={14} strokeWidth={1.8} className="text-[#667085]" />
          </motion.span>
        )}
      </AnimatePresence>
      <span>{copied ? t('ui.waiting.copied') : t('ui.waiting.copyCode')}</span>
    </motion.button>
  );
};
