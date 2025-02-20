import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define MeetingRequest schema
const MeetingRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientContact: {
    type: String,
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expertName: {
    type: String,
    required: true,
  },
  isOnPlatform: {
    type: Boolean,
    default: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'admin_review'],
    default: 'pending',
  },
  responseMessage: {
    type: String,
  },
  respondedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MeetingRequest = mongoose.models.MeetingRequest || 
  mongoose.model('MeetingRequest', MeetingRequestSchema);

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'patient') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      expertId, 
      expertName, 
      isOnPlatform, 
      patientName, 
      patientContact, 
      message 
    } = await req.json();

    if (!expertName || !patientName || !patientContact || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create meeting request
    const meetingRequest = await MeetingRequest.create({
      patientId: currentUser.id,
      patientName,
      patientContact,
      expertId: expertId || null,
      expertName,
      isOnPlatform: isOnPlatform || false,
      message,
      status: isOnPlatform ? 'pending' : 'admin_review',
    });

    // If expert is on platform, you could send them a notification here
    // If not on platform, flag for admin review

    const responseMessage = isOnPlatform
      ? 'Meeting request sent successfully! The researcher will be notified.'
      : 'Your request has been submitted to our admin team. We will contact the researcher on your behalf and get back to you soon.';

    return NextResponse.json({ 
      success: true, 
      message: responseMessage,
      meetingRequest,
    });
  } catch (error) {
    console.error('Meeting request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    let meetingRequests;

    if (currentUser.role === 'patient') {
      // Get patient's meeting requests
      meetingRequests = await MeetingRequest.find({ patientId: currentUser.id })
        .sort({ createdAt: -1 });
    } else if (currentUser.role === 'researcher') {
      // Get meeting requests for researcher - populate patient data
      meetingRequests = await MeetingRequest.find({ 
        expertId: currentUser.id,
        isOnPlatform: true,
      })
      .populate('patientId', 'name email medicalConditions location')
      .sort({ createdAt: -1 });
    } else if (currentUser.role === 'admin') {
      // Admin sees all requests, especially those needing review
      meetingRequests = await MeetingRequest.find({ status: 'admin_review' })
        .populate('patientId', 'name email medicalConditions')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ 
      meetingRequests: meetingRequests || [] 
    });
  } catch (error) {
    console.error('Get meeting requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
