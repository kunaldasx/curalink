'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, FlaskConical, BookOpen, Users, HeartOff, ExternalLink, MapPin, Mail, Building, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PatientFavorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
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

  const handleRemoveFavorite = async (refType: string, refId: string) => {
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refType, refId }),
      });
      fetchFavorites(); // Refresh list
    } catch (error) {
      console.error('Remove favorite error:', error);
    }
  };

  const groupedFavorites = {
    trial: favorites.filter((f) => f.refType === 'trial'),
    publication: favorites.filter((f) => f.refType === 'publication'),
    expert: favorites.filter((f) => f.refType === 'expert'),
  };

  const totalCount = favorites.length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          My Favorites
        </h1>
        <p className="text-gray-600">Your saved clinical trials, publications, and experts</p>
      </div>

      {loading && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Loading your favorites...</p>
          </CardContent>
        </Card>
      )}

      {!loading && totalCount === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start saving clinical trials, publications, and experts you're interested in
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push('/patient/trials')}>
                Browse Clinical Trials
              </Button>
              <Button variant="outline" onClick={() => router.push('/patient/publications')}>
                Browse Publications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && totalCount > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({totalCount})
            </TabsTrigger>
            <TabsTrigger value="trials">
              <FlaskConical className="h-4 w-4 mr-2" />
              Clinical Trials ({groupedFavorites.trial.length})
            </TabsTrigger>
            <TabsTrigger value="publications">
              <BookOpen className="h-4 w-4 mr-2" />
              Publications ({groupedFavorites.publication.length})
            </TabsTrigger>
            <TabsTrigger value="experts">
              <Users className="h-4 w-4 mr-2" />
              Experts ({groupedFavorites.expert.length})
            </TabsTrigger>
          </TabsList>

          {/* All Tab */}
          <TabsContent value="all" className="space-y-6">
            {groupedFavorites.trial.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-blue-600" />
                  Clinical Trials
                </h2>
                <div className="grid gap-4">
                  {groupedFavorites.trial.map((fav) => (
                    <TrialCard key={fav._id} favorite={fav} onRemove={handleRemoveFavorite} />
                  ))}
                </div>
              </div>
            )}

            {groupedFavorites.publication.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Publications
                </h2>
                <div className="grid gap-4">
                  {groupedFavorites.publication.map((fav) => (
                    <PublicationCard key={fav._id} favorite={fav} onRemove={handleRemoveFavorite} />
                  ))}
                </div>
              </div>
            )}

            {groupedFavorites.expert.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Experts
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {groupedFavorites.expert.map((fav) => (
                    <ExpertCard key={fav._id} favorite={fav} onRemove={handleRemoveFavorite} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Trials Tab */}
          <TabsContent value="trials">
            {groupedFavorites.trial.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center py-12">
                  <FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">No saved clinical trials yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {groupedFavorites.trial.map((fav) => (
                  <TrialCard key={fav._id} favorite={fav} onRemove={handleRemoveFavorite} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Publications Tab */}
          <TabsContent value="publications">
            {groupedFavorites.publication.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">No saved publications yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {groupedFavorites.publication.map((fav) => (
                  <PublicationCard key={fav._id} favorite={fav} onRemove={handleRemoveFavorite} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Experts Tab */}
          <TabsContent value="experts">
            {groupedFavorites.expert.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">No followed experts yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {groupedFavorites.expert.map((fav) => (
                  <ExpertCard key={fav._id} favorite={fav} onRemove={handleRemoveFavorite} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Trial Card Component
function TrialCard({ favorite, onRemove }: any) {
  const trial = favorite.details;
  if (!trial) return null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{trial.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{trial.phase}</Badge>
              <Badge variant={trial.status === 'Recruiting' ? 'default' : 'secondary'}>
                {trial.status}
              </Badge>
              {trial.conditions?.slice(0, 2).map((cond: string, i: number) => (
                <Badge key={i} variant="outline">{cond}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {trial.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {trial.location}
                </span>
              )}
              {trial.sponsor && (
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {trial.sponsor}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove('trial', trial._id)}
            className="text-red-600 hover:text-red-700"
          >
            <HeartOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{trial.description}</p>
        <Link href={`/patient/trials/${trial._id}`}>
          <Button variant="outline" size="sm">
            View Details
            <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Publication Card Component
function PublicationCard({ favorite, onRemove }: any) {
  const pub = favorite.details;
  if (!pub) return null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{pub.title}</CardTitle>
            {pub.authors && (
              <p className="text-sm text-muted-foreground mb-2">
                {pub.authors.slice(0, 3).join(', ')}
                {pub.authors.length > 3 && ' et al.'}
              </p>
            )}
            {pub.journal && (
              <Badge variant="outline" className="mb-2">{pub.journal}</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove('publication', pub._id)}
            className="text-red-600 hover:text-red-700"
          >
            <HeartOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {pub.summary && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">{pub.summary}</p>
        )}
        <div className="flex gap-2">
          {pub.doiURL && (
            <Link href={pub.doiURL} target="_blank">
              <Button variant="outline" size="sm">
                Read Full Paper
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Expert Card Component
function ExpertCard({ favorite, onRemove }: any) {
  const expert = favorite.details;
  if (!expert) return null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{expert.name}</CardTitle>
            {expert.specialization && (
              <Badge className="mb-2">{expert.specialization}</Badge>
            )}
            <div className="space-y-1 text-sm text-muted-foreground">
              {expert.institution && (
                <p className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {expert.institution}
                </p>
              )}
              {expert.location && (
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {typeof expert.location === 'string' 
                    ? expert.location 
                    : `${expert.location.city || ''}, ${expert.location.country || ''}`.trim().replace(/^,\s*/, '')}
                </p>
              )}
              {expert.email && (
                <p className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {expert.email}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove('expert', expert._id)}
            className="text-red-600 hover:text-red-700"
          >
            <HeartOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      {expert.researchFocus && (
        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-2">{expert.researchFocus}</p>
        </CardContent>
      )}
    </Card>
  );
}
