"use client";
import React, { createContext, useContext } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

interface ThemeContextType {
  language: string;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useNextTheme();
  const language = 'ru'; // You can make this dynamic based on user preferences

  return (
    <ThemeContext.Provider value={{ language, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
