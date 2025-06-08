import { create } from 'zustand';
import { Task, TaskStatus } from '../types/task';

// Интерфейс состояния хранилища задач
interface TaskState {
  // Список всех задач
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  // Загрузка задач
  fetchTasks: () => Promise<void>;
  // Добавление новой задачи
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  // Обновление существующей задачи
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  // Удаление задачи
  deleteTask: (id: string) => Promise<void>;
  // Перемещение задачи между статусами
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
}

// Создание хранилища задач с помощью Zustand
export const useTaskStore = create<TaskState>((set, get) => ({
  // Список задач
  tasks: [],
  isLoading: false,
  error: null,
  
  // Загрузка задач
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch tasks');
      }
      const tasks = await response.json();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch tasks', isLoading: false });
    }
  },

  // Добавление новой задачи
  addTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }
      const newTask = await response.json();
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create task', isLoading: false });
    }
  },

  // Обновление существующей задачи
  updateTask: async (id, updatedTask) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update task');
      }
      const updated = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updated : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update task', isLoading: false });
    }
  },

  // Удаление задачи
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete task');
      }
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete task', isLoading: false });
    }
  },

  // Перемещение задачи между статусами
  moveTask: async (id, newStatus) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to move task');
      }
      const updated = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updated : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to move task', isLoading: false });
    }
  },
})); 
