import { Task, TaskPriority, TaskStatus } from '../types/task';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { useTaskStore } from '../store/useTaskStore';
import { ExternalLink, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDragStart }: TaskCardProps) {
  const { updateTask, deleteTask } = useTaskStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'down' | 'up'>('down');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen && buttonRef.current && menuRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        setMenuPosition('up');
      } else {
        setMenuPosition('down');
      }
    }
  }, [isMenuOpen]);

  const handleEditClick = () => {
    onEdit(task);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = async () => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
    setIsMenuOpen(false);
  };

  const handleStatusChangeInMenu = async (newStatus: TaskStatus) => {
    await handleStatusChange(newStatus);
    setIsMenuOpen(false);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'bg-pink-100 text-pink-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <div className="bg-background dark:bg-slate-800 rounded-lg shadow-sm p-2 sm:p-4" draggable onDragStart={(e) => onDragStart(e, task)}>
      <div className="flex justify-between items-start mb-2 sm:mb-4">
        <div className="flex flex-wrap gap-2 items-start w-full">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white break-words whitespace-normal w-0 min-w-0 flex-1">
            {task.title}
          </h3>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority.toUpperCase() as TaskPriority)}`}>
              {task.priority === 'high' ? 'Высокий' : 
               task.priority === 'medium' ? 'Средний' : 'Низкий'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status === 'TODO' ? 'К выполнению' :
               task.status === 'IN_PROGRESS' ? 'В процессе' : 'Выполнено'}
            </span>
          </div>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 break-words">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
        {(task as any).tags && (task as any).tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(task as any).tags.map((tag: string) => (
              <span key={`${task.id}-${tag}`} className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {task.dueDate && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Срок: {format(new Date(task.dueDate), 'dd.MM.yyyy', { locale: ru })}
          </span>
        )}
        {(task as any).documentationLink && (
          <a
            href={(task as any).documentationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
          >
            Документация
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="flex justify-end relative">
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 focus:outline-none"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className={`absolute right-0 left-auto w-48 mt-2 bg-white dark:bg-slate-700 rounded-md shadow-lg z-10 py-1 whitespace-nowrap
              ${menuPosition === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
          >
            <button
              onClick={handleEditClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              <Edit className="w-4 h-4 mr-2" /> Редактировать
            </button>
            {/* Статусы только на мобильных и планшетах */}
            <div className="block md:hidden">
              {task.status !== 'TODO' && (
                <button
                  onClick={() => handleStatusChangeInMenu('TODO')}
                  className="flex items-center w-full px-4 py-2 text-sm text-pink-600 hover:bg-gray-100 dark:text-pink-400 dark:hover:bg-slate-600"
                >
                  К выполнению
                </button>
              )}
              {task.status !== 'IN_PROGRESS' && (
                <button
                  onClick={() => handleStatusChangeInMenu('IN_PROGRESS')}
                  className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 dark:text-yellow-400 dark:hover:bg-slate-600"
                >
                  В процессе
                </button>
              )}
              {task.status !== 'DONE' && (
                <button
                  onClick={() => handleStatusChangeInMenu('DONE')}
                  className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:text-green-400 dark:hover:bg-slate-600"
                >
                  Выполнено
                </button>
              )}
            </div>
            <button
              onClick={handleDeleteClick}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-slate-600"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
