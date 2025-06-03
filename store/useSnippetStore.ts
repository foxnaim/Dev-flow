import { create } from 'zustand';
import { Snippet } from '../types/snippet';

interface SnippetStore {
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSnippet: (id: string, snippet: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
}

export const useSnippetStore = create<SnippetStore>((set) => ({
  snippets: [],

  addSnippet: (snippet) => set((state) => ({
    snippets: [...state.snippets, {
      ...snippet,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  })),

  updateSnippet: (id, updatedSnippet) => set((state) => ({
    snippets: state.snippets.map((s) =>
      s.id === id
        ? { ...s, ...updatedSnippet, updatedAt: new Date() }
        : s
    ),
  })),

  deleteSnippet: (id) => set((state) => ({
    snippets: state.snippets.filter((s) => s.id !== id),
  })),
})); 
