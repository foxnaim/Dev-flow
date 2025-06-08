import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import GlobalLoading from './global-loading';
import { AuthProvider } from './providers';

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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GlobalLoading />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
