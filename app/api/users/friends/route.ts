import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import User from '../../../../models/User';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  try {
    const user = await User.findById(session.user.id).populate(
      'friends',
      '_id email username firstName lastName photoUrl'
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 
