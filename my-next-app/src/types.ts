
export enum AppTab {
  NAME = 'TÊN',
  NOTES = 'GHI CHÚ',
  CHAT = 'TRÒ CHUYỆN',
  HISTORY = 'LỊCH SỬ TRÒ CHUYỆN',
  ACCOUNT = 'TÀI KHOẢN'
}

export interface Note {
  id: string;
  title: string;
  chatContext: string;
  createdAt: string;
  summary: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: string;
  summary: string;
}

export type FocusSection = 'header' | 'left' | 'center' | 'right' | 'footer';

export interface Conversations {
  id: number;
  user_id: number;
  title: string;
}

export interface ChatMessages {
  id: number;
  conversation_id: number;
  sender_type: 'user' | 'bot' | 'agent' | 'system';
  content: string;
  generated_links?: Record<string, any>[];
  audio_url?: string;
}

export interface Notes {
  id: number;
  user_id: number;
  title: string;
  content: string;
}

export interface NoteMessageSources {
  note_id: number;
  chat_message_id: number;
}