import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '../../../../models/User';
import connectDB from '../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const emailQuery = searchParams.get('email');

  if (!emailQuery) {
    return NextResponse.json({ message: 'Email query is required' }, { status: 400 });
  }

  try {
    const users = await User.find({
      email: { $regex: emailQuery, $options: 'i' },
      _id: { $ne: session.user.id }, // Exclude the current user
    }).select('-password -friendRequests -friends -createdAt -updatedAt'); // Exclude sensitive fields

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 
