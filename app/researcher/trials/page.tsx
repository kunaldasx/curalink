'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, MapPin, Bookmark, Globe, RefreshCw, Mail, Sparkles, Loader2, Filter, X } from 'lucide-react';

export default function ResearcherBrowseTrials() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [phase, setPhase] = useState('');
  const [location, setLocation] = useState('');
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favoritedTrials, setFavoritedTrials] = useState<Set<string>>(new Set());
  
  // Email dialog state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState<any>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadAllTrials();
    loadFavorites();
  }, []);

  const loadAllTrials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clinical-trials/search?');
      const data = await res.json();
      setTrials(data.trials || []);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await fetch('/api/favorites?type=trial');
      const data = await res.json();
      const trialIds = new Set(data.favorites.map((f: any) => f.refId));
      setFavoritedTrials(trialIds);
    } catch (error) {
      console.error('Load favorites error:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (status) params.append('status', status);
      if (phase) params.append('phase', phase);
      if (location) params.append('location', location);

      const res = await fetch(`/api/clinical-trials/search?${params}`);
      const data = await res.json();
      setTrials(data.trials || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setQuery('');
    setStatus('');
    setPhase('');
    setLocation('');
    setShowFilters(false);
    loadAllTrials();
  };

  const clearFilters = () => {
    setStatus('');
    setPhase('');
    setLocation('');
  };

  const activeFiltersCount = [status, phase, location].filter(Boolean).length;

  const handleToggleFavorite = async (trialId: string, trialTitle: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          refType: 'trial', 
          refId: trialId,
          metadata: { title: trialTitle }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.isFavorite) {
          setFavoritedTrials(prev => new Set(prev).add(trialId));
        } else {
          setFavoritedTrials(prev => {
            const newSet = new Set(prev);
            newSet.delete(trialId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  const openEmailDialog = (trial: any) => {
    setSelectedTrial(trial);
    setEmailSubject(`Collaboration Inquiry: ${trial.title}`);
    setEmailBody(
      `Dear Trial Administrator,\n\n` +
      `I am a researcher interested in "${trial.title}".\n\n` +
      `I would like to discuss:\n` +
      `- Potential collaboration opportunities\n` +
      `- Research methodologies\n` +
      `- Data sharing possibilities\n\n` +
      `I believe my expertise in [your field] could complement this research.\n\n` +
      `Best regards`
    );
    setEmailDialogOpen(true);
  };

  const sendEmail = async () => {
    if (!selectedTrial?.contactEmail) return;

    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedTrial.contactEmail,
          subject: emailSubject,
          body: emailBody,
          trialTitle: selectedTrial.title,
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
        setEmailDialogOpen(false);
      } else {
        // Fallback to mailto
        window.location.href = `mailto:${selectedTrial.contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        setEmailDialogOpen(false);
      }
    } catch (error) {
      console.error('Send email error:', error);
      // Fallback to mailto
      window.location.href = `mailto:${selectedTrial.contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      setEmailDialogOpen(false);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Clinical Trials</h1>
        <p className="text-gray-600">
          Discover clinical trials for collaboration and research opportunities
        </p>
      </div>

      {/* Search Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Main Search */}
            <div>
              <Label htmlFor="query">Search Clinical Trials</Label>
              <Input
                id="query"
                placeholder="e.g., Lung Cancer Immunotherapy, Diabetes Treatment, Phase 3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Search by condition, treatment type, phase, or keywords
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <Label htmlFor="status">Recruitment Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="Recruiting">Recruiting</option>
                    <option value="Not yet recruiting">Not Yet Recruiting</option>
                    <option value="Active, not recruiting">Active, Not Recruiting</option>
                    <option value="Completed">Completed</option>
                    <option value="Enrolling by invitation">Enrolling by Invitation</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="phase">Trial Phase</Label>
                  <select
                    id="phase"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Phases</option>
                    <option value="Early Phase 1">Early Phase 1</option>
                    <option value="Phase 1">Phase 1</option>
                    <option value="Phase 2">Phase 2</option>
                    <option value="Phase 3">Phase 3</option>
                    <option value="Phase 4">Phase 4</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Boston, California"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSearch} disabled={loading} className="flex-1 md:flex-initial">
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Searching...' : 'Search Trials'}
              </Button>
              {(query || status || phase || location) && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {trials.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {trials.length} trial{trials.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {trials.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                No trials found. Try different search terms.
              </p>
            </CardContent>
          </Card>
        )}

        {trials.map((trial, i) => {
          const trialId = trial._id || trial.nctId;
          const isFavorited = favoritedTrials.has(trialId);

          return (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{trial.title}</CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap gap-2 items-center">
                      <span>{trial.condition}</span>
                      <span>•</span>
                      <Badge variant="outline">{trial.phase}</Badge>
                      <span>•</span>
                      <Badge variant={trial.status === 'Recruiting' ? 'default' : 'secondary'}>
                        {trial.status}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Button
                    variant={isFavorited ? "default" : "ghost"}
                    size="icon"
                    onClick={() => handleToggleFavorite(trialId, trial.title)}
                    title={isFavorited ? "Remove from library" : "Add to library"}
                    className={isFavorited ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <Bookmark className={`h-5 w-5 ${isFavorited ? 'fill-white' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI-Generated Summary */}
                {trial.summary && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        AI-Generated Summary
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{trial.summary}</p>
                  </div>
                )}

                {/* Eligibility */}
                {trial.eligibility && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Eligibility Criteria:</h4>
                    <p className="text-sm text-muted-foreground">{trial.eligibility}</p>
                  </div>
                )}

                {/* Participant Info */}
                {trial.targetParticipants && trial.targetParticipants > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Participants: {trial.currentParticipants || 0} / {trial.targetParticipants}
                    </span>
                    {trial.currentParticipants && trial.targetParticipants && (
                      <div className="flex-1 max-w-xs">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min((trial.currentParticipants / trial.targetParticipants) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Location and Contact */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {trial.location}
                  </span>
                  {trial.contactEmail && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEmailDialog(trial)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact for Collaboration
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Email Dialog */}
        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Trial Team</DialogTitle>
              <DialogDescription>
                {selectedTrial?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="emailTo">To</Label>
                <Input
                  id="emailTo"
                  value={selectedTrial?.contactEmail || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="emailSubject">Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="emailBody">Message</Label>
                <Textarea
                  id="emailBody"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Customize this message to introduce yourself and your collaboration interests
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEmailDialogOpen(false)}
                disabled={sendingEmail}
              >
                Cancel
              </Button>
              <Button
                onClick={sendEmail}
                disabled={sendingEmail || !emailSubject || !emailBody}
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
