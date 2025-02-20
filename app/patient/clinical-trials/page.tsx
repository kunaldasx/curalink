'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Heart } from 'lucide-react';

export default function PatientClinicalTrials() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (status) params.append('status', status);

      const res = await fetch(`/api/clinical-trials/search?${params}`);
      const data = await res.json();
      setTrials(data.trials || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (trialId: string) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refType: 'trial', refId: trialId }),
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Clinical Trials</h1>
        <p className="text-gray-600">Search for clinical trials relevant to your condition</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <Label htmlFor="query">Search by condition or keyword</Label>
              <Input
                id="query"
                placeholder="e.g., diabetes, cancer, alzheimer's"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All</option>
                <option value="recruiting">Recruiting</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            {loading ? 'Searching...' : 'Search Trials'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {trials.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No trials found. Try searching for a condition or keyword.
              </p>
            </CardContent>
          </Card>
        )}

        {trials.map((trial, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{trial.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {trial.condition} • Phase: {trial.phase} • Status: {trial.status}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFavorite(trial._id || trial.nctId)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {trial.summary && (
                <p className="text-sm text-gray-600 mb-3">{trial.summary}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {trial.location}
                </span>
                {trial.contactEmail && (
                  <a
                    href={`mailto:${trial.contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    Contact
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
