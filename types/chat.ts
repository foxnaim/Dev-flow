// Типы для сообщений чата
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  chatId: string;
}

// Interface for a Chat
export interface Chat {
  id: string;
  name: string;
  // You might add more properties later, like last message timestamp, etc.
}

// Интерфейс для состояния чата
export interface ChatState {
  messages: ChatMessage[];
  chats: Chat[];
  selectedChatId: string | null;
  isLoading: boolean;
  error: string | null;
} 
