# Patient Clinical Trials Search System

## 🎯 Overview
Comprehensive clinical trials search system for patients with advanced filters, AI-generated summaries, and email contact functionality.

---

## ✨ Features Implemented

### **1. Keyword Search** ✅

**Search Bar:**
- Large, prominent search input
- Placeholder: "e.g., Lung Cancer Immunotherapy Trials, Diabetes Treatment"
- Enter key support for quick search
- Search by:
  - **Condition** (e.g., "Breast Cancer", "Type 2 Diabetes")
  - **Treatment Type** (e.g., "Immunotherapy", "Gene Therapy")
  - **Keywords** (e.g., "Cancer Trials", "Clinical Studies")
  - **Multiple terms** (searches across title, condition, description, eligibility)

**Search Intelligence:**
- Searches across multiple fields simultaneously
- Case-insensitive matching
- Partial word matching
- Searches both database and external sources

---

### **2. Advanced Filters** ✅

**Filter Panel:**
- Collapsible filter section with badge counter
- Shows active filter count
- One-click "Clear Filters" button

**Filter Options:**

#### **A. Recruitment Status Filter:**
```
- All Statuses
- Recruiting ⭐ (actively enrolling)
- Not Yet Recruiting (upcoming)
- Active, Not Recruiting (ongoing, not accepting)
- Completed (finished)
- Enrolling by Invitation (limited access)
```

#### **B. Trial Phase Filter:**
```
- All Phases
- Early Phase 1 (first-in-human)
- Phase 1 (safety testing)
- Phase 2 (efficacy testing)
- Phase 3 (large-scale testing)
- Phase 4 (post-market)
- Not Applicable
```

#### **C. Location Filter:**
```
- Text input for city, state, or country
- Examples: "Boston", "California", "United States"
- Partial matching (e.g., "CA" finds California trials)
```

**Filter Behavior:**
- Filters combine with AND logic
- Apply with "Search Trials" button
- Persist until cleared
- Visual feedback with badge count

---

### **3. AI-Generated Summaries** ✅

**Display Format:**
```
┌────────────────────────────────────┐
│ ✨ AI-Generated Summary            │
│ ───────────────────────────────────│
│ This study investigates a novel    │
│ treatment approach for patients... │
│                                    │
│ [Patient-friendly language]        │
└────────────────────────────────────┘
```

**Features:**
- **Purple highlighted box** with sparkle icon
- **Label:** "AI-Generated Summary"
- **Automatic generation** for all trials
- **Patient-friendly language** - simplifies medical jargon
- **Cached in database** - generated once, reused

**What AI Summarizes:**
- Trial purpose and goals
- Treatment approach
- What participants can expect
- Potential benefits
- Key requirements

**Example:**
```
Original: "A randomized, double-blind, placebo-controlled study 
evaluating the efficacy and safety of XYZ-123 in subjects with 
metastatic adenocarcinoma..."

AI Summary: "This study tests a new cancer treatment called XYZ-123 
for patients with advanced cancer. Participants will receive either 
the new treatment or a placebo, and researchers will track how well 
it works and any side effects."
```

---

### **4. Email Contact System** ✅

**Contact Button:**
- Prominent "Contact Trial Team" button on each trial card
- Opens compose dialog instead of mailto link
- Professional, pre-filled email template

**Email Compose Dialog:**

```
┌─────────────────────────────────────────────┐
│ Contact Trial Administrator                 │
│ ─────────────────────────────────────────── │
│ Trial Title Here                            │
│                                             │
│ To: study@hospital.edu [locked]             │
│                                             │
│ Subject: [Editable]                         │
│ Inquiry about [Trial Name]                  │
│                                             │
│ Message: [Fully Editable]                   │
│ Dear Trial Administrator,                   │
│                                             │
│ I am interested in learning more about...   │
│ - Eligibility requirements                  │
│ - Trial timeline and duration               │
│ - How to participate                        │
│                                             │
│                   [Cancel]  [Send Email]    │
└─────────────────────────────────────────────┘
```

