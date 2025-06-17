"use client";

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  text?: string;
}

export default function LoadingSpinner({ fullScreen = true, text = 'Loading...' }: LoadingSpinnerProps) {
  const content = (
    <div className="flex items-center gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {text}
      </span>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
        {content}
      </div>
    </div>
  );
} 
