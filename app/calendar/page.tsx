'use client';

import Layout from '../../components/Layout';
import { useCalendarStore } from '../../store/useCalendarStore';

export default function CalendarPage() {
  // Получаем события из хранилища календаря
  const { events } = useCalendarStore();

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Календарь</h1>
        
        {/* Список событий или сообщение об отсутствии событий */}
        {events.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Пока нет событий в календаре. Добавьте первое!</p>
        ) : (
          <div className="space-y-4">
            {/* Карточки событий */}
            {events.map(event => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                {/* Заголовок события */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                {/* Время начала и окончания */}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(event.start).toLocaleString('ru-RU')} - {new Date(event.end).toLocaleString('ru-RU')}
                </p>
                {/* Описание события (если есть) */}
                {event.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* TODO: Добавить кнопку создания нового события */}
        {/* TODO: Добавить модальное окно для создания/редактирования события */}
      </div>
    </Layout>
  );
} 
