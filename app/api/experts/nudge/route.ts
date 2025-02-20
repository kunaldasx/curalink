import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define ExpertInvitation schema
const ExpertInvitationSchema = new mongoose.Schema({
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expertName: {
    type: String,
    required: true,
  },
  expertEmail: {
    type: String,
  },
  invitationSent: {
    type: Boolean,
    default: false,
  },
  invitationSentAt: {
    type: Date,
  },
  joined: {
    type: Boolean,
    default: false,
  },
  joinedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ExpertInvitation = mongoose.models.ExpertInvitation || 
  mongoose.model('ExpertInvitation', ExpertInvitationSchema);

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { expertName, expertEmail } = await req.json();

    if (!expertName) {
      return NextResponse.json(
        { error: 'Expert name is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if invitation already sent
    const existingInvitation = await ExpertInvitation.findOne({
      expertName,
      expertEmail,
    });

    if (existingInvitation) {
      return NextResponse.json({ 
        success: true, 
        message: 'Invitation already sent to this expert',
        alreadyInvited: true,
      });
    }

    // Create invitation record
    const invitation = await ExpertInvitation.create({
      invitedBy: currentUser.id,
      expertName,
      expertEmail,
      invitationSent: true,
      invitationSentAt: new Date(),
    });

    // In a production environment, you would send an actual email here
    // Example with SendGrid or similar:
    /*
    await sendEmail({
      to: expertEmail || 'admin@curalink.com',
      subject: `Invitation to join CuraLink - ${expertName}`,
      body: `
        Dear Dr. ${expertName},

        A patient on CuraLink is interested in your research and would like to connect with you.

        CuraLink is a platform connecting patients with researchers like you to facilitate:
        - Patient recruitment for clinical trials
        - Collaboration opportunities
        - Direct communication with patients interested in your research

        Join CuraLink today: [signup link]

        Best regards,
        The CuraLink Team
      `
    });
    */

    console.log('Invitation created for:', {
      expertName,
      expertEmail,
      invitedBy: currentUser.name,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Invitation sent successfully!',
      invitation,
    });
  } catch (error) {
    console.error('Nudge expert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const invitations = await ExpertInvitation.find()
      .populate('invitedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
