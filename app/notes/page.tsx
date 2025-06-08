'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
import { useNotesStore } from '../../store/useNotesStore';
import { Note, NoteFormData } from '../../types/notes';
import NoteModal from '../../components/NoteModal';
import { motion } from 'framer-motion';

// Импорт иконки из react-icons
import { FiTrash2 } from 'react-icons/fi';
import { Edit } from 'lucide-react';
import { Trash2 } from 'lucide-react';

export default function NotesPage() {
  // Получаем функции и состояние из хранилища заметок
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

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
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Заголовок страницы и кнопка создания */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Заметки</h1>
          <button
            onClick={() => setIsNewNoteModalOpen(true)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
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
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-surface rounded-lg shadow-sm border border-border p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-foreground break-words">{note.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setIsNewNoteModalOpen(true);
                      }}
                      className="p-1 hover:bg-surface/80 rounded"
                    >
                      <Edit className="w-4 h-4 text-secondary-text" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 hover:bg-surface/80 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                </div>
                <p className="text-secondary-text break-words whitespace-pre-wrap">{note.content}</p>
                <div className="mt-4 text-xs text-secondary-text">
                  {new Date(note.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Модальное окно для создания/редактирования заметки */}
        <NoteModal
          isOpen={isNewNoteModalOpen}
          onClose={() => {
            setIsNewNoteModalOpen(false);
            setSelectedNote(null);
          }}
          onSubmit={handleSubmit}
          note={editingNote || undefined}
        />
      </motion.div>
    </Layout>
  );
} 
