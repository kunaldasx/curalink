import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ForumReply from '@/models/ForumReply';
import ForumTopic from '@/models/ForumTopic';
import User from '@/models/User';

// POST - Create reply (RESEARCHER ONLY)
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

    // Verify user is a researcher
    const user = await User.findById(currentUser.id);
    
    if (!user || user.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Forbidden: Only researchers can reply to topics' },
        { status: 403 }
      );
    }

    const { topicId, content } = await req.json();

    if (!topicId || !content) {
      return NextResponse.json(
        { error: 'Topic ID and content are required' },
        { status: 400 }
      );
    }

    // Verify topic exists
    const topic = await ForumTopic.findById(topicId);
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Content sanitization
    const sanitizedContent = content.trim();

    if (sanitizedContent.length < 10 || sanitizedContent.length > 10000) {
      return NextResponse.json(
        { error: 'Reply must be between 10 and 10,000 characters' },
        { status: 400 }
      );
    }

    // Rate limiting (max 20 replies per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRepliesCount = await ForumReply.countDocuments({
      authorId: currentUser.id,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentRepliesCount >= 20) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before replying again.' },
        { status: 429 }
      );
    }

    // Create reply
    const reply = await ForumReply.create({
      topicId,
      authorId: currentUser.id,
      content: sanitizedContent,
      isVerified: true, // All researcher replies are verified
    });

    // Update topic reply count and last activity
    await ForumTopic.findByIdAndUpdate(topicId, {
      $inc: { replyCount: 1 },
      lastActivityAt: new Date(),
    });

    const populatedReply = await ForumReply.findById(reply._id)
      .populate('authorId', 'name role email');

    return NextResponse.json({
      success: true,
      reply: populatedReply,
    }, { status: 201 });
  } catch (error) {
    console.error('Create reply error:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}
