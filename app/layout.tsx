import { Providers } from '../components/Providers';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ["cyrillic"], variable: '--font-montserrat' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru-en" suppressHydrationWarning>
      <body className={`${montserrat.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
