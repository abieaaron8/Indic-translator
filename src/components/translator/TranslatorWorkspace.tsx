import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConversationArea } from './ConversationArea';
import { MicrophoneControl } from './MicrophoneControl';

export const TranslatorWorkspace: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="flex-1 flex flex-col h-[calc(100vh-114px)] overflow-hidden" aria-label={t('ui.translator.workspaceAria')}>
      {/* Primary Focus: Vertically Stacked Conversation Cards */}
      <ConversationArea />

      {/* Bottom Microphone Control Dock */}
      <MicrophoneControl />
    </section>
  );
};
