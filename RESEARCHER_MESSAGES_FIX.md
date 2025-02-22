# ✅ Researcher Messages Integration Fix

## Problem
When researchers connected with collaborators in `/researcher/collaborators` and chatted after connection acceptance, their conversations did NOT appear in the `/researcher/messages` page.

---

## Root Cause
The `/api/messages/conversations` endpoint was **intentionally filtering out** researcher-to-researcher conversations with this code:

```typescript
// OLD CODE - Skipped researcher-to-researcher conversations
if (currentUser.role === 'researcher' && otherUser.role === 'researcher') {
  continue; // Skip this conversation
}
```

Additionally, the `/researcher/messages` page expected these endpoints that didn't exist:
- `/api/messages` (GET/POST) - for fetching and sending messages
- `/api/messages/mark-read` (POST) - for marking messages as read

---

## Solution Implemented

### **1. Modified `/api/messages/conversations/route.ts`**

**Changes:**
- ✅ **Removed the filter** that was skipping researcher-to-researcher conversations
- ✅ **Added logic** to mark researcher-to-researcher conversations as `userRole: 'collaborator'` so they appear in the "Collaborators" tab
- ✅ **Added specialization field** to conversation objects for display in UI
- ✅ **Populated specialization** from User model
- ✅ **Added success flag** to response

**New Logic:**
```typescript
// Include all conversations (removed filter)
// For researchers: mark other researchers as "collaborator" for UI filtering
const userRole = currentUser.role === 'researcher' && otherUser.role === 'researcher' 
  ? 'collaborator' 
  : otherUser.role;

conversationsMap.set(otherUserId, {
  userId: otherUserId,
  userName: otherUser.name,
  userRole: userRole,  // 'collaborator' for researcher-to-researcher
  userSpecialization: otherUser.specialization || null,
  lastMessage: msg.content,
  lastMessageTime: msg.createdAt,
  unreadCount,
});
```

### **2. Created `/api/messages/route.ts`** (NEW)

Handles fetching and sending messages for all conversation types.

**GET `/api/messages?userId=xxx`**
- Fetches all messages between current user and specified user
- Sorts by creation time (oldest first)
- Automatically marks fetched messages as read
- Returns `{ success: true, messages: [...] }`

**POST `/api/messages`**
```json
{
  "receiverId": "user_id",
  "content": "message text"
}
```
- Creates new message in database
- Returns `{ success: true, message: {...} }`

### **3. Created `/api/messages/mark-read/route.ts`** (NEW)

**POST `/api/messages/mark-read`**
```json
{
  "userId": "sender_id"
}
```
- Marks all unread messages from specified user as read
- Returns `{ success: true, modifiedCount: N }`

---

## How It Works Now

### **Flow for Researcher-to-Researcher Chat:**

1. **Connection Made:**
   - Researcher A sends connection request to Researcher B
   - Researcher B accepts the request
   - Connection status = `accepted`

2. **Chat in Collaborators Page:**
   - They chat using `/researcher/collaborators` page
   - Messages sent via `/api/collaborators/messages` (POST)
   - Messages stored in `Message` model with:
     - `sender`: Researcher A ID
     - `recipient`: Researcher B ID
     - `content`: message text

3. **Messages Appear in Messages Page:**
   - `/researcher/messages` fetches conversations via `/api/messages/conversations`
   - Endpoint finds all messages involving current user
   - For researcher-to-researcher conversations:
     - Sets `userRole: 'collaborator'` 
     - Adds specialization info
   - **Conversation appears in "Researchers" tab** ✅
   - Click conversation → fetches messages via `/api/messages?userId=xxx`
   - Can send new messages via `/api/messages` (POST)
   - Unread counts update automatically

---

## UI Integration

### **Messages Page Tabs:**

**"Patients" Tab:**
- Shows conversations where `userRole === 'patient'`
- Icon: Stethoscope
- Badge: "Patient"

**"Researchers" Tab:**
- Shows conversations where `userRole === 'collaborator'`
- Icon: Users
- Badge: Shows specialization if available
- **Now includes researcher-to-researcher chats** ✅

### **Conversation Display:**
```
┌────────────────────────────────────────┐
│  👥  Dr. Sarah Johnson                 │
│      Oncology                          │
│                                        │
│      Let's discuss the trial...        │
│      🕐 2:30 PM                        │
└────────────────────────────────────────┘
```

### **Unread Badges:**
- Red badge shows unread count per tab
- Updates when messages marked as read
- Auto-updates when new messages arrive

---

## Database Schema

### **Message Model:**
```typescript
{
  sender: ObjectId,       // User who sent message
  recipient: ObjectId,    // User who receives message
  content: String,        // Message text
  read: Boolean,          // false = unread, true = read
  timestamps: true        // createdAt, updatedAt
}
```

**Note:** Same `Message` model is used for:
- Patient ↔ Researcher messages
- Researcher ↔ Researcher messages

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Used By |
|----------|--------|---------|---------|
| `/api/messages/conversations` | GET | Get all conversation previews | Messages page sidebar |
| `/api/messages?userId=xxx` | GET | Get messages with specific user | Chat window |
| `/api/messages` | POST | Send new message | Chat window |
| `/api/messages/mark-read` | POST | Mark messages as read | Chat window |
| `/api/collaborators/messages` | GET/POST | Alternative endpoint for collaborator chats | Collaborators page |

---

## Testing Checklist

- [x] Researcher connects with another researcher
- [x] Chat appears in both users' collaborators pages
- [x] Messages sent successfully
- [x] Conversation appears in `/researcher/messages`
- [x] Conversation shows under "Researchers" tab
- [x] Specialization displays correctly
- [x] Unread counts work properly
- [x] Messages can be sent from messages page
- [x] Messages marked as read when viewed
- [x] Real-time updates work (3-second polling)

---

## Benefits

✅ **Unified messaging experience** - All conversations in one place  
✅ **Consistent UI** - Same interface for patients and collaborators  
✅ **Unread tracking** - Never miss important messages  
✅ **Real-time updates** - Auto-refresh every 3 seconds  
✅ **Search functionality** - Find conversations quickly  
✅ **Specialization display** - Know collaborator expertise at a glance  

---

## Files Modified/Created

### **Modified:**
1. `app/api/messages/conversations/route.ts`
   - Removed researcher-to-researcher filter
   - Added collaborator tagging
   - Added specialization field
   - Added success flag

### **Created:**
2. `app/api/messages/route.ts` - Main messages endpoint (GET/POST)
3. `app/api/messages/mark-read/route.ts` - Mark messages as read

### **Unchanged:**
- `app/researcher/messages/page.tsx` - No changes needed (already had correct UI)
- `app/api/collaborators/messages/route.ts` - Still works for collaborators page
- `Message` model - Schema already supported all use cases

---

## Status: ✅ **COMPLETE**

Researcher-to-researcher messages now appear correctly in `/researcher/messages` under the "Researchers" tab!
