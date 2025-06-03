// Приоритет задачи
export type Priority = 'low' | 'medium' | 'high';

// Статус задачи
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// Интерфейс задачи
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

// Интерфейс колонки канбан-доски
export interface TaskColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
