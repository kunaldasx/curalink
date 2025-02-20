'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';

export default function ResearcherTrials() {
  const [trials, setTrials] = useState<any[]>([]);

  useEffect(() => {
    fetchTrials();
  }, []);

  const fetchTrials = async () => {
    try {
      const res = await fetch('/api/researcher/trials');
      const data = await res.json();
      setTrials(data.trials || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Clinical Trials</h1>
          <p className="text-gray-600">Add and manage your research trials</p>
        </div>
        <Link href="/researcher/clinical-trials/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Trial
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {trials.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You haven't added any trials yet. Click "Add New Trial" to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {trials.map((trial, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{trial.title}</CardTitle>
                  <CardDescription>
                    {trial.condition} • Phase: {trial.phase} • Status: {trial.status}
                  </CardDescription>
                </div>
                <Link href={`/researcher/clinical-trials/manage/${trial._id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {trial.summary && <p className="text-sm text-gray-600">{trial.summary}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
