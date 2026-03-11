
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
