import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ConversationCodeInput } from './ConversationCodeInput';
import { microInteractions } from '../../motion';

interface JoinConversationCardProps {
  onJoin: (code: string) => void;
  isConnecting?: boolean;
}

const easeOut = 'easeOut' as const;

export const JoinConversationCard: React.FC<JoinConversationCardProps> = ({
  onJoin,
  isConnecting = false,
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const shouldReduceMotion = !!useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoin(code.trim());
    }
  };

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.45, ease: easeOut }}
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
      aria-label={t('ui.setup.joinCardAria')}
    >
      <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {/* Link Icon with subtle circular background */}
            <div className="w-12 h-12 rounded-full bg-[#EEF3F8] flex items-center justify-center text-[#486581] shadow-xs shrink-0">
              <Link2 size={22} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-[#1F2933] tracking-tight">
                {t('ui.setup.joinTitle')}
              </h2>
              <p className="text-[12.5px] text-[#667085]">
                {t('ui.setup.joinDescription')}
              </p>
            </div>
          </div>

          <ConversationCodeInput
            value={code}
            onChange={setCode}
            placeholder={t('setup.code.placeholder')}
            disabled={isConnecting}
          />
        </div>

        <motion.button
          type="submit"
          disabled={!code.trim() || isConnecting}
          whileHover={
            shouldReduceMotion || !code.trim() || isConnecting
              ? undefined
              : { scale: 1.02, transition: { duration: 0.2, ease: easeOut } }
          }
          whileTap={shouldReduceMotion || !code.trim() || isConnecting ? undefined : microInteractions.buttonTap}
          className="w-full h-[46px] rounded-[12px] bg-white border border-[#E0E5E0] text-[#1F2933] text-[14px] font-medium tracking-tight hover:border-[#CCD5CC] hover:bg-[#FAFBF9] transition-colors duration-140 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>{isConnecting ? t('ui.setup.joinLoading') : t('ui.setup.joinButton')}</span>
        </motion.button>
      </form>
    </motion.article>
  );
};
