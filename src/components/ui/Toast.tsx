import React from 'react';
import i18n from '../../i18n';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { toastVariants, getMotionSafeVariants } from '../../motion';

export const Toast: React.FC = () => {
  const { toastMessage } = useTranslatorStore();
  const translateToast = (message: string) => {
    const translations: Record<string, string> = {
      'Please enter a valid session code': 'toast.invalidSessionCode',
      'Participant joined the conversation': 'toast.participantJoined',
      'Settings saved': 'toast.settingsSaved',
    };
    const key = translations[message];
    if (key) return i18n.t(key);
    const connectingMatch = message.match(/^Connecting to session (.+)…$/);
    if (connectingMatch) return i18n.t('toast.connectingToSession', { code: connectingMatch[1] });
    const languageMatch = message.match(/^Language set to (.+)$/);
    if (languageMatch) return i18n.t('toast.languageSetTo', { name: languageMatch[1] });
    const sourceMatch = message.match(/^Source set to (.+)$/);
    if (sourceMatch) return i18n.t('toast.sourceSetTo', { name: sourceMatch[1] });
    const targetMatch = message.match(/^Target set to (.+)$/);
    if (targetMatch) return i18n.t('toast.targetSetTo', { name: targetMatch[1] });
    const loadedMatch = message.match(/^Loaded (.+)$/);
    if (loadedMatch) return i18n.t('toast.loadedSession', { title: loadedMatch[1] });
    return message;
  };
  const shouldReduceMotion = !!useReducedMotion();
  const safeToastVariants = getMotionSafeVariants(toastVariants, shouldReduceMotion);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          key="toast"
          role="status"
          aria-live="polite"
          variants={safeToastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#1F2933] text-white text-[13px] font-normal rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] pointer-events-none"
        >
          {toastMessage && translateToast(toastMessage)}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
