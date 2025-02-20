import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { extractDiseaseKeywords } from '@/utils/ai';

export async function PUT(req: NextRequest) {
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await req.json();

    // Update common fields
    if (body.name) user.name = body.name;
    if (body.location) user.location = body.location;

    // Role-specific updates
    if (user.role === 'patient') {
      // Handle patient-specific updates
      if (body.conditions || body.additionalConditions) {
        const keywords = body.conditions 
          ? await extractDiseaseKeywords(body.conditions)
          : [];
        
        const combined = [...keywords, ...(body.additionalConditions || [])];
        const allConditions = Array.from(new Set(combined));
        
        user.medicalConditions = allConditions;
      }
    } else if (user.role === 'researcher') {
      // Handle researcher-specific updates
      if (body.specialties !== undefined) user.specialties = body.specialties;
      if (body.interests !== undefined) user.interests = body.interests;
      if (body.orcidId !== undefined) user.orcidId = body.orcidId;
      if (body.researchGateUrl !== undefined) user.researchGateUrl = body.researchGateUrl;
      if (body.acceptsMeetings !== undefined) user.acceptsMeetings = body.acceptsMeetings;
    }

    await user.save();

    return NextResponse.json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        medicalConditions: user.medicalConditions,
        specialties: user.specialties,
        interests: user.interests,
        orcidId: user.orcidId,
        researchGateUrl: user.researchGateUrl,
        acceptsMeetings: user.acceptsMeetings,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
