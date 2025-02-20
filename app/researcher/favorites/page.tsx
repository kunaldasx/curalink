'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ResearcherFavorites() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const res = await fetch('/api/favorites');
    const data = await res.json();
    setFavorites(data.favorites || []);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
      <p className="text-gray-600 mb-8">Your saved content</p>

      {favorites.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No favorites yet</CardTitle>
            <CardDescription>Start saving content to see it here</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-4">
        {favorites.map((fav, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{fav.refType}</CardTitle>
              <CardDescription>ID: {fav.refId}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
