import { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';

interface NewTaskFormProps {
  onSubmit: (task: Partial<Task>) => void;
  onClose: () => void;
  existingTask?: Task;
}

export default function NewTaskForm({ onSubmit, onClose, existingTask }: NewTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('средний');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setPriority(existingTask.priority);
      setTags(existingTask.tags?.join(', ') || '');
      setDueDate(existingTask.dueDate || '');
    }
  }, [existingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Partial<Task> = {
      title,
      description,
      priority,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dueDate: dueDate || undefined,
      status: existingTask?.status || 'к выполнению'
    };

    onSubmit(taskData);
    onClose();
  };

  const inputClasses = "w-full px-3 py-2 border border-border rounded-md bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
          Название
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
          Описание
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClasses}
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-1">
          Приоритет
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className={inputClasses}
        >
          <option value="низкий">Низкий</option>
          <option value="средний">Средний</option>
          <option value="высокий">Высокий</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-1">
          Теги (через запятую)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClasses}
          placeholder="например: важное, срочное"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-1">
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

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-secondary-text hover:text-foreground"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-md"
        >
          {existingTask ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
} 
