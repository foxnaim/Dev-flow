import { create } from 'zustand';
import { Note, NoteFormData } from '../types/notes';

interface NotesState {
  notes: Note[];
  addNote: (note: NoteFormData) => void;
  updateNote: (id: string, note: Partial<NoteFormData>) => void;
  deleteNote: (id: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  addNote: (noteData) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ notes: [...state.notes, newNote] }));
  },
  updateNote: (id, noteData) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, ...noteData, updatedAt: new Date() }
          : note
      ),
    }));
  },
  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },
})); 
