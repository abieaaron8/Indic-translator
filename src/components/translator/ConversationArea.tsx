import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ConversationCard } from './ConversationCard';
import { TranslationCard } from './TranslationCard';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { cardEntryVariants, getMotionSafeVariants } from '../../motion';

export const ConversationArea: React.FC = () => {
  const { t } = useTranslation();
  const { turns, currentStreamingTurn } = useTranslatorStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = !!useReducedMotion();
  const safeCardVariants = getMotionSafeVariants(cardEntryVariants, shouldReduceMotion);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [turns.length, currentStreamingTurn?.translation.text]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 w-full overflow-y-auto px-6 md:px-10 lg:px-12 py-6 space-y-6"
      role="feed"
      aria-label={t('ui.translator.conversationFeedAria')}
    >
      <div className="w-full max-w-[1040px] 2xl:max-w-[1180px] mx-auto space-y-6">
        {turns.map((turn) => (
          <motion.div
            key={turn.id}
            variants={safeCardVariants}
            initial="initial"
            animate="animate"
            className="w-full space-y-4"
          >
            {/* Card One: Original Speech (Soft Sage Tint) */}
            <ConversationCard
              segment={turn.original}
              timestamp={turn.timestamp}
              speaker={turn.speaker}
            />

            {/* Card Two: Translation (Soft Mist-Blue Tint) */}
            <TranslationCard turn={turn} />
          </motion.div>
        ))}

        {/* Real-time Streaming Turn (Partial transcript & translation) */}
        {currentStreamingTurn && (
          <motion.div
            key={currentStreamingTurn.id}
            variants={safeCardVariants}
            initial="initial"
            animate="animate"
            className="w-full space-y-4"
          >
            <ConversationCard
              segment={currentStreamingTurn.original}
              timestamp={currentStreamingTurn.timestamp}
              speaker={currentStreamingTurn.speaker}
            />
            <TranslationCard turn={currentStreamingTurn} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
