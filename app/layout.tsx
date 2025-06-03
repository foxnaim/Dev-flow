import type { Metadata } from "next";
import { Montserrat, Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const montserrat = Montserrat({ subsets: ["cyrillic"], variable: '--font-montserrat' });
const nunito = Nunito({ subsets: ["cyrillic"], variable: '--font-nunito' });

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
      <body className={`${nunito.className} ${montserrat.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
