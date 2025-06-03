'use client';

import Layout from '../components/Layout';
import TaskBoard from '../components/TaskBoard';
import { ThemeProvider } from 'next-themes';

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout>
        <TaskBoard />
      </Layout>
    </ThemeProvider>
  );
}
