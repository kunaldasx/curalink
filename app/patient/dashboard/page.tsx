'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Users, BookOpen, ArrowRight, MapPin, Globe, MessageSquare } from 'lucide-react';

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
      {/* Welcome Header with Gradient */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-lg animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold mb-3"
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Dashboard
        </h1>
        <p className="text-lg text-gray-700">
          Welcome back{user?.name ? `, ${user.name}` : ''}! 👋 Here are your personalized recommendations.
        </p>
      </div>

      {/* User Conditions & Location Filter */}
      <Card className="mb-8 rounded-2xl shadow-lg border-0 overflow-hidden animate-fade-in">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <p className="text-base font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-xl">🔍</span> Tracking conditions
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendations.userConditions?.length > 0 ? (
                  recommendations.userConditions.map((condition: string, i: number) => (
                    <Badge key={i} className="px-4 py-2 rounded-xl bg-gradient-to-r from-medical-teal-100 to-medical-indigo-100 text-medical-teal-700 border border-medical-teal-300 font-medium hover:scale-105 transition-transform duration-200">
                      {condition}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No conditions set yet</span>
                )}
              </div>
            </div>
            
            {/* Location Toggle */}
            {recommendations.userLocation && (
              <div className="flex flex-col items-start md:items-end gap-3">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-medical-teal-500" />
                  {recommendations.userLocation.city}, {recommendations.userLocation.country}
                </p>
                <Button
                  size="sm"
                  onClick={toggleLocation}
                  disabled={loading}
                  className={`w-full md:w-auto px-6 py-5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    nearbyOnly 
                      ? 'bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 text-white hover:from-medical-teal-600 hover:to-medical-indigo-600'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-medical-teal-400'
                  }`}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Clinical Trials Card */}
        <Card className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in">
          <div className="h-2 bg-gradient-to-r from-medical-teal-400 to-medical-indigo-400" />
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-teal-100 to-medical-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <FlaskConical className="h-8 w-8 text-medical-teal-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Clinical Trials</CardTitle>
            <CardDescription className="text-base mt-2">
              {loading ? 'Loading...' : (
                <span className="font-semibold text-medical-teal-600">
                  {recommendations.trials.length} matching trial{recommendations.trials.length !== 1 ? 's' : ''}
                  {nearbyOnly && recommendations.trials.length > 0 && ' nearby'}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/patient/clinical-trials">
              <Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 group-hover:shadow-lg">
                Explore Trials <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Health Experts Card */}
        <Card className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="h-2 bg-gradient-to-r from-medical-indigo-400 to-medical-lavender-400" />
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-indigo-100 to-medical-lavender-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Users className="h-8 w-8 text-medical-indigo-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Health Experts</CardTitle>
            <CardDescription className="text-base mt-2">
              {loading ? 'Loading...' : (
                <span className="font-semibold text-medical-indigo-600">
                  {recommendations.experts.length} expert{recommendations.experts.length !== 1 ? 's' : ''}
                  {nearbyOnly && recommendations.experts.length > 0 && ' nearby'}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/patient/experts">
              <Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-medical-indigo-500 to-medical-lavender-500 hover:from-medical-indigo-600 hover:to-medical-lavender-600 text-white transition-all duration-200 hover:scale-105 group-hover:shadow-lg">
                Find Experts <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Publications Card */}
        <Card className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="h-2 bg-gradient-to-r from-medical-lavender-400 to-medical-teal-400" />
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-lavender-100 to-medical-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <BookOpen className="h-8 w-8 text-medical-lavender-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Publications</CardTitle>
            <CardDescription className="text-base mt-2">
              {loading ? 'Loading...' : (
                <span className="font-semibold text-medical-lavender-600">
                  {recommendations.publications.length} research article{recommendations.publications.length !== 1 ? 's' : ''}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/patient/publications">
              <Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-medical-lavender-500 to-medical-teal-500 hover:from-medical-lavender-600 hover:to-medical-teal-600 text-white transition-all duration-200 hover:scale-105 group-hover:shadow-lg">
                Browse Publications <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="rounded-2xl shadow-lg border-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-medical-teal-600" />
              Recommended Trials
            </CardTitle>
            <CardDescription className="text-base mt-2">
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
                    className="block border-l-4 border-medical-teal-400 pl-4 pr-3 py-3 hover:bg-gradient-to-r hover:from-medical-teal-50 hover:to-medical-indigo-50 transition-all rounded-r-xl hover:scale-102 group"
                  >
                    <p className="font-semibold text-sm line-clamp-1 text-gray-800 group-hover:text-medical-teal-700">{trial.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                      <Badge className="px-2 py-1 rounded-md bg-medical-indigo-100 text-medical-indigo-700 border-0">{trial.status}</Badge>
                      {trial.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-medical-teal-500" />
                          {trial.location}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-medical-indigo-600" />
              Community Forums
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Connect with others, ask questions, and get answers from researchers and the community 💬
            </p>
            <Link href="/patient/forums">
              <Button className="w-full py-6 rounded-xl font-semibold bg-white border-2 border-medical-indigo-300 text-medical-indigo-600 hover:bg-gradient-to-r hover:from-medical-indigo-50 hover:to-medical-lavender-50 hover:border-medical-indigo-400 transition-all duration-200 hover:scale-105 hover:shadow-lg group">
                Visit Forums <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
