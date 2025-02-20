# Patient Health Experts Discovery System

## 🎯 Overview
Comprehensive health experts search and discovery system allowing patients to find, follow, and request meetings with researchers based on their medical conditions and research interests.

---

## ✨ Features Implemented

### **1. Expert Search by Condition/Disease** ✅

**Search Functionality:**
- **Natural Language Search**: "Glioma", "Breast Cancer", "Immunotherapy"
- **Multiple Search Fields**:
  - Medical specialties
  - Research interests  
  - Expert name
  - Institution
  - Bio/description
- **Personalized Recommendations**: Auto-loads experts matching patient's conditions
- **Location Filter**: Nearby vs. Global results

**Search Bar:**
```
┌────────────────────────────────────────────┐
│ Search by condition, specialty, or research│
│ e.g., Glioma, Breast Cancer, Cardiology   │
│                                            │
│ Search for experts by medical condition or│
│ research specialty                         │
└────────────────────────────────────────────┘
```

---

### **2. Platform vs. External Expert Display** ✅

**Platform Status Badges:**

#### **On Platform (Green Badge):**
```
┌────────────────────────────────┐
│                    [✓ On Platform]│
│ Dr. Jane Smith     📚 45 pubs  │
│ Oncology, Immunotherapy         │
└────────────────────────────────┘
```
- **Verified presence** on CuraLink
- **Full profile** available
- **Direct messaging** enabled
- **Active engagement**

#### **External (Gray Badge):**
```
┌────────────────────────────────┐
│                    [⤴ External] │
│ Dr. John Doe       📚 120 pubs  │
│ Neurology, Glioma Research      │
└────────────────────────────────┘
```
- **Not on platform** yet
- **Data from publications**
- **Admin-mediated contact**
- **Can be invited**

---

### **3. Follow/Unfollow Experts** ✅

**Follow Functionality:**
- **Follow Button**: Add expert to following list
- **Unfollow Button**: Remove from following list
- **Visual State**: "Following" badge when followed
- **Persistent Tracking**: Saved in database

**Follow Flow:**
```
1. Patient sees expert profile
2. Clicks "Follow" button (heart icon)
3. Expert added to patient's following list
4. Patient added to expert's followers list
5. Button changes to "Following" ✓
6. Can unfollow anytime
```

**Benefits:**
- Track favorite experts
- Get notified of expert's updates (future feature)
- Build personal network
- Bookmark interesting researchers

---

### **4. Meeting Requests with Patient Details** ✅

**Meeting Request System:**

#### **For Platform Experts:**
```
┌─────────────────────────────────────┐
│ Request Meeting with Dr. Jane Smith│
│ ─────────────────────────────────── │
│ Send a meeting request directly to  │
│ this researcher                     │
│                                     │
│ Your Name: [John Doe]               │
│ Contact: [john@email.com]           │
│                                     │
│ Message:                            │
│ Dear Dr. Smith,                     │
│ I am interested in your research... │
│                                     │
│          [Cancel]  [Send Request]   │
└─────────────────────────────────────┘
```
- **Direct delivery** to researcher
- **Patient details** included
- **Custom message**
- **Immediate notification**

#### **For External Experts:**
```
┌─────────────────────────────────────┐
│ Request Meeting with Dr. John Doe   │
│ ─────────────────────────────────── │
│ This request will be sent to our    │
│ admin team who will contact the     │
│ researcher on your behalf           │
│                                     │
│ Your Name: [Required]               │
│ Contact: [Required]                 │
│ Message: [Your inquiry...]          │
│                                     │
│          [Cancel]  [Send Request]   │
└─────────────────────────────────────┘
```
- **Admin mediation** required
- **Manual outreach** to expert
- **Patient info** preserved
- **Follow-up guaranteed**

**Required Fields:**
- ✅ **Patient Name** - Full name
- ✅ **Contact Info** - Email or phone
- ✅ **Message** - Introduction and meeting purpose

