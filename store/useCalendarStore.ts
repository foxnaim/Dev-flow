import { create } from 'zustand';
import { CalendarEvent } from '../types/event';

interface CalendarStore {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],

  addEvent: (event) => set((state) => ({
    events: [...state.events, {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  })),

  updateEvent: (id, updatedEvent) => set((state) => ({
    events: state.events.map((e) =>
      e.id === id
        ? { ...e, ...updatedEvent, updatedAt: new Date() }
        : e
    ),
  })),

  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((e) => e.id !== id),
  })),
})); 
