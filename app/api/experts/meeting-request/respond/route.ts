import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Import the MeetingRequest model (reuse schema from meeting-request route)
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
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { requestId, action, responseMessage } = await req.json();

    if (!requestId || !action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the meeting request
    const meetingRequest = await MeetingRequest.findById(requestId);

    if (!meetingRequest) {
      return NextResponse.json(
        { error: 'Meeting request not found' },
        { status: 404 }
      );
    }

    // Verify this request is for the current researcher
    if (meetingRequest.expertId?.toString() !== currentUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized - this request is not for you' },
        { status: 403 }
      );
    }

    // Check if already responded
    if (meetingRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'This request has already been responded to' },
        { status: 400 }
      );
    }

    // Update the meeting request
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    
    meetingRequest.status = newStatus;
    meetingRequest.responseMessage = responseMessage;
    meetingRequest.respondedAt = new Date();
    
    await meetingRequest.save();

    // In production, you would send an email/SMS to the patient here
    // Example:
    /*
    await sendNotification({
      to: meetingRequest.patientContact,
      subject: `Meeting Request ${action === 'accept' ? 'Accepted' : 'Declined'} - ${currentUser.name}`,
      body: responseMessage,
    });
    */

    console.log('Meeting request response:', {
      requestId,
      action,
      patientName: meetingRequest.patientName,
      researcherName: currentUser.name,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Meeting request ${action}ed successfully`,
      meetingRequest,
    });
  } catch (error) {
    console.error('Meeting request response error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
