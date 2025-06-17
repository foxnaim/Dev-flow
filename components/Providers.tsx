"use client";

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as AppThemeProvider } from '../contexts/ThemeContext';
import { AppProvider } from '../contexts/AppContext';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppThemeProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </AppThemeProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 
