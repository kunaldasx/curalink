import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getORCIDProfile } from '@/utils/orcid';
import { generateSummary } from '@/utils/ai';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (currentUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Only researchers can import publications' },
        { status: 403 }
      );
    }

    const { orcidId, researchGateUrl } = await req.json();

    let publications: any[] = [];

    // Import from ORCID
    if (orcidId) {
      try {
        const orcidProfile = await getORCIDProfile(orcidId);
        
        if (orcidProfile && orcidProfile.works) {
          // Generate AI summaries for publications
          const pubsWithSummaries = await Promise.all(
            orcidProfile.works.map(async (work) => {
              const summary = await generateSummary(
                work.title,
                `Research publication in ${work.type}. DOI: ${work.doi}`,
                'publication'
              );

              return {
                title: work.title,
                type: work.type,
                year: work.publicationYear,
                doi: work.doi,
                summary,
                source: 'ORCID',
              };
            })
          );

          publications = [...publications, ...pubsWithSummaries];
        }
      } catch (error) {
        console.error('ORCID import error:', error);
      }
    }

    // ResearchGate import would require web scraping or their API
    // For now, we'll just acknowledge it
    if (researchGateUrl) {
      // Note: ResearchGate doesn't have a public API
      // In production, you would either:
      // 1. Use a web scraping service
      // 2. Partner with ResearchGate for API access
      // 3. Ask users to manually add publications
      console.log('ResearchGate URL provided:', researchGateUrl);
    }

    return NextResponse.json({
      success: true,
      publications,
      message: `Imported ${publications.length} publications`,
    });
  } catch (error) {
    console.error('Import publications error:', error);
    return NextResponse.json(
      { error: 'Failed to import publications' },
      { status: 500 }
    );
  }
}