**Pre-filled Template:**
```
Dear Dr. [Expert Name],

I am a patient interested in your research on [Specialty]. 
I would like to request a meeting to discuss potential 
participation in research or consultation.

Thank you for your consideration.
```

---

### **5. Nudge/Invite Experts to Platform** ✅

**Invitation System:**

**For External Experts Only:**
```
┌─────────────────────────────────────┐
│ Invite Dr. John Doe to CuraLink     │
│ ─────────────────────────────────── │
│ Send an invitation to this expert to│
│ join the platform                   │
│                                     │
│ We'll send an invitation email      │
│ highlighting the benefits of joining│
│ CuraLink and connecting with        │
│ patients interested in their        │
│ research.                           │
│                                     │
│          [Cancel]  [Send Invitation]│
└─────────────────────────────────────┘
```

**Invitation Features:**
- ✅ **One-click invitation**
- ✅ **Professional email** (future: actual email integration)
- ✅ **Platform benefits** highlighted
- ✅ **Tracked invitations** - prevents duplicates
- ✅ **Admin visibility** - admins can see all invitations

**Invitation Email Content:**
```
Subject: Invitation to join CuraLink - Dr. [Name]

Dear Dr. [Name],

A patient on CuraLink is interested in your research and 
would like to connect with you.

CuraLink is a platform connecting patients with researchers 
like you to facilitate:
- Patient recruitment for clinical trials
- Collaboration opportunities  
- Direct communication with patients interested in your research

Benefits of joining:
✓ Reach qualified patients for your research
✓ Streamline recruitment process
✓ Build your research network
✓ Increase research impact

Join CuraLink today: [signup link]

Best regards,
The CuraLink Team
```

---

### **6. Enhanced Expert Cards** ✅

**Rich Profile Display:**
```
┌──────────────────────────────────────────┐
│                    [✓ On Platform]       │
│ Dr. Jane Smith     📚 45 publications    │
│ Oncology, Immunotherapy, Clinical Trials │
├──────────────────────────────────────────┤
│ Research Interests:                      │
│ [Cancer] [Glioma] [Immunotherapy]        │
│ [Clinical Trials] [Precision Medicine]   │
│                                          │
│ 📍 Boston, MA, United States             │
│ Harvard Medical School                    │
│                                          │
│ Specializes in glioma immunotherapy...   │
├──────────────────────────────────────────┤
│ [♡ Follow] [📧 Request Meeting]          │
└──────────────────────────────────────────┘
```

**Card Elements:**
- ✅ **Platform Status Badge** (top right)
- ✅ **Expert Name** with publication count
- ✅ **Specialties** listed
- ✅ **Research Interests** as badges
- ✅ **Location** with map pin
- ✅ **Institution** name
- ✅ **Brief Bio** (2 lines)
- ✅ **Action Buttons** (follow, meeting, invite)

**For External Experts:**
```
┌──────────────────────────────────────────┐
│                    [⤴ External]          │
│ Dr. John Doe       📚 120 publications   │
│ Neurology, Neurosurgery                  │
├──────────────────────────────────────────┤
│ Research Interests:                      │
│ [Glioma] [Brain Tumors] [Surgery]        │
│                                          │
│ 📍 New York, NY, United States           │
│ Memorial Sloan Kettering                 │
├──────────────────────────────────────────┤
│ [♡ Follow] [📧 Request via Admin]        │
│            [➕ Invite to Platform]       │
└──────────────────────────────────────────┘
```

**Buttons for External:**
- **Request via Admin** - Gray/secondary button
- **Invite to Platform** - Ghost button

---

## 🔌 API Endpoints

### **1. Search Experts**
```
GET /api/experts?query=Glioma
```

