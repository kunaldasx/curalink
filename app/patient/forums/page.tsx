'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Folder, Pin, CheckCircle2, Eye, MessageCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  topicCount: number;
  tags: string[];
}

interface Topic {
  _id: string;
  title: string;
  content: string;
  category: any;
  authorId: any;
  authorRole: 'patient' | 'researcher';
  replyCount: number;
  viewCount: number;
  isResolved: boolean;
  isPinned: boolean;
  lastActivityAt: string;
  createdAt: string;
}

export default function PatientForums() {
  const router = useRouter();
  const [view, setView] = useState<'categories' | 'topics'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchTopics(selectedCategory._id);
    }
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forum/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (categoryId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/topics?categoryId=${categoryId}&sortBy=${sortBy}`);
      const data = await res.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error('Fetch topics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setView('topics');
  };

  const handleBackToCategories = () => {
    setView('categories');
    setSelectedCategory(null);
  };

  const handleAskQuestion = () => {
    if (selectedCategory) {
      router.push(`/patient/forums/new?category=${selectedCategory._id}`);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  // Categories View
  if (view === 'categories') {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Health Q&A Forums</h1>
          <p className="text-gray-600">
            Ask questions and get verified answers from medical researchers and experts
          </p>
        </div>

        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Medical-Grade Q&A Platform</p>
                <p className="text-xs text-blue-700">
                  • Only verified researchers can answer questions<br />
                  • Post your questions in relevant categories<br />
                  • All answers are from medical professionals<br />
                  • No peer-to-peer medical advice
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading && (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">Loading categories...</p>
              </CardContent>
            </Card>
          )}

          {!loading && categories.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <Folder className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No forum categories yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}

          {categories.map((category) => (
            <Card
              key={category._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Folder className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{category.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                      {category.tags && category.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {category.tags.slice(0, 5).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {category.topicCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">questions</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Topics View
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBackToCategories} className="mb-4">
          ← Back to Categories
        </Button>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{selectedCategory?.name}</h1>
            <p className="text-gray-600">{selectedCategory?.description}</p>
          </div>
          <Button onClick={handleAskQuestion} className="flex-shrink-0">
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask Question
          </Button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        <Button
          variant={sortBy === 'recent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('recent')}
        >
          Recent Activity
        </Button>
        <Button
          variant={sortBy === 'oldest' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('oldest')}
        >
          Oldest First
        </Button>
        <Button
          variant={sortBy === 'most-answered' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('most-answered')}
        >
          Most Answered
        </Button>
      </div>

      <div className="space-y-3">
        {loading && (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <p className="text-muted-foreground">Loading questions...</p>
            </CardContent>
          </Card>
        )}

        {!loading && topics.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                No questions in this category yet
              </p>
              <Button onClick={handleAskQuestion} size="sm">
                Be the first to ask
              </Button>
            </CardContent>
          </Card>
        )}

        {topics.map((topic) => (
          <Link key={topic._id} href={`/patient/forums/topic/${topic._id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Stats Sidebar */}
                  <div className="flex flex-col items-center gap-2 text-center min-w-[80px]">
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        {topic.replyCount || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">answers</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {topic.viewCount || 0}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      {topic.isPinned && (
                        <Pin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                      )}
                      {topic.isResolved && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                      )}
                      <h3 className="font-semibold text-lg leading-tight hover:text-blue-600">
                        {topic.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {topic.content}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Asked by {topic.authorId?.name || 'Anonymous'}
                        {topic.authorRole === 'researcher' && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            Researcher
                          </Badge>
                        )}
                      </span>
                      <span>•</span>
                      <span>{formatTimeAgo(topic.lastActivityAt || topic.createdAt)}</span>
                      {topic.isResolved && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">✓ Answered</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
