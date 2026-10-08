import React from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Volume2, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ConversationTurn } from '../../types';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { springs, microInteractions, transitions } from '../../motion';

interface TranslationCardProps {
  turn: ConversationTurn;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({ turn }) => {
  const { t } = useTranslation();
  const { playTurnAudio, playingTurnId, showToast, openShareModal } = useTranslatorStore();
  const [hasCopied, setHasCopied] = React.useState(false);
  const isPlayingThis = playingTurnId === turn.id;
  const shouldReduceMotion = !!useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(turn.translation.text);
      setHasCopied(true);
      showToast(t('toast.copiedToClipboard'));
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      showToast(t('toast.copiedTranslationFallback'));
    }
  };

  const handlePlay = () => {
    playTurnAudio(turn);
  };

  const handleShare = () => {
    openShareModal(turn);
  };

  return (
    <article
      className="group relative w-full bg-[#EFF4F9] border border-[#DEE7EF] rounded-[18px] p-6 lg:p-7 shadow-[0_1px_3px_rgba(20,30,25,0.02)] transition-colors duration-140"
      aria-label={t('ui.translator.translatedSpeechCardAria')}
    >
      <header className="flex items-center justify-between pb-3.5 border-b border-[#DEE7EF]/70">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium tracking-tight text-[#334E68]">
            {turn.translation.languageLabel}
          </span>
          <span className="text-[11.5px] text-[#627D98]">{t('ui.translator.translationBadge')}</span>
        </div>
        <time className="text-[12px] text-[#627D98] font-normal" dateTime={turn.timestamp}>
          {turn.timestamp}
        </time>
      </header>

      <div className="pt-4 pb-2">
        <p className="text-[17px] lg:text-[18px] leading-[1.7] lg:leading-[1.75] font-normal text-[#1F2933] select-text">
          {turn.translation.text}
          {turn.translation.isPartial && (
            <motion.span
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block w-1.5 h-4 ml-1.5 bg-[#486581] align-middle"
            />
          )}
        </p>
      </div>

      {/* Small Hover Actions (Only visible on hover) */}
      <div
        className="absolute bottom-4 right-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-160 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-full border border-[#D8E2EC] shadow-xs"
        role="toolbar"
        aria-label={t('ui.translator.translationActionsAria')}
      >
        <motion.button
          type="button"
          onClick={handleCopy}
          whileTap={shouldReduceMotion ? undefined : microInteractions.iconTap}
          className="p-1.5 text-[#627D98] hover:text-[#1F2933] hover:bg-[#EFF4F9] rounded-full transition-colors cursor-pointer"
          title={t('ui.translator.copyText')}
          aria-label={t('ui.translator.copyTranslation')}
        >
          <AnimatePresence mode="wait" initial={false}>
            {hasCopied ? (
              <motion.span
                key="check"
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
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transitions.fadeQuick}
                className="flex items-center"
              >
                <Copy size={14} strokeWidth={1.8} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          type="button"
          onClick={handlePlay}
          whileTap={shouldReduceMotion ? undefined : microInteractions.iconTap}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            isPlayingThis
              ? 'text-[#486581] bg-[#DFE9F3]'
              : 'text-[#627D98] hover:text-[#1F2933] hover:bg-[#EFF4F9]'
          }`}
          title={t('ui.translator.playAudio')}
          aria-label={t('ui.translator.playTranslatedSpeech')}
        >
          <motion.span
            animate={
              isPlayingThis && !shouldReduceMotion
                ? { opacity: [1, 0.4, 1] }
                : { opacity: 1 }
            }
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center"
          >
            <Volume2 size={14} strokeWidth={1.8} />
          </motion.span>
        </motion.button>

        <motion.button
          type="button"
          onClick={handleShare}
          whileTap={shouldReduceMotion ? undefined : microInteractions.iconTap}
          className="p-1.5 text-[#627D98] hover:text-[#1F2933] hover:bg-[#EFF4F9] rounded-full transition-colors cursor-pointer"
          title={t('ui.translator.share')}
          aria-label={t('ui.translator.shareTranslation')}
        >
          <Share2 size={14} strokeWidth={1.8} />
        </motion.button>
      </div>
    </article>
  );
};
