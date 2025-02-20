'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Heart, Globe, RefreshCw } from 'lucide-react';

export default function PatientClinicalTrials() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userConditions, setUserConditions] = useState<string[]>([]);
  const [nearbyOnly, setNearbyOnly] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(true);
  const [userLocation, setUserLocation] = useState<any>(null);

  useEffect(() => {
    loadPersonalizedTrials();
  }, []);

  const loadPersonalizedTrials = async () => {
    setLoading(true);
    setIsPersonalized(true);
    try {
      const res = await fetch(`/api/recommendations?nearbyOnly=${nearbyOnly}`);
      const data = await res.json();
      setTrials(data.trials || []);
      setUserConditions(data.userConditions || []);
      setUserLocation(data.userLocation);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = async () => {
    const newValue = !nearbyOnly;
    setNearbyOnly(newValue);
    if (isPersonalized) {
      setLoading(true);
      try {
        const res = await fetch(`/api/recommendations?nearbyOnly=${newValue}`);
        const data = await res.json();
        setTrials(data.trials || []);
      } catch (error) {
        console.error('Toggle error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setIsPersonalized(false);
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

  const resetToPersonalized = () => {
    setQuery('');
    setStatus('');
    loadPersonalizedTrials();
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
        <p className="text-gray-600">
          {isPersonalized
            ? 'Personalized trials based on your conditions'
            : 'Search results for clinical trials'}
        </p>
      </div>

      {/* User Conditions & Location Toggle */}
      {userConditions.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
              {userLocation && isPersonalized && (
                <div className="flex flex-col items-start md:items-end gap-2">
                  <p className="text-xs text-muted-foreground">
                    📍 {userLocation.city}, {userLocation.country}
                  </p>
                  <Button
                    variant={nearbyOnly ? 'default' : 'outline'}
                    size="sm"
                    onClick={toggleLocation}
                    disabled={loading}
                  >
                    {nearbyOnly ? (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Nearby Only
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Global Results
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Card */}
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
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading} className="flex-1 md:flex-initial">
              <Search className="mr-2 h-4 w-4" />
              {loading ? 'Searching...' : 'Search Trials'}
            </Button>
            {!isPersonalized && (
              <Button
                variant="outline"
                onClick={resetToPersonalized}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to My Recommendations
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {trials.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {trials.length} trial{trials.length !== 1 ? 's' : ''}
            {isPersonalized && nearbyOnly && ' nearby'}
            {isPersonalized && !nearbyOnly && ' worldwide'}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {trials.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                {isPersonalized
                  ? 'No trials found for your conditions'
                  : 'No trials found. Try different search terms.'}
              </p>
              {isPersonalized && nearbyOnly && userLocation && (
                <Button variant="link" onClick={toggleLocation}>
                  Try viewing global results
                </Button>
              )}
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
