import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'patient') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { expertId } = await req.json();

    if (!expertId) {
      return NextResponse.json(
        { error: 'Expert ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Add expert to patient's following list
    await User.findByIdAndUpdate(currentUser.id, {
      $addToSet: { followingExperts: expertId },
    });

    // Add patient to expert's followers list (if expert is on platform)
    await User.findByIdAndUpdate(expertId, {
      $addToSet: { followers: currentUser.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully followed expert' 
    });
  } catch (error) {
    console.error('Follow expert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'patient') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { expertId } = await req.json();

    if (!expertId) {
      return NextResponse.json(
        { error: 'Expert ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Remove expert from patient's following list
    await User.findByIdAndUpdate(currentUser.id, {
      $pull: { followingExperts: expertId },
    });

    // Remove patient from expert's followers list
    await User.findByIdAndUpdate(expertId, {
      $pull: { followers: currentUser.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Unfollowed expert' 
    });
  } catch (error) {
    console.error('Unfollow expert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
