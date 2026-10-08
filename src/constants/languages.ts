import { Language, ConversationTurn } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'auto', name: 'Auto Detect', nativeName: 'Auto Detect' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export const TARGET_LANGUAGES = SUPPORTED_LANGUAGES.filter((lang) => lang.code !== 'auto');

export const INITIAL_CONVERSATION_TURNS: ConversationTurn[] = [
  {
    id: 'turn-1',
    sessionId: 'session-live',
    timestamp: '10:42 AM',
    speaker: 'Speaker A',
    original: {
      language: 'ta',
      languageLabel: 'தமிழ் · Tamil',
      text: 'வணக்கம், நீங்கள் சொல்வது எனக்கு தெளிவாக கேட்கிறது. நாங்கள் எப்போது எங்கள் உரையாடலைத் தொடங்கலாம்?',
    },
    translation: {
      language: 'en',
      languageLabel: 'English',
      text: 'Hello, I can hear you clearly. When would you like us to begin our conversation?',
    },
  },
  {
    id: 'turn-2',
    sessionId: 'session-live',
    timestamp: '10:43 AM',
    speaker: 'Speaker B',
    original: {
      language: 'en',
      languageLabel: 'English',
      text: 'Good morning. We can begin right away. I wanted to ask how the regional agricultural distribution is progressing this week.',
    },
    translation: {
      language: 'ta',
      languageLabel: 'தமிழ் · Tamil',
      text: 'காலை வணக்கம். நாம் உடனே தொடங்கலாம். இந்த வாரம் பிராந்திய விவசாய விநியோகம் எவ்வாறு முன்னேறி வருகிறது என்று கேட்க விரும்பினேன்.',
    },
  },
];

export interface StreamDialoguePair {
  speaker: 'Speaker A' | 'Speaker B';
  originalLang: 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'en';
  originalLabel: string;
  originalText: string;
  originalInterimChunks: string[];
  targetLang: 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'en';
  targetLabel: string;
  targetText: string;
  targetInterimChunks: string[];
}

