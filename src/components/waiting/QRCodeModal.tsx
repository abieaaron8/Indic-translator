import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, QrCode } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { modalBackdropVariants, modalPanelVariants, microInteractions, getMotionSafeVariants } from '../../motion';

interface QRCodeModalProps {
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ code, isOpen, onClose }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = !!useReducedMotion();
  const safeBackdrop = getMotionSafeVariants(modalBackdropVariants, shouldReduceMotion);
  const safePanel = getMotionSafeVariants(modalPanelVariants, shouldReduceMotion);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="qr-backdrop"
          variants={safeBackdrop}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-2xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qrTitle"
        >
          <motion.div
            key="qr-panel"
            variants={safePanel}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-[360px] bg-white border border-[#E8ECE8] rounded-[22px] p-6 shadow-[0_20px_50px_rgba(20,30,25,0.08)] space-y-5 select-none"
          >
            <header className="flex items-center justify-between pb-3 border-b border-[#E8ECE8]">
              <div className="flex items-center gap-2 text-[#1F2933]">
                <QrCode size={16} strokeWidth={2} className="text-[#3B5B43]" />
                <h3 id="qrTitle" className="text-[15px] font-semibold">
                  {t('ui.waiting.scanToJoin')}
                </h3>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                whileTap={shouldReduceMotion ? undefined : microInteractions.iconTap}
                className="p-1 rounded-full text-[#667085] hover:text-[#1F2933] hover:bg-[#F2F5F2] transition-colors cursor-pointer"
                aria-label={t('ui.waiting.closeQrAria')}
              >
                <X size={16} strokeWidth={2} />
              </motion.button>
            </header>

            {/* Minimalist Japanese Paper QR Representation */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#F8FAF8] border border-[#E8ECE8] rounded-[16px] space-y-4">
              <div className="w-44 h-44 bg-white p-3 rounded-[12px] border border-[#E2E7E2] shadow-xs flex items-center justify-center">
                {/* Clean SVG QR matrix illustration */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#1F2933]" fill="currentColor">
                  {/* Corner 1 */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="13" width="10" height="10" rx="2" />
                  {/* Corner 2 */}
                  <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="77" y="13" width="10" height="10" rx="2" />
                  {/* Corner 3 */}
                  <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="77" width="10" height="10" rx="2" />
                  {/* Data matrix dots */}
                  <rect x="38" y="10" width="8" height="8" rx="1.5" />
                  <rect x="52" y="10" width="8" height="8" rx="1.5" />
                  <rect x="38" y="24" width="8" height="8" rx="1.5" />
                  <rect x="52" y="24" width="8" height="8" rx="1.5" />
                  <rect x="10" y="38" width="8" height="8" rx="1.5" />
                  <rect x="24" y="38" width="8" height="8" rx="1.5" />
                  <rect x="38" y="38" width="8" height="8" rx="1.5" />
                  <rect x="52" y="38" width="8" height="8" rx="1.5" />
                  <rect x="66" y="38" width="8" height="8" rx="1.5" />
                  <rect x="80" y="38" width="8" height="8" rx="1.5" />
                  <rect x="38" y="52" width="8" height="8" rx="1.5" />
                  <rect x="52" y="52" width="8" height="8" rx="1.5" />
                  <rect x="66" y="52" width="8" height="8" rx="1.5" />
                  <rect x="80" y="52" width="8" height="8" rx="1.5" />
                  <rect x="38" y="66" width="8" height="8" rx="1.5" />
                  <rect x="52" y="66" width="8" height="8" rx="1.5" />
                  <rect x="66" y="66" width="8" height="8" rx="1.5" />
                  <rect x="80" y="66" width="8" height="8" rx="1.5" />
                  <rect x="38" y="80" width="8" height="8" rx="1.5" />
                  <rect x="52" y="80" width="8" height="8" rx="1.5" />
                  <rect x="66" y="80" width="8" height="8" rx="1.5" />
                </svg>
              </div>

              <div className="text-center space-y-1">
                <span className="text-[12px] text-[#667085]">{t('ui.waiting.conversationCode')}</span>
                <p className="text-[18px] font-mono tracking-widest font-semibold text-[#1F2933]">
                  {code}
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
              className="w-full py-2.5 rounded-[12px] bg-[#F2F5F2] hover:bg-[#E8EFE8] text-[#1F2933] text-[13.5px] font-medium transition-colors cursor-pointer"
            >
              {t('ui.waiting.dismiss')}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
