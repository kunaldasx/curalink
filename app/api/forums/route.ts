import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ForumThread from '@/models/ForumThread';
import ForumReply from '@/models/ForumReply';

export async function GET() {
  try {
    await dbConnect();

    const threads = await ForumThread.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    // Add reply count to each thread
    const threadsWithCounts = await Promise.all(
      threads.map(async (thread) => {
        const replyCount = await ForumReply.countDocuments({ threadId: thread._id });
        return {
          ...thread.toObject(),
          replyCount,
        };
      })
    );

    return NextResponse.json({ threads: threadsWithCounts });
  } catch (error) {
    console.error('Get threads error:', error);
    return NextResponse.json({ threads: [] }, { status: 500 });
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

    const { title, content, tags } = await req.json();

    await dbConnect();

    const thread = await ForumThread.create({
      title,
      content,
      userId: currentUser.id,
      tags: tags || [],
    });

    return NextResponse.json({ success: true, thread });
  } catch (error) {
    console.error('Create thread error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
