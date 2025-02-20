import axios from 'axios';

const PUBMED_SEARCH_API = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_FETCH_API = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
const PUBMED_SUMMARY_API = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';

export interface PublicationSearchResult {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  doiURL: string;
  abstract: string;
}

/**
 * Search PubMed for publications
 */
export async function searchPubMed(
  query: string,
  maxResults: number = 10
): Promise<PublicationSearchResult[]> {
  try {
    // Step 1: Search for PMIDs
    const searchResponse = await axios.get(PUBMED_SEARCH_API, {
      params: {
        db: 'pubmed',
        term: query,
        retmode: 'json',
        retmax: maxResults,
      },
    });

    const pmids = searchResponse.data?.esearchresult?.idlist || [];
    if (pmids.length === 0) return [];

    // Step 2: Fetch summaries
    const summaryResponse = await axios.get(PUBMED_SUMMARY_API, {
      params: {
        db: 'pubmed',
        id: pmids.join(','),
        retmode: 'json',
      },
    });

    const result = summaryResponse.data?.result || {};

    return pmids.map((pmid: string) => {
      const article = result[pmid] || {};
      const authors = (article.authors || []).map((a: any) => a.name).slice(0, 3);

      return {
        pmid,
        title: article.title || '',
        authors,
        journal: article.fulljournalname || article.source || '',
        doiURL: article.elocationid
          ? `https://doi.org/${article.elocationid.replace('doi: ', '')}`
          : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        abstract: '', // Abstract requires separate fetch
      };
    });
  } catch (error) {
    console.error('Error searching PubMed:', error);
    return [];
  }
}

/**
 * Get publication details by PMID
 */
export async function getPublicationByPMID(pmid: string): Promise<PublicationSearchResult | null> {
  try {
    const summaryResponse = await axios.get(PUBMED_SUMMARY_API, {
      params: {
        db: 'pubmed',
        id: pmid,
        retmode: 'json',
      },
    });

    const result = summaryResponse.data?.result;
    const article = result?.[pmid];

    if (!article) return null;

    const authors = (article.authors || []).map((a: any) => a.name);

    return {
      pmid,
      title: article.title || '',
      authors,
      journal: article.fulljournalname || article.source || '',
      doiURL: article.elocationid
        ? `https://doi.org/${article.elocationid.replace('doi: ', '')}`
        : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      abstract: '',
    };
  } catch (error) {
    console.error('Error fetching publication:', error);
    return null;
  }
}
