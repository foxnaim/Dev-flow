'use client';

import Layout from '../../components/Layout';
import { useCalendarStore } from '../../store/useCalendarStore';

export default function CalendarPage() {
  const { events } = useCalendarStore();

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Календарь</h1>
        
        {events.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Пока нет событий в календаре. Добавьте первое!</p>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(event.start).toLocaleString('ru-RU')} - {new Date(event.end).toLocaleString('ru-RU')}
                </p>
                {event.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>}
                {/* Добавить кнопки для редактирования/удаления */}
              </div>
            ))}
          </div>
        )}

        {/* Кнопка добавления события */}
        {/* <button className="...">Новое событие</button> */}

      </div>
    </Layout>
  );
} 
