'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle2, XCircle, Clock, MessageSquare, User, Phone, Calendar, Loader2, Send } from 'lucide-react';

interface MeetingRequest {
  _id: string;
  patientId?: {
    _id: string;
    name: string;
    email: string;
    medicalConditions?: string[];
  };
  patientName: string;
  patientContact: string;
  expertName: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
  responseMessage?: string;
}

export default function ResearcherMeetingRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  
  // Dialog states
  const [selectedRequest, setSelectedRequest] = useState<MeetingRequest | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Chat dialog
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [chatPatient, setChatPatient] = useState<any>(null);
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

  const openAcceptDialog = (request: MeetingRequest) => {
    setSelectedRequest(request);
    setActionType('accept');
    setResponseMessage(
      `Dear ${request.patientName},\n\n` +
      `Thank you for your interest in my research. I would be happy to meet with you to discuss potential collaboration or consultation.\n\n` +
      `Please let me know your availability, and we can arrange a suitable time.\n\n` +
      `Best regards`
    );
  };

  const openRejectDialog = (request: MeetingRequest) => {
    setSelectedRequest(request);
    setActionType('reject');
    setResponseMessage(
      `Dear ${request.patientName},\n\n` +
      `Thank you for your interest in my research. Unfortunately, I am unable to accommodate your meeting request at this time due to scheduling constraints.\n\n` +
      `I appreciate your understanding.\n\n` +
      `Best regards`
    );
  };

  const handleResponse = async () => {
    if (!selectedRequest || !actionType) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/experts/meeting-request/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          action: actionType,
          responseMessage,
        }),
      });

      if (response.ok) {
        alert(`Meeting request ${actionType}ed successfully!`);
        fetchRequests();
        setSelectedRequest(null);
        setActionType(null);
        setResponseMessage('');
      } else {
        alert(`Failed to ${actionType} request`);
      }
    } catch (error) {
      console.error('Response error:', error);
      alert('Failed to respond to request');
    } finally {
      setProcessing(false);
    }
  };

  const openChat = (request: MeetingRequest) => {
    if (!request.patientId) {
      alert('Cannot chat with this patient - patient not on platform');
      return;
    }
    
    setChatPatient(request.patientId);
    setChatMessage(
      `Hi ${request.patientName}, I've accepted your meeting request. ` +
      `Let's discuss the details here.`
    );
    setChatDialogOpen(true);
  };

  const sendChatMessage = async () => {
    if (!chatPatient || !chatMessage.trim()) return;

    setSendingMessage(true);
    try {
      const response = await fetch('/api/collaborators/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: chatPatient._id,
          message: chatMessage,
        }),
      });

      if (response.ok) {
        setChatDialogOpen(false);
        setChatMessage('');
        setChatPatient(null);
        // Redirect to Messages page
        router.push('/researcher/messages');
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
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              {request.patientName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Phone className="h-4 w-4" />
              {request.patientContact}
            </CardDescription>
          </div>
          <Badge
            variant={
              request.status === 'pending' ? 'secondary' :
              request.status === 'accepted' ? 'default' :
              'destructive'
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
        {/* Patient Conditions */}
        {request.patientId?.medicalConditions && request.patientId.medicalConditions.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Patient's Conditions:</p>
            <div className="flex flex-wrap gap-1">
              {request.patientId.medicalConditions.map((condition, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Request Message */}
        <div>
          <p className="text-sm font-medium mb-2">Request Message:</p>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {request.message}
            </p>
          </div>
        </div>

        {/* Response Message (if responded) */}
        {request.responseMessage && (
          <div>
            <p className="text-sm font-medium mb-2">Your Response:</p>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {request.responseMessage}
              </p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Requested: {new Date(request.createdAt).toLocaleDateString()}
          </span>
          {request.respondedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Responded: {new Date(request.respondedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>

      {/* Action Buttons */}
      {request.status === 'pending' && (
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => openAcceptDialog(request)}
            className="flex-1"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Accept Request
          </Button>
          <Button
            onClick={() => openRejectDialog(request)}
            variant="outline"
            className="flex-1"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Decline
          </Button>
        </CardFooter>
      )}

      {request.status === 'accepted' && request.patientId && (
        <CardFooter>
          <Button
            onClick={() => openChat(request)}
            className="w-full"
            variant="outline"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Chat with Patient
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meeting Requests</h1>
        <p className="text-gray-600">
          Manage meeting requests from patients interested in your research
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
                <p className="text-muted-foreground">No pending meeting requests</p>
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
                <p className="text-muted-foreground">No accepted meeting requests</p>
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

      {/* Accept/Reject Dialog */}
      <Dialog open={!!selectedRequest && !!actionType} onOpenChange={() => {
        setSelectedRequest(null);
        setActionType(null);
        setResponseMessage('');
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'accept' ? 'Accept' : 'Decline'} Meeting Request
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.patientName} - {selectedRequest?.patientContact}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="responseMessage">Response Message</Label>
              <Textarea
                id="responseMessage"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={8}
                placeholder="Write your response message..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                This message will be sent to the patient via their contact email/phone
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null);
                setActionType(null);
                setResponseMessage('');
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResponse}
              disabled={processing || !responseMessage.trim()}
              variant={actionType === 'accept' ? 'default' : 'destructive'}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {actionType === 'accept' ? (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  {actionType === 'accept' ? 'Accept Request' : 'Decline Request'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Start Chat with {chatPatient?.name}</DialogTitle>
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
