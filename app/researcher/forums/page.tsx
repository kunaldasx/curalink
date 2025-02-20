'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function ResearcherForums() {
  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    const res = await fetch('/api/forums');
    const data = await res.json();
    setThreads(data.threads || []);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Forum Discussions</h1>
      <p className="text-gray-600 mb-8">Answer patient questions and share expertise</p>

      <div className="space-y-4">
        {threads.map((thread, i) => (
          <Link key={i} href={`/researcher/forums/${thread._id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{thread.title}</CardTitle>
                <CardDescription>
                  Posted by {thread.userId?.name} • {thread.replyCount || 0} replies
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
