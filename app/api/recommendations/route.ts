import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import ClinicalTrial from '@/models/ClinicalTrial';
import Publication from '@/models/Publication';

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
    const user = await User.findById(currentUser.id);

    if (!user || user.role !== 'patient') {
      return NextResponse.json({
        trials: [],
        experts: [],
        publications: [],
      });
    }

    const conditions = user.medicalConditions || [];

    // Find matching trials
    const trials = await ClinicalTrial.find({
      $or: [
        { condition: { $in: conditions } },
        { title: { $regex: conditions.join('|'), $options: 'i' } },
      ],
    }).limit(10);

    // Find experts with matching specialties
    const experts = await User.find({
      role: 'researcher',
      $or: [
        { specialties: { $in: conditions } },
        { interests: { $in: conditions } },
      ],
    }).limit(10);

    // Find matching publications
    const publications = await Publication.find({
      $or: [
        { title: { $regex: conditions.join('|'), $options: 'i' } },
      ],
    }).limit(10);

    return NextResponse.json({
      trials,
      experts,
      publications,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { trials: [], experts: [], publications: [] },
      { status: 500 }
    );
  }
}
