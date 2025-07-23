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
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query is required' }, { status: 400 });
  }

  try {
    const users = await User.find({
      $and: [
        { _id: { $ne: session.user.id } },
        {
          $or: [
            { email: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } },
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
          ]
        }
      ]
    }).select('-password -friendRequests -friends -createdAt -updatedAt');

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 
