import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ForumTopic from '@/models/ForumTopic';
import ForumCategory from '@/models/ForumCategory';
import User from '@/models/User';

// GET - View topics in a category (accessible to all authenticated users)
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const sortBy = searchParams.get('sortBy') || 'recent'; // recent, oldest, most-answered

    await dbConnect();

    const query: any = { isHidden: false };
    
    if (categoryId) {
      query.category = categoryId;
    }

    let sortOption: any = {};
    switch (sortBy) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'most-answered':
        sortOption = { replyCount: -1, lastActivityAt: -1 };
        break;
      case 'recent':
      default:
        sortOption = { isPinned: -1, lastActivityAt: -1 };
    }

    const topics = await ForumTopic.find(query)
      .populate('authorId', 'name role')
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(50)
      .lean();

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

// POST - Create new topic (Both patients and researchers can create)
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

    const user = await User.findById(currentUser.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { categoryId, title, content, tags } = await req.json();

    if (!categoryId || !title || !content) {
      return NextResponse.json(
        { error: 'Category, title, and content are required' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await ForumCategory.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Content sanitization (basic)
    const sanitizedContent = content.trim();
    const sanitizedTitle = title.trim();

    if (sanitizedTitle.length < 10 || sanitizedTitle.length > 300) {
      return NextResponse.json(
        { error: 'Title must be between 10 and 300 characters' },
        { status: 400 }
      );
    }

    if (sanitizedContent.length < 20 || sanitizedContent.length > 10000) {
      return NextResponse.json(
        { error: 'Content must be between 20 and 10,000 characters' },
        { status: 400 }
      );
    }

    // Rate limiting check (simple - max 5 topics per hour per user)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentTopicsCount = await ForumTopic.countDocuments({
      authorId: currentUser.id,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentTopicsCount >= 5) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before posting again.' },
        { status: 429 }
      );
    }

    // Create topic
    const topic = await ForumTopic.create({
      category: categoryId,
      title: sanitizedTitle,
      content: sanitizedContent,
      authorId: currentUser.id,
      authorRole: user.role,
      tags: tags || [],
      lastActivityAt: new Date(),
    });

    // Update category topic count
    await ForumCategory.findByIdAndUpdate(categoryId, {
      $inc: { topicCount: 1 },
    });

    const populatedTopic = await ForumTopic.findById(topic._id)
      .populate('authorId', 'name role')
      .populate('category', 'name slug');

    return NextResponse.json({
      success: true,
      topic: populatedTopic,
    }, { status: 201 });
  } catch (error) {
    console.error('Create topic error:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
