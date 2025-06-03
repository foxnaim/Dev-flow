'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import { useTaskStore } from '../store/useTaskStore';
import { Task, TaskStatus } from '../types/task';

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        status: 'todo',
      });
      setNewTaskTitle('');
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'К выполнению' },
    { id: 'in_progress', title: 'В процессе' },
    { id: 'done', title: 'Выполнено' },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Задачи</h1>

        {/* Форма добавления задачи */}
        <form onSubmit={handleAddTask} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Добавить новую задачу..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Добавить
            </button>
          </div>
        </form>

        {/* Канбан доска */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{column.title}</h2>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Удалить
                        </button>
                      </div>
                      <div className="mt-4 flex gap-2">
                        {columns.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => handleStatusChange(task.id, col.id)}
                            className={`px-2 py-1 text-sm rounded ${
                              task.status === col.id
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                            }`}
                          >
                            {col.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
