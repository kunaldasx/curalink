import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateSummary } from '@/utils/ai';
import dbConnect from '@/lib/mongodb';
import ClinicalTrial from '@/models/ClinicalTrial';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const trial = await ClinicalTrial.findOne({
      _id: params.id,
      ownerResearcherId: currentUser.id,
    });

    if (!trial) {
      return NextResponse.json(
        { error: 'Trial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ trial });
  } catch (error) {
    console.error('Get trial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updateData = await req.json();

    await dbConnect();
    
    const trial = await ClinicalTrial.findOne({
      _id: params.id,
      ownerResearcherId: currentUser.id,
    });

    if (!trial) {
      return NextResponse.json(
        { error: 'Trial not found' },
        { status: 404 }
      );
    }

    // If title or description changed, regenerate summary
    if (updateData.title || updateData.description) {
      const summaryText = `${updateData.title || trial.title}. ${updateData.description || trial.description || ''}`.substring(0, 500);
      updateData.summary = await generateSummary(
        summaryText, 
        updateData.condition || trial.condition, 
        'trial'
      );
    }

    // Update fields
    Object.assign(trial, updateData);
    await trial.save();

    return NextResponse.json({ success: true, trial });
  } catch (error) {
    console.error('Update trial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const trial = await ClinicalTrial.findOneAndDelete({
      _id: params.id,
      ownerResearcherId: currentUser.id,
    });

    if (!trial) {
      return NextResponse.json(
        { error: 'Trial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Trial deleted' });
  } catch (error) {
    console.error('Delete trial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
