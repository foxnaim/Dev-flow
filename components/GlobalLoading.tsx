"use client";

import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function GlobalLoading() {
  const { isLoading } = useAuth();

  if (!isLoading) return null;

  return <LoadingSpinner />;
} 
