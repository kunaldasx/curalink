import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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
      ];
    }

    const experts = await User.find(filter).select('-passwordHash').limit(20);

    return NextResponse.json({ experts });
  } catch (error) {
    console.error('Experts search error:', error);
    return NextResponse.json({ experts: [] }, { status: 500 });
  }
}
