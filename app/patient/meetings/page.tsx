'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle2, XCircle, Clock, MessageSquare, User, Calendar, Loader2, Send, UserCircle } from 'lucide-react';

interface MeetingRequest {
  _id: string;
  expertId?: {
    _id: string;
    name: string;
    email: string;
    specialties?: string[];
    institution?: string;
  };
  expertName: string;
  patientName: string;
  patientContact: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
  responseMessage?: string;
}

export default function PatientMeetings() {
  const router = useRouter();
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  
  // Chat dialog
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [chatExpert, setChatExpert] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experts/meeting-request');
      const data = await res.json();
      setRequests(data.meetingRequests || []);
    } catch (error) {
      console.error('Fetch requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (request: MeetingRequest) => {
    if (!request.expertId) {
      alert('Cannot chat with this researcher - researcher not on platform');
      return;
    }
    
    setChatExpert(request.expertId);
    setChatMessage(
      `Hi Dr. ${request.expertName}, thank you for accepting my meeting request. ` +
      `I'd like to discuss the next steps.`
    );
    setChatDialogOpen(true);
  };

  const sendChatMessage = async () => {
    if (!chatExpert || !chatMessage.trim()) return;

    setSendingMessage(true);
    try {
      // Extract the user ID - handle both object and string formats
      const recipientId = typeof chatExpert === 'string' ? chatExpert : (chatExpert._id || chatExpert.id);
      
      console.log('Sending message to:', recipientId);
      
      const response = await fetch('/api/collaborators/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: recipientId,
          message: chatMessage,
        }),
      });

      if (response.ok) {
        setChatDialogOpen(false);
        setChatMessage('');
        setChatExpert(null);
        // Redirect to Messages page
        router.push('/patient/messages');
      } else {
        const errorData = await response.json();
        console.error('Send message error:', errorData);
        alert(`Failed to send message: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Send message error:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const renderRequest = (request: MeetingRequest) => (
    <Card key={request._id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Dr. {request.expertName}
            </CardTitle>
            {request.expertId?.specialties && request.expertId.specialties.length > 0 && (
              <CardDescription className="mt-1">
                {request.expertId.specialties.join(', ')}
              </CardDescription>
            )}
            {request.expertId?.institution && (
              <CardDescription className="mt-1 text-xs">
                {request.expertId.institution}
              </CardDescription>
            )}
          </div>
          <Badge
            variant={
              request.status === 'pending' ? 'secondary' :
              request.status === 'accepted' ? 'default' :
              'destructive'
            }
            className={
              request.status === 'accepted' ? 'bg-green-600' : ''
            }
          >
            {request.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
            {request.status === 'accepted' && <CheckCircle2 className="mr-1 h-3 w-3" />}
            {request.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Your Request Message */}
        <div>
          <p className="text-sm font-medium mb-2">Your Request Message:</p>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {request.message}
            </p>
          </div>
        </div>

        {/* Researcher's Response (if responded) */}
        {request.responseMessage && (
          <div>
            <p className="text-sm font-medium mb-2">
              {request.status === 'accepted' ? "Researcher's Acceptance:" : "Researcher's Response:"}
            </p>
            <div className={`p-3 rounded-lg border ${
              request.status === 'accepted' 
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
            }`}>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {request.responseMessage}
              </p>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {request.status === 'pending' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⏳ Your meeting request is pending. The researcher will review it soon.
            </p>
          </div>
        )}

        {request.status === 'accepted' && !request.responseMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Your meeting request has been accepted! Start a conversation below.
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Sent: {new Date(request.createdAt).toLocaleDateString()}
          </span>
          {request.respondedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {request.status === 'accepted' ? 'Accepted' : 'Responded'}: {new Date(request.respondedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>

      {/* Action Buttons */}
      {request.status === 'accepted' && request.expertId && (
        <CardFooter>
          <Button
            onClick={() => openChat(request)}
            className="w-full"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Chat with Researcher
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Meeting Requests</h1>
        <p className="text-gray-600">
          Track your meeting requests with researchers and start conversations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{acceptedRequests.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Declined</p>
                <p className="text-2xl font-bold">{rejectedRequests.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Declined ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {loading ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-muted-foreground">Loading requests...</p>
              </CardContent>
            </Card>
          ) : pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">No pending meeting requests</p>
                <p className="text-sm text-muted-foreground">
                  Find researchers in the Health Experts section and request meetings
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map(renderRequest)
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4 mt-6">
          {acceptedRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground">No accepted meeting requests yet</p>
              </CardContent>
            </Card>
          ) : (
            acceptedRequests.map(renderRequest)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {rejectedRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <XCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground">No declined meeting requests</p>
              </CardContent>
            </Card>
          ) : (
            rejectedRequests.map(renderRequest)
          )}
        </TabsContent>
      </Tabs>

      {/* Chat Dialog */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Start Chat with Dr. {chatExpert?.name}</DialogTitle>
            <DialogDescription>
              Send your first message to begin the conversation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="chatMessage">Message</Label>
              <Textarea
                id="chatMessage"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={6}
                placeholder="Type your message..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChatDialogOpen(false)}
              disabled={sendingMessage}
            >
              Cancel
            </Button>
            <Button
              onClick={sendChatMessage}
              disabled={sendingMessage || !chatMessage.trim()}
            >
              {sendingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
