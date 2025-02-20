import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Connection from '@/models/Connection';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { recipientId } = await req.json();

    if (!recipientId) {
      return NextResponse.json(
        { error: 'Recipient ID is required' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: currentUser.id, recipient: recipientId },
        { requester: recipientId, recipient: currentUser.id },
      ],
    });

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Connection request already exists' },
        { status: 400 }
      );
    }

    // Create connection request
    const connection = await Connection.create({
      requester: currentUser.id,
      recipient: recipientId,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      connection,
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    return NextResponse.json(
      { error: 'Failed to send connection request' },
      { status: 500 }
    );
  }
}
