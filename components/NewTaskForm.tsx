import { useState } from 'react';
import { Priority } from '../types/task';
import { useTaskStore } from '../store/useTaskStore';

interface NewTaskFormProps {
  onClose: () => void;
}

export default function NewTaskForm({ onClose }: NewTaskFormProps) {
  const addTask = useTaskStore((state) => state.addTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTask({
      title,
      description,
      priority,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      status: 'backlog',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    onClose();
  };

  const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className={labelClasses}>
          Заголовок
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Описание
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="priority" className={labelClasses}>
          Приоритет
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={inputClasses}
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className={labelClasses}>
          Теги (через запятую)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="например: важное, срочное, проект"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="dueDate" className={labelClasses}>
          Срок выполнения
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 transition-colors duration-200"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Создать задачу
        </button>
      </div>
    </form>
  );
} 
