# ✅ Researcher Onboarding Fixes

## Issues Fixed

### **1. Research Interests Not Being Saved to Database**
**Problem:** Research interests were collected in Step 2 but not saved to the database.

**Root Cause:** Frontend was sending `researchInterests` but the API expected `interests`.

**Fix:**
- Changed frontend submission to send `interests: researchInterests` instead of `researchInterests`
- API now correctly receives and saves to `user.interests` field

```typescript
// BEFORE (not working)
body: JSON.stringify({
  specialties,
  researchInterests,  // ❌ Wrong field name
  ...
})

// AFTER (working)
body: JSON.stringify({
  specialties,
  interests: researchInterests,  // ✅ Correct field name
  ...
})
```

---

### **2. City and Country Not Collected in Onboarding**
**Problem:** The User model has `location: { city, country }` fields but onboarding didn't ask for them.

**Fix:**
- Added `city` and `country` state variables
- Added input fields in Step 1 (after specialties)
- Added validation to require both fields before progressing
- Updated API to properly save location object

**New UI in Step 1:**
```
Your Location
├── City *     [e.g., Boston]
└── Country *  [e.g., USA]
```

---

## Changes Made

### **File: `app/researcher/onboarding/page.tsx`**

**Added State:**
```typescript
const [city, setCity] = useState("");
const [country, setCountry] = useState("");
```

**Updated Validation:**
```typescript
case 1:
  return specialties.length > 0 && 
         city.trim() !== "" && 
         country.trim() !== "";
```

**Updated Submission:**
```typescript
body: JSON.stringify({
  specialties,
  interests: researchInterests,      // ✅ Fixed field name
  location: { city, country },       // ✅ Added location
  orcidId,
  researchGateUrl,
  publications,
  acceptsMeetings,
})
```

**Added UI Fields:**
- Two-column grid layout for city and country inputs
- Labels with asterisks (*) indicating required fields
- Placeholder text for guidance
- Consistent styling with other form elements

---

### **File: `app/api/user/onboarding/route.ts`**

**Updated Location Handling:**
```typescript
// BEFORE
user.location = location;  // ❌ Might cause issues

// AFTER
if (location) {
  user.location = {
    city: location.city || '',
    country: location.country || '',
  };
}
```

**Benefits:**
- ✅ Properly structures location object
- ✅ Handles missing/undefined location gracefully
- ✅ Sets empty strings as defaults
- ✅ Works for both patients and researchers

---

## Database Schema

The User model already had the correct schema:

```typescript
location: {
  city: { type: String, default: '' },
  country: { type: String, default: '' },
}
```

No database changes needed! ✅

---

## User Flow

### **Step 1: Your Expertise**
```
┌─────────────────────────────────────┐
│  Welcome to CuraLink!               │
│  Let's set up your research profile │
├─────────────────────────────────────┤
│  Your Specialties                   │
│  [Type specialty...       ]         │
│  + Oncology  + Neurology  + ...     │
│                                     │
│  Selected: Oncology, Neurology      │
├─────────────────────────────────────┤
│  Your Location                      │
│  City *        │  Country *         │
│  [Boston   ]   │  [USA       ]      │
└─────────────────────────────────────┘
           [Next Step →]
```

### **Step 2: Research Interests**
- ✅ Now properly saved as `interests` in database
- Displayed in researcher profile
- Used for matching with trials and collaborators

---

## Data Flow

1. **User Input:**
   - Specialties: `["Oncology", "Neurology"]`
   - City: `"Boston"`
   - Country: `"USA"`
   - Research Interests: `["Immunotherapy", "Clinical AI"]`

2. **Frontend Submission:**
```json
{
  "specialties": ["Oncology", "Neurology"],
  "location": {
    "city": "Boston",
    "country": "USA"
  },
  "interests": ["Immunotherapy", "Clinical AI"],
  "orcidId": "...",
  "researchGateUrl": "...",
  "acceptsMeetings": true
}
```

3. **Database Storage:**
```javascript
{
  _id: ObjectId("..."),
  name: "Dr. Sarah Johnson",
  email: "sarah@example.com",
  role: "researcher",
  specialties: ["Oncology", "Neurology"],
  location: {
    city: "Boston",
    country: "USA"
  },
  interests: ["Immunotherapy", "Clinical AI"],  // ✅ Now saved!
  orcidId: "0000-0002-1825-0097",
  acceptsMeetings: true,
  // ...
}
```

---

## Testing Checklist

- [x] City and country fields appear in Step 1
- [x] Both fields are required (validation)
- [x] Can't proceed without filling both fields
- [x] Research interests collected in Step 2
- [x] All data submitted correctly to API
- [x] Location saved as `{ city, country }` object
- [x] Interests saved to `interests` field (not `researchInterests`)
- [x] Researcher can complete onboarding successfully
- [x] Data appears correctly in database

---

## Benefits

✅ **Complete researcher profile** - All important data collected  
✅ **Better matching** - Location enables regional trial matching  
✅ **Research interests saved** - Used for recommendations and connections  
✅ **Consistent data structure** - Follows existing User model schema  
✅ **Required fields validated** - Ensures data quality  
✅ **Professional UI** - Clean, intuitive input fields  

---

## Files Modified

1. ✅ `app/researcher/onboarding/page.tsx`
   - Added city and country state
   - Added location input fields in Step 1
   - Fixed interests field name in submission
   - Updated validation logic

2. ✅ `app/api/user/onboarding/route.ts`
   - Updated location handling for proper object structure
   - Applied to both patient and researcher roles

---

## Status: ✅ **COMPLETE**

Researcher onboarding now:
- ✅ Collects city and country in Step 1
- ✅ Saves research interests to database correctly
- ✅ All fields properly validated and required
- ✅ Data structure matches User model schema
