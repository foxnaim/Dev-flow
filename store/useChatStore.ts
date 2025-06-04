import { create } from 'zustand';
import { ChatMessage, ChatState } from '../types/chat';

// Создаем store для управления состоянием чата
export const useChatStore = create<ChatState & {
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}>((set) => ({
  // Начальное состояние
  messages: [],
  isLoading: false,
  error: null,

  // Действия
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }],
  })),

  clearMessages: () => set({ messages: [] }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
})); 
