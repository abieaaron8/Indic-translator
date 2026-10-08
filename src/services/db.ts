import Dexie, { type Table } from 'dexie';
import { ConversationTurn, SessionRecord } from '../types';

export class IndicTranslatorDatabase extends Dexie {
  sessions!: Table<SessionRecord>;
  turns!: Table<ConversationTurn>;

  constructor() {
    super('IndicTranslatorDB');
    this.version(1).stores({
      sessions: 'id, createdAt, sourceLang, targetLang',
      turns: 'id, sessionId, timestamp',
    });
  }
}

export const db = new IndicTranslatorDatabase();
