import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Import Message model
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

// Import User model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

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

    // Get all messages involving current user
    const messages = await Message.find({
      $or: [
        { sender: currentUser.id },
        { recipient: currentUser.id },
      ],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .lean();

    // Group messages by conversation partner
    const conversationsMap = new Map();

    for (const msg of messages) {
      // Determine the other user
      const otherUser = msg.sender._id.toString() === currentUser.id 
        ? msg.recipient 
        : msg.sender;
      
      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        // Count unread messages from this user
        const unreadCount = await Message.countDocuments({
          sender: otherUserId,
          recipient: currentUser.id,
          read: false,
        });

        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUser.name,
          userRole: otherUser.role,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount,
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    );
  }
}
