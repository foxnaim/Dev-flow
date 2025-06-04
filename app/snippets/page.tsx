'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
// Удаляем импорт useSnippetStore, так как он больше не нужен для чата
// import { useSnippetStore } from '../../store/useSnippetStore';
// Удаляем импорт типов сниппетов
// import { Snippet } from '../../types/snippet';

export default function ChatPage() {
  // Состояние для поля ввода сообщения (пока не используется для отправки)
  const [messageInput, setMessageInput] = useState('');
  // Состояние для отслеживания, выбран ли чат на мобильных устройствах
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Пока оставим пустой обработчик отправки сообщения
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Отправка сообщения:', messageInput);
    setMessageInput(''); // Очищаем поле ввода
  };

  // Обработчик выбора чата (пока просто меняет состояние для мобильных)
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  return (
    <Layout>
      {/* Контейнер для двухколоночного макета */}
      <div className="flex h-[calc(100vh-100px)]">

        {/* Боковая панель для списка чатов */}
        {/* Скрываем на больших экранах, если выбран чат */}
        {(!selectedChatId || window.innerWidth >= 768) && (
          <div className="w-full md:w-1/4 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
            <h2 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">Чаты</h2>
            {/* Здесь будет список чатов (placeholder) */}
            <div className="p-4 text-gray-500 dark:text-gray-400">
              <p>Список чатов появится здесь...</p>
              {/* Пример элемента списка чата с обработчиком выбора */}
               <div 
                 className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded"
                 onClick={() => handleSelectChat('chat-1')} // Пример ID чата
               >
                 Чат 1 (кликни)
               </div>
               <div 
                 className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded"
                 onClick={() => handleSelectChat('chat-2')} // Пример ID чата
               >
                 Чат 2 (кликни)
               </div>
            </div>
          </div>
        )}

        {/* Основная область для выбранного чата */}
        {/* Скрываем на маленьких экранах, если чат не выбран */}
        {(selectedChatId || window.innerWidth >= 768) && (
          <div className="flex flex-col flex-1 w-full md:w-3/4 p-6">

            {/* Заголовок выбранного чата (placeholder) */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedChatId ? `Чат ${selectedChatId}` : 'Выберите чат'} {/* Показываем ID выбранного чата */} 
            </h1>

            {/* Кнопка Назад для мобильных */}
            {window.innerWidth < 768 && (
              <button 
                onClick={() => setSelectedChatId(null)}
                className="mb-4 px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
              >
                Назад к чатам
              </button>
            )}

            {/* Область для сообщений чата */}
            <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-800">
              {/* Здесь будут отображаться сообщения */}
              <p className="text-center text-gray-500 dark:text-gray-400">Сообщения чата появятся здесь...</p>
            </div>

            {/* Форма ввода сообщения */}
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Введите ваше сообщение..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Отправить
              </button>
            </form>
          </div>
        )}

      </div>
    </Layout>
  );
} 
