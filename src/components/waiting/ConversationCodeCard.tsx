import React from 'react';
import { useTranslation } from 'react-i18next';
import { Share2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { CopyCodeButton } from './CopyCodeButton';
import { QRCodeButton } from './QRCodeButton';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { microInteractions } from '../../motion';

interface ConversationCodeCardProps {
  code: string;
}

export const ConversationCodeCard: React.FC<ConversationCodeCardProps> = ({ code }) => {
  const { t } = useTranslation();
  const showToast = useTranslatorStore((state) => state.showToast);
  const shouldReduceMotion = !!useReducedMotion();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/translate/${code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('waiting.share.title'),
          text: t('waiting.share.text', { code }),
          url: shareUrl,
        });
      } catch {
        // Dismissed or unsupported
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast(t('toast.inviteLinkCopied'));
      } catch {
        showToast(t('toast.sessionLinkCopiedFallback'));
      }
    }
  };

  return (
    <article
      className="w-full max-w-[480px] bg-white border border-[#E8ECE8] rounded-[24px] p-8 shadow-[0_4px_24px_rgba(20,30,25,0.03)] text-center space-y-6"
      aria-label={t('ui.waiting.codeCardAria')}
    >
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-[#8C98A4] tracking-widest uppercase">
          {t('ui.waiting.conversationCode')}
        </span>
        <div className="py-2">
          <p className="text-[34px] font-mono font-semibold tracking-[0.25em] text-[#1F2933] select-all">
            {code}
          </p>
        </div>
        <p className="text-[12.5px] text-[#667085]">
          {t('waiting.code.hint')}
        </p>
      </div>

      {/* Action buttons arranged horizontally */}
      <div className="flex items-center justify-center gap-2.5 pt-2 border-t border-[#E8ECE8]/60">
        <CopyCodeButton code={code} />

        <motion.button
          type="button"
          onClick={handleShare}
          whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[#1F2933] bg-white border border-[#E0E5E0] rounded-[10px] hover:border-[#CCD5CC] hover:bg-[#FAFBF9] transition-colors duration-140 cursor-pointer shadow-xs"
          aria-label={t('ui.waiting.shareSessionLinkAria')}
        >
          <Share2 size={14} strokeWidth={1.8} className="text-[#667085]" />
          <span>{t('ui.waiting.share')}</span>
        </motion.button>

        <QRCodeButton code={code} />
      </div>
    </article>
  );
};
