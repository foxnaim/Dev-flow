import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import User from '../../../../models/User';
import { connectDB } from '../../../../lib/mongodb';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { senderId, action } = await req.json();

  if (!senderId || !action || !['accept', 'reject'].includes(action)) {
    return NextResponse.json({ message: 'Invalid request parameters' }, { status: 400 });
  }

  await connectDB();

  try {
    const recipientId = session.user.id;

    const recipient = await User.findById(recipientId);
    const sender = await User.findById(senderId);

    if (!recipient || !sender) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the friend request exists
    const requestIndex = recipient.friendRequests.findIndex(
      (id: any) => id.toString() === senderId
    );

    if (requestIndex === -1) {
      return NextResponse.json({ message: 'Friend request not found' }, { status: 404 });
    }

    if (action === 'accept') {
      // Add to friends list for both users
      if (!recipient.friends.includes(senderId)) {
        recipient.friends.push(senderId);
      }
      if (!sender.friends.includes(recipientId)) {
        sender.friends.push(recipientId);
      }
    }

    // Remove the friend request
    recipient.friendRequests.splice(requestIndex, 1);

    await recipient.save();
    await sender.save();

    return NextResponse.json({ message: `Friend request ${action}ed` }, { status: 200 });
  } catch (error) {
    console.error('Error responding to friend request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 
