# Researcher Meeting Requests Management System

## 🎯 Overview
Comprehensive meeting requests management system for researchers to view, accept/reject patient meeting requests, and initiate text chat conversations with accepted patients.

---

## ✨ Features Implemented

### **1. Meeting Requests Dashboard** ✅

**Three-Tab Interface:**
```
┌─────────────────────────────────────────┐
│ [Pending (3)] [Accepted (5)] [Declined (2)]│
└─────────────────────────────────────────┘
```

**Stats Overview:**
```
┌──────────────┬──────────────┬──────────────┐
│ ⏰ Pending   │ ✓ Accepted   │ ✗ Declined   │
│     3        │     5        │     2        │
└──────────────┴──────────────┴──────────────┘
```

- **Real-time counts** for each status
- **Color-coded icons** for visual clarity
- **Easy navigation** between request types

---

### **2. Detailed Request Cards** ✅

**Request Card Layout:**
```
┌──────────────────────────────────────────┐
│ 👤 John Doe              [⏰ Pending]    │
│ 📞 john@email.com                        │
├──────────────────────────────────────────┤
│ Patient's Conditions:                    │
│ [Glioma] [Brain Tumor] [Stage III]       │
│                                          │
│ Request Message:                         │
│ ┌────────────────────────────────────┐   │
│ │ Dear Dr. Smith,                    │   │
│ │ I am interested in your research...│   │
│ │                                    │   │
│ └────────────────────────────────────┘   │
│                                          │
│ 📅 Requested: Jan 15, 2024               │
├──────────────────────────────────────────┤
│ [✓ Accept Request] [✗ Decline]           │
└──────────────────────────────────────────┘
```

**Card Information:**
- ✅ **Patient Name** with icon
- ✅ **Contact Info** (email/phone)
- ✅ **Medical Conditions** as badges
- ✅ **Request Message** in formatted box
- ✅ **Timestamps** (requested date)
- ✅ **Status Badge** (color-coded)
- ✅ **Action Buttons** (context-sensitive)

---

### **3. Accept Request Flow** ✅

**Accept Dialog:**
```
┌─────────────────────────────────────────┐
│ Accept Meeting Request                  │
│ ─────────────────────────────────────── │
│ John Doe - john@email.com               │
│                                         │
│ Response Message:                       │
│ ┌───────────────────────────────────┐   │
│ │ Dear John,                        │   │
│ │                                   │   │
│ │ Thank you for your interest in my │   │
│ │ research. I would be happy to meet│   │
│ │ with you to discuss potential     │   │
│ │ collaboration or consultation.    │   │
│ │                                   │   │
│ │ Please let me know your           │   │
│ │ availability, and we can arrange  │   │
│ │ a suitable time.                  │   │
│ │                                   │   │
│ │ Best regards                      │   │
│ └───────────────────────────────────┘   │
│                                         │
│          [Cancel]  [✓ Accept Request]   │
└─────────────────────────────────────────┘
```

**Pre-filled Template:**
```
Dear [Patient Name],

Thank you for your interest in my research. I would be happy 
to meet with you to discuss potential collaboration or 
consultation.

Please let me know your availability, and we can arrange a 
suitable time.

Best regards
```

**Features:**
- ✅ **Pre-filled professional message**
- ✅ **Fully editable** - customize response
- ✅ **Patient contact** shown at top
- ✅ **Loading state** during processing
- ✅ **Success confirmation**

**After Acceptance:**
- Status changes to `accepted`
- Response message saved
- Timestamp recorded
- "Start Chat" button appears
- Patient notified (future: email/SMS)

---

### **4. Reject Request Flow** ✅

**Reject Dialog:**
```
┌─────────────────────────────────────────┐
│ Decline Meeting Request                 │
│ ─────────────────────────────────────── │
│ John Doe - john@email.com               │
│                                         │
│ Response Message:                       │
│ ┌───────────────────────────────────┐   │
│ │ Dear John,                        │   │
│ │                                   │   │
│ │ Thank you for your interest in my │   │
│ │ research. Unfortunately, I am     │   │
│ │ unable to accommodate your meeting│   │
│ │ request at this time due to       │   │
│ │ scheduling constraints.           │   │
│ │                                   │   │
│ │ I appreciate your understanding.  │   │
│ │                                   │   │
│ │ Best regards                      │   │
│ └───────────────────────────────────┘   │
│                                         │
│          [Cancel]  [✗ Decline Request]  │
└─────────────────────────────────────────┘
```

**Pre-filled Decline Template:**
```
Dear [Patient Name],

Thank you for your interest in my research. Unfortunately, 
I am unable to accommodate your meeting request at this time 
due to scheduling constraints.

I appreciate your understanding.

Best regards
```

