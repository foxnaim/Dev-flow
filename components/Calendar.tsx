"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../utils/translations';
import { Button } from '../components/ui/button';
import { FadeIn, ScaleIn } from '../components/ui/transitions';
import { CalendarSkeleton } from '../components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor,
  DragStartEvent
} from '@dnd-kit/core';
import { DraggableTask } from './DraggableTask';
import { Task } from '../types/task';
import { useTaskStore } from '../store/useTaskStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
}

export const Calendar: React.FC = () => {
  const { tasks, addTask, updateTask, fetchTasks, isLoading, error } = useTaskStore();
  const { language } = useTheme();
  const t = useTranslation(language);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date(),
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasks().catch(error => {
        console.error('Error loading tasks:', error);
      });
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, fetchTasks, router]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setTaskFormData(prev => ({ ...prev, dueDate: date }));
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      ...taskFormData,
      status: 'TODO',
      dueDate: taskFormData.dueDate.toISOString(),
    });
    setIsTaskFormOpen(false);
    setTaskFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date(),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newDate = new Date(over.id as string);
      
      updateTask(taskId, { dueDate: newDate.toISOString() });
    }
    
    setActiveTask(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActiveTask(task);
    }
  };

  if (status === 'loading' || isLoading) {
    return <CalendarSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">Ошибка</div>
          <p className="text-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const monthNames = language === 'ru' 
    ? ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = language === 'ru' 
    ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="container mx-auto px-4 py-6">
      <FadeIn>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                {language === 'ru' ? 'Сегодня' : 'Today'}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-slate-700">
            {dayNames.map(day => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <div className="grid grid-cols-7">
              {/* Empty cells for days before the first day of the month */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="p-2 h-24 border-r border-b border-gray-100 dark:border-slate-700" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isToday = date.toDateString() === today.toDateString();
                const dayTasks = getTasksForDate(date);

                return (
                  <motion.div
                    key={date.toISOString()}
                    id={date.toISOString()}
                    className="p-2 h-24 border-r border-b border-gray-100 dark:border-slate-700 relative group hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => handleDateClick(date)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday 
                        ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {day}
                    </div>
                    
                    <div className="space-y-1">
                      <AnimatePresence>
                        {dayTasks.slice(0, 2).map(task => (
                          <DraggableTask
                            key={`${task.id}-${task.dueDate}`}
                            task={task}
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              // Здесь можно добавить обработку клика по задаче
                            }}
                          />
                        ))}
                      </AnimatePresence>
                      
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayTasks.length - 2} {t('more')}
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute bottom-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDateClick(date);
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="text-xs p-1 rounded bg-white shadow-lg">
                  {activeTask.title}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </FadeIn>

      {/* Task Form Modal */}
      <AnimatePresence>
        {isTaskFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsTaskFormOpen(false)}
          >
            <ScaleIn>
              <div
                className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {language === 'ru' ? 'Новая задача' : 'New Task'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsTaskFormOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'ru' ? 'Название' : 'Title'}
                    </label>
                    <input
                      type="text"
                      value={taskFormData.title}
                      onChange={e => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'ru' ? 'Описание' : 'Description'}
                    </label>
                    <textarea
                      value={taskFormData.description}
                      onChange={e => setTaskFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'ru' ? 'Приоритет' : 'Priority'}
                    </label>
                    <select
                      value={taskFormData.priority}
                      onChange={e => setTaskFormData(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      <option value="high">{language === 'ru' ? 'Высокий' : 'High'}</option>
                      <option value="medium">{language === 'ru' ? 'Средний' : 'Medium'}</option>
                      <option value="low">{language === 'ru' ? 'Низкий' : 'Low'}</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full">
                    {language === 'ru' ? 'Создать задачу' : 'Create Task'}
                  </Button>
                </form>
              </div>
            </ScaleIn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 