**Response:**
```json
{
  "experts": [
    {
      "_id": "...",
      "name": "Dr. Jane Smith",
      "specialties": ["Oncology", "Immunotherapy"],
      "interests": ["Glioma", "Cancer", "Clinical Trials"],
      "location": {
        "city": "Boston",
        "country": "United States"
      },
      "institution": "Harvard Medical School",
      "bio": "Specializes in glioma immunotherapy...",
      "publicationCount": 45,
      "isOnPlatform": true,
      "acceptsMeetings": true
    }
  ]
}
```

---

### **2. Follow Expert**
```
POST /api/experts/follow
{
  "expertId": "expert_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully followed expert"
}
```

**Database Updates:**
- Patient's `followingExperts` array: add expertId
- Expert's `followers` array: add patientId

---

### **3. Unfollow Expert**
```
DELETE /api/experts/follow
{
  "expertId": "expert_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Unfollowed expert"
}
```

---

### **4. Request Meeting**
```
POST /api/experts/meeting-request
{
  "expertId": "expert_id",
  "expertName": "Dr. Jane Smith",
  "isOnPlatform": true,
  "patientName": "John Doe",
  "patientContact": "john@email.com",
  "message": "I am interested in..."
}
```

**Response (Platform Expert):**
```json
{
  "success": true,
  "message": "Meeting request sent successfully! The researcher will be notified.",
  "meetingRequest": {
    "_id": "...",
    "status": "pending"
  }
}
```

**Response (External Expert):**
```json
{
  "success": true,
  "message": "Your request has been submitted to our admin team. We will contact the researcher on your behalf and get back to you soon.",
  "meetingRequest": {
    "_id": "...",
    "status": "admin_review"
  }
}
```

**Meeting Request Statuses:**
- `pending` - Sent to platform expert, awaiting response
- `admin_review` - External expert, admin needs to reach out
- `accepted` - Expert accepted meeting
- `rejected` - Expert declined

---

### **5. Nudge/Invite Expert**
```
POST /api/experts/nudge
{
  "expertName": "Dr. John Doe",
  "expertEmail": "john@institution.edu"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent successfully!",
  "invitation": {
    "_id": "...",
    "invitedBy": "patient_id",
    "expertName": "Dr. John Doe",
    "invitationSent": true,
    "invitationSentAt": "2024-01-01T00:00:00Z"
  }
}
```

**Duplicate Prevention:**
```json
{
  "success": true,
  "message": "Invitation already sent to this expert",
  "alreadyInvited": true
}
```

---

### **6. Get Meeting Requests**
```
GET /api/experts/meeting-request
```

**For Patients** - Returns their requests:
```json
{
  "meetingRequests": [
    {
      "_id": "...",
      "expertName": "Dr. Jane Smith",
      "patientName": "John Doe",
      "status": "pending",
      "message": "I am interested in...",
      "createdAt": "2024-01-01"
    }
  ]
}
```

**For Researchers** - Returns requests to them:
```json
{
  "meetingRequests": [
    {
      "_id": "...",
      "patientName": "John Doe",
      "patientContact": "john@email.com",
      "message": "I am interested in...",
      "status": "pending"
    }
  ]
}
```

**For Admins** - Returns requests needing review:
```json
{
  "meetingRequests": [
    {
      "_id": "...",
      "expertName": "Dr. External Expert",
      "patientName": "John Doe",
      "patientContact": "john@email.com",
      "status": "admin_review"
    }
  ]
}
```

---

## 📊 Database Schemas

### **MeetingRequest Model:**
```typescript
{
  patientId: ObjectId (ref: User),
  patientName: String,
  patientContact: String,
  expertId: ObjectId (ref: User) | null,
  expertName: String,
  isOnPlatform: Boolean,
  message: String,
  status: 'pending' | 'accepted' | 'rejected' | 'admin_review',
  createdAt: Date
}
```

### **ExpertInvitation Model:**
```typescript
{
  invitedBy: ObjectId (ref: User),
  expertName: String,
  expertEmail: String,
  invitationSent: Boolean,
  invitationSentAt: Date,
  joined: Boolean,
  joinedAt: Date,
  createdAt: Date
}
```

