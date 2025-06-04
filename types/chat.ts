// Типы для сообщений чата
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Интерфейс для состояния чата
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
} 
