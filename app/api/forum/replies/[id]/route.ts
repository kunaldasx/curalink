import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ForumReply from '@/models/ForumReply';
import User from '@/models/User';

// PATCH - Update reply (author researcher or moderator only)
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
    
    if (!user || user.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Forbidden: Only researchers can edit replies' },
        { status: 403 }
      );
    }

    const reply = await ForumReply.findById(params.id);

    if (!reply) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      );
    }

    const { action, content, isHidden, flagReason } = await req.json();

    if (action === 'edit') {
      // Only author can edit their own reply
      if (reply.authorId.toString() !== currentUser.id) {
        return NextResponse.json(
          { error: 'Forbidden: You can only edit your own replies' },
          { status: 403 }
        );
      }

      if (!content) {
        return NextResponse.json(
          { error: 'Content is required' },
          { status: 400 }
        );
      }

      await ForumReply.findByIdAndUpdate(params.id, {
        content: content.trim(),
        editedAt: new Date(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'moderate') {
      // Any researcher can moderate
      const updates: any = {};
      if (typeof isHidden === 'boolean') updates.isHidden = isHidden;
      if (isHidden && flagReason) {
        updates.isFlagged = true;
        updates.flagReason = flagReason;
      }

      await ForumReply.findByIdAndUpdate(params.id, updates);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update reply error:', error);
    return NextResponse.json(
      { error: 'Failed to update reply' },
      { status: 500 }
    );
  }
}

// DELETE - Delete reply (author researcher or moderator only)
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
    
    if (!user || user.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Forbidden: Only researchers can delete replies' },
        { status: 403 }
      );
    }

    const reply = await ForumReply.findById(params.id);

    if (!reply) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      );
    }

    const isAuthor = reply.authorId.toString() === currentUser.id;

    if (!isAuthor && user.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete reply
    await ForumReply.findByIdAndDelete(params.id);

    // Update topic reply count
    const ForumTopic = (await import('@/models/ForumTopic')).default;
    await ForumTopic.findByIdAndUpdate(reply.topicId, {
      $inc: { replyCount: -1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete reply error:', error);
    return NextResponse.json(
      { error: 'Failed to delete reply' },
      { status: 500 }
    );
  }
}
