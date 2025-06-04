import { Task, TaskStatus, TaskPriority } from '../types/task';
import { motion } from 'framer-motion';
import { MoreVertical, Edit, Trash2, CheckSquare } from 'lucide-react';
import { useState } from 'react';

// Пропсы для карточки задачи
interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
}

// Цвета для разных приоритетов
const priorityColors = {
  low: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  high: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'высокий':
      return 'bg-red-100 text-red-800';
    case 'средний':
      return 'bg-yellow-100 text-yellow-800';
    case 'низкий':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'к выполнению':
      return 'bg-blue-100 text-blue-800';
    case 'в процессе':
      return 'bg-yellow-100 text-yellow-800';
    case 'выполнено':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TaskCard({ task, onDragStart, onDelete, onChangeStatus, onEdit }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStatusChange = (newStatus: TaskStatus) => {
    onChangeStatus(task.id, newStatus);
    setIsMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 cursor-move relative"
        draggable
        onDragStart={(e: React.DragEvent<HTMLDivElement>) => onDragStart(e, task)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(task);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleStatusChange('к выполнению')}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    К выполнению
                  </button>
                  <button
                    onClick={() => handleStatusChange('в процессе')}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    В процессе
                  </button>
                  <button
                    onClick={() => handleStatusChange('выполнено')}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Выполнено
                  </button>
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {task.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        {task.dueDate && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Срок: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
          </div>
        )}
      </div>
    </motion.div>
  );
} 
