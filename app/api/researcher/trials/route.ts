import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateSummary } from '@/utils/ai';
import dbConnect from '@/lib/mongodb';
import ClinicalTrial from '@/models/ClinicalTrial';

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
    const trials = await ClinicalTrial.find({ ownerResearcherId: currentUser.id });

    return NextResponse.json({ trials });
  } catch (error) {
    console.error('Get researcher trials error:', error);
    return NextResponse.json({ trials: [] }, { status: 500 });
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

    const { title, phase, status, condition, location, contactEmail, description } = await req.json();

    // Generate AI summary
    const summary = await generateSummary(title, description || '', 'trial');

    await dbConnect();

    const trial = await ClinicalTrial.create({
      title,
      phase,
      status,
      condition,
      location,
      contactEmail,
      summary,
      ownerResearcherId: currentUser.id,
    });

    return NextResponse.json({ success: true, trial });
  } catch (error) {
    console.error('Create trial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
