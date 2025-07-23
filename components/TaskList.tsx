'use client';

import { useTaskStore } from '../store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { useState } from 'react';
import Modal from './Modal';
import { Task } from '../types/task';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TaskList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { tasks } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-slate-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Название</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Срок выполнения</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Приоритет</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.tr 
                  key={task.id} 
                  className="hover:bg-slate-700 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {task.dueDate ? format(new Date(task.dueDate), 'dd.MM.yyyy', { locale: ru }) : 'Не указан'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{task.priority || 'Не указан'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{task.status}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              className="bg-slate-700 rounded-lg p-4"
              onClick={() => setSelectedTask(task)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <h3 className="text-lg font-medium text-white break-words mb-2">{task.title}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="font-medium">Срок:</span>{' '}
                  {task.dueDate ? format(new Date(task.dueDate), 'dd.MM.yyyy', { locale: ru }) : 'Не указан'}
                </p>
                <p className="text-slate-300">
                  <span className="font-medium">Приоритет:</span> {task.priority || 'Не указан'}
                </p>
                <p className="text-slate-300">
                  <span className="font-medium">Статус:</span> {task.status}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {tasks.length === 0 && (
        <p className="text-center text-slate-500 py-4">Задач нет</p>
      )}

      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || 'Детали задачи'}
      >
        {selectedTask && (
          <div className="space-y-4">
            <p className="break-words text-slate-300">
              <strong>Описание:</strong> {selectedTask.description || 'Нет описания'}
            </p>
            <p className="text-slate-300">
              <strong>Срок выполнения:</strong>{' '}
              {selectedTask.dueDate ? format(new Date(selectedTask.dueDate), 'dd.MM.yyyy', { locale: ru }) : 'Не указан'}
            </p>
            <p className="text-slate-300">
              <strong>Приоритет:</strong> {selectedTask.priority || 'Не указан'}
            </p>
            <p className="text-slate-300">
              <strong>Статус:</strong> {selectedTask.status}
            </p>
            {(selectedTask as any).documentationLink && (
              <p className="break-words text-slate-300">
                <strong>Документация:</strong>{' '}
                <a 
                  href={(selectedTask as any).documentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {(selectedTask as any).documentationLink}
                </a>
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
