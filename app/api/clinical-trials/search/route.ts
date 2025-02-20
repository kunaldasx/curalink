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

    if (!query) {
      // Return cached trials from DB
      await dbConnect();
      const trials = await ClinicalTrial.find().limit(20);
      return NextResponse.json({ trials });
    }

    // Search external API
    const externalTrials = await searchClinicalTrials(query, status);

    // Generate AI summaries and cache
    await dbConnect();
    const trialsWithSummaries = await Promise.all(
      externalTrials.map(async (trial) => {
        // Check if already cached
        let existingTrial = await ClinicalTrial.findOne({ externalId: trial.nctId });

        if (!existingTrial) {
          // Generate summary
          const summary = await generateSummary(
            trial.title,
            trial.description,
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
          });
        }

        return existingTrial;
      })
    );

    return NextResponse.json({ trials: trialsWithSummaries });
  } catch (error) {
    console.error('Clinical trials search error:', error);
    return NextResponse.json({ trials: [] }, { status: 500 });
  }
}
