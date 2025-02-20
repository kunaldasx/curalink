import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const favorites = await Favorite.find({ userId: currentUser.id });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json({ favorites: [] }, { status: 500 });
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

    const { refType, refId } = await req.json();

    await dbConnect();

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: currentUser.id,
      refType,
      refId,
    });

    if (existing) {
      // Remove favorite
      await Favorite.deleteOne({ _id: existing._id });
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      // Add favorite
      await Favorite.create({
        userId: currentUser.id,
        refType,
        refId,
      });
      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
