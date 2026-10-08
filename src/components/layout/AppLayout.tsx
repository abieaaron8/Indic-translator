import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Toast } from '../ui/Toast';
import { ShareModal } from '../ui/ShareModal';
import { pageVariants, getMotionSafeVariants } from '../../motion';

export const AppLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const shouldReduceMotion = !!useReducedMotion();
  const safePageVariants = getMotionSafeVariants(pageVariants, shouldReduceMotion);

  return (
    <div
      className="w-screen h-screen min-h-screen max-w-none m-0 p-0 flex flex-row overflow-hidden bg-[#F8FAF8] select-none"
      role="application"
      aria-label={t('ui.appAria')}
    >
      {/* Fixed 240px Sidebar */}
      <Sidebar />

      {/* Flexible Edge-to-Edge Main Stage */}
      <main className="flex-1 h-full min-w-0 flex flex-col overflow-hidden bg-[#F8FAF8]">
        {/* Dynamic Route-aware TopBar */}
        <TopBar />

        {/* Dynamic Route View Content */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={safePageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex flex-col overflow-hidden"
              style={{ willChange: 'transform, opacity, filter' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Toast & Modals */}
      <Toast />
      <ShareModal />
    </div>
  );
};
