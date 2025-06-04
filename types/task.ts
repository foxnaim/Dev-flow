// Типы для задач
export type TaskPriority = 'низкий' | 'средний' | 'высокий';
export type TaskStatus = 'к выполнению' | 'в процессе' | 'выполнено';

// Интерфейс задачи
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Интерфейс колонки канбан-доски
export interface TaskColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
