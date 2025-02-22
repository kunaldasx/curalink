import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

// GET /api/messages?userId=xxx - Fetch messages with a specific user
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: currentUser.id, recipient: userId },
        { sender: userId, recipient: currentUser.id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        recipient: currentUser.id,
        read: false,
      },
      { read: true }
    );

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a new message
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const receiverId = body.receiverId;
    const content = body.content;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver ID and content are required' },
        { status: 400 }
      );
    }

    // Create message
    const message = await Message.create({
      sender: currentUser.id,
      recipient: receiverId,
      content,
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