export const STREAMING_DIALOGUES: StreamDialoguePair[] = [
  {
    speaker: 'Speaker A',
    originalLang: 'ta',
    originalLabel: 'தமிழ் · Tamil',
    originalText: 'அறுவடைக்கு பிந்தைய சேமிப்பு வசதிகள் சிறப்பாக செயல்படுகின்றன. கிராமப்புற மையங்களில் எந்தவித தாமதமும் இல்லை.',
    originalInterimChunks: [
      'அறுவடைக்கு பிந்தைய...',
      'அறுவடைக்கு பிந்தைய சேமிப்பு வசதிகள்...',
      'அறுவடைக்கு பிந்தைய சேமிப்பு வசதிகள் சிறப்பாக செயல்படுகின்றன...',
      'அறுவடைக்கு பிந்தைய சேமிப்பு வசதிகள் சிறப்பாக செயல்படுகின்றன. கிராமப்புற மையங்களில் எந்தவித தாமதமும் இல்லை.',
    ],
    targetLang: 'en',
    targetLabel: 'English',
    targetText: 'The post-harvest storage facilities are functioning well. There is no delay across the rural centers.',
    targetInterimChunks: [
      'Post-harvest...',
      'The post-harvest storage facilities...',
      'The post-harvest storage facilities are functioning well...',
      'The post-harvest storage facilities are functioning well. There is no delay across the rural centers.',
    ],
  },
  {
    speaker: 'Speaker B',
    originalLang: 'en',
    originalLabel: 'English',
    originalText: 'That is wonderful to hear. Let us make sure the cold storage units remain monitored through the weekend.',
    originalInterimChunks: [
      'That is wonderful...',
      'That is wonderful to hear...',
      'Let us make sure the cold storage units...',
      'That is wonderful to hear. Let us make sure the cold storage units remain monitored through the weekend.',
    ],
    targetLang: 'ta',
    targetLabel: 'தமிழ் · Tamil',
    targetText: 'அதை கேட்பதில் மிகவும் மகிழ்ச்சி. வார இறுதி முழுவதும் குளிர்பதன சேமிப்பு நிலையங்கள் கண்காணிக்கப்படுவதை உறுதி செய்வோம்.',
    targetInterimChunks: [
      'அதை கேட்பதில்...',
      'அதை கேட்பதில் மிகவும் மகிழ்ச்சி...',
      'வார இறுதி முழுவதும் குளிர்பதன சேமிப்பு நிலையங்கள்...',
      'அதை கேட்பதில் மிகவும் மகிழ்ச்சி. வார இறுதி முழுவதும் குளிர்பதன சேமிப்பு நிலையங்கள் கண்காணிக்கப்படுவதை உறுதி செய்வோம்.',
    ],
  },
  {
    speaker: 'Speaker A',
    originalLang: 'hi',
    originalLabel: 'हिन्दी · Hindi',
    originalText: 'नमस्ते, क्या सभी दल समय पर परियोजना की समीक्षा रिपोर्ट प्रस्तुत कर पाएंगे?',
    originalInterimChunks: [
      'नमस्ते...',
      'क्या सभी दल समय पर...',
      'परियोजना की समीक्षा रिपोर्ट...',
      'नमस्ते, क्या सभी दल समय पर परियोजना की समीक्षा रिपोर्ट प्रस्तुत कर पाएंगे?',
    ],
    targetLang: 'en',
    targetLabel: 'English',
    targetText: 'Hello, will all teams be able to submit the project review reports on time?',
    targetInterimChunks: [
      'Hello...',
      'Will all teams be able to...',
      'submit the project review reports on time?',
      'Hello, will all teams be able to submit the project review reports on time?',
    ],
  },
  {
    speaker: 'Speaker B',
    originalLang: 'te',
    originalLabel: 'తెలుగు · Telugu',
    originalText: 'అవును, మేము ఇప్పటికే తుది వివరాలను సమీక్షించాము. రేపటికల్లా అంతా పూర్తవుతుంది.',
    originalInterimChunks: [
      'అవును...',
      'మేము ఇప్పటికే తుది వివరాలను...',
      'సమీక్షించాము...',
      'అవును, మేము ఇప్పటికే తుది వివరాలను సమీక్షించాము. రేపటికల్లా అంతా పూర్తవుతుంది.',
    ],
    targetLang: 'en',
    targetLabel: 'English',
    targetText: 'Yes, we have already reviewed the final details. Everything will be completed by tomorrow.',
    targetInterimChunks: [
      'Yes...',
      'We have already reviewed...',
      'the final details...',
      'Yes, we have already reviewed the final details. Everything will be completed by tomorrow.',
    ],
  },
  {
    speaker: 'Speaker A',
    originalLang: 'kn',
    originalLabel: 'ಕನ್ನಡ · Kannada',
    originalText: 'ನಾವು ಚರ್ಚಿಸಿದ ತಾಂತ್ರಿಕ ವಿವರಗಳನ್ನು ಎಲ್ಲರಿಗೂ ಹಂಚಿಕೊಳ್ಳೋಣ.',
    originalInterimChunks: [
      'ನಾವು ಚರ್ಚಿಸಿದ...',
      'ತಾಂತ್ರಿಕ ವಿವರಗಳನ್ನು...',
      'ಎಲ್ಲರಿಗೂ ಹಂಚಿಕೊಳ್ಳೋಣ.',
      'ನಾವು ಚರ್ಚಿಸಿದ ತಾಂತ್ರಿಕ ವಿವರಗಳನ್ನು ಎಲ್ಲರಿಗೂ ಹಂಚಿಕೊಳ್ಳೋಣ.',
    ],
    targetLang: 'ml',
    targetLabel: 'മലയാളം · Malayalam',
    targetText: 'ഞങ്ങൾ ചർച്ച ചെയ്ത സാങ്കೇതിക വിശദാംಶങ്ങൾ എല്ലാവരുമായും പങ്കിടാം.',
    targetInterimChunks: [
      'ഞങ്ങൾ ചർച്ച ചെയ്ത...',
      'സാങ്കേതിക വിശദാംಶങ്ങൾ...',
      'എല്ലാവരുമായും പങ്കിടാം.',
      'ഞങ്ങൾ ചർച്ച ചെയ്ത സാങ്കേതിക വിശദാംಶങ്ങൾ എല്ലാവരുമായും പങ്കിടാം.',
    ],
  },
];
