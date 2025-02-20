'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PatientForums() {
  const [threads, setThreads] = useState<any[]>([]);
  const [showNewThread, setShowNewThread] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/forums');
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Fetch threads error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      setTitle('');
      setContent('');
      setShowNewThread(false);
      fetchThreads();
    } catch (error) {
      console.error('Create thread error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Forums</h1>
          <p className="text-gray-600">Ask questions and get answers from researchers</p>
        </div>
        <Button onClick={() => setShowNewThread(!showNewThread)}>
          <Plus className="mr-2 h-4 w-4" />
          New Question
        </Button>
      </div>

      {showNewThread && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What's your question?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Details</Label>
                <Textarea
                  id="content"
                  placeholder="Provide more context..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Post Question</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewThread(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {threads.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No forum threads yet. Be the first to ask a question!
              </p>
            </CardContent>
          </Card>
        )}

        {threads.map((thread, i) => (
          <Link key={i} href={`/patient/forums/${thread._id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{thread.title}</CardTitle>
                <CardDescription>
                  Posted by {thread.userId?.name || 'Anonymous'} • {new Date(thread.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{thread.content}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{thread.replyCount || 0} replies</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