**Features:**
- ✅ **Professional decline message**
- ✅ **Editable** - add personal touch
- ✅ **Red button** for decline action
- ✅ **Records response**

---

### **5. Text Chat Integration** ✅

**Start Chat Dialog:**
```
┌─────────────────────────────────────────┐
│ Start Chat with John Doe                │
│ ─────────────────────────────────────── │
│ Send your first message to begin the    │
│ conversation                            │
│                                         │
│ Message:                                │
│ ┌───────────────────────────────────┐   │
│ │ Hi John, I've accepted your       │   │
│ │ meeting request. Let's discuss the│   │
│ │ details here.                     │   │
│ │                                   │   │
│ │                                   │   │
│ │                                   │   │
│ └───────────────────────────────────┘   │
│                                         │
│          [Cancel]  [📤 Send Message]    │
└─────────────────────────────────────────┘
```

**Chat Flow:**
```
1. Researcher accepts meeting request
2. "Start Chat with Patient" button appears
3. Click button → Chat dialog opens
4. Pre-filled message ready
5. Customize message if needed
6. Click "Send Message"
   ↓
7. Message sent to patient
8. Success notification
9. Continue chatting in Messages section
```

**Integration:**
- ✅ **Uses existing messaging system** (`/api/collaborators/messages`)
- ✅ **Pre-filled starter message**
- ✅ **Direct patient connection**
- ✅ **Seamless transition** to full chat

**Pre-filled Chat Message:**
```
Hi [Patient Name], I've accepted your meeting request. 
Let's discuss the details here.
```

**Benefits:**
- 🔒 **Secure communication** - platform-mediated
- 💬 **Text-based** - no phone numbers shared
- 📝 **Persistent** - conversation history saved
- 🔔 **Notifications** - both parties alerted
- 📍 **Centralized** - all chats in one place

---

### **6. Accepted Requests View** ✅

**Accepted Request Card:**
```
┌──────────────────────────────────────────┐
│ 👤 John Doe              [✓ Accepted]    │
│ 📞 john@email.com                        │
├──────────────────────────────────────────┤
│ Patient's Conditions:                    │
│ [Glioma] [Brain Tumor]                   │
│                                          │
│ Request Message:                         │
│ Original patient message here...         │
│                                          │
│ Your Response:                           │
│ ┌────────────────────────────────────┐   │
│ │ Thank you for your interest...     │   │
│ │ (Your acceptance message)          │   │
│ └────────────────────────────────────┘   │
│                                          │
│ 📅 Requested: Jan 15, 2024               │
│ 📅 Responded: Jan 16, 2024               │
├──────────────────────────────────────────┤
│ [💬 Start Chat with Patient]             │
└──────────────────────────────────────────┘
```

**Features:**
- ✅ **Shows original request**
- ✅ **Shows your response**
- ✅ **Both timestamps** visible
- ✅ **Chat button** prominent
- ✅ **Patient conditions** visible

---

### **7. Declined Requests View** ✅

**Declined Request Card:**
```
┌──────────────────────────────────────────┐
│ 👤 John Doe              [✗ Declined]    │
│ 📞 john@email.com                        │
├──────────────────────────────────────────┤
│ Request Message:                         │
│ Original patient message...              │
│                                          │
│ Your Response:                           │
│ ┌────────────────────────────────────┐   │
│ │ Unfortunately, I am unable to...   │   │
│ │ (Your decline message)             │   │
│ └────────────────────────────────────┘   │
│                                          │
│ 📅 Requested: Jan 15, 2024               │
│ 📅 Responded: Jan 16, 2024               │
└──────────────────────────────────────────┘
```

**Features:**
- ✅ **Historical record**
- ✅ **Shows decline reason**
- ✅ **No action buttons** (already handled)
- ✅ **Red badge** for declined status

---

## 🔌 API Endpoints

### **1. Get Meeting Requests**
```
GET /api/experts/meeting-request
```

**Authorization:** Researcher role required

