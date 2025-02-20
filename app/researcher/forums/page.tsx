'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MessageSquare, Folder, Plus, Pin, CheckCircle2, Eye, Shield, Flag, EyeOff } from 'lucide-react';
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
  isHidden: boolean;
  isFlagged: boolean;
  lastActivityAt: string;
  createdAt: string;
}

export default function ResearcherForums() {
  const router = useRouter();
  const [view, setView] = useState<'categories' | 'topics'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  
  // Create Category Dialog
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryTags, setCategoryTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const tags = categoryTags.split(',').map(t => t.trim()).filter(t => t);
      const res = await fetch('/api/forum/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription,
          tags,
        }),
      });

      if (res.ok) {
        setCategoryName('');
        setCategoryDescription('');
        setCategoryTags('');
        setShowCreateCategory(false);
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Create category error:', error);
      alert('Failed to create category');
    } finally {
      setSubmitting(false);
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
      router.push(`/researcher/forums/new?category=${selectedCategory._id}`);
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
        {/* Page Header with Gradient */}
        <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-lg animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3"
                style={{
                  background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Community Forums
              </h1>
              <p className="text-lg text-gray-700">
                💬 Create communities, answer patient questions, and share medical expertise
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateCategory(true)}
              className="px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Category
            </Button>
          </div>
        </div>

        <Card className="mb-8 rounded-2xl shadow-lg border-0 overflow-hidden animate-fade-in">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-800 mb-3">Researcher Privileges</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">✓ Create and moderate forum categories</p>
                  <p className="flex items-center gap-2">✓ Answer patient questions with verified responses</p>
                  <p className="flex items-center gap-2">✓ Lead discussions and share expertise</p>
                  <p className="flex items-center gap-2">✓ Pin, hide, and flag content for quality control</p>
                </div>
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
                <p className="text-muted-foreground mb-2">
                  No forum categories yet
                </p>
                <Button onClick={() => setShowCreateCategory(true)}>
                  Create First Category
                </Button>
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
                    <Folder className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
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
                    <div className="text-xs text-muted-foreground">topics</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Create Category Dialog */}
        <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Create a new discussion space for patients and researchers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCategory}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Clinical Trials, Cancer Research"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this category is for..."
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    rows={3}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., phase-1, eligibility, oncology"
                    value={categoryTags}
                    onChange={(e) => setCategoryTags(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateCategory(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Category'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
            New Topic
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
              <p className="text-muted-foreground">Loading topics...</p>
            </CardContent>
          </Card>
        )}

        {!loading && topics.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                No topics in this category yet
              </p>
              <Button onClick={handleAskQuestion} size="sm">
                Start a discussion
              </Button>
            </CardContent>
          </Card>
        )}

        {topics.map((topic) => (
          <Link key={topic._id} href={`/researcher/forums/topic/${topic._id}`}>
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
                        <Pin className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                      )}
                      {topic.isResolved && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                      )}
                      {topic.isHidden && (
                        <EyeOff className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                      )}
                      {topic.isFlagged && (
                        <Flag className="h-4 w-4 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <h3 className="font-semibold text-lg leading-tight hover:text-green-600">
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
                      {topic.isHidden && (
                        <>
                          <span>•</span>
                          <span className="text-gray-500">Hidden</span>
                        </>
                      )}
                      {topic.isFlagged && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">Flagged</span>
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
