import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { cardEntryVariants, staggerFeedVariants, microInteractions, getMotionSafeVariants } from '../../motion';

export const SessionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { sessions, openSession } = useTranslatorStore();
  const shouldReduceMotion = !!useReducedMotion();

  const safeFeed = getMotionSafeVariants(staggerFeedVariants, shouldReduceMotion);
  const safeItem = getMotionSafeVariants(cardEntryVariants, shouldReduceMotion);

  return (
    <div className="flex-1 w-full overflow-y-auto px-8 md:px-12 lg:px-16 py-8" role="tabpanel" aria-label={t('ui.sessions.historyAria')}>
      <motion.div
        variants={safeFeed}
        initial="initial"
        animate="animate"
        className="w-full max-w-5xl space-y-6"
      >
        <header className="pb-4 border-b border-[#E8ECE8]">
          <h2 className="text-[18px] font-medium text-[#1F2933] tracking-tight">{t('sessions.title')}</h2>
          <p className="text-[13px] text-[#667085] mt-0.5">
            {t('sessions.subtitle')}
          </p>
        </header>

        <div className="space-y-4">
          {sessions.map((session) => (
            <motion.article
              key={session.id}
              variants={safeItem}
              onClick={() => openSession(session.id)}
              whileHover={shouldReduceMotion ? undefined : microInteractions.cardHover}
              whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
              className="group p-6 bg-white border border-[#E8ECE8] rounded-[16px] hover:border-[#D5DDD5] hover:shadow-[0_2px_8px_rgba(20,30,25,0.03)] transition-colors duration-140 cursor-pointer"
            >
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[15px] font-medium text-[#1F2933]">
                    {session.title}
                  </span>
                  <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#F2F5F2] text-[#4A6B53]">
                    {t('ui.sessions.turnCount', { count: session.turnsCount })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#667085]">
                  <time className="text-[12.5px]">{session.createdAt}</time>
                  <ArrowUpRight
                    size={15}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#3B5B43]"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1 text-[14px] text-[#485563]">
                <p className="line-clamp-1 italic text-[#667085]">
                  "{session.snippet.original}"
                </p>
                <p className="line-clamp-1 text-[#1F2933]">
                  "{session.snippet.translation}"
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
