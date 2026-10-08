import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeModal } from './QRCodeModal';
import { microInteractions } from '../../motion';

interface QRCodeButtonProps {
  code: string;
}

export const QRCodeButton: React.FC<QRCodeButtonProps> = ({ code }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[#1F2933] bg-white border border-[#E0E5E0] rounded-[10px] hover:border-[#CCD5CC] hover:bg-[#FAFBF9] transition-colors duration-140 cursor-pointer shadow-xs"
        aria-label={t('ui.waiting.generateQrAria')}
      >
        <QrCode size={14} strokeWidth={1.8} className="text-[#667085]" />
        <span>{t('ui.waiting.generateQr')}</span>
      </motion.button>

      <QRCodeModal code={code} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
