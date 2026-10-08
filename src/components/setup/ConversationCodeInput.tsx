import React from 'react';
import { useTranslation } from 'react-i18next';

interface ConversationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ConversationCodeInput: React.FC<ConversationCodeInputProps> = ({
  value,
  onChange,
  placeholder = 'AAXYRZ',
  disabled = false,
}) => {
  const { t } = useTranslation();
  const inputPlaceholder = placeholder ?? t('setup.code.placeholder');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep uppercase alphanumeric, max 8 chars
    const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    onChange(cleaned);
  };

  return (
    <div className="w-full">
      <label htmlFor="conversationCode" className="block text-[11.5px] font-semibold text-[#7E8B9B] uppercase tracking-wider mb-2">
        {t('ui.setup.conversationCode')}
      </label>
      <input
        id="conversationCode"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={inputPlaceholder}
        disabled={disabled}
        autoComplete="off"
        spellCheck="false"
        className="w-full h-[46px] px-4 text-[15px] font-mono tracking-widest text-[#1F2933] bg-[#F8FAF8] border border-[#E0E5E0] rounded-[12px] placeholder:text-[#A0AEC0] placeholder:font-sans focus:outline-hidden focus:ring-1 focus:ring-[#3B5B43]/30 focus:border-[#3B5B43] focus:bg-white transition-all duration-140 select-text"
      />
    </div>
  );
};
