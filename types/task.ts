// Типы для задач
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// Интерфейс задачи
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  documentationLink?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Интерфейс колонки канбан-доски
export interface TaskColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
