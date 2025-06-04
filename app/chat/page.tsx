'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import ChatMessage from '../../components/ChatMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, isLoading } = useChatStore();

  // Автопрокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Добавляем сообщение пользователя
    addMessage({
      role: 'user',
      content: inputMessage.trim(),
    });

    setInputMessage('');

    // Здесь будет логика отправки сообщения на сервер
    // Пока просто имитируем ответ
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: 'Это тестовый ответ. В будущем здесь будет интеграция с API.',
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Заголовок */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold">Чат</h1>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Форма ввода */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-surface">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2 rounded-lg bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 
