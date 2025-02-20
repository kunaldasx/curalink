'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Bookmark, ExternalLink, RefreshCw, BookOpen, FileText, Calendar, Users, Link as LinkIcon } from 'lucide-react';

export default function ResearcherPublications() {
  const [query, setQuery] = useState('');
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoritedPubs, setFavoritedPubs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await fetch('/api/favorites?type=publication');
      const data = await res.json();
      const pubIds = new Set(data.favorites.map((f: any) => f.refId));
      setFavoritedPubs(pubIds);
    } catch (error) {
      console.error('Load favorites error:', error);
    }
  };

  const handleSearch = async () => {
    if (!query) {
      alert('Please enter a search term');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/publications/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setPublications(data.publications || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setQuery('');
    setPublications([]);
  };

  const handleToggleFavorite = async (pubId: string, pubTitle: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          refType: 'publication', 
          refId: pubId,
          metadata: { title: pubTitle }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.isFavorite) {
          setFavoritedPubs(prev => new Set(prev).add(pubId));
        } else {
          setFavoritedPubs(prev => {
            const newSet = new Set(prev);
            newSet.delete(pubId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Research Publications</h1>
        <p className="text-gray-600">
          Search PubMed and browse medical research literature
        </p>
      </div>

      {/* Search Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="query">Search PubMed</Label>
              <Input
                id="query"
                placeholder="e.g., glioblastoma immunotherapy, CRISPR gene editing, Alzheimer's biomarkers"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Search for research articles by topic, author, disease, or treatment
              </p>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} disabled={loading || !query}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
              {publications.length > 0 && (
                <Button
                  variant="outline"
                  onClick={resetSearch}
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {publications.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-700">
              Search Results
              <span className="text-muted-foreground ml-1">({publications.length} publications)</span>
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            PubMed
          </Badge>
        </div>
      )}

      <div className="space-y-4">
        {publications.length === 0 && !loading && (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Search Medical Literature</h3>
              <p className="text-muted-foreground mb-1">
                Enter keywords to search millions of biomedical research articles
              </p>
              <p className="text-sm text-gray-500">
                Powered by PubMed / NCBI
              </p>
            </CardContent>
          </Card>
        )}

        {publications.map((pub, i) => {
          const pubId = pub._id || pub.externalId || pub.pmid;
          const isFavorited = favoritedPubs.has(pubId);

          return (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors">
                      {pub.title}
                    </CardTitle>
                    <div className="mt-2 space-y-1">
                      {/* Journal & Date */}
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-3 w-3" />
                        <span className="font-medium">{pub.journal || 'Journal'}</span>
                        {pub.year && (
                          <>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{pub.year}</span>
                          </>
                        )}
                      </CardDescription>
                      {/* Authors */}
                      {pub.authors && pub.authors.length > 0 && (
                        <CardDescription className="flex items-start gap-2 text-xs">
                          <Users className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>
                            {pub.authors.slice(0, 5).join(', ')}
                            {pub.authors.length > 5 && ` et al. (${pub.authors.length} authors)`}
                          </span>
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={isFavorited ? "default" : "ghost"}
                    size="icon"
                    onClick={() => handleToggleFavorite(pubId, pub.title)}
                    className={`flex-shrink-0 ${isFavorited ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    title={isFavorited ? "Remove from library" : "Add to library"}
                  >
                    <Bookmark className={`h-5 w-5 ${isFavorited ? 'fill-white' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* AI Summary */}
                {pub.summary && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      AI Summary:
                    </p>
                    <p className="text-sm text-blue-900 leading-relaxed">{pub.summary}</p>
                  </div>
                )}

                {/* Abstract Preview */}
                {pub.abstract && !pub.summary && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Abstract:</p>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                      {pub.abstract}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 items-center">
                  {pub.doiURL && (
                    <a
                      href={pub.doiURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Read Full Paper
                    </a>
                  )}
                  {pub.pmid && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <LinkIcon className="h-3 w-3" />
                      View on PubMed
                    </a>
                  )}
                  {pub.externalId && !pub.pmid && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${pub.externalId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <LinkIcon className="h-3 w-3" />
                      View on PubMed
                    </a>
                  )}
                </div>

                {/* Additional Info */}
                {(pub.externalId || pub.pmid) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      PMID: {pub.externalId || pub.pmid}
                      {pub.doi && <span className="ml-3">DOI: {pub.doi}</span>}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
