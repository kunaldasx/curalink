'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, Plus, Link2, Loader2 } from 'lucide-react';

export default function ResearcherProfile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [orcidId, setOrcidId] = useState('');
  const [researchGateUrl, setResearchGateUrl] = useState('');
  const [acceptsMeetings, setAcceptsMeetings] = useState(false);

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      setUser(data);
      // Populate edit fields
      setName(data.name || '');
      setCity(data.location?.city || '');
      setCountry(data.location?.country || '');
      setSpecialties(data.specialties || []);
      setInterests(data.interests || []);
      setOrcidId(data.orcidId || '');
      setResearchGateUrl(data.researchGateUrl || '');
      setAcceptsMeetings(data.acceptsMeetings || false);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location: { city, country },
          specialties,
          interests,
          orcidId,
          researchGateUrl,
          acceptsMeetings,
        }),
      });

      if (response.ok) {
        await fetchUserProfile();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setName(user?.name || '');
    setCity(user?.location?.city || '');
    setCountry(user?.location?.country || '');
    setSpecialties(user?.specialties || []);
    setInterests(user?.interests || []);
    setOrcidId(user?.orcidId || '');
    setResearchGateUrl(user?.researchGateUrl || '');
    setAcceptsMeetings(user?.acceptsMeetings || false);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">View and edit your research profile and expertise</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{user?.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <p className="text-sm py-2 text-muted-foreground">{user?.email} (cannot be changed)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Boston"
                />
              ) : (
                <p className="text-sm py-2">{user?.location?.city || 'Not set'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              {isEditing ? (
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., USA"
                />
              ) : (
                <p className="text-sm py-2">{user?.location?.country || 'Not set'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Specialties */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Research Specialties</CardTitle>
          <CardDescription>
            {isEditing ? 'Update your areas of expertise' : 'Your areas of expertise'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && (
            <>
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
            </>
          )}

          {/* Display Current Specialties */}
          {specialties.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-md">
              {specialties.map((spec) => (
                <Badge key={spec} className="flex items-center gap-1">
                  {spec}
                  {isEditing && (
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSpecialty(spec)}
                    />
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              No specialties added yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Research Interests */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Research Interests</CardTitle>
          <CardDescription>
            {isEditing ? 'Update your research focus areas' : 'Your research focus areas'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && (
            <>
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
            </>
          )}

          {/* Display Current Interests */}
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-3 bg-purple-50 rounded-md">
              {interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                  {interest}
                  {isEditing && (
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeInterest(interest)}
                    />
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              No research interests added yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Academic Profiles */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Academic Profiles</CardTitle>
          <CardDescription>Link your academic profiles for publication import</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orcidId">
              <Link2 className="inline h-4 w-4 mr-1" />
              ORCID ID
            </Label>
            {isEditing ? (
              <Input
                id="orcidId"
                placeholder="0000-0002-1234-5678"
                value={orcidId}
                onChange={(e) => setOrcidId(e.target.value)}
              />
            ) : (
              <p className="text-sm py-2">{user?.orcidId || 'Not linked'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="researchGate">
              <Link2 className="inline h-4 w-4 mr-1" />
              ResearchGate Profile
            </Label>
            {isEditing ? (
              <Input
                id="researchGate"
                placeholder="https://researchgate.net/profile/..."
                value={researchGateUrl}
                onChange={(e) => setResearchGateUrl(e.target.value)}
              />
            ) : (
              <p className="text-sm py-2">{user?.researchGateUrl || 'Not linked'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meeting Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meeting Preferences</CardTitle>
          <CardDescription>Control your availability for patient consultations</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
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
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Meeting Availability:</span>
              <Badge variant={acceptsMeetings ? 'default' : 'secondary'}>
                {acceptsMeetings ? 'Available' : 'Not Available'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Account Type:</span>
            <span className="font-medium capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member Since:</span>
            <span className="font-medium">
              {new Date(user?.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Specialties:</span>
            <span className="font-medium">{specialties.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Research Interests:</span>
            <span className="font-medium">{interests.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
