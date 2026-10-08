import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { microInteractions } from '../../motion';

interface CreateConversationCardProps {
  onCreate: () => void;
  isLoading?: boolean;
}

const easeOut = 'easeOut' as const;

export const CreateConversationCard: React.FC<CreateConversationCardProps> = ({
  onCreate,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.35, ease: easeOut }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -4,
              boxShadow: '0 8px 24px rgba(20,30,25,0.08)',
              transition: { duration: 0.2, ease: easeOut },
            }
      }
      className="flex-1 min-w-[280px] h-[320px] bg-white border border-[#E8ECE8] rounded-[20px] p-8 flex flex-col justify-between shadow-[0_1px_3px_rgba(20,30,25,0.02)]"
      aria-label={t('ui.setup.createCardAria')}
    >
      <div className="space-y-5">
        {/* Plus Icon with subtle circular background */}
        <div className="w-12 h-12 rounded-full bg-[#EAF1EB] flex items-center justify-center text-[#3B5B43] shadow-xs">
          <Plus size={22} strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <h2 className="text-[17px] font-semibold text-[#1F2933] tracking-tight">
            {t('ui.setup.createTitle')}
          </h2>
          <p className="text-[13.5px] leading-relaxed text-[#667085]">
            {t('ui.setup.createDescription')}
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onCreate}
        disabled={isLoading}
        whileHover={
          shouldReduceMotion || isLoading
            ? undefined
            : { scale: 1.02, transition: { duration: 0.2, ease: easeOut } }
        }
        whileTap={shouldReduceMotion || isLoading ? undefined : microInteractions.buttonTap}
        className="w-full h-[46px] rounded-[12px] bg-[#243B28] text-white text-[14px] font-medium tracking-tight hover:bg-[#1C2F20] transition-colors duration-140 cursor-pointer shadow-xs disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <span>{isLoading ? t('ui.setup.createLoading') : t('ui.setup.createButton')}</span>
      </motion.button>
    </motion.article>
  );
};
