import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ForumTopic from '@/models/ForumTopic';
import ForumReply from '@/models/ForumReply';
import User from '@/models/User';

// GET - View single topic with replies
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const topic = await ForumTopic.findById(params.id)
      .populate('authorId', 'name role email')
      .populate('category', 'name slug description')
      .lean();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Don't show hidden topics to patients
    const user = await User.findById(currentUser.id);
    if (topic.isHidden && user?.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await ForumTopic.findByIdAndUpdate(params.id, {
      $inc: { viewCount: 1 },
    });

    // Get replies (only from researchers, not hidden)
    const replies = await ForumReply.find({
      topicId: params.id,
      isHidden: false,
    })
      .populate('authorId', 'name role email')
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      topic: { ...topic, viewCount: (topic.viewCount || 0) + 1 },
      replies,
    });
  } catch (error) {
    console.error('Get topic error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

// PATCH - Update topic (author or researcher moderator only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(currentUser.id);
    const topic = await ForumTopic.findById(params.id);

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const { action, content, title, isResolved, isHidden, isPinned, flagReason } = await req.json();

    // Check permissions
    const isAuthor = topic.authorId.toString() === currentUser.id;
    const isResearcher = user?.role === 'researcher';

    if (action === 'edit') {
      // Only author can edit their own topic
      if (!isAuthor) {
        return NextResponse.json(
          { error: 'Forbidden: You can only edit your own topics' },
          { status: 403 }
        );
      }

      const updates: any = {};
      if (title) updates.title = title.trim();
      if (content) updates.content = content.trim();

      await ForumTopic.findByIdAndUpdate(params.id, updates);

      return NextResponse.json({ success: true });
    }

    if (action === 'moderate') {
      // Only researchers can moderate
      if (!isResearcher) {
        return NextResponse.json(
          { error: 'Forbidden: Only researchers can moderate content' },
          { status: 403 }
        );
      }

      const updates: any = {};
      if (typeof isResolved === 'boolean') updates.isResolved = isResolved;
      if (typeof isHidden === 'boolean') updates.isHidden = isHidden;
      if (typeof isPinned === 'boolean') updates.isPinned = isPinned;
      if (isHidden && flagReason) {
        updates.isFlagged = true;
        updates.flagReason = flagReason;
      }

      await ForumTopic.findByIdAndUpdate(params.id, updates);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update topic error:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    );
  }
}

// DELETE - Delete topic (author or researcher moderator only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(currentUser.id);
    const topic = await ForumTopic.findById(params.id);

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const isAuthor = topic.authorId.toString() === currentUser.id;
    const isResearcher = user?.role === 'researcher';

    if (!isAuthor && !isResearcher) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own topics or moderate as researcher' },
        { status: 403 }
      );
    }

    // Delete all replies
    await ForumReply.deleteMany({ topicId: params.id });

    // Delete topic
    await ForumTopic.findByIdAndDelete(params.id);

    // Update category topic count
    await dbConnect();
    const ForumCategory = (await import('@/models/ForumCategory')).default;
    await ForumCategory.findByIdAndUpdate(topic.category, {
      $inc: { topicCount: -1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete topic error:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}