**Response:**
```json
{
  "meetingRequests": [
    {
      "_id": "req_123",
      "patientId": {
        "_id": "patient_456",
        "name": "John Doe",
        "email": "john@email.com",
        "medicalConditions": ["Glioma", "Brain Tumor"],
        "location": {
          "city": "Boston",
          "country": "United States"
        }
      },
      "patientName": "John Doe",
      "patientContact": "john@email.com",
      "expertName": "Dr. Jane Smith",
      "message": "I am interested in your research...",
      "status": "pending",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Features:**
- Filters requests for current researcher
- Populates patient data (conditions, location)
- Sorts by most recent first
- Only shows platform requests (isOnPlatform: true)

---

### **2. Respond to Meeting Request**
```
POST /api/experts/meeting-request/respond
{
  "requestId": "req_123",
  "action": "accept",  // or "reject"
  "responseMessage": "Thank you for your interest..."
}
```

**Authorization:** Researcher role required

**Validations:**
- ✅ Request must exist
- ✅ Request must be for current researcher
- ✅ Request must be in `pending` status
- ✅ Action must be "accept" or "reject"
- ✅ Response message required

**Response (Success):**
```json
{
  "success": true,
  "message": "Meeting request accepted successfully",
  "meetingRequest": {
    "_id": "req_123",
    "status": "accepted",
    "responseMessage": "Thank you for your interest...",
    "respondedAt": "2024-01-16T14:30:00Z"
  }
}
```

**Response (Error - Already Responded):**
```json
{
  "error": "This request has already been responded to"
}
```

**Response (Error - Not Your Request):**
```json
{
  "error": "Unauthorized - this request is not for you"
}
```

---

### **3. Send Chat Message**
```
POST /api/collaborators/messages
{
  "toUserId": "patient_456",
  "message": "Hi John, let's discuss the details..."
}
```

**Authorization:** Any authenticated user

**Response:**
```json
{
  "success": true,
  "message": {
    "_id": "msg_789",
    "fromUserId": "researcher_123",
    "toUserId": "patient_456",
    "message": "Hi John, let's discuss...",
    "createdAt": "2024-01-16T15:00:00Z"
  }
}
```

---

## 📊 Database Schema Updates

### **MeetingRequest Model:**
```typescript
{
  patientId: ObjectId (ref: User),
  patientName: String,
  patientContact: String,
  expertId: ObjectId (ref: User),
  expertName: String,
  isOnPlatform: Boolean,
  message: String,
  status: 'pending' | 'accepted' | 'rejected' | 'admin_review',
  responseMessage: String,        // NEW: Researcher's response
  respondedAt: Date,              // NEW: When responded
  createdAt: Date
}
```

**New Fields:**
- `responseMessage` - Researcher's acceptance/decline message
- `respondedAt` - Timestamp when researcher responded

---

## 🔄 Complete User Workflows

### **Workflow 1: Accept Meeting Request and Start Chat**
```
1. Researcher logs in
2. Goes to /researcher/meeting-requests
3. Sees 3 pending requests
4. Reviews John Doe's request:
   - Condition: Glioma
   - Message: Interested in clinical trial
5. Clicks "Accept Request"
   ↓
6. Dialog opens with pre-filled message
7. Researcher edits message:
   "Hi John, I'd love to discuss our glioma trial..."
8. Clicks "Accept Request"
   ↓
9. Alert: "Meeting request accepted!"
10. Card moves to "Accepted" tab
11. Status badge changes to green ✓
12. "Start Chat" button appears
    ↓
13. Clicks "Start Chat with Patient"
14. Chat dialog opens
15. Pre-filled: "Hi John, I've accepted your request..."
16. Researcher adds details
17. Clicks "Send Message"
    ↓
18. Message sent successfully
19. Notification: "Continue chatting in Messages section"
20. Researcher goes to Messages
21. Sees conversation with John ✓
```

---

### **Workflow 2: Decline Meeting Request**
```
1. Researcher reviews Sarah's request
2. Realizes schedule conflict
3. Clicks "Decline" button
   ↓
4. Dialog opens with professional decline message
5. Researcher personalizes:
   "Thank you for your interest. Unfortunately, 
   I'm fully booked this semester..."
6. Clicks "Decline Request"
   ↓
7. Alert: "Meeting request rejected"
8. Card moves to "Declined" tab
9. Status badge changes to red ✗
10. Sarah receives notification ✓
```

---

### **Workflow 3: Review Accepted Requests**
```
1. Researcher clicks "Accepted" tab
2. Sees 5 accepted meeting requests
3. Reviews past conversations:
   - Original patient message
   - Own acceptance response
   - Request and response dates
