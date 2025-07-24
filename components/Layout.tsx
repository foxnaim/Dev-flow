import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CheckSquare,
  Code,
  FileText,
  Moon,
  Sun
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

// Пропсы для компонента Layout
interface LayoutProps {
  children: ReactNode;
}

// Навигационные элементы с иконками и метками
const navItems = [
  { href: '/', icon: CheckSquare, label: 'Задачи' },
  { href: '/calendar', icon: Calendar, label: 'Календарь' },
  { href: '/notes', icon: FileText, label: 'Заметки' },
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Предотвращаем гидратацию с неправильной темой
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      {/* Основной контент с анимацией перехода */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={pathname} // Ключ для AnimatePresence, меняется при смене маршрута
          className="flex-1 pb-20 md:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {React.cloneElement(children as React.ReactElement, {
            onModalStateChange: setIsTaskModalOpen
          })}
        </motion.main>
      </AnimatePresence>

      {/* Нижняя навигационная панель */}
      {!isTaskModalOpen && (
        <nav className="fixed bottom-7 left-1/2 -translate-x-1/2 border border-border bg-surface text-foreground rounded-full px-6 py-3 flex justify-around items-center gap-6 z-50 shadow-lg w-[calc(100%-2rem)] max-w-sm">
        {/* Навигационные ссылки */}
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'p-2 rounded-full transition-colors duration-200',
              pathname === item.href
                ? 'bg-accent text-white'
                : 'text-secondary-text hover:text-foreground'
            )}
            aria-label={item.label}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        ))}

        {/* Кнопка переключения темы */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full transition-colors duration-200 text-secondary-text hover:text-foreground"
          aria-label="Переключить тему"
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </nav>
      )}
    </div>
  );
}
