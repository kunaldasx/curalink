'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function ResearcherCollaborators() {
  const [query, setQuery] = useState('');
  const [collaborators, setCollaborators] = useState<any[]>([]);

  const handleSearch = async () => {
    const res = await fetch(`/api/experts?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setCollaborators(data.experts || []);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Find Collaborators</h1>
      <p className="text-gray-600 mb-8">Connect with researchers in your field</p>

      <Card className="mb-6">
        <div className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by specialty or interest..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {collaborators.map((collab, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{collab.name}</CardTitle>
              <CardDescription>
                {collab.specialties?.join(', ') || 'Researcher'}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
