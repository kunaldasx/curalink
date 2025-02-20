import axios from 'axios';

const ORCID_API_BASE = 'https://pub.orcid.org/v3.0';

export interface ORCIDProfile {
  orcidId: string;
  name: string;
  bio: string;
  works: ORCIDWork[];
}

export interface ORCIDWork {
  title: string;
  type: string;
  publicationYear: string;
  doi: string;
}

/**
 * Fetch ORCID profile
 */
export async function getORCIDProfile(orcidId: string): Promise<ORCIDProfile | null> {
  try {
    const response = await axios.get(`${ORCID_API_BASE}/${orcidId}/person`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const person = response.data;
    const name = person?.name?.['given-names']?.value || '';
    const familyName = person?.name?.['family-name']?.value || '';
    const bio = person?.biography?.content || '';

    // Fetch works
    const worksResponse = await axios.get(`${ORCID_API_BASE}/${orcidId}/works`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const works = (worksResponse.data?.group || []).slice(0, 10).map((group: any) => {
      const workSummary = group['work-summary']?.[0] || {};
      const title = workSummary.title?.title?.value || '';
      const type = workSummary.type || '';
      const publicationYear = workSummary['publication-date']?.year?.value || '';
      const externalIds = workSummary['external-ids']?.['external-id'] || [];
      const doi = externalIds.find((id: any) => id['external-id-type'] === 'doi')?.[
        'external-id-value'
      ] || '';

      return { title, type, publicationYear, doi };
    });

    return {
      orcidId,
      name: `${name} ${familyName}`.trim(),
      bio,
      works,
    };
  } catch (error) {
    console.error('Error fetching ORCID profile:', error);
    return null;
  }
}
