'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NewTopic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await fetch('/api/forum/categories');
      const data = await res.json();
      const cat = data.categories.find((c: any) => c._id === categoryId);
      setCategory(cat);
    } catch (error) {
      console.error('Fetch category error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/forum/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/patient/forums/topic/${data.topic._id}`);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to post question');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Failed to post question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
        {category && (
          <p className="text-gray-600">
            Posting in <span className="font-semibold">{category.name}</span>
          </p>
        )}
      </div>

      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Posting Guidelines</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Be clear and specific with your question</li>
                <li>• Only verified researchers can provide answers</li>
                <li>• Avoid sharing personal medical information publicly</li>
                <li>• Be respectful and patient while waiting for responses</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Your Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Question Title *</Label>
              <Input
                id="title"
                placeholder="What would you like to know?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                minLength={10}
                maxLength={300}
                required
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {title.length}/300 characters (minimum 10 required)
              </p>
            </div>

            <div>
              <Label htmlFor="content">Detailed Question *</Label>
              <Textarea
                id="content"
                placeholder="Provide details to help researchers understand and answer your question. Be specific about what information you're looking for."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                minLength={20}
                maxLength={10000}
                required
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {content.length}/10,000 characters (minimum 20 required)
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={submitting || title.length < 10 || content.length < 20}>
                {submitting ? 'Posting...' : 'Post Question'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
