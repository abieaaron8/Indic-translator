import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mic } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ConversationCodeCard } from './ConversationCodeCard';
import { WaitingStatus } from './WaitingStatus';
import { ConnectionIndicator } from './ConnectionIndicator';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { cardEntryVariants, staggerFeedVariants, microInteractions, getMotionSafeVariants } from '../../motion';

export const WaitingRoom: React.FC = () => {
  const { t } = useTranslation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { isParticipantJoined, simulateParticipantJoined } = useTranslatorStore();
  const shouldReduceMotion = !!useReducedMotion();

  const code = (sessionId || 'AAXYRZ').toUpperCase();
  const safeFeed = getMotionSafeVariants(staggerFeedVariants, shouldReduceMotion);
  const safeItem = getMotionSafeVariants(cardEntryVariants, shouldReduceMotion);

  // Automatic transition when participant joins (Motion fade 180-250ms)
  useEffect(() => {
    if (isParticipantJoined) {
      const timer = setTimeout(() => {
        navigate(`/translate/${code}`);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isParticipantJoined, code, navigate]);

  return (
    <motion.div
      variants={safeFeed}
      initial="initial"
      animate="animate"
      className="flex-1 w-full h-full overflow-y-auto px-6 py-8 flex flex-col items-center justify-between select-none"
      role="main"
      aria-label={t('ui.waiting.roomAria')}
    >
      {/* Top Status & Connection Metadata */}
      <motion.div variants={safeItem} className="w-full flex flex-col items-center space-y-4 pt-2">
        <WaitingStatus />
        <ConnectionIndicator />
      </motion.div>

      {/* Main Centered Conversation Code Card */}
      <motion.div variants={safeItem} className="my-auto py-6 flex flex-col items-center gap-4">
        <ConversationCodeCard code={code} />

        {/* Quiet preview helper for judges & demo evaluation */}
        <motion.button
          type="button"
          onClick={simulateParticipantJoined}
          whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
          className="text-[12px] text-[#667085] hover:text-[#243B28] transition-colors py-1 px-3 rounded-full hover:bg-[#EAF1EB]/50 cursor-pointer"
          title={t('ui.waiting.simulateJoinTitle')}
        >
          {t('ui.waiting.simulateJoinButton')}
        </motion.button>
      </motion.div>

      {/* Bottom Microphone section: Disabled state with guidance text */}
      <motion.div variants={safeItem} className="w-full max-w-[560px] pb-4 flex flex-col items-center text-center space-y-3">
        {/* Same microphone button component visual in disabled state */}
        <div
          className="relative inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#E8ECE8] bg-[#F2F5F2] text-[#A0AEC0] cursor-not-allowed shadow-2xs"
          aria-disabled="true"
          title={t('ui.waiting.microphoneStandby')}
        >
          <Mic size={20} strokeWidth={1.8} />
        </div>

        <p className="text-[13px] text-[#667085] max-w-[420px] leading-relaxed">
          {t('ui.waiting.translationStarts')}
        </p>
      </motion.div>
    </motion.div>
  );
};