**Email Features:**
- ✅ **Pre-filled template** with professional structure
- ✅ **Editable subject line**
- ✅ **Fully customizable message**
- ✅ **Shows recipient email** (locked field)
- ✅ **Loading state** during send
- ✅ **Automatic fallback** to mailto: if API fails
- ✅ **Large text area** for detailed questions

**Pre-filled Template:**
```
Dear Trial Administrator,

I am interested in learning more about the clinical trial 
"[Trial Title]".

I would like to know more about:
- Eligibility requirements
- Trial timeline and duration
- How to participate

Thank you for your time.

Best regards
```

**User can customize to ask:**
- Specific eligibility questions
- Side effect concerns
- Travel/time commitment
- Compensation details
- Next steps

---

### **5. Enhanced Trial Cards** ✅

**Card Layout:**
```
┌──────────────────────────────────────────┐
│ Trial Title                        [♡]   │
│ Condition • Phase 2 • [Recruiting]       │
├──────────────────────────────────────────┤
│ ✨ AI-Generated Summary                  │
│ Patient-friendly explanation here...     │
├──────────────────────────────────────────┤
│ Eligibility Criteria:                    │
│ Age 18-65, diagnosed with...             │
├──────────────────────────────────────────┤
│ Participants: 45 / 100                   │
│ [███████████░░░░░░░░] 45%                │
├──────────────────────────────────────────┤
│ 📍 Boston, MA    [Contact Trial Team]    │
└──────────────────────────────────────────┘
```

**Card Features:**

#### **Title & Status:**
- Bold trial title
- Condition name
- Phase badge (outlined)
- Status badge (colored: blue for recruiting, gray for others)
- Heart icon for favorites

#### **AI Summary Section:**
- Purple highlighted box
- Sparkle icon indicator
- Clear "AI-Generated Summary" label
- Easy-to-read patient language

#### **Eligibility Section:**
- Shows inclusion/exclusion criteria
- Helps patients self-assess fit
- Only shown if available

#### **Recruitment Progress:**
- Current vs. target participants
- Visual progress bar
- Percentage indicator
- Helps gauge availability

#### **Contact Section:**
- Location with map pin icon
- "Contact Trial Team" button
- Opens email compose dialog

---

### **6. Personalized Recommendations** ✅

**Auto-Loading:**
- Page loads with personalized trials automatically
- Based on patient's conditions from profile
- Shows conditions with blue badges
- Location-aware by default

**Nearby Filter:**
- Toggle between "Nearby Only" and "Global Results"
- Uses patient's location from profile
- Visual toggle button with icons
- Updates results immediately

**Reset Button:**
- "My Recommendations" button appears after search
- Returns to personalized view
- Clears search query and filters

---

## 🔍 Search Behavior

### **Search Flow:**
```
1. User types query: "Lung Cancer Immunotherapy Trials"
2. User clicks "Search Trials" or presses Enter
3. System searches:
   ↓
   a. Database (researcher-created + cached external)
      - Searches: title, condition, description, eligibility
      - Applies filters (status, phase, location)
   ↓
   b. If < 5 results, searches external ClinicalTrials.gov
      - Fetches additional trials
      - Generates AI summaries
      - Caches in database
   ↓
4. Combines and deduplicates results
5. Displays trials with AI summaries
```

### **Filter Combination:**
```
Query: "diabetes"
Status: "Recruiting"
Phase: "Phase 3"
Location: "Boston"

Results: Recruiting Phase 3 diabetes trials in Boston
```

---

## 📊 Trial Card Information

### **Always Displayed:**
- ✅ Trial title
- ✅ Medical condition
- ✅ Trial phase
- ✅ Recruitment status
- ✅ Location
- ✅ Contact button

### **Conditionally Displayed:**
- ✅ AI summary (if generated)
- ✅ Eligibility criteria (if provided)
- ✅ Participant progress (if tracking)
- ✅ Start/end dates (if set)

