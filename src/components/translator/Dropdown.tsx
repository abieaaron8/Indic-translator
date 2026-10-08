import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Language } from '../../types';
import { dropdownMenuVariants, springs, microInteractions, getMotionSafeVariants } from '../../motion';

interface DropdownProps {
  label: string;
  value: string;
  options: Language[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onChange,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = !!useReducedMotion();
  const safeMenuVariants = getMotionSafeVariants(dropdownMenuVariants, shouldReduceMotion);

  const selectedOption = options.find((opt) => opt.code === value) || options[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center gap-2.5" ref={containerRef}>
      <span className="text-[11.5px] font-semibold tracking-wider text-[#7E8B9B] uppercase select-none">
        {label}
      </span>

      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        whileTap={shouldReduceMotion ? undefined : microInteractions.buttonTap}
        className="inline-flex items-center justify-between min-w-[165px] lg:min-w-[185px] h-[42px] px-4 text-[14.5px] font-medium text-[#1F2933] bg-white border border-[#E0E5E0] rounded-[12px] hover:border-[#CCD5CC] hover:bg-[#FAFBF9] transition-colors duration-140 cursor-pointer shadow-[0_1px_3px_rgba(20,30,25,0.03)] focus:outline-hidden focus:ring-1 focus:ring-[#3B5B43]/30"
      >
        <span className="truncate">{selectedOption.nativeName}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : springs.snappy}
          className="ml-2.5 text-[#667085] flex items-center shrink-0"
        >
          <ChevronDown size={15} strokeWidth={1.8} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            variants={safeMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-[200px] py-2 bg-white border border-[#E0E5E0] rounded-[14px] shadow-[0_12px_32px_rgba(20,30,25,0.08)] focus:outline-hidden"
          >
            {options.map((option) => {
              const isSelected = option.code === value;
              return (
                <li
                  key={option.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.code);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-2 text-[14px] cursor-pointer transition-colors duration-120 ${
                    isSelected
                      ? 'bg-[#F2F6F2] text-[#233827] font-medium'
                      : 'text-[#1F2933] hover:bg-[#F8FAF8]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{option.name}</span>
                    <span className="text-[12px] text-[#667085]">{option.nativeName}</span>
                  </div>
                  {isSelected && (
                    <Check size={15} className="text-[#3B5B43] ml-2 shrink-0" strokeWidth={2.2} />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
