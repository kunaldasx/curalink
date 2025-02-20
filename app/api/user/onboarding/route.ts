import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { extractDiseaseKeywords } from '@/utils/ai';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    await dbConnect();

    const user = await User.findById(currentUser.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update based on role
    if (user.role === 'patient') {
      const { conditions, location } = body;
      
      // Extract keywords using AI
      const keywords = conditions ? await extractDiseaseKeywords(conditions) : [];
      
      user.medicalConditions = keywords;
      user.location = location;
    } else if (user.role === 'researcher') {
      const { specialties, interests, orcidId, acceptsMeetings, location } = body;
      
      user.specialties = specialties || [];
      user.interests = interests || [];
      user.orcidId = orcidId || '';
      user.acceptsMeetings = acceptsMeetings !== undefined ? acceptsMeetings : false;
      user.location = location;
    }

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