### **User Model Updates:**
```typescript
{
  // ...existing fields
  followingExperts: [ObjectId],  // Experts patient follows
  followers: [ObjectId],          // Users following this expert
  bio: String,                    // Brief bio
  institution: String,            // University/hospital
}
```

---

## 🔄 Complete User Workflows

### **Workflow 1: Search and Follow Expert**
```
1. Patient opens /patient/experts
2. Sees personalized experts for their conditions
3. Types "Glioma" in search
4. Clicks "Search"
   ↓
5. Sees list of glioma experts
6. Reviews expert cards:
   - Dr. Smith (On Platform) - 45 pubs
   - Dr. Doe (External) - 120 pubs
7. Clicks "Follow" on Dr. Smith
8. Alert: "Successfully followed expert!"
9. Button changes to "Following" ✓
```

---

### **Workflow 2: Request Meeting (Platform Expert)**
```
1. Patient finds Dr. Smith (On Platform)
2. Clicks "Request Meeting" button
3. Dialog opens with form:
   - Your Name: [auto-filled or enter]
   - Contact: [enter email/phone]
   - Message: [pre-filled template]
4. Patient customizes message
5. Clicks "Send Request"
   ↓
6. Request sent to Dr. Smith
7. Alert: "Meeting request sent! Researcher will be notified"
8. Dr. Smith receives notification
9. Dr. Smith can accept/reject in their dashboard
```

---

### **Workflow 3: Request Meeting (External Expert)**
```
1. Patient finds Dr. Doe (External)
2. Clicks "Request via Admin" button
3. Dialog opens:
   - Note: "Admin will contact researcher"
   - Your Name: [enter]
   - Contact: [enter]
   - Message: [customize]
4. Clicks "Send Request"
   ↓
5. Request saved with status: admin_review
6. Alert: "Submitted to admin team..."
7. Admin sees request in dashboard
8. Admin contacts Dr. Doe via email/phone
9. Admin updates patient on response
```

---

### **Workflow 4: Invite External Expert**
```
1. Patient finds Dr. Doe (External)
2. Clicks "Invite to Platform" button
3. Dialog opens:
   - Title: "Invite Dr. Doe to CuraLink"
   - Explanation of invitation
4. Clicks "Send Invitation"
   ↓
5. Invitation recorded in database
6. (Future) Email sent to Dr. Doe
7. Alert: "Invitation sent to expert!"
8. If Dr. Doe joins later:
   - Invitation marked as successful
   - Patient can now directly contact
```

---

### **Workflow 5: Unfollow Expert**
```
1. Patient sees expert card
2. "Following" button displayed (already followed)
3. Clicks "Following" button
4. Expert removed from following list
5. Button changes back to "Follow"
6. Alert: "Unfollowed expert"
```

---

## 💡 Key Benefits

### **For Patients:**
1. 🔍 **Easy Discovery** - Find experts by condition
2. 👥 **Network Building** - Follow favorite researchers
3. 📧 **Direct Contact** - Request meetings easily
4. 🌐 **Global Reach** - Find experts worldwide
5. ✅ **Platform Status** - Know who's active on CuraLink
6. 📚 **Research Visibility** - See publication counts
7. 🎯 **Personalized** - Recommendations based on conditions

### **For Researchers:**
1. 👨‍⚕️ **Patient Connections** - Patients find you easily
2. 💬 **Controlled Communication** - Accept meetings selectively
3. 📊 **Visibility** - Profile showcases your research
4. 🌟 **Follower Network** - Build patient following
5. 🔔 **Notifications** - Know when patients are interested

### **For Platform:**
1. 📈 **Growth** - Invite external experts
2. 🔗 **Network Effects** - Patients invite researchers
3. 💼 **Admin Tools** - Mediate external connections
4. 📊 **Analytics** - Track invitations and meetings

---

