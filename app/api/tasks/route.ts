import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

// GET /api/tasks - получить все задачи пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in GET /api/tasks:', session);
    
    if (!session?.user?.id) {
      console.log('No user ID in session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    console.log('Fetching tasks for user:', session.user.id);
    const tasks = await Task.find({ userId: session.user.id });
    console.log('Found tasks:', tasks);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/tasks - создать новую задачу
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in POST /api/tasks:', session);
    
    if (!session?.user?.id) {
      console.log('No user ID in session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Creating task with body:', body);
    await connectDB();

    const task = await Task.create({
      ...body,
      userId: session.user.id,
    });
    console.log('Created task:', task);

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
