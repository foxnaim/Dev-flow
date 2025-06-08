'use client';

import { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { useTaskStore } from '../store/useTaskStore';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user: User;
}

interface NewTaskFormProps {
  onSubmit?: () => void;
  onClose?: () => void;
  existingTask?: Task;
}

export default function NewTaskForm({ onSubmit, onClose, existingTask }: NewTaskFormProps) {
  const { addTask } = useTaskStore();
  const { data: session } = useSession() as { data: Session | null };
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [documentationLink, setDocumentationLink] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setPriority(existingTask.priority);
      setDueDate(existingTask.dueDate ? new Date(existingTask.dueDate).toISOString().split('T')[0] : '');
      setDocumentationLink(existingTask.documentationLink || '');
      setTags(existingTask.tags?.join(', ') || '');
    }
  }, [existingTask]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError('Необходимо авторизоваться');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      status: existingTask?.status || 'TODO' as TaskStatus,
      documentationLink: documentationLink || undefined,
      userId: session.user.id,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      await addTask(taskData);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueDate('');
      setDocumentationLink('');
      setTags('');
      onSubmit?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании задачи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 border border-muted/30 rounded-md bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-muted mb-1">
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
          <label htmlFor="description" className="block text-sm font-medium text-muted mb-1">
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
          <label htmlFor="documentationLink" className="block text-sm font-medium text-muted mb-1">
            Ссылка на документацию
          </label>
          <input
            type="url"
            id="documentationLink"
            value={documentationLink}
            onChange={(e) => setDocumentationLink(e.target.value)}
            className={inputClasses}
            placeholder="https://..."
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-muted mb-1">
            Приоритет
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className={inputClasses}
          >
            <option value="LOW">Низкий</option>
            <option value="MEDIUM">Средний</option>
            <option value="HIGH">Высокий</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-muted mb-1">
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
          <label htmlFor="dueDate" className="block text-sm font-medium text-muted mb-1">
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

        {error && (
          <div className="bg-red-500/10 text-red-400 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted hover:text-white"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Создание...' : existingTask ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
      </>
  );
}
