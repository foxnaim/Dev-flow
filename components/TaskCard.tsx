import { Task } from '../types/task';
import { Tag, Calendar, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

const priorityColors = {
  low: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  high: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-2 cursor-move hover:shadow-md transition-all duration-200"
    >
      <h3 className="font-medium text-gray-900 dark:text-white mb-2">{task.title}</h3>
      
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
          {task.priority === 'low' && 'Низкий'}
          {task.priority === 'medium' && 'Средний'}
          {task.priority === 'high' && 'Высокий'}
        </span>
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
} 
