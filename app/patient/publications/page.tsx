'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, ExternalLink, RefreshCw, BookOpen } from 'lucide-react';

export default function PatientPublications() {
  const [query, setQuery] = useState('');
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userConditions, setUserConditions] = useState<string[]>([]);
  const [isPersonalized, setIsPersonalized] = useState(true);

  useEffect(() => {
    loadPersonalizedPublications();
  }, []);

  const loadPersonalizedPublications = async () => {
    setLoading(true);
    setIsPersonalized(true);
    try {
      const res = await fetch('/api/recommendations');
      const data = await res.json();
      setPublications(data.publications || []);
      setUserConditions(data.userConditions || []);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    setIsPersonalized(false);
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

  const resetToPersonalized = () => {
    setQuery('');
    loadPersonalizedPublications();
  };

  const handleFavorite = async (pubId: string) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refType: 'publication', refId: pubId }),
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Publications</h1>
        <p className="text-gray-600">
          {isPersonalized
            ? 'Research articles relevant to your conditions'
            : 'Search results for publications'}
        </p>
      </div>

      {/* User Conditions */}
      {userConditions.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">🔍 Your conditions:</p>
              <div className="flex flex-wrap gap-2">
                {userConditions.map((condition, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="query">Search publications</Label>
              <Input
                id="query"
                placeholder="e.g., diabetes treatment, cancer immunotherapy"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} disabled={loading || !query}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              {!isPersonalized && (
                <Button
                  variant="outline"
                  onClick={resetToPersonalized}
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {publications.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {publications.length} publication{publications.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {publications.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                {isPersonalized
                  ? 'No publications found for your conditions'
                  : 'Enter a search term to find relevant publications'}
              </p>
            </CardContent>
          </Card>
        )}

        {publications.map((pub, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{pub.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {pub.journal} • {pub.authors?.slice(0, 3).join(', ')}
                    {pub.authors?.length > 3 && ` et al.`}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFavorite(pub._id || pub.pmid)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pub.summary && (
                <p className="text-sm text-gray-600 mb-3">{pub.summary}</p>
              )}
              <div className="flex gap-2">
                {pub.doiURL && (
                  <a
                    href={pub.doiURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View Article <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
