import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import ClinicalTrial from '@/models/ClinicalTrial';
import Publication from '@/models/Publication';
import User from '@/models/User';

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
    
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type'); // Filter by type if provided

    const query: any = { userId: currentUser.id };
    if (type) {
      query.refType = type;
    }

    const favorites = await Favorite.find(query).sort({ createdAt: -1 });

    // Populate full details for each favorite
    const populatedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        let details = null;
        
        try {
          if (fav.refType === 'trial') {
            details = await ClinicalTrial.findById(fav.refId);
          } else if (fav.refType === 'publication') {
            details = await Publication.findById(fav.refId);
          } else if (fav.refType === 'expert' || fav.refType === 'collaborator') {
            details = await User.findById(fav.refId).select('-password');
          }
        } catch (err) {
          console.error(`Error fetching ${fav.refType} ${fav.refId}:`, err);
        }

        return {
          _id: fav._id,
          refType: fav.refType,
          refId: fav.refId,
          createdAt: fav.createdAt,
          details,
        };
      })
    );

    // Filter out any favorites where the referenced item was deleted
    const validFavorites = populatedFavorites.filter(f => f.details);

    return NextResponse.json({ 
      favorites: validFavorites,
      total: validFavorites.length,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json({ favorites: [], total: 0 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { refType, refId, metadata } = await req.json();

    if (!refType || !refId) {
      return NextResponse.json(
        { error: 'refType and refId are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: currentUser.id,
      refType,
      refId,
    });

    if (existing) {
      // Remove favorite
      await Favorite.deleteOne({ _id: existing._id });
      return NextResponse.json({ success: true, action: 'removed', isFavorite: false });
    } else {
      // Add favorite
      await Favorite.create({
        userId: currentUser.id,
        refType,
        refId,
        metadata: metadata || {},
      });
      return NextResponse.json({ success: true, action: 'added', isFavorite: true });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
