'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Link2, Loader2 } from 'lucide-react';

export default function ResearcherOnboarding() {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [orcidId, setOrcidId] = useState('');
  const [researchGateUrl, setResearchGateUrl] = useState('');
  const [acceptsMeetings, setAcceptsMeetings] = useState(true);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [importingPublications, setImportingPublications] = useState(false);
  const [publications, setPublications] = useState<any[]>([]);
  const router = useRouter();

  // Suggested specialties
  const suggestedSpecialties = [
    'Oncology',
    'Neurology',
    'Cardiology',
    'Immunology',
    'Endocrinology',
    'Gastroenterology',
    'Pulmonology',
    'Nephrology',
  ];

  // Suggested research interests
  const suggestedInterests = [
    'Immunotherapy',
    'Clinical AI',
    'Gene Therapy',
    'Precision Medicine',
    'Biomarkers',
    'Drug Development',
    'Clinical Trials Design',
    'Regenerative Medicine',
  ];

  const addSpecialty = (specialty: string) => {
    const trimmed = specialty.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed]);
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleImportPublications = async () => {
    if (!orcidId && !researchGateUrl) {
      alert('Please provide ORCID ID or ResearchGate URL');
      return;
    }

    setImportingPublications(true);
    try {
      const response = await fetch('/api/researcher/import-publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orcidId, researchGateUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setPublications(data.publications || []);
      } else {
        console.error('Import failed:', data.error);
      }
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImportingPublications(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (specialties.length === 0) {
      alert('Please add at least one specialty');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialties,
          interests,
          orcidId,
          researchGateUrl,
          acceptsMeetings,
          location: { city, country },
          publications, // Save imported publications
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
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Setup - Researcher</CardTitle>
            <CardDescription>
              Provide background and expertise to connect with relevant opportunities and collaborators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Specialties */}
              <div className="space-y-3">
                <Label>Specialties</Label>
                <p className="text-sm text-muted-foreground">
                  Mention areas like Oncology, Neurology, or Immunology to categorize your profile.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a specialty and press Enter"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSpecialty(specialtyInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => addSpecialty(specialtyInput)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Suggested specialties */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSpecialties.map((spec) => (
                      <Badge
                        key={spec}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addSpecialty(spec)}
                      >
                        + {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Selected specialties */}
                {specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-md">
                    {specialties.map((spec) => (
                      <Badge key={spec} className="flex items-center gap-1">
                        {spec}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeSpecialty(spec)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Research Interests */}
              <div className="space-y-3">
                <Label>Research Interests</Label>
                <p className="text-sm text-muted-foreground">
                  Add areas like Immunotherapy, Clinical AI, or Gene Therapy to receive relevant recommendations.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a research interest and press Enter"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest(interestInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => addInterest(interestInput)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Suggested interests */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedInterests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addInterest(interest)}
                      >
                        + {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Selected interests */}
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-purple-50 rounded-md">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                        {interest}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeInterest(interest)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Auto-import Publications */}
              <div className="space-y-3 border-t pt-6">
                <div>
                  <Label className="text-base font-medium">Auto-Import Publications</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Link your ORCID or ResearchGate to automatically fetch your publications with AI-generated summaries.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orcidId">
                      <Link2 className="inline h-4 w-4 mr-1" />
                      ORCID ID
                    </Label>
                    <Input
                      id="orcidId"
                      placeholder="0000-0002-1234-5678"
                      value={orcidId}
                      onChange={(e) => setOrcidId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Auto-import credentials and publications
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="researchGate">
                      <Link2 className="inline h-4 w-4 mr-1" />
                      ResearchGate Profile
                    </Label>
                    <Input
                      id="researchGate"
                      placeholder="https://researchgate.net/profile/..."
                      value={researchGateUrl}
                      onChange={(e) => setResearchGateUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Pull academic contributions
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImportPublications}
                  disabled={importingPublications || (!orcidId && !researchGateUrl)}
                  className="w-full"
                >
                  {importingPublications ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing Publications...
                    </>
                  ) : (
                    <>
                      <Link2 className="mr-2 h-4 w-4" />
                      Import My Publications
                    </>
                  )}
                </Button>

                {/* Display imported publications */}
                {publications.length > 0 && (
                  <div className="space-y-2 p-4 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-800">
                      ✓ {publications.length} publication{publications.length !== 1 ? 's' : ''} imported successfully
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {publications.slice(0, 5).map((pub, i) => (
                        <div key={i} className="text-xs bg-white p-2 rounded">
                          <p className="font-medium">{pub.title}</p>
                          {pub.summary && (
                            <p className="text-muted-foreground mt-1">{pub.summary}</p>
                          )}
                        </div>
                      ))}
                      {publications.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          +{publications.length - 5} more publications
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-3 border-t pt-6">
                <Label>Your Location</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Boston, London"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="e.g., USA, UK"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Meeting Availability */}
              <div className="space-y-3 border-t pt-6">
                <Label>Meeting Availability</Label>
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-md">
                  <input
                    type="checkbox"
                    id="acceptsMeetings"
                    checked={acceptsMeetings}
                    onChange={(e) => setAcceptsMeetings(e.target.checked)}
                    className="h-5 w-5 mt-0.5"
                  />
                  <div>
                    <Label htmlFor="acceptsMeetings" className="font-normal cursor-pointer">
                      I'm available for meeting requests from patients
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Patients can request meetings to discuss their conditions and treatment options.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">🎯 What happens next?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Your profile will be visible to patients seeking expertise</li>
                  <li>✓ You'll receive relevant collaboration opportunities</li>
                  <li>✓ Access clinical trial management and collaboration tools</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Setting up your profile...' : 'Complete Setup & Go to Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
