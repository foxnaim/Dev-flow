'use client';

import Layout from '../components/Layout';
import TaskBoard from '../components/TaskBoard';
import { useSession } from 'next-auth/react';

const PROMO_FIT = process.env.NEXT_PUBLIC_PROMO_FIT?.split(',').map(e => e.trim().toLowerCase()) || [];

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;
  return (
    <Layout>
      <TaskBoard />
    </Layout>
  );
}
