import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import { useTaskStore } from '../store/useTaskStore';
import TaskCard from './TaskCard';
import Modal from './Modal';
import NewTaskForm from './NewTaskForm';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

// Определение колонок для канбан-доски
const columns: { id: TaskStatus; title: string }[] = [
  { id: 'к выполнению', title: 'К выполнению' },
  { id: 'в процессе', title: 'В процессе' },
  { id: 'выполнено', title: 'Выполнено' }
];

export default function TaskBoard() {
  // Получаем задачи и функции из хранилища
  const { tasks, moveTask, deleteTask, addTask, updateTask } = useTaskStore();
  // Состояние для отслеживания перетаскиваемой задачи
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  // Состояние модального окна для новой задачи
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  // Состояние для задачи, которая редактируется
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Обработчик начала перетаскивания
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Обработчик перетаскивания над областью
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Обработчик отпускания задачи
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask) {
      moveTask(draggedTask.id, status);
      setDraggedTask(null);
    }
  };

  // Обработчик отправки формы задачи
  const handleTaskSubmit = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask({
        ...taskData,
        status: 'к выполнению',
      } as Task);
    }
  };

  return (
    <div className="p-6">
      {/* Заголовок доски и кнопка добавления задачи */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DevFlow</h1>
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="flex items-center px-6 py-2 rounded-full border border-purple-700 bg-pink text-purple-700 font-medium shadow-md hover:bg-pink-200 transition-colors duration-200 focus:outline-none"
        >
          <Plus className="w-5 h-5 mr-2" />
          Новая задача
        </button>
      </div>

      {/* Сетка колонок для задач */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Заголовок колонки */}
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 px-2">
              {column.title}
            </h2>
            {/* Список задач в колонке */}
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={handleDragStart}
                    onDelete={deleteTask}
                    onChangeStatus={moveTask}
                    onEdit={(taskToEdit) => {
                      setEditingTask(taskToEdit);
                      setIsNewTaskModalOpen(true);
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Модальное окно для новой задачи */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => {
          setIsNewTaskModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Редактировать задачу' : 'Новая задача'}
      >
        <NewTaskForm 
          onSubmit={handleTaskSubmit}
          onClose={() => {
            setIsNewTaskModalOpen(false);
            setEditingTask(null);
          }}
          existingTask={editingTask || undefined}
        />
      </Modal>
    </div>
  );
} 
