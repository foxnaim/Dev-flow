'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
import { useNotesStore } from '../../store/useNotesStore';
import { Note, NoteFormData } from '../../types/notes';
import NoteModal from '../../components/NoteModal';

export default function NotesPage() {
  // Получаем функции и состояние из хранилища заметок
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Обработчик создания/обновления заметки
  const handleSubmit = (data: NoteFormData) => {
    if (selectedNote) {
      updateNote(selectedNote.id, data);
    } else {
      addNote(data);
    }
    setSelectedNote(null);
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Заголовок страницы и кнопка создания */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Заметки</h1>
          <button
            onClick={() => {
              setSelectedNote(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Новая заметка
          </button>
        </div>

        {/* Список заметок или сообщение об отсутствии заметок */}
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">У вас пока нет заметок. Создайте первую!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Карточки заметок */}
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedNote(note);
                  setIsModalOpen(true);
                }}
              >
                {/* Заголовок заметки */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{note.title}</h3>
                {/* Предпросмотр содержания */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {note.content}
                </p>
                {/* Информация о заметке и кнопка удаления */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Модальное окно для создания/редактирования заметки */}
        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNote(null);
          }}
          onSubmit={handleSubmit}
          note={selectedNote || undefined}
        />
      </div>
    </Layout>
  );
} 
