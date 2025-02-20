'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Heart, Mail } from 'lucide-react';

export default function PatientExperts() {
  const [query, setQuery] = useState('');
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const params = query ? `?query=${encodeURIComponent(query)}` : '';
      const res = await fetch(`/api/experts${params}`);
      const data = await res.json();
      setExperts(data.experts || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (expertId: string) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refType: 'expert', refId: expertId }),
    });
  };

  const handleMeetingRequest = async () => {
    if (!selectedExpert) return;

    await fetch('/api/meeting-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toResearcherId: selectedExpert._id,
        message,
      }),
    });

    setMessage('');
    setSelectedExpert(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Health Experts</h1>
        <p className="text-gray-600">Connect with researchers and specialists</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="query">Search by specialty or interest</Label>
              <Input
                id="query"
                placeholder="e.g., oncology, cardiology, immunology"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchExperts} disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {experts.length === 0 && !loading && (
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No experts found. Try a different search term.
              </p>
            </CardContent>
          </Card>
        )}

        {experts.map((expert, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{expert.name}</CardTitle>
              <CardDescription>
                {expert.specialties?.join(', ') || 'Researcher'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expert.interests && expert.interests.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Research Interests:</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.interests.slice(0, 3).map((interest: string, j: number) => (
                      <span key={j} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {expert.location && (
                <p className="text-sm text-muted-foreground">
                  {expert.location.city}, {expert.location.country}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFavorite(expert._id)}
              >
                <Heart className="mr-2 h-4 w-4" />
                Follow
              </Button>
              {expert.acceptsMeetings && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setSelectedExpert(expert)}>
                      <Mail className="mr-2 h-4 w-4" />
                      Request Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Meeting with {expert.name}</DialogTitle>
                      <DialogDescription>
                        Send a meeting request to this researcher
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Introduce yourself and explain why you'd like to meet..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleMeetingRequest}>Send Request</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
