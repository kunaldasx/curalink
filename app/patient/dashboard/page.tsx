'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Users, BookOpen, ArrowRight } from 'lucide-react';

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [recommendations, setRecommendations] = useState({
    trials: [],
    experts: [],
    publications: [],
  });

  useEffect(() => {
    fetchUserData();
    fetchRecommendations();
  }, []);

  const fetchUserData = async () => {
    const res = await fetch('/api/user/me');
    const data = await res.json();
    setUser(data);
  };

  const fetchRecommendations = async () => {
    const res = await fetch('/api/recommendations');
    const data = await res.json();
    setRecommendations(data);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back{user?.name ? `, ${user.name}` : ''}! Here are your personalized recommendations.
        </p>
      </div>

      {user?.medicalConditions && user.medicalConditions.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Tracking conditions:</p>
            <div className="flex flex-wrap gap-2">
              {user.medicalConditions.map((condition: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {condition}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <FlaskConical className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Clinical Trials</CardTitle>
            <CardDescription>
              {recommendations.trials.length} matching trials found
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
              Connect with specialists
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
              Latest research and articles
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
          </CardHeader>
          <CardContent>
            {recommendations.trials.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Complete your profile to see personalized trial recommendations
              </p>
            ) : (
              <div className="space-y-3">
                {recommendations.trials.slice(0, 3).map((trial: any, i: number) => (
                  <div key={i} className="border-l-4 border-primary pl-3">
                    <p className="font-medium text-sm">{trial.title || 'Clinical Trial'}</p>
                    <p className="text-xs text-muted-foreground">{trial.status}</p>
                  </div>
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
