import { NextRequest, NextResponse } from 'next/server';
import { searchPubMed } from '@/utils/pubmed';
import { generateSummary } from '@/utils/ai';
import dbConnect from '@/lib/mongodb';
import Publication from '@/models/Publication';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query') || '';

    if (!query) {
      await dbConnect();
      const publications = await Publication.find().limit(20);
      return NextResponse.json({ publications });
    }

    // Search PubMed
    const externalPubs = await searchPubMed(query, 10);

    // Generate AI summaries and cache
    await dbConnect();
    const pubsWithSummaries = await Promise.all(
      externalPubs.map(async (pub) => {
        // Check if already cached
        let existingPub = await Publication.findOne({ externalId: pub.pmid });

        if (!existingPub) {
          // Generate summary
          const summary = await generateSummary(
            pub.title,
            pub.abstract || 'No abstract available',
            'publication'
          );

          // Cache in database
          existingPub = await Publication.create({
            externalId: pub.pmid,
            title: pub.title,
            journal: pub.journal,
            authors: pub.authors,
            doiURL: pub.doiURL,
            summary,
          });
        }

        return existingPub;
      })
    );

    return NextResponse.json({ publications: pubsWithSummaries });
  } catch (error) {
    console.error('Publications search error:', error);
    return NextResponse.json({ publications: [] }, { status: 500 });
  }
}
