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
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      title, 
      phase, 
      status, 
      condition, 
      location, 
      contactEmail, 
      description,
      eligibility,
      targetParticipants,
      currentParticipants,
      startDate,
      endDate
    } = await req.json();

    // Generate AI summary from title and description
    const summaryText = `${title}. ${description || ''}`.substring(0, 500);
    const summary = await generateSummary(summaryText, condition, 'trial');

    await dbConnect();

    const trial = await ClinicalTrial.create({
      title,
      phase,
      status,
      condition,
      location,
      contactEmail,
      description,
      eligibility,
      targetParticipants: targetParticipants || 0,
      currentParticipants: currentParticipants || 0,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
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