4. Clicks "Start Chat" on any request
5. Continues conversation ✓
```

---

## 💡 Key Benefits

### **For Researchers:**
1. 📬 **Centralized Inbox** - All requests in one place
2. 👀 **Patient Context** - See conditions before accepting
3. ✍️ **Professional Responses** - Pre-filled templates
4. ✅ **Quick Actions** - Accept/decline with one click
5. 💬 **Integrated Chat** - Seamless communication
6. 📊 **Request History** - Track all interactions
7. 🔔 **Clear Status** - Know what needs action

### **For Patients:**
1. ✉️ **Professional Replies** - Thoughtful responses
2. 📱 **Direct Chat** - Text-based communication
3. ✅ **Clear Status** - Know if accepted/declined
4. 🔒 **Privacy** - No personal phone numbers needed
5. 📝 **Record Keeping** - All messages saved

### **For Platform:**
1. 🤝 **Facilitates Connections** - Researchers and patients
2. 💬 **Engagement** - Ongoing conversations
3. 📈 **Metrics** - Track acceptance rates
4. 🎯 **Matching Success** - See what works

---

## 🧪 Testing Scenarios

### **Test 1: Accept Request**
```
1. Login as researcher
2. Go to /researcher/meeting-requests
3. See pending requests
4. Click "Accept Request" on first request
5. ✓ Dialog opens with patient details
6. ✓ Pre-filled message shown
7. Edit message
8. Click "Accept Request"
9. ✓ Success alert
10. ✓ Request moves to Accepted tab
11. ✓ responseMessage saved in DB
12. ✓ respondedAt timestamp recorded
```

### **Test 2: Decline Request**
```
1. Click "Decline" on a request
2. ✓ Dialog opens with decline template
3. Customize message
4. Click "Decline Request"
5. ✓ Success alert
6. ✓ Request moves to Declined tab
7. ✓ Red badge shown
8. ✓ No chat button (correctly)
```

### **Test 3: Start Chat**
```
1. Go to Accepted tab
2. Find accepted request with patient on platform
3. Click "Start Chat with Patient"
4. ✓ Chat dialog opens
5. ✓ Pre-filled message: "Hi [Name], I've accepted..."
6. Customize message
7. Click "Send Message"
8. ✓ Success notification
9. Go to Messages section
10. ✓ See conversation with patient
```

### **Test 4: View Patient Conditions**
```
1. Review any request card
2. ✓ Patient conditions shown as badges
3. ✓ Patient name and contact visible
4. ✓ Request message formatted correctly
5. ✓ Timestamps displayed
```

### **Test 5: Tab Navigation**
```
1. Click "Pending" tab
2. ✓ See only pending requests
3. Click "Accepted" tab
4. ✓ See only accepted requests
5. Click "Declined" tab
6. ✓ See only declined requests
7. ✓ Counts in tabs match actual numbers
```

---

## 📁 Files Created/Modified

### **Created:**
1. ✅ `app/researcher/meeting-requests/page.tsx` - Main UI
2. ✅ `app/api/experts/meeting-request/respond/route.ts` - Response API
3. ✅ `RESEARCHER_MEETING_REQUESTS_SYSTEM.md` - Documentation

### **Modified:**
4. ✅ `app/api/experts/meeting-request/route.ts` - Added populate and response fields

---

## 🚀 How to Test

```bash
1. npm run dev

# Setup: Send a meeting request as patient
2. Login as patient
3. Go to /patient/experts
4. Find a researcher
5. Click "Request Meeting"
6. Fill form and send

# Test as researcher:
7. Logout and login as researcher
8. Go to: http://localhost:3000/researcher/meeting-requests

# Test Accept Flow:
9. See pending request
10. Click "Accept Request"
11. Edit response message
12. Click "Accept Request"
13. Verify moves to Accepted tab
14. Click "Start Chat with Patient"
15. Send message
16. Go to Messages section
17. Verify conversation started

# Test Decline Flow:
18. Find another pending request
19. Click "Decline"
20. Customize decline message
21. Click "Decline Request"
22. Verify moves to Declined tab

# Test Tab Navigation:
23. Click through all tabs
24. Verify counts are correct
25. Verify status badges match
```

---

## 🎉 Result

✅ **Meeting requests dashboard** - Clean three-tab interface  
✅ **Accept/reject functionality** - With custom messages  
✅ **Patient condition visibility** - See medical background  
✅ **Professional templates** - Pre-filled responses  
✅ **Text chat integration** - Seamless messaging  
✅ **Status tracking** - Pending/accepted/declined  
✅ **Response history** - View past messages  
✅ **Stats overview** - Quick counts at glance  
✅ **Timestamp tracking** - Request and response dates  
✅ **Loading states** - Professional UX  

The researcher meeting requests system is fully functional with integrated chat! 🚀

**Future Enhancements:**
- 📧 Email notifications when requests accepted/declined
- 📅 Calendar integration for scheduling
- 🔔 Real-time notifications for new requests
- 📊 Analytics dashboard (acceptance rate, response time)
- 🎥 Video call integration
- 📎 File attachments in chat
- ⏰ Meeting reminders
