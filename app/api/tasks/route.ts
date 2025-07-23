import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

// GET /api/tasks - получить все задачи пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    const PROMO_FIT = process.env.NEXT_PUBLIC_PROMO_FIT?.split(',').map(e => e.trim().toLowerCase()) || [];
    const userEmail = session.user.email?.toLowerCase();
    let tasks;
    if (userEmail && PROMO_FIT.includes(userEmail)) {
      // Показываем все общие задачи + свои личные
      tasks = await Task.find({
        $or: [
          { sharedWithPromoFit: true },
          { userId: session.user.id }
        ]
      });
    } else {
      // Только свои задачи
      tasks = await Task.find({ userId: session.user.id });
    }
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/tasks - создать новую задачу
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const PROMO_FIT = process.env.NEXT_PUBLIC_PROMO_FIT?.split(',').map(e => e.trim().toLowerCase()) || [];
    const userEmail = session.user.email?.toLowerCase();
    const sharedWithPromoFit = userEmail && PROMO_FIT.includes(userEmail);

    const task = await Task.create({
      ...body,
      userId: session.user.id,
      sharedWithPromoFit,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