---

## 🎨 UI/UX Features

### **Visual Hierarchy:**
1. **Search bar** - Most prominent
2. **Filter panel** - Collapsible, secondary
3. **Results count** - Subtle feedback
4. **Trial cards** - Clear, scannable

### **Color Coding:**
- **Blue** - Recruiting status (active)
- **Gray** - Other statuses (inactive)
- **Purple** - AI summaries (highlight)
- **Outlined** - Phase badges (neutral)

### **Loading States:**
- Search button: "Searching..."
- Email button: "Sending..." with spinner
- Disabled buttons during actions

### **Empty States:**
- Clear message when no results
- Helpful suggestions
- "Try global results" link if nearby filter active

### **Responsive Design:**
- Mobile-friendly filter layout
- Stacking buttons on small screens
- Readable card text sizes

---

## 🔌 API Integration

### **Search Endpoint:**
```
GET /api/clinical-trials/search
  ?query=lung cancer
  &status=Recruiting
  &phase=Phase 2
  &location=Boston
```

**Response:**
```json
{
  "trials": [
    {
      "_id": "...",
      "title": "Phase II Lung Cancer Study",
      "condition": "Lung Cancer",
      "phase": "Phase 2",
      "status": "Recruiting",
      "location": "Boston, MA",
      "summary": "AI-generated patient-friendly summary...",
      "eligibility": "Age 18-70, diagnosed with...",
      "contactEmail": "study@hospital.edu",
      "currentParticipants": 45,
      "targetParticipants": 100
    }
  ]
}
```

### **Email Endpoint:**
```
POST /api/send-email
{
  "to": "study@hospital.edu",
  "subject": "Inquiry about Trial",
  "body": "I am interested in...",
  "trialTitle": "Phase II Study"
}
```

**Behavior:**
- Logs email intent
- Returns success
- Frontend opens mailto: with pre-filled content
- Fallback ensures email always works

---

## 🎯 User Workflows

### **Workflow 1: Quick Search**
```
1. Patient opens /patient/clinical-trials
2. Sees personalized trials based on conditions
3. Clicks search bar
4. Types "immunotherapy"
5. Presses Enter
6. Sees immunotherapy trials with AI summaries
7. Reads AI summary to understand trial
8. Clicks "Contact Trial Team"
9. Reviews pre-filled email
10. Customizes with specific questions
11. Clicks "Send Email"
12. Email client opens with message ✓
```

### **Workflow 2: Filtered Search**
```
1. Patient types "cancer trials"
2. Clicks "Filters" button
3. Selects:
   - Status: "Recruiting"
   - Phase: "Phase 3"
   - Location: "California"
4. Clicks "Search Trials"
5. Sees only recruiting Phase 3 trials in CA
6. Reviews AI summaries
7. Finds suitable trial
8. Checks eligibility criteria
9. Sees 60/100 participants (40% full)
10. Contacts trial team ✓
```

### **Workflow 3: Personalized Discovery**
```
1. Patient logs in (has "Diabetes" in profile)
2. Page auto-loads diabetes trials nearby
3. Sees blue badge: "Diabetes"
4. Sees 8 trials in Boston area
5. Clicks "Global Results" toggle
6. Now sees 45 trials worldwide
7. Filters by "Phase 2"
8. Reviews AI summaries to understand options
9. Favorits 3 interesting trials
10. Contacts most suitable trial ✓
```

---

## 💡 Key Benefits

### **For Patients:**
1. 🔍 **Easy Discovery** - Natural language search
2. 📝 **Clear Information** - AI simplifies complex trials
3. 🎯 **Relevant Results** - Smart filtering
4. 📧 **Direct Contact** - One-click email to researchers
5. 📍 **Location Aware** - Finds nearby opportunities
6. ⚡ **Quick Assessment** - See eligibility at a glance
7. 📊 **Transparency** - See enrollment progress

