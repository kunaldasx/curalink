import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Connection from '@/models/Connection';
import Publication from '@/models/Publication';

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

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    // Build search filter
    const filter: any = {
      role: 'researcher',
      _id: { $ne: currentUser.id }, // Exclude self
    };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { specialties: { $regex: query, $options: 'i' } },
        { interests: { $regex: query, $options: 'i' } },
      ];
    }

    // Find researchers
    const researchers = await User.find(filter)
      .select('name email location specialties interests orcidId createdAt')
      .limit(50)
      .lean();

    // Get connection status for each researcher
    const connections = await Connection.find({
      $or: [
        { requester: currentUser.id },
        { recipient: currentUser.id },
      ],
    }).lean();

    // Get recent publications for each researcher (limit to 3)
    const researchersWithDetails = await Promise.all(
      researchers.map(async (researcher) => {
        const publications = await Publication.find({ userId: researcher._id })
          .sort({ createdAt: -1 })
          .limit(3)
          .select('title summary createdAt')
          .lean();

        // Determine connection status
        let connectionStatus = 'none';
        let connectionId = null;

        const connection = connections.find(
          (c) =>
            (c.requester.toString() === currentUser.id &&
              c.recipient.toString() === researcher._id.toString()) ||
            (c.recipient.toString() === currentUser.id &&
              c.requester.toString() === researcher._id.toString())
        );

        if (connection) {
          connectionId = connection._id;
          if (connection.status === 'accepted') {
            connectionStatus = 'connected';
          } else if (connection.status === 'pending') {
            if (connection.requester.toString() === currentUser.id) {
              connectionStatus = 'pending_sent';
            } else {
              connectionStatus = 'pending_received';
            }
          }
        }

        return {
          ...researcher,
          publications,
          connectionStatus,
          connectionId,
        };
      })
    );

    return NextResponse.json({
      collaborators: researchersWithDetails,
      total: researchersWithDetails.length,
    });
  } catch (error) {
    console.error('Search collaborators error:', error);
    return NextResponse.json(
      { error: 'Failed to search collaborators' },
      { status: 500 }
    );
  }
}
