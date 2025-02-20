import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Publication from '@/models/Publication';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query') || '';

    await dbConnect();

    let filter: any = { role: 'researcher' };

    if (query) {
      filter.$or = [
        { specialties: { $regex: query, $options: 'i' } },
        { interests: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
        { institution: { $regex: query, $options: 'i' } },
      ];
    }

    // Get researchers from platform
    const platformExperts = await User.find(filter).select('-passwordHash').limit(20);

    // Enhance with publication counts and mark as on platform
    const expertsWithData = await Promise.all(
      platformExperts.map(async (expert) => {
        const publicationCount = await Publication.countDocuments({
          researcherId: expert._id,
        });

        return {
          ...expert.toObject(),
          publicationCount,
          isOnPlatform: true,
        };
      })
    );

    // If we have a query but few results, we could search external sources here
    // For now, just return platform experts
    // TODO: Integrate with PubMed API, Google Scholar, etc. to find external experts

    return NextResponse.json({ experts: expertsWithData });
  } catch (error) {
    console.error('Experts search error:', error);
    return NextResponse.json({ experts: [] }, { status: 500 });
  }
}
