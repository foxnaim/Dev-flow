'use client';
import { useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/Calendar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CalendarPage() {
  const { fetchTasks, isLoading, error } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading) {
    return <LoadingSpinner text="Загрузка задач..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">Ошибка</div>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Calendar />
    </Layout>
  );
} 
