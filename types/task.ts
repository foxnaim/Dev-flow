export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface TaskColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
