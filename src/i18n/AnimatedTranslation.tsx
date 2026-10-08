import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface AnimatedTranslationProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedTranslation: React.FC<AnimatedTranslationProps> = ({
  children,
  className,
}) => {
  const { i18n } = useTranslation();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.span
        key={i18n.language}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={className}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
};
