import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

// GET /api/tasks/[id] - получить задачу по ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const task = await Task.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/tasks/[id] - обновить задачу
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - удалить задачу
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    const task = await Task.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!task) {
      return new NextResponse('Task not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    // Получаем задачу
    const task = await Task.findById(params.id);
    if (!task) {
      return new NextResponse('Task not found', { status: 404 });
    }

    // Проверяем доступ: владелец или PROMO_FIT
    const PROMO_FIT = process.env.NEXT_PUBLIC_PROMO_FIT?.split(',').map(e => e.trim().toLowerCase()) || [];
    const userEmail = session.user.email?.toLowerCase();
    const isPromoFit = userEmail && PROMO_FIT.includes(userEmail);
    const isOwner = task.userId === session.user.id;
    const isSharedPromoFit = task.sharedWithPromoFit === true;

    if (!(isOwner || (isPromoFit && isSharedPromoFit))) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Обновляем задачу
    const updatedTask = await Task.findOneAndUpdate(
      { _id: params.id },
      { $set: body },
      { new: true }
    );

    if (!updatedTask) {
      return new NextResponse('Task not found', { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
