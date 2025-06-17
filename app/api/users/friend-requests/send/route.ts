import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import User from '../../../../../models/User';
import connectDB from '../../../../../lib/mongodb';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { recipientId } = await req.json();

  if (!recipientId) {
    return NextResponse.json({ message: 'Recipient ID is required' }, { status: 400 });
  }

  await connectDB();

  try {
    const senderId = session.user.id;

    // Find sender and recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if they are already friends
    if (sender.friends.includes(recipientId)) {
      return NextResponse.json({ message: 'Already friends' }, { status: 400 });
    }

    // Check if a friend request already exists from sender to recipient
    if (recipient.friendRequests.includes(senderId)) {
      return NextResponse.json({ message: 'Friend request already sent' }, { status: 400 });
    }

    // Check if recipient has already sent a request to sender (mutual request)
    if (sender.friendRequests.includes(recipientId)) {
      // If recipient already sent a request, automatically accept it
      sender.friends.push(recipientId);
      recipient.friends.push(senderId);
      sender.friendRequests = sender.friendRequests.filter(
        (id: any) => id.toString() !== recipientId
      );
      await sender.save();
      await recipient.save();
      return NextResponse.json({ message: 'Friend request accepted automatically' }, { status: 200 });
    }

    // Send new friend request
    recipient.friendRequests.push(senderId);
    await recipient.save();

    return NextResponse.json({ message: 'Friend request sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 
