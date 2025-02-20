import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { searchClinicalTrials } from '@/utils/clinicalTrials';
import { searchPubMed } from '@/utils/pubmed';
import { generateSummary } from '@/utils/ai';
import ClinicalTrial from '@/models/ClinicalTrial';
import Publication from '@/models/Publication';

/**
 * Prepopulate recommendations based on user's onboarding data
 * This runs after patient completes onboarding
 */
export async function POST() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(currentUser.id);

    if (!user || user.role !== 'patient') {
      return NextResponse.json({ message: 'Not applicable for this user' });
    }

    const conditions = user.medicalConditions || [];
    if (conditions.length === 0) {
      return NextResponse.json({ message: 'No conditions to prepopulate' });
    }

    // Prepopulate trials for each condition
    const trialsPromises = conditions.slice(0, 3).map(async (condition: string) => {
      try {
        const externalTrials = await searchClinicalTrials(condition, 'recruiting');
        
        // Cache trials with AI summaries
        const cachedTrials = await Promise.all(
          externalTrials.slice(0, 5).map(async (trial) => {
            let existingTrial = await ClinicalTrial.findOne({ externalId: trial.nctId });

            if (!existingTrial) {
              const summary = await generateSummary(
                trial.title,
                trial.description,
                'trial'
              );

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

        return cachedTrials;
      } catch (error) {
        console.error(`Error prepopulating trials for ${condition}:`, error);
        return [];
      }
    });

    // Prepopulate publications for each condition
    const pubsPromises = conditions.slice(0, 3).map(async (condition: string) => {
      try {
        const externalPubs = await searchPubMed(condition, 5);
        
        // Cache publications with AI summaries
        const cachedPubs = await Promise.all(
          externalPubs.map(async (pub) => {
            let existingPub = await Publication.findOne({ externalId: pub.pmid });

            if (!existingPub) {
              const summary = await generateSummary(
                pub.title,
                pub.abstract || 'No abstract available',
                'publication'
              );

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

        return cachedPubs;
      } catch (error) {
        console.error(`Error prepopulating publications for ${condition}:`, error);
        return [];
      }
    });

    // Wait for all prepopulation to complete
    await Promise.all([...trialsPromises, ...pubsPromises]);

    return NextResponse.json({
      success: true,
      message: 'Recommendations prepopulated successfully',
    });
  } catch (error) {
    console.error('Prepopulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
