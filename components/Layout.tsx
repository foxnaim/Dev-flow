import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CheckSquare,
  Code,
  FileText,
  Moon,
  Sun,
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/', icon: CheckSquare },
  { href: '/snippets', icon: Code },
  { href: '/calendar', icon: Calendar },
  { href: '/notes', icon: FileText },
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <nav className="fixed bottom-7 left-1/2 -translate-x-1/2 border-blue-200 bg-blue-50  dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-white rounded-full px-6 py-3 flex justify-around items-center gap-6 z-50 shadow-lg w-[calc(100%-2rem)] max-w-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'p-2 rounded-full transition-colors duration-200',
              pathname === item.href
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-400 hover:text-gray-200'
            )}
            aria-label={item.href === '/' ? 'Tasks' : item.href.substring(1).charAt(0).toUpperCase() + item.href.substring(2)}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        ))}

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </nav>

    </div>
  );
}
