import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Connection from '@/models/Connection';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get all connections (accepted and pending)
    const connections = await Connection.find({
      $or: [
        { requester: currentUser.id },
        { recipient: currentUser.id },
      ],
    })
      .populate('requester', 'name email location specialties interests')
      .populate('recipient', 'name email location specialties interests')
      .sort({ createdAt: -1 })
      .lean();

    // Format connections to always show the "other" person
    const formattedConnections = connections.map((conn) => {
      const isRequester = conn.requester._id.toString() === currentUser.id;
      const otherPerson = isRequester ? conn.recipient : conn.requester;

      return {
        connectionId: conn._id,
        status: conn.status,
        user: otherPerson,
        isRequester,
        createdAt: conn.createdAt,
      };
    });

    // Separate into categories
    const accepted = formattedConnections.filter((c) => c.status === 'accepted');
    const pendingSent = formattedConnections.filter(
      (c) => c.status === 'pending' && c.isRequester
    );
    const pendingReceived = formattedConnections.filter(
      (c) => c.status === 'pending' && !c.isRequester
    );

    return NextResponse.json({
      accepted,
      pendingSent,
      pendingReceived,
    });
  } catch (error) {
    console.error('Get connections error:', error);
    return NextResponse.json(
      { error: 'Failed to get connections' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { connectionId, action } = await req.json();

    if (!connectionId || !action) {
      return NextResponse.json(
        { error: 'Connection ID and action are required' },
        { status: 400 }
      );
    }

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    // Only recipient can accept/reject
    if (connection.recipient.toString() !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only respond to requests sent to you' },
        { status: 403 }
      );
    }

    if (action === 'accept') {
      connection.status = 'accepted';
    } else if (action === 'reject') {
      connection.status = 'rejected';
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    await connection.save();

    return NextResponse.json({
      success: true,
      connection,
    });
  } catch (error) {
    console.error('Update connection error:', error);
    return NextResponse.json(
      { error: 'Failed to update connection' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const connectionId = searchParams.get('connectionId');

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    // Either party can remove the connection
    if (
      connection.requester.toString() !== currentUser.id &&
      connection.recipient.toString() !== currentUser.id
    ) {
      return NextResponse.json(
        { error: 'You can only remove your own connections' },
        { status: 403 }
      );
    }

    await Connection.findByIdAndDelete(connectionId);

    return NextResponse.json({
      success: true,
      message: 'Connection removed',
    });
  } catch (error) {
    console.error('Delete connection error:', error);
    return NextResponse.json(
      { error: 'Failed to delete connection' },
      { status: 500 }
    );
  }
}
