'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитируем минимальное время загрузки
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return <LoadingSpinner />;
} 
