export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'backlog' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface TaskColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
