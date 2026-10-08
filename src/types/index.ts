export type LanguageCode = 'auto' | 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export type MicState = 'idle' | 'listening' | 'processing' | 'muted';

export type SystemStatus = 'Connected' | 'Listening' | 'Translating' | 'Offline';

export type SpeechCadence = 'deliberate' | 'natural' | 'brisk';

export interface SpeechSegment {
  language: LanguageCode;
  languageLabel: string;
  text: string;
  isPartial?: boolean;
}

export interface ConversationTurn {
  id: string;
  sessionId: string;
  timestamp: string;
  speaker: 'Speaker A' | 'Speaker B';
  original: SpeechSegment;
  translation: SpeechSegment;
  isStreaming?: boolean;
}

export interface SessionRecord {
  id: string;
  title: string;
  createdAt: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  turnsCount: number;
  snippet: {
    original: string;
    translation: string;
  };
}

export type BackendMode = 'simulation' | 'websocket' | 'webspeech';

export interface AppSettings {
  audioDevice: string;
  ambientCancellation: boolean;
  autoPlayTranslation: boolean;
  speechCadence: SpeechCadence;
  nativeTypography: boolean;
  backendMode: BackendMode;
  backendEndpoint: string;
}

export type StreamEventType =
  | 'mic_status'
  | 'speech_start'
  | 'speech_interim'
  | 'speech_final'
  | 'translation_interim'
  | 'translation_final'
  | 'sentence_stabilized'
  | 'error';

export interface StreamEvent {
  type: StreamEventType;
  payload: any;
}
