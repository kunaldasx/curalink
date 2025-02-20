import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ClinicalTrial from '@/models/ClinicalTrial';
import ForumThread from '@/models/ForumThread';
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

    // Count trials owned by researcher
    const trials = await ClinicalTrial.countDocuments({
      ownerResearcherId: currentUser.id,
    });

    // Count collaborators (favorites of type expert)
    const collaborators = await Favorite.countDocuments({
      userId: currentUser.id,
      refType: 'expert',
    });

    // Count forum threads (all threads are pending questions)
    const pendingQuestions = await ForumThread.countDocuments();

    return NextResponse.json({
      trials,
      collaborators,
      pendingQuestions,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { trials: 0, collaborators: 0, pendingQuestions: 0 },
      { status: 500 }
    );
  }
}
