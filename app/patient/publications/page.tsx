'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Heart, ExternalLink } from 'lucide-react';

export default function PatientPublications() {
  const [query, setQuery] = useState('');
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    
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
        <p className="text-gray-600">Search for research articles and medical publications</p>
      </div>

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
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading || !query}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {publications.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Enter a search term to find relevant publications
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
