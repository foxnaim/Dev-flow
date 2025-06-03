import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import { useTaskStore } from '../store/useTaskStore';
import TaskCard from './TaskCard';
import Modal from './Modal';
import NewTaskForm from './NewTaskForm';
import { Plus } from 'lucide-react';

// Определение колонок для канбан-доски
const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'Бэклог' },
  { id: 'in-progress', title: 'В процессе' },
  { id: 'done', title: 'Выполнено' },
];

export default function TaskBoard() {
  // Получаем задачи и функцию перемещения из хранилища
  const { tasks, moveTask } = useTaskStore();
  // Состояние для отслеживания перетаскиваемой задачи
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  // Состояние модального окна для новой задачи
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

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

  return (
    <div className="p-6">
      {/* Заголовок доски и кнопка добавления задачи */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Канбан-доска</h1>
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="flex items-center px-6 py-2 rounded-full border border-purple-700 bg-purple-100 text-purple-700 font-medium shadow-md hover:bg-purple-200 transition-colors duration-200 focus:outline-none"
        >
          <Plus className="w-5 h-5 mr-2" />
          Новая задача
        </button>
      </div>

      {/* Сетка колонок для задач */}
      <div className="grid grid-cols-3 gap-6">
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
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для новой задачи */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Новая задача"
      >
        <NewTaskForm onClose={() => setIsNewTaskModalOpen(false)} />
      </Modal>
    </div>
  );
} 
