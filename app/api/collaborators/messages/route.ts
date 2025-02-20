import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Connection from '@/models/Connection';
import User from '@/models/User';

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
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Optional: Verify they are connected (commenting out to allow meeting-based chats)
    // const connection = await Connection.findOne({
    //   $or: [
    //     { requester: currentUser.id, recipient: otherUserId, status: 'accepted' },
    //     { requester: otherUserId, recipient: currentUser.id, status: 'accepted' },
    //   ],
    // });

    // if (!connection) {
    //   return NextResponse.json(
    //     { error: 'You must be connected to chat' },
    //     { status: 403 }
    //   );
    // }

    // Get messages between users
    const messages = await Message.find({
      $or: [
        { sender: currentUser.id, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUser.id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read
    await Message.updateMany(
      {
        sender: otherUserId,
        recipient: currentUser.id,
        read: false,
      },
      { read: true }
    );

    return NextResponse.json({
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
    // Support both parameter names for compatibility
    const recipientId = body.recipientId || body.toUserId;
    const content = body.content || body.message;

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: 'Recipient ID and content/message are required' },
        { status: 400 }
      );
    }

    // Optional: Verify they are connected (commenting out to allow meeting-based chats)
    // This allows patients and researchers to chat after meeting acceptance
    // const connection = await Connection.findOne({
    //   $or: [
    //     { requester: currentUser.id, recipient: recipientId, status: 'accepted' },
    //     { requester: recipientId, recipient: currentUser.id, status: 'accepted' },
    //   ],
    // });

    // if (!connection) {
    //   return NextResponse.json(
    //     { error: 'You must be connected to send messages' },
    //     { status: 403 }
    //   );
    // }

    // Create message
    const message = await Message.create({
      sender: currentUser.id,
      recipient: recipientId,
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
