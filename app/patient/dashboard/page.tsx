'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Users, BookOpen, ArrowRight, MapPin, Globe } from 'lucide-react';

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>({
    trials: [],
    experts: [],
    publications: [],
    userConditions: [],
    userLocation: null,
  });
  const [nearbyOnly, setNearbyOnly] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchRecommendations(true);
  }, []);

  const fetchUserData = async () => {
    const res = await fetch('/api/user/me');
    const data = await res.json();
    setUser(data);
  };

  const fetchRecommendations = async (nearby: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recommendations?nearbyOnly=${nearby}`);
      const data = await res.json();
      setRecommendations(data);
      setNearbyOnly(nearby);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = () => {
    const newValue = !nearbyOnly;
    fetchRecommendations(newValue);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back{user?.name ? `, ${user.name}` : ''}! Here are your personalized recommendations.
        </p>
      </div>

      {/* User Conditions & Location Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">🔍 Tracking conditions:</p>
              <div className="flex flex-wrap gap-2">
                {recommendations.userConditions?.length > 0 ? (
                  recommendations.userConditions.map((condition: string, i: number) => (
                    <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700">
                      {condition}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No conditions set yet</span>
                )}
              </div>
            </div>
            
            {/* Location Toggle */}
            {recommendations.userLocation && (
              <div className="flex flex-col items-start md:items-end gap-2">
                <p className="text-xs text-muted-foreground">
                  📍 Your location: {recommendations.userLocation.city}, {recommendations.userLocation.country}
                </p>
                <Button
                  variant={nearbyOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleLocation}
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {nearbyOnly ? (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Showing Nearby
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Showing Global
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <FlaskConical className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Clinical Trials</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `${recommendations.trials.length} matching trials`}
              {nearbyOnly && recommendations.trials.length > 0 && ' nearby'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/patient/clinical-trials">
              <Button className="w-full">
                Explore Trials <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Health Experts</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `${recommendations.experts.length} expert${recommendations.experts.length !== 1 ? 's' : ''}`}
              {nearbyOnly && recommendations.experts.length > 0 && ' nearby'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/patient/experts">
              <Button className="w-full">
                Find Experts <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Publications</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `${recommendations.publications.length} research articles`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/patient/publications">
              <Button className="w-full">
                Browse Publications <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Trials</CardTitle>
            <CardDescription>
              Based on your conditions {nearbyOnly && '& location'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recommendations.trials.length === 0 ? (
              <div className="text-center py-6">
                <FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  No trials found for your conditions
                </p>
                {nearbyOnly && (
                  <Button variant="link" size="sm" onClick={toggleLocation}>
                    Try viewing global results
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.trials.slice(0, 3).map((trial: any, i: number) => (
                  <Link
                    key={i}
                    href="/patient/clinical-trials"
                    className="block border-l-4 border-primary pl-3 hover:bg-gray-50 transition-colors rounded-r py-1"
                  >
                    <p className="font-medium text-sm line-clamp-1">{trial.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{trial.status}</span>
                      {trial.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {trial.location}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Forums</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ask questions and get answers from researchers
            </p>
            <Link href="/patient/forums">
              <Button variant="outline" className="w-full">
                Visit Forums <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
