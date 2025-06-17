"use client";

import React, { createContext, useContext } from 'react';
import { useTaskStore } from '../store/useTaskStore';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

interface AppContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();

  return (
    <AppContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 
