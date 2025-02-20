'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, UserPlus, Check, X, MessageCircle, Send, BookOpen, MapPin, Loader2, UserMinus, Bookmark } from 'lucide-react';

type TabType = 'search' | 'connections' | 'pending';

export default function ResearcherCollaborators() {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [query, setQuery] = useState('');
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [connections, setConnections] = useState<any>({
    accepted: [],
    pendingSent: [],
    pendingReceived: [],
  });
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [savedCollaborators, setSavedCollaborators] = useState<Set<string>>(new Set());

  // Debug: Log connections state changes
  useEffect(() => {
    console.log('Connections updated:', {
      accepted: connections.accepted.length,
      pendingSent: connections.pendingSent.length,
      pendingReceived: connections.pendingReceived.length,
    });
  }, [connections]);

  // Debug: Log actionLoading changes
  useEffect(() => {
    console.log('actionLoading changed to:', actionLoading);
  }, [actionLoading]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collaborators/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setCollaborators(data.collaborators || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/collaborators/connections');
      const data = await res.json();
      setConnections(data);
    } catch (error) {
      console.error('Fetch connections error:', error);
    }
  };

  // Initial load on mount
  useEffect(() => {
    // Ensure actionLoading is null on mount
    setActionLoading(null);
    handleSearch();
    fetchConnections();
    loadSavedCollaborators();
  }, []);

  const loadSavedCollaborators = async () => {
    try {
      const res = await fetch('/api/favorites?type=collaborator');
      const data = await res.json();
      const collabIds = new Set(data.favorites.map((f: any) => f.refId));
      setSavedCollaborators(collabIds);
    } catch (error) {
      console.error('Load saved collaborators error:', error);
    }
  };

  const handleToggleSave = async (collaboratorId: string, collaboratorName: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          refType: 'collaborator', 
          refId: collaboratorId,
          metadata: { name: collaboratorName }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.isFavorite) {
          setSavedCollaborators(prev => new Set(prev).add(collaboratorId));
        } else {
          setSavedCollaborators(prev => {
            const newSet = new Set(prev);
            newSet.delete(collaboratorId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Toggle save error:', error);
    }
  };

  // Update on tab change
  useEffect(() => {
    if (activeTab === 'connections' || activeTab === 'pending') {
      fetchConnections();
    }
  }, [activeTab]);

  const sendConnectionRequest = async (recipientId: string) => {
    console.log('Sending connection request to:', recipientId);
    setActionLoading(recipientId);
    try {
      const response = await fetch('/api/collaborators/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Connection request failed:', errorData);
        throw new Error(errorData.error || 'Failed to send request');
      }
      
      // Force immediate refresh of connections to update counts
      const res = await fetch('/api/collaborators/connections');
      const data = await res.json();
      setConnections(data);
      
      // Refresh search to update button states
      await handleSearch();
      
      console.log('Connection request sent successfully, actionLoading cleared');
    } catch (error) {
      console.error('Connection request error:', error);
      alert('Failed to send connection request');
    } finally {
      console.log('Clearing actionLoading state');
      setActionLoading(null);
    }
  };

  const handleConnectionResponse = async (connectionId: string, action: 'accept' | 'reject') => {
    setActionLoading(connectionId);
    try {
      const response = await fetch('/api/collaborators/connections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId, action }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to respond to request');
      }
      
      // Force immediate refresh
      const res = await fetch('/api/collaborators/connections');
      const data = await res.json();
      setConnections(data);
      
      if (activeTab === 'search') {
        await handleSearch(); // Also refresh search to update connection statuses
      }
      
      console.log(`Connection ${action}ed successfully`);
    } catch (error) {
      console.error('Response error:', error);
      alert(`Failed to ${action} connection`);
    } finally {
      setActionLoading(null);
    }
  };

  const removeConnection = async (connectionId: string) => {
    if (!confirm('Are you sure you want to remove this connection?')) {
      return;
    }
    
    setActionLoading(connectionId);
    try {
      const response = await fetch(`/api/collaborators/connections?connectionId=${connectionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove connection');
      }
      
      // Force immediate refresh
      const res = await fetch('/api/collaborators/connections');
      const data = await res.json();
      setConnections(data);
      
      if (activeTab === 'search') {
        await handleSearch();
      }
      
      console.log('Connection removed successfully');
    } catch (error) {
      console.error('Remove connection error:', error);
      alert('Failed to remove connection');
    } finally {
      setActionLoading(null);
    }
  };

  const openChat = async (user: any) => {
    setSelectedUser(user);
    setChatOpen(true);
    await fetchMessages(user._id);
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/collaborators/messages?userId=${userId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    setSendingMessage(true);
    try {
      await fetch('/api/collaborators/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedUser._id,
          content: newMessage,
        }),
      });
      setNewMessage('');
      await fetchMessages(selectedUser._id);
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const renderCollaboratorCard = (collab: any) => (
    <Card key={collab._id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{collab.name}</CardTitle>
            {collab.email && (
              <p className="text-sm text-muted-foreground mb-1">{collab.email}</p>
            )}
            {collab.location?.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <MapPin className="h-3 w-3" />
                {collab.location.city}, {collab.location.country}
              </p>
            )}
          </div>
          <div className="flex gap-2 items-start">
            <Button
              variant={savedCollaborators.has(collab._id) ? "default" : "ghost"}
              size="icon"
              onClick={() => handleToggleSave(collab._id, collab.name)}
              title={savedCollaborators.has(collab._id) ? "Remove from library" : "Save to library"}
              className={savedCollaborators.has(collab._id) ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              <Bookmark className={`h-4 w-4 ${savedCollaborators.has(collab._id) ? 'fill-white' : ''}`} />
            </Button>
            {renderConnectionButton(collab)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Specialties */}
        {collab.specialties && collab.specialties.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {collab.specialties.map((spec: string, i: number) => (
                <Badge key={i} variant="default">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Research Interests */}
        {collab.interests && collab.interests.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Research Interests</p>
            <div className="flex flex-wrap gap-2">
              {collab.interests.map((interest: string, i: number) => (
                <Badge key={i} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recent Publications */}
        {collab.publications && collab.publications.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Recent Publications
            </p>
            <div className="space-y-2">
              {collab.publications.map((pub: any, i: number) => (
                <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                  <p className="font-medium">{pub.title}</p>
                  {pub.summary && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {pub.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORCID */}
        {collab.orcidId && (
          <div className="text-xs text-muted-foreground">
            ORCID: {collab.orcidId}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderConnectionButton = (collab: any) => {
    // More defensive loading check - ensure actionLoading is truthy and matches
    const isLoading = actionLoading !== null && 
                     (actionLoading === collab._id || actionLoading === collab.connectionId);
    
    // Debug logging
    if (isLoading) {
      console.log('Button loading for:', collab.name, 'actionLoading:', actionLoading, 'collab._id:', collab._id, 'collab.connectionId:', collab.connectionId);
    }
    
    if (collab.connectionStatus === 'connected') {
      return (
        <div className="flex gap-2">
          <Button onClick={() => openChat(collab)} size="sm" disabled={isLoading}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button
            onClick={() => removeConnection(collab.connectionId)}
            size="sm"
            variant="outline"
            disabled={isLoading}
            title="Remove connection"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserMinus className="h-4 w-4" />
            )}
          </Button>
        </div>
      );
    } else if (collab.connectionStatus === 'pending_sent') {
      return (
        <Badge variant="secondary">Request Sent</Badge>
      );
    } else if (collab.connectionStatus === 'pending_received') {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConnectionResponse(collab.connectionId, 'accept')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-1 h-4 w-4" />
            )}
            Accept
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleConnectionResponse(collab.connectionId, 'reject')}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      return (
        <Button
          onClick={() => sendConnectionRequest(collab._id)}
          size="sm"
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Connect
        </Button>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Collaborators</h1>
        <p className="text-gray-600">Connect with researchers and build your network</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'search'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Search className="inline h-4 w-4 mr-2" />
          Search Collaborators
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'connections'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          My Connections ({connections.accepted.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'pending'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending ({connections.pendingReceived.length})
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Search by name, specialty, or research interest..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {collaborators.map(renderCollaboratorCard)}
          </div>

          {collaborators.length === 0 && !loading && (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Search for researchers by specialty or research interest
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="grid md:grid-cols-2 gap-4">
          {connections.accepted.map((conn: any) =>
            renderCollaboratorCard({
              ...conn.user,
              connectionStatus: 'connected',
              connectionId: conn.connectionId,
            })
          )}
          {connections.accepted.length === 0 && (
            <Card className="col-span-2">
              <CardContent className="pt-6 text-center py-8">
                <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No connections yet. Search for collaborators to get started!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Pending Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {connections.pendingReceived.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {connections.pendingReceived.map((conn: any) =>
                  renderCollaboratorCard({
                    ...conn.user,
                    connectionStatus: 'pending_received',
                    connectionId: conn.connectionId,
                  })
                )}
              </div>
            </div>
          )}

          {connections.pendingSent.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Sent Requests</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {connections.pendingSent.map((conn: any) =>
                  renderCollaboratorCard({
                    ...conn.user,
                    connectionStatus: 'pending_sent',
                    connectionId: conn.connectionId,
                  })
                )}
              </div>
            </div>
          )}

          {connections.pendingReceived.length === 0 &&
            connections.pendingSent.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center py-8">
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            )}
        </div>
      )}

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-2xl max-h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chat with {selectedUser?.name}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === selectedUser?._id ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === selectedUser?._id
                      ? 'bg-white text-gray-900'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={2}
              className="resize-none"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              size="icon"
              className="shrink-0"
            >
              {sendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
