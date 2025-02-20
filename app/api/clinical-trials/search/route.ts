import { NextRequest, NextResponse } from 'next/server';
import { searchClinicalTrials } from '@/utils/clinicalTrials';
import { generateSummary } from '@/utils/ai';
import dbConnect from '@/lib/mongodb';
import ClinicalTrial from '@/models/ClinicalTrial';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || '';
    const phase = searchParams.get('phase') || '';
    const location = searchParams.get('location') || '';

    await dbConnect();

    // Build filter object for database query
    const filter: any = {};
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { condition: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { eligibility: { $regex: query, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (phase) {
      filter.phase = phase;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Search in database (includes researcher-created and cached external trials)
    let trials = await ClinicalTrial.find(filter)
      .sort({ updatedAt: -1 })
      .limit(50);

    // If searching with query and few results, try external API
    if (query && trials.length < 5) {
      try {
        const externalTrials = await searchClinicalTrials(query, status);

        // Generate AI summaries and cache
        const newTrials = await Promise.all(
          externalTrials.map(async (trial) => {
            // Check if already cached
            let existingTrial = await ClinicalTrial.findOne({ externalId: trial.nctId });

            if (!existingTrial) {
              // Generate summary
              const summary = await generateSummary(
                trial.title,
                trial.description || trial.condition,
                'trial'
              );

              // Cache in database
              existingTrial = await ClinicalTrial.create({
                externalId: trial.nctId,
                title: trial.title,
                phase: trial.phase,
                status: trial.status,
                condition: trial.condition,
                location: trial.location,
                summary,
                contactEmail: trial.contactEmail,
                description: trial.description || '',
              });
            }

            return existingTrial;
          })
        );

        // Combine and deduplicate
        trials = [...trials, ...newTrials].filter((trial, index, self) =>
          index === self.findIndex((t) => t._id.toString() === trial._id.toString())
        );
      } catch (externalError) {
        console.error('External API error:', externalError);
        // Continue with database results only
      }
    }

    return NextResponse.json({ trials });
  } catch (error) {
    console.error('Clinical trials search error:', error);
    return NextResponse.json({ trials: [] }, { status: 500 });
  }
}
