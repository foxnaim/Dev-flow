import { create } from 'zustand';
import { ChatMessage, ChatState, Chat } from '../types/chat';

// Создаем store для управления состоянием чата
export const useChatStore = create<ChatState & {
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'chatId'>) => void;
  clearMessages: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  selectChat: (chatId: string | null) => void;
}>((set, get) => ({
  // Начальное состояние
  messages: [],
  chats: [
    { id: 'chat-1', name: 'Общий чат' },
    { id: 'chat-2', name: 'Проектная группа' },
    { id: 'chat-3', name: 'Поддержка' },
  ],
  selectedChatId: null,
  isLoading: false,
  error: null,

  // Действия
  addMessage: (message) => set((state) => {
    const selectedChatId = get().selectedChatId;
    if (!selectedChatId) return state;

    return {
      messages: [...state.messages, {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        chatId: selectedChatId,
      }],
    };
  }),

  clearMessages: () => set({ messages: [] }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  selectChat: (chatId) => set({ selectedChatId: chatId }),
})); 
