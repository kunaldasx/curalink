import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import MeetingRequest from '@/models/MeetingRequest';

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

    // Get requests for or from current user
    const requests = await MeetingRequest.find({
      $or: [
        { fromPatientId: currentUser.id },
        { toResearcherId: currentUser.id },
      ],
    })
      .populate('fromPatientId', 'name email')
      .populate('toResearcherId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Get meeting requests error:', error);
    return NextResponse.json({ requests: [] }, { status: 500 });
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

    const { toResearcherId, message } = await req.json();

    await dbConnect();

    const request = await MeetingRequest.create({
      fromPatientId: currentUser.id,
      toResearcherId,
      message,
      status: 'pending',
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    console.error('Create meeting request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
