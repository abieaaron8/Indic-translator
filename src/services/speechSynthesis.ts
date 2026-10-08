import { LanguageCode, SpeechCadence } from '../types';

const BCP47_LANG_MAP: Record<LanguageCode, string> = {
  auto: 'en-US',
  en: 'en-US',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
};

const CADENCE_SPEED_MAP: Record<SpeechCadence, number> = {
  deliberate: 0.85,
  natural: 1.0,
  brisk: 1.15,
};

export function speakText(
  text: string,
  lang: LanguageCode,
  cadence: SpeechCadence = 'natural',
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const targetTag = BCP47_LANG_MAP[lang] || 'en-US';
  utterance.lang = targetTag;
  utterance.rate = CADENCE_SPEED_MAP[cadence] || 1.0;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matched = voices.find((v) => v.lang.startsWith(targetTag.slice(0, 2)));
  if (matched) {
    utterance.voice = matched;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function cancelSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
