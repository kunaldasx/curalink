'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Loader2, User, Users, Stethoscope, Search, Clock } from 'lucide-react';

interface Message {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  userId: string;
  userName: string;
  userRole: string;
  userEmail?: string;
  userSpecialization?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function ResearcherMessages() {
  const [activeTab, setActiveTab] = useState('patients');
  const [patientConversations, setPatientConversations] = useState<Conversation[]>([]);
  const [collaboratorConversations, setCollaboratorConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<'patient' | 'collaborator'>('patient');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
      const interval = setInterval(() => fetchMessages(selectedUserId), 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUserId(data.user?.id || '');
    } catch (error) {
      console.error('Get current user error:', error);
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // Fetch all conversations (from meeting requests)
      const patientRes = await fetch('/api/messages/conversations');
      const patientData = await patientRes.json();
      
      // Filter to only include actual patients (not researchers)
      const onlyPatients = (patientData.conversations || []).filter(
        (conv: Conversation) => conv.userRole !== 'researcher' && conv.userRole !== 'Researcher'
      );
      setPatientConversations(onlyPatients);

      // Fetch collaborator conversations (from connections)
      const collabRes = await fetch('/api/collaborators/connections');
      const collabData = await collabRes.json();
      
      // Only process accepted connections
      const acceptedConnections = collabData.accepted || [];
      
      // Transform collaborator connections to conversation format
      const collabConvs = await Promise.all(
        acceptedConnections.map(async (conn: any) => {
          // Fetch last message for this collaborator
          try {
            const msgRes = await fetch(`/api/collaborators/messages?userId=${conn.user._id}`);
            const msgData = await msgRes.json();
            const lastMsg = msgData.messages?.[msgData.messages.length - 1];
            
            return {
              userId: conn.user._id,
              userName: conn.user.name,
              userRole: 'Researcher',
              userEmail: conn.user.email,
              userSpecialization: conn.user.specialization || conn.user.specialties?.[0],
              lastMessage: lastMsg?.content || 'Start a conversation',
              lastMessageTime: lastMsg?.createdAt || conn.createdAt,
              unreadCount: 0, // TODO: implement unread count for collaborators
            };
          } catch (error) {
            console.error('Error fetching collaborator messages:', error);
            return {
              userId: conn.user._id,
              userName: conn.user.name,
              userRole: 'Researcher',
              userEmail: conn.user.email,
              userSpecialization: conn.user.specialization || conn.user.specialties?.[0],
              lastMessage: 'Start a conversation',
              lastMessageTime: conn.createdAt,
              unreadCount: 0,
            };
          }
        })
      );
      
      setCollaboratorConversations(collabConvs);
    } catch (error) {
      console.error('Fetch conversations error:', error);
    } finally {
      setLoading(false);
    }
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
    if (!newMessage.trim() || !selectedUserId) return;

    setSending(true);
    try {
      const response = await fetch('/api/collaborators/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: selectedUserId,
          message: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedUserId);
        fetchConversations(); // Update conversation list
      } else {
        const errorData = await response.json();
        alert(`Failed to send: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Send error:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const allConversations = [...patientConversations, ...collaboratorConversations];
  const selectedConversation = allConversations.find(c => c.userId === selectedUserId);
  
  // Filter conversations based on search
  const filteredPatients = patientConversations.filter(c => 
    c.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCollaborators = collaboratorConversations.filter(c => 
    c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.userSpecialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalUnreadPatients = patientConversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const totalUnreadCollaborators = collaboratorConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const handleSelectConversation = (userId: string, type: 'patient' | 'collaborator') => {
    setSelectedUserId(userId);
    setSelectedUserType(type);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Conversations List with Tabs */}
      <Card className="w-full md:w-96 flex flex-col rounded-2xl shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-medical-teal-50 to-medical-indigo-50 border-b-2 border-medical-teal-100">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal-400 to-medical-indigo-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Messages</span>
          </CardTitle>
        </CardHeader>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patients" className="relative">
                <Stethoscope className="h-4 w-4 mr-2" />
                Patients
                {totalUnreadPatients > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1 text-xs">
                    {totalUnreadPatients}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="collaborators" className="relative">
                <Users className="h-4 w-4 mr-2" />
                Researchers
                {totalUnreadCollaborators > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1 text-xs">
                    {totalUnreadCollaborators}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="flex-1 overflow-y-auto p-0 mt-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {/* Patients Tab */}
                <TabsContent value="patients" className="mt-0">
                  {filteredPatients.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">
                        {searchQuery ? 'No patients found' : 'No patient conversations'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {searchQuery ? 'Try a different search term' : 'Conversations appear when you accept meeting requests'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredPatients.map((conv) => (
                        <button
                          key={conv.userId}
                          onClick={() => handleSelectConversation(conv.userId, 'patient')}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                            selectedUserId === conv.userId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Stethoscope className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm truncate">{conv.userName}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    Patient
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge variant="default" className="text-xs ml-2 flex-shrink-0">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate ml-12">{conv.lastMessage}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 ml-12">
                            <Clock className="h-3 w-3" />
                            {new Date(conv.lastMessageTime).toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Collaborators Tab */}
                <TabsContent value="collaborators" className="mt-0">
                  {filteredCollaborators.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">
                        {searchQuery ? 'No researchers found' : 'No collaborator conversations'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {searchQuery ? 'Try a different search term' : 'Connect with researchers to start conversations'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredCollaborators.map((conv) => (
                        <button
                          key={conv.userId}
                          onClick={() => handleSelectConversation(conv.userId, 'collaborator')}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                            selectedUserId === conv.userId ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <Users className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm truncate">{conv.userName}</span>
                                </div>
                                {conv.userSpecialization && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {conv.userSpecialization}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge variant="default" className="text-xs ml-2 flex-shrink-0">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate ml-12">{conv.lastMessage}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 ml-12">
                            <Clock className="h-3 w-3" />
                            {new Date(conv.lastMessageTime).toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </CardContent>
        </Tabs>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  selectedUserType === 'patient' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  {selectedUserType === 'patient' ? (
                    <Stethoscope className={`h-6 w-6 text-blue-600`} />
                  ) : (
                    <Users className={`h-6 w-6 text-purple-600`} />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {selectedConversation?.userName || 'User'}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={selectedUserType === 'patient' ? 'secondary' : 'outline'} className="text-xs">
                      {selectedUserType === 'patient' ? 'Patient' : 'Researcher'}
                    </Badge>
                    {selectedConversation?.userSpecialization && (
                      <Badge variant="outline" className="text-xs">
                        {selectedConversation.userSpecialization}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  // Convert to string for comparison (handles ObjectId)
                  const senderId = typeof msg.sender === 'string' ? msg.sender : String(msg.sender || '');
                  const isOwn = senderId === currentUserId;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwn
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type your message..."
                  disabled={sending}
                />
                <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
