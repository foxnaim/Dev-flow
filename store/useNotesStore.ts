import { create } from 'zustand';
import { Note, NoteFormData } from '../types/notes';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (note: NoteFormData) => Promise<void>;
  updateNote: (id: string, note: Partial<NoteFormData>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/notes', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch notes');
      }
      const notes = await response.json();
      const transformedNotes = notes.map((note: any) => ({
        ...note,
        id: note._id,
      }));
      set({ notes: transformedNotes, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch notes', isLoading: false });
      throw error;
    }
  },

  addNote: async (noteData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create note');
      }
      const newNote = await response.json();
      set((state) => ({
        notes: [...state.notes, { ...newNote, id: newNote._id }],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create note', isLoading: false });
      throw error;
    }
  },

  updateNote: async (id, noteData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update note');
      }
      const updated = await response.json();
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...updated, id: updated._id } : note
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update note', isLoading: false });
      throw error;
    }
  },

  deleteNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete note');
      }
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete note', isLoading: false });
      throw error;
    }
  },
})); 
