'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NewClinicalTrial() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    condition: '',
    phase: 'Phase 1',
    status: 'Recruiting',
    location: '',
    contactEmail: '',
    description: '',
    eligibility: '',
    targetParticipants: '',
    currentParticipants: '0',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/researcher/trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetParticipants: formData.targetParticipants ? parseInt(formData.targetParticipants) : 0,
          currentParticipants: formData.currentParticipants ? parseInt(formData.currentParticipants) : 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/researcher/clinical-trials');
      } else {
        alert(data.error || 'Failed to create trial');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to create trial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/researcher/clinical-trials">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trials
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Clinical Trial</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Fill in the details below. An AI summary will be automatically generated from your trial information.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <Label htmlFor="title">Trial Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Phase II Study of Novel Cancer Treatment"
                  required
                />
              </div>

              <div>
                <Label htmlFor="condition">Medical Condition *</Label>
                <Input
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  placeholder="e.g., Breast Cancer, Type 2 Diabetes"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phase">Trial Phase *</Label>
                  <select
                    id="phase"
                    name="phase"
                    value={formData.phase}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="Early Phase 1">Early Phase 1</option>
                    <option value="Phase 1">Phase 1</option>
                    <option value="Phase 2">Phase 2</option>
                    <option value="Phase 3">Phase 3</option>
                    <option value="Phase 4">Phase 4</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="Not yet recruiting">Not yet recruiting</option>
                    <option value="Recruiting">Recruiting</option>
                    <option value="Enrolling by invitation">Enrolling by invitation</option>
                    <option value="Active, not recruiting">Active, not recruiting</option>
                    <option value="Completed">Completed</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Boston, MA, United States"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="contact@institution.edu"
                  required
                />
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Information</h3>
              
              <div>
                <Label htmlFor="description">Trial Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the trial objectives, methodology, and expected outcomes..."
                  rows={5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  AI will generate a patient-friendly summary from this description
                </p>
              </div>

              <div>
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  placeholder="List inclusion and exclusion criteria (e.g., age range, diagnosis requirements, exclusions...)"
                  rows={4}
                />
              </div>
            </div>

            {/* Recruitment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recruitment Progress</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentParticipants">Current Participants</Label>
                  <Input
                    id="currentParticipants"
                    name="currentParticipants"
                    type="number"
                    min="0"
                    value={formData.currentParticipants}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="targetParticipants">Target Participants</Label>
                  <Input
                    id="targetParticipants"
                    name="targetParticipants"
                    type="number"
                    min="0"
                    value={formData.targetParticipants}
                    onChange={handleChange}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timeline</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Expected End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link href="/researcher/clinical-trials">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Trial...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Trial with AI Summary
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
