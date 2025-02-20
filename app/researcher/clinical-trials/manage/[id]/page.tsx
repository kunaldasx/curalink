'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Sparkles, Trash2, Save } from 'lucide-react';
import Link from 'next/link';

export default function ManageClinicalTrial({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [trial, setTrial] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    condition: '',
    phase: 'Phase 1',
    status: 'Recruiting',
    location: '',
    contactEmail: '',
    description: '',
    eligibility: '',
    targetParticipants: '0',
    currentParticipants: '0',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchTrial();
  }, [params.id]);

  const fetchTrial = async () => {
    try {
      const res = await fetch(`/api/researcher/trials/${params.id}`);
      const data = await res.json();
      
      if (res.ok && data.trial) {
        setTrial(data.trial);
        setFormData({
          title: data.trial.title || '',
          condition: data.trial.condition || '',
          phase: data.trial.phase || 'Phase 1',
          status: data.trial.status || 'Recruiting',
          location: data.trial.location || '',
          contactEmail: data.trial.contactEmail || '',
          description: data.trial.description || '',
          eligibility: data.trial.eligibility || '',
          targetParticipants: data.trial.targetParticipants?.toString() || '0',
          currentParticipants: data.trial.currentParticipants?.toString() || '0',
          startDate: data.trial.startDate ? new Date(data.trial.startDate).toISOString().split('T')[0] : '',
          endDate: data.trial.endDate ? new Date(data.trial.endDate).toISOString().split('T')[0] : '',
        });
      } else {
        alert('Trial not found');
        router.push('/researcher/clinical-trials');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load trial');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/researcher/trials/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetParticipants: formData.targetParticipants ? parseInt(formData.targetParticipants) : 0,
          currentParticipants: formData.currentParticipants ? parseInt(formData.currentParticipants) : 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Trial updated successfully!');
        fetchTrial(); // Reload to show updated summary
      } else {
        alert(data.error || 'Failed to update trial');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to update trial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trial? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/researcher/trials/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/researcher/clinical-trials');
      } else {
        alert('Failed to delete trial');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete trial');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const recruitmentPercentage = trial?.targetParticipants > 0
    ? Math.round((trial.currentParticipants / trial.targetParticipants) * 100)
    : 0;

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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Manage Clinical Trial</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Update trial details and track recruitment progress
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Recruitment Progress Overview */}
          {trial && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="font-semibold mb-2">Recruitment Progress</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{trial.currentParticipants} / {trial.targetParticipants} Participants</span>
                    <span className="font-semibold">{recruitmentPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(recruitmentPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <Badge variant={trial.status === 'Recruiting' ? 'default' : 'secondary'}>
                  {trial.status}
                </Badge>
              </div>
            </div>
          )}

          {/* AI-Generated Summary */}
          {trial?.summary && (
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold">AI-Generated Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground">{trial.summary}</p>
              <p className="text-xs text-muted-foreground mt-2">
                This summary is automatically updated when you change the title or description
              </p>
            </div>
          )}

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
                  rows={5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  AI summary will be regenerated when you save changes to this field
                </p>
              </div>

              <div>
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
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
                <Button type="button" variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
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
