'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heart, FlaskConical, BookOpen, Users } from 'lucide-react';

export default function PatientFavorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedFavorites = {
    trial: favorites.filter((f) => f.refType === 'trial'),
    publication: favorites.filter((f) => f.refType === 'publication'),
    expert: favorites.filter((f) => f.refType === 'expert'),
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-gray-600">Your saved trials, publications, and experts</p>
      </div>

      {!loading && favorites.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven't saved any favorites yet. Start exploring!
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {groupedFavorites.trial.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Saved Clinical Trials ({groupedFavorites.trial.length})
            </h2>
            <div className="space-y-3">
              {groupedFavorites.trial.map((fav, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-base">Trial ID: {fav.refId}</CardTitle>
                    <CardDescription>Saved on {new Date(fav.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {groupedFavorites.publication.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Saved Publications ({groupedFavorites.publication.length})
            </h2>
            <div className="space-y-3">
              {groupedFavorites.publication.map((fav, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-base">Publication ID: {fav.refId}</CardTitle>
                    <CardDescription>Saved on {new Date(fav.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {groupedFavorites.expert.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Followed Experts ({groupedFavorites.expert.length})
            </h2>
            <div className="space-y-3">
              {groupedFavorites.expert.map((fav, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-base">Expert ID: {fav.refId}</CardTitle>
                    <CardDescription>Followed on {new Date(fav.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
