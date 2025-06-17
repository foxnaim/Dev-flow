import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import GlobalLoading from './global-loading';
import { AuthProvider } from './providers';
import { AppProvider } from '../contexts/AppContext';
import { ThemeProvider } from '../contexts/ThemeContext';

const montserrat = Montserrat({ subsets: ["cyrillic"], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: "DevFlow",
  description: "Personal task and code snippet manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru-en" suppressHydrationWarning>
      <body className={`${montserrat.variable}`}>
        <AuthProvider>
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeProvider>
              <AppProvider>
                <GlobalLoading />
                {children}
              </AppProvider>
            </ThemeProvider>
          </NextThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
