import { useState, useEffect } from 'react';
import { Note, NoteFormData } from '../types/notes';
import Modal from './Modal'; // Импортируем базовый компонент Modal

// Пропсы для модального окна заметки
interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NoteFormData) => void;
  note?: Note;
}

export default function NoteModal({ isOpen, onClose, onSubmit, note }: NoteModalProps) {
  // Состояние формы
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    tags: [],
  });

  // Обновляем форму при изменении заметки
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags || [],
      });
    } else {
      setFormData({
        title: '',
        content: '',
        tags: [],
      });
    }
  }, [note]);

  if (!isOpen) return null;

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    // Используем базовый компонент Modal для отображения модального окна
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? 'Редактировать заметку' : 'Новая заметка'} // Заголовок передаем в Modal
    >
      {/* Содержимое формы заметки */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
            Заголовок
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
            Содержание
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            rows={6}
            required
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
            {note ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 
