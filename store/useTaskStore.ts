import { create } from 'zustand';
import { Task, TaskStatus } from '../types/task';
import { v4 as uuidv4 } from 'uuid';

// Интерфейс состояния хранилища задач
interface TaskState {
  // Список всех задач
  tasks: Task[];
  // Добавление новой задачи
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  // Обновление существующей задачи
  updateTask: (id: string, task: Partial<Task>) => void;
  // Удаление задачи
  deleteTask: (id: string) => void;
  // Перемещение задачи между статусами
  moveTask: (id: string, newStatus: TaskStatus) => void;
}

// Создание хранилища задач с помощью Zustand
export const useTaskStore = create<TaskState>((set) => ({
  // Список задач
  tasks: [],
  
  // Добавление новой задачи
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  })),

  // Обновление существующей задачи
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id
        ? { ...task, ...updatedTask, updatedAt: new Date() }
        : task
    ),
  })),

  // Удаление задачи
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),

  // Перемещение задачи между статусами
  moveTask: (id, newStatus) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus, updatedAt: new Date() } : task
    ),
  })),
}));
