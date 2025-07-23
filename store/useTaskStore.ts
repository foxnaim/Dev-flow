import { create } from 'zustand';
import { Task, TaskStatus } from '../types/task';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
      // Маппинг _id -> id
      const mappedTasks = tasks.map((task: any) => ({ ...task, id: task._id }));
      set({ tasks: mappedTasks, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },

  addTask: async (task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          dueDate: task.dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      // Маппинг _id -> id
      set((state) => ({
        tasks: [...state.tasks, { ...newTask, id: newTask._id }],
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  },

  updateTask: async (id, updatedTask) => {
    try {
      // Найти задачу по id в состоянии, чтобы получить _id
      let realId = id;
      const state = useTaskStore.getState();
      const found = state.tasks.find((t) => t.id === id);
      // realId всегда равен id, так как _id не используется в типе Task
      const response = await fetch(`/api/tasks/${realId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTaskData = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...updatedTaskData, id: updatedTaskData._id } : task
        ),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  },

  deleteTask: async (id) => {
    try {
      // Найти задачу по id в состоянии, чтобы получить _id
      let realId = id;
      const state = useTaskStore.getState();
      const found = state.tasks.find((t) => t.id === id);
      // realId всегда равен id, так как _id не используется в типе Task
      const response = await fetch(`/api/tasks/${realId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  },
})); 
