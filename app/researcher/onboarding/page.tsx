'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ResearcherOnboarding() {
  const [specialties, setSpecialties] = useState('');
  const [interests, setInterests] = useState('');
  const [orcidId, setOrcidId] = useState('');
  const [acceptsMeetings, setAcceptsMeetings] = useState(true);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialties: specialties.split(',').map((s) => s.trim()),
          interests: interests.split(',').map((i) => i.trim()),
          orcidId,
          acceptsMeetings,
          location: { city, country },
        }),
      });

      if (response.ok) {
        router.push('/researcher/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Researcher!</CardTitle>
            <CardDescription>
              Set up your research profile to connect with patients and collaborators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="specialties">Research Specialties</Label>
                <Input
                  id="specialties"
                  placeholder="Oncology, Cardiology, Neurology..."
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">Separate multiple with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Research Interests</Label>
                <Textarea
                  id="interests"
                  placeholder="Clinical trials, biomarkers, immunotherapy..."
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orcidId">ORCID ID (Optional)</Label>
                <Input
                  id="orcidId"
                  placeholder="0000-0000-0000-0000"
                  value={orcidId}
                  onChange={(e) => setOrcidId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Link your ORCID to import publications automatically
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Boston"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="USA"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="acceptsMeetings"
                  checked={acceptsMeetings}
                  onChange={(e) => setAcceptsMeetings(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="acceptsMeetings" className="font-normal">
                  I'm open to meeting requests from patients
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Setting up your profile...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
