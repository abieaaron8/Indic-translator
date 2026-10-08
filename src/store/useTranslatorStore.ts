import { create } from 'zustand';
import {
  LanguageCode,
  MicState,
  SystemStatus,
  ConversationTurn,
  SessionRecord,
  AppSettings,
} from '../types';
import {
  INITIAL_CONVERSATION_TURNS,
  STREAMING_DIALOGUES,
  SUPPORTED_LANGUAGES,
} from '../constants/languages';
import { db } from '../services/db';
import { speakText, cancelSpeaking } from '../services/speechSynthesis';
import { audioCapture } from '../services/audioCapture';
import { UI_LOCALE_STORAGE_KEY, toUiLocale } from '../i18n';

interface TranslatorState {
  activeTab: 'translate' | 'sessions' | 'settings';
  fromLang: LanguageCode;
  toLang: LanguageCode;
  micState: MicState;
  systemStatus: SystemStatus;
  turns: ConversationTurn[];
  currentStreamingTurn: ConversationTurn | null;
  sessions: SessionRecord[];
  settings: AppSettings;
  isSwapRotating: boolean;
  toastMessage: string | null;
  shareTargetTurn: ConversationTurn | null;
  playingTurnId: string | null;
  dialogueIndex: number;
  currentSessionId: string | null;
  myLanguage: LanguageCode;
  sessionRole: 'host' | 'guest' | null;
  isParticipantJoined: boolean;

  setActiveTab: (tab: 'translate' | 'sessions' | 'settings') => void;
  setFromLang: (lang: LanguageCode) => void;
  setToLang: (lang: LanguageCode) => void;
  setMyLanguage: (lang: LanguageCode) => void;
  createSession: () => string;
  joinSession: (code: string) => Promise<boolean>;
  simulateParticipantJoined: () => void;
  swapLanguages: () => void;
  setMicState: (state: MicState) => void;
  toggleMic: () => void;
  toggleMute: () => void;
  simulateStreamingSpeech: () => void;
  playTurnAudio: (turn: ConversationTurn) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  openShareModal: (turn: ConversationTurn) => void;
  closeShareModal: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  loadSessions: () => Promise<void>;
  openSession: (sessionId: string) => void;
}