### **For Researchers:**
1. 👥 **Reach Patients** - Trials visible to qualified patients
2. 📨 **Pre-qualified Inquiries** - Patients self-assess eligibility
3. 💬 **Direct Communication** - Email contact preserved
4. 📈 **Recruitment Support** - Better discovery

---

## 🧪 Testing Examples

### **Test 1: Keyword Search**
```
Query: "Lung Cancer Immunotherapy Trials"

Expected Results:
- Trials with "lung cancer" in title or condition
- Trials with "immunotherapy" in description
- AI summaries highlighting immunotherapy approach
- Multiple phases shown
```

### **Test 2: Multiple Filters**
```
Query: "diabetes"
Status: "Recruiting"
Phase: "Phase 3"
Location: "Boston"

Expected Results:
- Only recruiting trials
- Only Phase 3 trials
- Only trials in Boston area
- Diabetes-related trials
- Each with AI summary
```

### **Test 3: Email Contact**
```
1. Search for "cancer trials"
2. Find trial with contact email
3. Click "Contact Trial Team"
4. Dialog opens with:
   - To: study@hospital.edu
   - Subject: Pre-filled
   - Body: Professional template
5. Edit message with questions
6. Click "Send Email"
7. mailto: opens with edited content ✓
```

### **Test 4: AI Summary Display**
```
1. Search for any trial
2. Each trial card shows purple box
3. Box contains:
   - Sparkle icon
   - "AI-Generated Summary" label
   - Patient-friendly explanation
4. Summary is readable, not technical ✓
```

---

## 📱 Responsive Features

### **Mobile (< 768px):**
- Full-width search bar
- Stacked filters
- Full-width buttons
- Larger tap targets
- Simplified card layout

### **Tablet (768px - 1024px):**
- 2-column filter grid
- Hybrid button layout
- Readable card text

### **Desktop (> 1024px):**
- 3-column filter grid
- Side-by-side buttons
- Optimal card density

---

## 📁 Files Created/Modified

### **Modified:**
1. `app/patient/clinical-trials/page.tsx`
   - Added phase and location filters
   - Added email compose dialog
   - Enhanced AI summary display
   - Added recruitment progress bars
   - Improved card layout

2. `app/api/clinical-trials/search/route.ts`
   - Added phase filter support
   - Added location filter support
   - Improved search logic
   - Better external API integration

### **Created:**
3. `app/api/send-email/route.ts`
   - Email sending API endpoint
   - Mailto fallback support
   - User authentication check

4. `PATIENT_CLINICAL_TRIALS_SEARCH.md`
   - This comprehensive documentation

---

## 🚀 How to Test

```bash
1. npm run dev
2. Login as patient
3. Navigate to /patient/clinical-trials
4. See personalized trials

# Test Search:
5. Type "lung cancer immunotherapy trials"
6. Press Enter
7. Verify results appear
8. Check AI summaries are visible

# Test Filters:
9. Click "Filters" button
10. Select "Recruiting" status
11. Select "Phase 2" phase
12. Type "Boston" in location
13. Click "Search Trials"
14. Verify filtered results

# Test Email:
15. Click "Contact Trial Team" on any trial
16. Verify dialog opens
17. Verify pre-filled template
18. Edit message
19. Click "Send Email"
20. Verify mailto opens

# Test AI Summaries:
21. Verify each trial shows purple AI summary box
22. Verify sparkle icon appears
23. Verify language is patient-friendly
```

---

## 🎉 Result

✅ **Keyword search** with natural language support  
✅ **Advanced filters** for status, phase, and location  
✅ **AI-generated summaries** with purple highlighting  
✅ **Email compose dialog** with professional templates  
✅ **Enrollment progress bars** for transparency  
✅ **Eligibility criteria** display for self-assessment  
✅ **Personalized recommendations** based on profile  
✅ **Location-aware** filtering (nearby/global)  
✅ **Mobile responsive** design  
✅ **Professional UI/UX** with clear visual hierarchy  

The patient clinical trials search system is now fully functional with all requested features! 🚀
