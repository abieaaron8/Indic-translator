import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SpeechSegment } from '../../types';

interface ConversationCardProps {
  segment: SpeechSegment;
  timestamp: string;
  speaker: string;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  segment,
  timestamp,
  speaker,
}) => {
  const { t } = useTranslation();
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <article
      className="w-full bg-[#F2F6F2] border border-[#E1E8E1] rounded-[18px] p-6 lg:p-7 shadow-[0_1px_3px_rgba(20,30,25,0.02)] transition-colors duration-140"
      aria-label={t('ui.translator.originalSpeechCardAria')}
    >
      <header className="flex items-center justify-between pb-3.5 border-b border-[#E3E9E3]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#E4EDE4] flex items-center justify-center text-[#3B5B43]">
            <User size={12} strokeWidth={2} />
          </div>
          <span className="text-[13px] font-medium tracking-tight text-[#2B3F2E]">
            {segment.languageLabel}
          </span>
          <span className="text-[11.5px] text-[#718274]">· {speaker}</span>
        </div>
        <time className="text-[12px] text-[#718274] font-normal" dateTime={timestamp}>
          {timestamp}
        </time>
      </header>

      <div className="pt-4">
        <p className="text-[17px] lg:text-[18px] leading-[1.7] lg:leading-[1.75] font-normal text-[#1F2933] select-text">
          {segment.text}
          {segment.isPartial && (
            <motion.span
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block w-1.5 h-4 ml-1.5 bg-[#3B5B43] align-middle"
            />
          )}
        </p>
      </div>
    </article>
  );
};