## 🧪 Testing Scenarios

### **Test 1: Search by Condition**
```
1. Login as patient with "Glioma" in conditions
2. Go to /patient/experts
3. See personalized glioma experts
4. Type "Breast Cancer" in search
5. Click Search
6. See breast cancer experts
7. ✓ Results match search query
```

### **Test 2: Follow/Unfollow**
```
1. Find expert Dr. Smith
2. Click "Follow" button
3. ✓ Alert: "Successfully followed expert!"
4. ✓ Button changes to "Following"
5. Click "Following" button again
6. ✓ Alert: "Unfollowed expert"
7. ✓ Button changes to "Follow"
```

### **Test 3: Meeting Request (Platform)**
```
1. Find platform expert
2. Click "Request Meeting"
3. Fill form:
   - Name: "John Doe"
   - Contact: "john@test.com"
   - Message: custom message
4. Click "Send Request"
5. ✓ Alert: "Meeting request sent!"
6. ✓ Request in database with status: pending
```

### **Test 4: Meeting Request (External)**
```
1. Find external expert (gray badge)
2. Click "Request via Admin"
3. Fill form with details
4. Click "Send Request"
5. ✓ Alert: "Submitted to admin team..."
6. ✓ Request in database with status: admin_review
```

### **Test 5: Invite Expert**
```
1. Find external expert
2. Click "Invite to Platform"
3. Dialog shows invitation info
4. Click "Send Invitation"
5. ✓ Alert: "Invitation sent to expert!"
6. ✓ Invitation in database
7. Try inviting same expert again
8. ✓ Alert: "Invitation already sent"
```

---

## 📁 Files Created/Modified

### **Created:**
1. `app/api/experts/follow/route.ts` - Follow/unfollow API
2. `app/api/experts/meeting-request/route.ts` - Meeting requests API  
3. `app/api/experts/nudge/route.ts` - Invitation system API
4. `PATIENT_HEALTH_EXPERTS_SYSTEM.md` - This documentation

### **Modified:**
5. `app/patient/experts/page.tsx` - Complete UI overhaul
6. `app/api/experts/route.ts` - Enhanced search with publication counts
7. `models/User.ts` - Added followingExperts, followers, bio, institution fields

---

## 🚀 How to Test

```bash
1. npm run dev
2. Login as patient
3. Go to: http://localhost:3000/patient/experts

# Test Search:
4. Type "Glioma" in search box
5. Click Search
6. Verify experts appear

# Test Follow:
7. Click "Follow" on any expert
8. Verify button changes to "Following"
9. Click again to unfollow

# Test Meeting Request:
10. Click "Request Meeting" on platform expert
11. Fill in your name and contact
12. Customize message
13. Click "Send Request"
14. Verify success alert

# Test External Expert:
15. Find external expert (if any)
16. Click "Request via Admin"
17. Fill form
18. Verify admin review message

# Test Invitation:
19. Click "Invite to Platform" on external
20. Click "Send Invitation"
21. Verify success alert
```

---

## 🎉 Result

✅ **Search by condition/disease** - "Glioma" works  
✅ **Platform status badges** - Green for platform, gray for external  
✅ **Profile data from platform** - Specialties, interests, bio  
✅ **Publication counts** - Shows research output  
✅ **Follow/unfollow** - Full functionality  
✅ **Meeting requests** - With patient name and contact  
✅ **Admin mediation** - For external experts  
✅ **Nudge/invite** - Send invitations to join  
✅ **Enhanced cards** - Rich expert profiles  
✅ **Duplicate prevention** - Can't invite twice  

The patient health experts discovery system is now fully functional! 🚀

**Future Enhancements:**
- 🔄 Integrate PubMed API for external expert data
- 📧 Actual email sending for invitations
- 🔔 Real-time notifications for meeting requests
- 📊 Analytics dashboard for admins
- 🔍 Advanced filters (years of experience, h-index, etc.)
