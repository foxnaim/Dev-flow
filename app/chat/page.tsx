'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import ChatMessage from '../../components/ChatMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Menu } from 'lucide-react';

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, isLoading, chats, selectedChatId, selectChat } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const filteredMessages = messages.filter(message => message.chatId === selectedChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages, selectedChatId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (selectedChatId !== null && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [selectedChatId, isSidebarOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !selectedChatId) return;

    addMessage({
      role: 'user',
      content: inputMessage.trim(),
    });

    setInputMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow relative">
      {/* Десктопный статичный сайдбар */}
      <div className="hidden md:flex md:flex-col md:w-72 bg-surface-light p-10 border-r border-border">
        <h2 className="text-lg font-semibold mb-4">Чаты</h2>
        <ul className="space-y-2 flex-grow overflow-y-auto">
          {isClient && chats.map(chat => (
            <li key={chat.id}>
              <button 
                className={`w-full text-left p-2 rounded ${selectedChatId === chat.id ? 'bg-accent text-white' : 'hover:bg-surface/80'}`}
                onClick={() => selectChat(chat.id)}
              >
                {chat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Мобильный сайдбар */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-surface-light p-4 border-r border-border flex flex-col z-40 md:hidden"
          >
            <h2 className="text-lg font-semibold mb-4">Чаты</h2>
            <ul className="space-y-2 flex-grow overflow-y-auto">
              {chats.map(chat => (
                <li key={chat.id}>
                  <button 
                    className={`w-full text-left p-2 rounded ${selectedChatId === chat.id ? 'bg-accent text-white' : 'hover:bg-surface/80'}`}
                    onClick={() => {
                      selectChat(chat.id);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {chat.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Затемнение фона при открытом сайдбаре на мобилке */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Основная область чата */}
      <div className="flex flex-col flex-1 ">
        {/* Хедер */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-surface/80 rounded md:hidden"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold">
            {selectedChatId ? chats.find(chat => chat.id === selectedChatId)?.name : 'Чат'}
          </h1>
        </div>

        {/* Сообщения */}
        {selectedChatId ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {filteredMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-secondary-text">
            Выберите чат для начала общения
          </div>
        )}

        {/* Инпут */}
        {selectedChatId && (
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
        )}
      </div>
    </div>
  );
}
