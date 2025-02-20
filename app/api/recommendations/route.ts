import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import ClinicalTrial from '@/models/ClinicalTrial';
import Publication from '@/models/Publication';

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
    const user = await User.findById(currentUser.id);

    if (!user || user.role !== 'patient') {
      return NextResponse.json({
        trials: [],
        experts: [],
        publications: [],
      });
    }

    const searchParams = req.nextUrl.searchParams;
    const nearbyOnly = searchParams.get('nearbyOnly') === 'true';

    const conditions = user.medicalConditions || [];
    const userLocation = user.location;

    // Build trial query
    const trialQuery: any = {
      $or: [
        { condition: { $in: conditions } },
        { title: { $regex: conditions.join('|'), $options: 'i' } },
      ],
    };

    // Add location filter for trials if nearbyOnly
    if (nearbyOnly && userLocation?.country) {
      trialQuery.location = { $regex: userLocation.country, $options: 'i' };
    }

    // Find matching trials
    const trials = await ClinicalTrial.find(trialQuery)
      .sort({ createdAt: -1 })
      .limit(20);

    // Build expert query
    const expertQuery: any = {
      role: 'researcher',
      $or: [
        { specialties: { $in: conditions } },
        { interests: { $in: conditions } },
      ],
    };

    // Add location filter for experts if nearbyOnly
    if (nearbyOnly && userLocation?.country) {
      expertQuery['location.country'] = { $regex: userLocation.country, $options: 'i' };
    }

    // Find experts with matching specialties
    const experts = await User.find(expertQuery)
      .select('-passwordHash')
      .limit(20);

    // Find matching publications (no location filter)
    const publications = await Publication.find({
      $or: [
        { title: { $regex: conditions.join('|'), $options: 'i' } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      trials,
      experts,
      publications,
      userConditions: conditions,
      userLocation,
      nearbyOnly,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { trials: [], experts: [], publications: [] },
      { status: 500 }
    );
  }
}
