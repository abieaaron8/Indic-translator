import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Copy, Download } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { modalBackdropVariants, modalPanelVariants, microInteractions, getMotionSafeVariants } from '../../motion';

export const ShareModal: React.FC = () => {
  const { t } = useTranslation();
  const { shareTargetTurn, closeShareModal, showToast } = useTranslatorStore();
  const shouldReduceMotion = !!useReducedMotion();
  const safeBackdrop = getMotionSafeVariants(modalBackdropVariants, shouldReduceMotion);
  const safePanel = getMotionSafeVariants(modalPanelVariants, shouldReduceMotion);

  const handleCopyTranscript = async () => {
    if (!shareTargetTurn) return;
    const text = t('share.copyTranscriptTemplate', {
      originalLang: shareTargetTurn.original.languageLabel,
      originalText: shareTargetTurn.original.text,
      translationLang: shareTargetTurn.translation.languageLabel,
      translationText: shareTargetTurn.translation.text,
    });
    try {
      await navigator.clipboard.writeText(text);
      showToast(t('toast.transcriptCopied'));
      closeShareModal();
    } catch {
      showToast(t('toast.transcriptCopiedFallback'));
      closeShareModal();
    }
  };

  const handleDownload = () => {
    if (!shareTargetTurn) return;
    const text = t('share.exportDocumentTemplate', {
      date: new Date().toLocaleDateString(),
      time: shareTargetTurn.timestamp,
      originalLang: shareTargetTurn.original.languageLabel,
      originalText: shareTargetTurn.original.text,
      translationLang: shareTargetTurn.translation.languageLabel,
      translationText: shareTargetTurn.translation.text,
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indic-translation-${shareTargetTurn.timestamp.replace(/[\s:]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('toast.exportedSessionNotes'));
    closeShareModal();
  };

  return (
    <AnimatePresence>
      {shareTargetTurn && (
        <motion.div
          key="share-modal-backdrop"
          variants={safeBackdrop}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={closeShareModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-2xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shareTitle"
        >
          <motion.div
            key="share-modal-panel"
            variants={safePanel}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-[420px] bg-white border border-[#E8ECE8] rounded-[20px] p-6 shadow-[0_20px_50px_rgba(20,30,25,0.08)] space-y-5"
          >
            <header className="flex items-center justify-between pb-3 border-b border-[#E8ECE8]">
              <h3 id="shareTitle" className="text-[16px] font-medium text-[#1F2933]">
                {t('share.modal.title')}
              </h3>
              <motion.button
                type="button"
                onClick={closeShareModal}
                whileTap={shouldReduceMotion ? undefined : microInteractions.iconTap}
                className="p-1 rounded-full text-[#667085] hover:text-[#1F2933] hover:bg-[#F2F5F2] transition-colors cursor-pointer"
                aria-label={t('ui.share.closeAria')}
              >
                <X size={16} strokeWidth={2} />
              </motion.button>
            </header>

            <div className="p-3.5 bg-[#F8FAF8] border border-[#E8ECE8] rounded-[12px] text-[13.5px] text-[#334E68] space-y-1.5">
              <p className="line-clamp-2 italic text-[#667085]">
                "{shareTargetTurn.original.text}"
              </p>
              <p className="line-clamp-2 font-medium text-[#1F2933]">
                "{shareTargetTurn.translation.text}"
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <motion.button
                type="button"
                onClick={handleCopyTranscript}
                whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[10px] bg-[#EAF1EB] text-[#243B28] text-[13.5px] font-medium hover:bg-[#E0ECE1] transition-colors cursor-pointer"
              >
                <Copy size={15} strokeWidth={1.8} />
                <span>{t('ui.share.copyFullTranscript')}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleDownload}
                whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[10px] bg-white border border-[#E8ECE8] text-[#1F2933] text-[13.5px] font-medium hover:bg-[#F8FAF8] transition-colors cursor-pointer"
              >
                <Download size={15} strokeWidth={1.8} />
                <span>{t('ui.share.exportTextDocument')}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