export const useTranslatorStore = create<TranslatorState>((set, get) => ({
  activeTab: 'translate',
  fromLang: 'auto',
  toLang: 'en',
  micState: 'listening',
  systemStatus: 'Listening',
  turns: INITIAL_CONVERSATION_TURNS,
  currentStreamingTurn: null,
  sessions: [
    {
      id: 'session-1',
      title: 'Tamil ⇄ English Consultation',
      createdAt: 'Today, 10:42 AM',
      sourceLang: 'ta',
      targetLang: 'en',
      turnsCount: 12,
      snippet: {
        original: 'வணக்கம், நீங்கள் சொல்வது எனக்கு தெளிவாக கேட்கிறது...',
        translation: 'Hello, I can hear you clearly. When would you like us to begin?',
      },
    },
    {
      id: 'session-2',
      title: 'Hindi ⇄ English Regional Planning',
      createdAt: 'Yesterday, 4:15 PM',
      sourceLang: 'hi',
      targetLang: 'en',
      turnsCount: 28,
      snippet: {
        original: 'क्या हम कल की समीक्षा बैठक के बारे में बात कर सकते हैं?',
        translation: "Can we discuss tomorrow's review meeting?",
      },
    },
    {
      id: 'session-3',
      title: 'Telugu ⇄ Kannada Cross-Border Sync',
      createdAt: 'Oct 6, 2:30 PM',
      sourceLang: 'te',
      targetLang: 'kn',
      turnsCount: 16,
      snippet: {
        original: 'మీరు చెప్పిన సమయానికి మేము సిద్ధంగా ఉంటాము.',
        translation: 'ನಾವು ಹೇಳಿದ ಸಮಯಕ್ಕೆ ನಾವು ಸಿದ್ಧರಾಗಿರುತ್ತೇವೆ.',
      },
    },
  ],
  settings: {
    audioDevice: 'Default System Microphone',
    ambientCancellation: true,
    autoPlayTranslation: true,
    speechCadence: 'natural',
    nativeTypography: true,
    backendMode: 'simulation',
    backendEndpoint: 'ws://localhost:8000/v1/stream',
  },
  isSwapRotating: false,
  toastMessage: null,
  shareTargetTurn: null,
  playingTurnId: null,
  dialogueIndex: 0,
  currentSessionId: null,
  myLanguage: toUiLocale(
    typeof window === 'undefined'
      ? 'en'
      : window.localStorage.getItem(UI_LOCALE_STORAGE_KEY)
  ),
  sessionRole: null,
  isParticipantJoined: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setMyLanguage: (lang) => {
    set({ myLanguage: lang, fromLang: lang });
    window.localStorage.setItem(UI_LOCALE_STORAGE_KEY, toUiLocale(lang));
    const name = SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name || lang;
    get().showToast(`Language set to ${name}`);
  },

  createSession: () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    set({
      currentSessionId: code,
      sessionRole: 'host',
      isParticipantJoined: false,
    });
    return code;
  },

  joinSession: async (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (code.length < 4) {
      get().showToast('Please enter a valid session code');
      return false;
    }
    set({
      currentSessionId: code,
      sessionRole: 'guest',
      isParticipantJoined: true,
    });
    get().showToast(`Connecting to session ${code}…`);
    return true;
  },

  simulateParticipantJoined: () => {
    set({ isParticipantJoined: true });
    get().showToast('Participant joined the conversation');
  },

  setFromLang: (lang) => {
    set({ fromLang: lang, myLanguage: lang });
    window.localStorage.setItem(UI_LOCALE_STORAGE_KEY, toUiLocale(lang));
    const name = SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name || lang;
    get().showToast(`Source set to ${name}`);
  },

  setToLang: (lang) => {
    set({ toLang: lang });
    const name = SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name || lang;
    get().showToast(`Target set to ${name}`);
  },

  swapLanguages: () => {
    const { fromLang, toLang } = get();
    set({ isSwapRotating: true });
    setTimeout(() => set({ isSwapRotating: false }), 250);

    const nextFrom = toLang;
    const nextTo = fromLang === 'auto' ? 'en' : fromLang;
    set({ fromLang: nextFrom, toLang: nextTo });
  },

  setMicState: (state) => {
    let status: SystemStatus = 'Connected';
    if (state === 'listening') {
      status = 'Listening';
      audioCapture.startCapture().catch(() => {});
    } else if (state === 'processing') {
      status = 'Translating';
    } else if (state === 'muted') {
      status = 'Connected';
      audioCapture.stopCapture();
    } else if (state === 'idle') {
      status = 'Connected';
      audioCapture.stopCapture();
    }

    set({ micState: state, systemStatus: status });
  },

  toggleMic: () => {
    const { micState } = get();
    if (micState === 'listening') {
      get().setMicState('idle');
    } else {
      get().setMicState('listening');
    }
  },

  toggleMute: () => {
    const { micState } = get();
    if (micState === 'muted') {
      get().setMicState('listening');
    } else {
      get().setMicState('muted');
    }
  },

  simulateStreamingSpeech: () => {
    const { dialogueIndex, settings } = get();
    const pair = STREAMING_DIALOGUES[dialogueIndex % STREAMING_DIALOGUES.length];
    const turnId = `stream-${Date.now()}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 1: Speech detected, start listening & streaming interim original transcript
    get().setMicState('listening');

    let chunkIdx = 0;
    const originalInterval = setInterval(() => {
      const isLastChunk = chunkIdx >= pair.originalInterimChunks.length - 1;
      const text = pair.originalInterimChunks[chunkIdx] || pair.originalText;

      set({
        currentStreamingTurn: {
          id: turnId,
          sessionId: 'session-live',
          timestamp: timeString,
          speaker: pair.speaker,
          original: {
            language: pair.originalLang,
            languageLabel: pair.originalLabel,
            text,
            isPartial: !isLastChunk,
          },
          translation: {
            language: pair.targetLang,
            languageLabel: pair.targetLabel,
            text: '…',
            isPartial: true,
          },
          isStreaming: true,
        },
      });

      chunkIdx++;

      if (isLastChunk) {
        clearInterval(originalInterval);

        // Step 2: Speech completed, transition to Processing / Translating
        get().setMicState('processing');

        let transIdx = 0;
        const transInterval = setInterval(() => {
          const isFinal = transIdx >= pair.targetInterimChunks.length - 1;
          const transText = pair.targetInterimChunks[transIdx] || pair.targetText;

          set((state) => {
            if (!state.currentStreamingTurn) return state;
            return {
              currentStreamingTurn: {
                ...state.currentStreamingTurn,
                original: {
                  ...state.currentStreamingTurn.original,
                  isPartial: false,
                },
                translation: {
                  language: pair.targetLang,
                  languageLabel: pair.targetLabel,
                  text: transText,
                  isPartial: !isFinal,
                },
              },
            };
          });

          transIdx++;

          if (isFinal) {
            clearInterval(transInterval);

            // Step 3: Sentence stabilized! Commit into permanent turns list
            const finalTurn: ConversationTurn = {
              id: turnId,
              sessionId: 'session-live',
              timestamp: timeString,
              speaker: pair.speaker,
              original: {
                language: pair.originalLang,
                languageLabel: pair.originalLabel,
                text: pair.originalText,
                isPartial: false,
              },
              translation: {
                language: pair.targetLang,
                languageLabel: pair.targetLabel,
                text: pair.targetText,
                isPartial: false,
              },
              isStreaming: false,
            };

            set((state) => ({
              turns: [...state.turns, finalTurn],
              currentStreamingTurn: null,
              dialogueIndex: state.dialogueIndex + 1,
            }));

            get().setMicState('listening');

            // Auto-play audio if enabled in settings
            if (settings.autoPlayTranslation) {
              get().playTurnAudio(finalTurn);
            }
          }
        }, 320);
      }
    }, 280);
  },

  playTurnAudio: (turn) => {
    const { settings } = get();
    cancelSpeaking();
    set({ playingTurnId: turn.id });

    const spoken = speakText(
      turn.translation.text,
      turn.translation.language,
      settings.speechCadence,
      () => {
        set({ playingTurnId: null });
      }
    );

    if (!spoken) {
      setTimeout(() => {
        set({ playingTurnId: null });
      }, 1600);
    }
  },

  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => {
      if (get().toastMessage === message) {
        set({ toastMessage: null });
      }
    }, 2000);
  },

  clearToast: () => set({ toastMessage: null }),

  openShareModal: (turn) => set({ shareTargetTurn: turn }),

  closeShareModal: () => set({ shareTargetTurn: null }),

  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
    get().showToast('Settings saved');
  },

  loadSessions: async () => {
    try {
      const stored = await db.sessions.toArray();
      if (stored && stored.length > 0) {
        set({ sessions: stored });
      }
    } catch {
      // IndexedDB fallback in dev
    }
  },

  openSession: (sessionId) => {
    const { sessions } = get();
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      set({
        fromLang: session.sourceLang,
        toLang: session.targetLang,
        activeTab: 'translate',
      });
      get().showToast(`Loaded ${session.title}`);
    }
  },
}));
