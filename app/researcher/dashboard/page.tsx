'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Users, MessageSquare, ArrowRight } from 'lucide-react';

export default function ResearcherDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    trials: 0,
    collaborators: 0,
    pendingQuestions: 0,
  });

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    const res = await fetch('/api/user/me');
    const data = await res.json();
    setUser(data);
  };

  const fetchStats = async () => {
    const res = await fetch('/api/researcher/stats');
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Researcher Dashboard</h1>
        <p className="text-gray-600">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </p>
      </div>

      {user?.specialties && user.specialties.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Your specialties:</p>
            <div className="flex flex-wrap gap-2">
              {user.specialties.map((specialty: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {specialty}
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
              Manage your {stats.trials} active trials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/researcher/clinical-trials">
              <Button className="w-full">
                Manage Trials <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Collaborators</CardTitle>
            <CardDescription>
              {stats.collaborators} connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/researcher/collaborators">
              <Button className="w-full">
                Find Collaborators <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Forum Questions</CardTitle>
            <CardDescription>
              {stats.pendingQuestions} need your expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/researcher/forums">
              <Button className="w-full">
                Answer Questions <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/researcher/clinical-trials/new">
              <Button variant="outline" className="w-full justify-start">
                + Add New Clinical Trial
              </Button>
            </Link>
            <Link href="/researcher/forums">
              <Button variant="outline" className="w-full justify-start">
                + Create Research Discussion
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your recent activities will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
