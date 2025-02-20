'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

export default function PatientOnboarding() {
  const [conditions, setConditions] = useState('');
  const [additionalConditions, setAdditionalConditions] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Suggested conditions for quick selection
  const suggestedConditions = [
    'Glioma',
    'Lung Cancer',
    'Breast Cancer',
    'Diabetes',
    'Heart Disease',
    'Alzheimer\'s',
    'Parkinson\'s',
    'Multiple Sclerosis',
  ];

  const addCondition = (condition: string) => {
    const trimmed = condition.trim();
    if (trimmed && !additionalConditions.includes(trimmed)) {
      setAdditionalConditions([...additionalConditions, trimmed]);
      setConditionInput('');
    }
  };

  const removeCondition = (condition: string) => {
    setAdditionalConditions(additionalConditions.filter((c) => c !== condition));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conditions,
          additionalConditions,
          location: { city, country },
        }),
      });

      if (response.ok) {
        // Trigger prepopulation of recommendations
        await fetch('/api/recommendations/prepopulate', {
          method: 'POST',
        });
        
        router.push('/patient/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to CuraLink!</CardTitle>
            <CardDescription>
              Let's personalize your experience. Tell us about your health interests in natural language.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="conditions">Tell Us About Yourself</Label>
                <Textarea
                  id="conditions"
                  placeholder="Example: 'I have brain cancer and experience frequent headaches' or 'My mother was diagnosed with glioma and I want to learn more about treatment options'"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  rows={5}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  ✨ Our AI will automatically identify conditions and symptoms from your description
                </p>
              </div>

              <div className="space-y-3">
                <Label>Add Specific Conditions (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a condition and press Enter"
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCondition(conditionInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => addCondition(conditionInput)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Suggested conditions */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedConditions.map((condition) => (
                      <Badge
                        key={condition}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addCondition(condition)}
                      >
                        + {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Selected conditions */}
                {additionalConditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-md">
                    {additionalConditions.map((condition) => (
                      <Badge key={condition} className="flex items-center gap-1">
                        {condition}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeCondition(condition)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  💡 Adding specific conditions helps us find more relevant clinical trials, experts, and publications
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Your Location</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    📍 We'll show you nearby experts and clinical trials. You can view global results anytime.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Boston, London, Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="e.g., USA, UK, India"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">🎯 What happens next?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ We'll analyze your input using AI</li>
                  <li>✓ Prepopulate relevant clinical trials from ClinicalTrials.gov</li>
                  <li>✓ Find health experts matching your conditions</li>
                  <li>✓ Discover latest research publications</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '⏳ Personalizing your experience...' : 'Complete Setup & View Recommendations'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
