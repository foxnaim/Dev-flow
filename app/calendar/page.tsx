'use client';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { format } from 'date-fns/format'; // Возможно, понадобится для форматирования даты
import { ru } from 'date-fns/locale/ru';
import { useTaskStore } from '../../store/useTaskStore';
import { Task } from '../../types/task';
import Modal from '../../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Nunito } from "next/font/google"; // Import Nunito font

const nunito = Nunito({ subsets: ["cyrillic"], variable: '--font-nunito' }); // Define Nunito font

export default function CalendarPage() {
  // Получаем задачи из хранилища задач
  const { tasks } = useTaskStore();
  // Состояние для выбранной задачи для попапа (оставляем для модального окна)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <Layout>
      <div className={`p-6 ${nunito.variable}`}> {/* Apply Nunito variable class */}
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
                    layout
                  >
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
            </div>
          )}
        </Modal>

      </div>
    </Layout>
  );
} 
