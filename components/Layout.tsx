import { ReactNode } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Calendar, CheckSquare, Code, FileText, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/', icon: CheckSquare, label: 'Tasks' },
  { href: '/snippets', icon: Code, label: 'Snippets' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/notes', icon: FileText, label: 'Notes' },
];

export default function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DevFlow</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-200" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
