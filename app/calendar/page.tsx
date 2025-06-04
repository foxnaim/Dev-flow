'use client';

import Layout from '../../components/Layout';
// import { useCalendarStore } from '../../store/useCalendarStore'; // Удаляем, так как больше не используем
import { useState } from 'react';

// Импорт стилей react-big-calendar (обязательно!) // Удаляем, так как больше не используем
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// Удаляем импорты react-big-calendar и date-fns, кроме ru и startOfToday если нужно для других целей (пока оставим startOfToday на всякий случай)
// import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format } from 'date-fns/format'; // Возможно, понадобится для форматирования даты
// import { parse } from 'date-fns/parse';
// import { startOfWeek } from 'date-fns/startOfWeek';
// import { getDay } from 'date-fns/getDay';
import { ru } from 'date-fns/locale/ru';
// import { startOfToday } from 'date-fns'; // Оставляем, если понадобится дата сегодня

// Импорт useTaskStore
import { useTaskStore } from '../../store/useTaskStore';
import { Task } from '../../types/task';
// Импорт компонента Modal (оставим, если решим показывать детали в модальном окне)
import Modal from '../../components/Modal';

import { motion, AnimatePresence } from 'framer-motion';

// Настройка date-fns localizer для react-big-calendar // Удаляем
// const locales = { 'ru': ru };
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// Удаляем интерфейс CalendarEvent, если он больше не нужен
// interface CalendarEvent {
//   title: string;
//   start: Date;
//   end: Date;
//   allDay?: boolean;
//   resource?: Task;
// }

export default function CalendarPage() {
  // Получаем задачи из хранилища задач
  const { tasks } = useTaskStore();
  // Состояние для выбранной задачи для попапа (оставляем для модального окна)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Удаляем состояния date, view и обработчики навигации/вида
  // const [date, setDate] = useState(startOfToday());
  // const [view, setView] = useState<View>('agenda');
  // const handleNavigate = (newDate: Date) => { setDate(newDate); };
  // const handleView = (newView: View) => { setView(newView); };

  // Удаляем преобразование задач в события календаря, работаем напрямую с задачами
  // const tasksAsEvents: CalendarEvent[] = tasks
  //   .filter(task => task.dueDate)
  //   .map(task => ({
  //     title: task.title,
  //     start: new Date(task.dueDate!),
  //     end: new Date(task.dueDate!),
  //     allDay: true,
  //     resource: task,
  //   }));

  // Объединяем события из хранилища календаря и задачи с dueDate // Удаляем
  // const allEvents = [...calendarEvents, ...tasksAsEvents];

  // Удаляем консоль лог событий
  // console.log('Tasks converted to Calendar Events:', tasksAsEvents); // Логируем события для отладки


  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Список всех задач</h1> {/* Изменяем заголовок */}
        
        {/* Заменяем компонент Calendar на список задач */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Название</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Срок выполнения</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Приоритет</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Статус</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Теги</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.tr 
                    key={task.id} 
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    layout // Ensures smooth reordering if tasks are added/removed
                  > {/* Добавляем клик для модального окна */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{task.dueDate ? format(new Date(task.dueDate), 'dd.MM.yyyy', { locale: ru }) : 'Не указан'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{task.priority || 'Не указан'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{task.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{task.tags?.join(', ') || 'Нет тегов'}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {tasks.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Задач нет</p>
          )}

        </div>

        {/* TODO: Добавить возможность drag-and-drop (требует дополнительных библиотек и логики) */}
        {/* TODO: Добавить попап с деталями задачи при клике */}

        {/* Модальное окно для деталей задачи (оставляем) */}
        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={selectedTask?.title || 'Детали задачи'}
        >
          {selectedTask && (
            <div>
              <p><strong>Описание:</strong> {selectedTask.description || 'Нет описания'}</p>
              <p><strong>Срок выполнения:</strong> {selectedTask.dueDate ? format(new Date(selectedTask.dueDate), 'dd.MM.yyyy', { locale: ru }) : 'Не указан'}</p>
              <p><strong>Приоритет:</strong> {selectedTask.priority || 'Не указан'}</p>
              <p><strong>Теги:</strong> {selectedTask.tags?.join(', ') || 'Нет тегов'}</p>
              <p><strong>Статус:</strong> {selectedTask.status}</p>
               {/* TODO: Добавить кнопки для редактирования/удаления из попапа */}
            </div>
          )}
        </Modal>

      </div>
    </Layout>
  );
} 
