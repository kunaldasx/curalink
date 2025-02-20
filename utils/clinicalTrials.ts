import axios from 'axios';

const CLINICAL_TRIALS_API = 'https://clinicaltrials.gov/api/v2/studies';

export interface ClinicalTrialSearchResult {
  nctId: string;
  title: string;
  status: string;
  phase: string;
  condition: string;
  location: string;
  contactEmail: string;
  description: string;
}

/**
 * Search ClinicalTrials.gov API
 */
export async function searchClinicalTrials(
  query: string,
  status?: string,
  location?: string,
  pageSize: number = 10
): Promise<ClinicalTrialSearchResult[]> {
  try {
    const params: any = {
      'query.term': query,
      pageSize,
      format: 'json',
    };

    if (status) {
      params['filter.overallStatus'] = status;
    }

    const response = await axios.get(CLINICAL_TRIALS_API, { params });

    const studies = response.data?.studies || [];

    return studies.map((study: any) => {
      const protocolSection = study.protocolSection || {};
      const identificationModule = protocolSection.identificationModule || {};
      const statusModule = protocolSection.statusModule || {};
      const designModule = protocolSection.designModule || {};
      const conditionsModule = protocolSection.conditionsModule || {};
      const contactsLocationsModule = protocolSection.contactsLocationsModule || {};
      const descriptionModule = protocolSection.descriptionModule || {};

      return {
        nctId: identificationModule.nctId || '',
        title: identificationModule.officialTitle || identificationModule.briefTitle || '',
        status: statusModule.overallStatus || '',
        phase: designModule.phases?.[0] || 'N/A',
        condition: conditionsModule.conditions?.[0] || '',
        location: contactsLocationsModule.locations?.[0]?.city || 'Not specified',
        contactEmail: contactsLocationsModule.centralContacts?.[0]?.email || '',
        description: descriptionModule.briefSummary || '',
      };
    });
  } catch (error) {
    console.error('Error searching clinical trials:', error);
    return [];
  }
}

/**
 * Get trial by NCT ID
 */
export async function getClinicalTrialById(nctId: string): Promise<ClinicalTrialSearchResult | null> {
  try {
    const response = await axios.get(`${CLINICAL_TRIALS_API}/${nctId}`, {
      params: { format: 'json' },
    });

    const study = response.data?.protocolSection;
    if (!study) return null;

    const identificationModule = study.identificationModule || {};
    const statusModule = study.statusModule || {};
    const designModule = study.designModule || {};
    const conditionsModule = study.conditionsModule || {};
    const contactsLocationsModule = study.contactsLocationsModule || {};
    const descriptionModule = study.descriptionModule || {};

    return {
      nctId: identificationModule.nctId || '',
      title: identificationModule.officialTitle || identificationModule.briefTitle || '',
      status: statusModule.overallStatus || '',
      phase: designModule.phases?.[0] || 'N/A',
      condition: conditionsModule.conditions?.[0] || '',
      location: contactsLocationsModule.locations?.[0]?.city || 'Not specified',
      contactEmail: contactsLocationsModule.centralContacts?.[0]?.email || '',
      description: descriptionModule.briefSummary || '',
    };
  } catch (error) {
    console.error('Error fetching clinical trial:', error);
    return null;
  }
}
