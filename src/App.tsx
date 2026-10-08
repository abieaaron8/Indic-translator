import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { SessionSetupView } from './components/setup/SessionSetupView';
import { WaitingRoom } from './components/waiting/WaitingRoom';
import { TranslatorWorkspace } from './components/translator/TranslatorWorkspace';
import { SessionsPage } from './components/sessions/SessionsPage';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { useTranslatorStore } from './store/useTranslatorStore';

export function App() {
  const loadSessions = useTranslatorStore((state) => state.loadSessions);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Page 1: Session Setup (Pre-conversation flow) */}
          <Route path="/" element={<SessionSetupView />} />

          {/* Page 2: Waiting Room for Host */}
          <Route path="/waiting/:sessionId" element={<WaitingRoom />} />

          {/* Page 3: Live Translator Workspace */}
          <Route path="/translate/:sessionId" element={<TranslatorWorkspace />} />
          <Route path="/translate" element={<TranslatorWorkspace />} />

          {/* Additional pages */}
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/settings" element={<SettingsPanel />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
