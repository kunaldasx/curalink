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
          Researcher Dashboard
        </h1>
        <p className="text-lg text-gray-700">
          Welcome back{user?.name ? `, ${user.name}` : ''}! 👋 Ready to make a difference today?
        </p>
      </div>

      {user?.specialties && user.specialties.length > 0 && (
        <Card className="mb-8 rounded-2xl shadow-lg border-0 overflow-hidden animate-fade-in">
          <CardContent className="pt-6 pb-6">
            <p className="text-base font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="text-xl">🎯</span> Your specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {user.specialties.map((specialty: string, i: number) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-gradient-to-r from-medical-teal-100 to-medical-indigo-100 text-medical-teal-700 border border-medical-teal-300 font-medium hover:scale-105 transition-transform duration-200">
                  {specialty}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in">
          <div className="h-2 bg-gradient-to-r from-medical-teal-400 to-medical-indigo-400" />
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-teal-100 to-medical-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <FlaskConical className="h-8 w-8 text-medical-teal-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Clinical Trials</CardTitle>
            <CardDescription className="text-base mt-2">
              <span className="font-semibold text-medical-teal-600">
                {stats.trials} active trial{stats.trials !== 1 ? 's' : ''}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/researcher/clinical-trials">
              <Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 group-hover:shadow-lg">
                Manage Trials <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="h-2 bg-gradient-to-r from-medical-indigo-400 to-medical-lavender-400" />
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-indigo-100 to-medical-lavender-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Users className="h-8 w-8 text-medical-indigo-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Collaborators</CardTitle>
            <CardDescription className="text-base mt-2">
              <span className="font-semibold text-medical-indigo-600">
                {stats.collaborators} connection{stats.collaborators !== 1 ? 's' : ''}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/researcher/collaborators">
              <Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-medical-indigo-500 to-medical-lavender-500 hover:from-medical-indigo-600 hover:to-medical-lavender-600 text-white transition-all duration-200 hover:scale-105 group-hover:shadow-lg">
                Find Collaborators <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="h-2 bg-gradient-to-r from-medical-lavender-400 to-medical-teal-400" />
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-lavender-100 to-medical-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <MessageSquare className="h-8 w-8 text-medical-lavender-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Forum Questions</CardTitle>
            <CardDescription className="text-base mt-2">
              <span className="font-semibold text-medical-lavender-600">
                {stats.pendingQuestions} need{stats.pendingQuestions !== 1 ? '' : 's'} your expertise
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/researcher/forums">
              <Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-medical-lavender-500 to-medical-teal-500 hover:from-medical-lavender-600 hover:to-medical-teal-600 text-white transition-all duration-200 hover:scale-105 group-hover:shadow-lg">
                Answer Questions <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="rounded-2xl shadow-lg border-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/researcher/clinical-trials/new">
              <Button className="w-full py-5 rounded-xl font-semibold bg-white border-2 border-medical-teal-300 text-medical-teal-600 hover:bg-gradient-to-r hover:from-medical-teal-50 hover:to-medical-indigo-50 hover:border-medical-teal-400 transition-all duration-200 hover:scale-105 hover:shadow-lg justify-start group">
                <span className="text-lg mr-2">+</span>
                <span>Add New Clinical Trial</span>
              </Button>
            </Link>
            <Link href="/researcher/forums">
              <Button className="w-full py-5 rounded-xl font-semibold bg-white border-2 border-medical-indigo-300 text-medical-indigo-600 hover:bg-gradient-to-r hover:from-medical-indigo-50 hover:to-medical-lavender-50 hover:border-medical-indigo-400 transition-all duration-200 hover:scale-105 hover:shadow-lg justify-start group">
                <span className="text-lg mr-2">+</span>
                <span>Create Research Discussion</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">📊 Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-medical-teal-100 to-medical-indigo-100 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-medical-teal-600" />
              </div>
              <p className="text-base text-gray-600">
                Your recent activities will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
