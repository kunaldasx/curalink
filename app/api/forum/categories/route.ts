import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ForumCategory from '@/models/ForumCategory';
import User from '@/models/User';

// GET - View all categories (accessible to all authenticated users)
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

    const categories = await ForumCategory.find({ isActive: true })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category (RESEARCHER ONLY)
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
        { error: 'Forbidden: Only researchers can create categories' },
        { status: 403 }
      );
    }

    const { name, description, tags } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if category with same slug exists
    const existingCategory = await ForumCategory.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }

    // Create category
    const category = await ForumCategory.create({
      name,
      description,
      slug,
      createdBy: currentUser.id,
      moderators: [currentUser.id], // Creator is default moderator
      tags: tags || [],
    });

    const populatedCategory = await ForumCategory.findById(category._id)
      .populate('createdBy', 'name email role');

    return NextResponse.json({
      success: true,
      category: populatedCategory,
    }, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
