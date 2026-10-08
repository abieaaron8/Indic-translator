import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, Clock, Settings } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslatorStore } from '../../store/useTranslatorStore';
import { microInteractions } from '../../motion';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentSessionId = useTranslatorStore((state) => state.currentSessionId);
  const shouldReduceMotion = !!useReducedMotion();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const getActiveTab = () => {
    if (location.pathname.startsWith('/sessions')) return 'sessions';
    if (location.pathname.startsWith('/settings')) return 'settings';
    return 'translate';
  };

  const activeTab = getActiveTab();

  const handleNav = (tabId: 'translate' | 'sessions' | 'settings') => {
    if (tabId === 'translate') {
      if (location.pathname.startsWith('/translate')) {
        return;
      }
      if (currentSessionId) {
        navigate(`/translate/${currentSessionId}`);
      } else {
        navigate('/');
      }
    } else if (tabId === 'sessions') {
      navigate('/sessions');
    } else if (tabId === 'settings') {
      navigate('/settings');
    }
  };

  const navItems = [
    { id: 'translate' as const, label: t('layout.nav.translate'), icon: Languages },
    { id: 'sessions' as const, label: t('layout.nav.sessions'), icon: Clock },
    { id: 'settings' as const, label: t('layout.nav.settings'), icon: Settings },
  ];

  return (
    <aside
      className="w-[240px] min-w-[240px] max-w-[240px] h-full border-r border-[#E8ECE8] bg-[#F8FAF8] flex flex-col justify-between p-4 shrink-0 select-none z-10"
      aria-label={t('ui.mainNavigation')}
    >
      <div className="flex flex-col gap-6">
        {/* Subtle, quiet app title or category mark */}
        <motion.div
          onClick={() => navigate('/')}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          className="px-3 py-1 flex items-center justify-between cursor-pointer group rounded-lg"
          title={t('layout.sidebar.returnToSetupTitle')}
        >
          <span className="text-[12px] font-semibold text-[#8C98A4] group-hover:text-[#1F2933] transition-colors tracking-widest uppercase">
            {t('layout.sidebar.brand')}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#3B5B43]/70 group-hover:bg-[#3B5B43] transition-colors" />
        </motion.div>

        <nav
          className="flex flex-col gap-1.5"
          role="tablist"
          aria-orientation="vertical"
          onMouseLeave={() => setHoveredTab(null)}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isHovered = hoveredTab === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleNav(item.id)}
                onMouseEnter={() => setHoveredTab(item.id)}
                whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
                className="relative flex items-center px-3.5 py-2.5 rounded-full text-[13.5px] cursor-pointer text-left select-none"
              >
                {/* Selected Item: Smooth background expansion (140ms spring easing) */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 rounded-full bg-[#EAF1EB] shadow-2xs z-0"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 450, damping: 34, mass: 0.65 }
                    }
                  />
                )}

                {/* Hover: Background softly appears (140ms spring easing) */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="sidebar-hover-indicator"
                      className="absolute inset-0 rounded-full bg-[#F2F5F2] z-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </AnimatePresence>

                {/* Items slide 2px to the right on hover, with smooth icon color transition & text fade */}
                <motion.div
                  animate={{ x: isHovered && !shouldReduceMotion ? 2 : 0 }}
                  transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 flex items-center gap-3 w-full"
                >
                  <motion.div
                    animate={{
                      color: isActive ? '#3B5B43' : isHovered ? '#1F2933' : '#667085',
                    }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center"
                  >
                    <Icon size={17} strokeWidth={1.6} />
                  </motion.div>

                  <motion.span
                    animate={{
                      color: isActive ? '#243B28' : isHovered ? '#1F2933' : '#667085',
                      fontWeight: isActive ? 500 : 400,
                    }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[13.5px]"
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Subtle quiet footer */}
      <div className="px-3 py-2 border-t border-[#E8ECE8]/60">
        <span className="text-[11px] text-[#8C98A4] font-normal tracking-wide">
          {t('layout.sidebar.version')}
        </span>
      </div>
    </aside>
  );
};
