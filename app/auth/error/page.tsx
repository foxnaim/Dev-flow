'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-6xl font-bold text-red-500 mb-4">!</div>
          <h1 className="text-2xl font-semibold text-white mb-4">
            Ошибка авторизации
          </h1>
          <p className="text-slate-400">
            Произошла ошибка при попытке входа. Пожалуйста, попробуйте снова.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Вернуться на страницу входа
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 
