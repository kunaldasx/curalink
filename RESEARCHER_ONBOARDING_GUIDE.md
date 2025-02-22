# Researcher Onboarding Implementation Guide

## Overview
The researcher onboarding follows the same 5-step progress system as the patient onboarding, with researcher-specific content and styling.

## Key Changes from Patient Onboarding

### 1. Component Name
- Change: `PatientOnboarding` → `ResearcherOnboarding`

### 2. Icon Imports
Add these icons to the import statement:
```typescript
import {
	X,
	Plus,
	ArrowRight,
	ArrowLeft,
	MapPin,
	Flask,          // NEW: For research icon
	Check,
	Sparkles,
	Loader2,
	Link2,          // NEW: For profile links
	GraduationCap,  // NEW: For expertise
	Building2,      // NEW: For institution
} from "lucide-react";
```

Remove: `Heart` (patient-specific)

### 3. State Variables
Replace patient-specific state with researcher state:

**Remove:**
```typescript
const [conditions, setConditions] = useState("");
const [additionalConditions, setAdditionalConditions] = useState<string[]>([]);
const [conditionInput, setConditionInput] = useState("");
```

**Add:**
```typescript
const [researchFocus, setResearchFocus] = useState("");
const [specialties, setSpecialties] = useState<string[]>([]);
const [specialtyInput, setSpecialtyInput] = useState("");
const [institution, setInstitution] = useState("");
const [orcidId, setOrcidId] = useState("");
const [researchGateUrl, setResearchGateUrl] = useState("");
const [acceptsMeetings, setAcceptsMeetings] = useState(true);
```

### 4. Suggested Lists

**Specialties** (replace suggestedConditions):
```typescript
const suggestedSpecialties = [
	"Oncology",
	"Neurology",
	"Cardiology",
	"Immunology",
	"Endocrinology",
	"Gastroenterology",
	"Pulmonology",
	"Nephrology",
];
```

**Interests** (update suggestedInterests):
```typescript
const suggestedInterests = [
	"Clinical Trials",
	"Drug Development",
	"Patient Recruitment",
	"Biomarker Research",
	"Gene Therapy",
	"Precision Medicine",
];
```

### 5. Helper Functions

**Replace condition functions with specialty functions:**
```typescript
const addSpecialty = (specialty: string) => {
	const trimmed = specialty.trim();
	if (trimmed && !specialties.includes(trimmed)) {
		setSpecialties([...specialties, trimmed]);
		setSpecialtyInput("");
	}
};

const removeSpecialty = (specialty: string) => {
	setSpecialties(specialties.filter((s) => s !== specialty));
};
```

### 6. Validation Logic (canProgress)
```typescript
const canProgress = () => {
	switch (currentStep) {
		case 1:
			return researchFocus.trim().length > 0;  // Must have research focus
		case 2:
			return specialties.length > 0;            // Must have at least one specialty
		case 3:
			return city.trim() && country.trim() && institution.trim();  // All required
		case 4:
			return true;  // Optional (profiles)
		case 5:
			return true;
		default:
			return false;
	}
};
```

### 7. Submit Handler
```typescript
const handleSubmit = async () => {
	setLoading(true);
	try {
		const response = await fetch("/api/user/onboarding", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				researchFocus,
				specialties,
				institution,
				location: { city, country },
				interests,
				orcidId,
				researchGateUrl,
				acceptsMeetings,
			}),
		});

		if (response.ok) {
			router.push("/researcher/dashboard");  // Researcher dashboard
		}
	} catch (error) {
		console.error("Onboarding error:", error);
		setLoading(false);
	}
};
```

### 8. Step Titles & Messages
```typescript
const stepTitles = [
	"About Your Research",
	"Your Expertise",
	"Institution & Location",
	"Research Profiles",
	"Let's Get Started!",
];

const stepMessages = [
	"Tell us about your research focus 🔬",
	"Share your areas of expertise",
	"Where do you conduct research?",
	"Connect your academic profiles",
	"Almost there!",
];
```

### 9. Gradient Classes

**Main container:**
```typescript
<div className="min-h-screen gradient-research flex items-center...">
```
(Change from `gradient-hopeful` to `gradient-research`)

**Progress bar gradient:**
```typescript
background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 25%, #a855f7 50%, #ec4899 75%, #f43f5e 100%)"
```
(Blue → Purple → Pink → Red theme)

**Progress dot colors:**
```typescript
step < currentStep
	? "bg-white text-blue-500 shadow-xl scale-100"
	: step === currentStep
	? "bg-white text-purple-600 shadow-2xl scale-125 ring-4 ring-white/50"
	: "bg-white/40 text-white/60 shadow-md scale-90"
```

---

## Step Content Updates

### Step 1: About Your Research
```typescript
{currentStep === 1 && (
	<div className="space-y-8 animate-fade-in-up">
		<div className="text-center mb-8">
			<div className="w-20 h-20 rounded-full ... animate-scale-bounce"
				style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}>
				<Flask className="h-10 w-10 text-white" />
			</div>
			<h2 style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)" }}>
				Welcome to CuraLink!
			</h2>
			<p>Let's set up your research profile</p>
		</div>

		<Label htmlFor="researchFocus">Tell us about your research</Label>
		<Textarea
			id="researchFocus"
			placeholder="Example: 'I'm a neuroscientist specializing in glioblastoma research...'"
			value={researchFocus}
			onChange={(e) => setResearchFocus(e.target.value)}
			className="... focus:border-blue-400 focus:ring-blue-100 ..."
		/>
		
		<div className="... from-blue-50 to-purple-50 ... border-blue-200">
			<Sparkles className="text-purple-500" />
			<p>Our AI will match you with relevant patients and collaboration opportunities</p>
		</div>
	</div>
)}
```

### Step 2: Your Expertise (Specialties)
```typescript
{currentStep === 2 && (
	<div className="space-y-8 animate-fade-in-up">
		<div className="text-center mb-8">
			<div className="w-20 h-20 ... animate-float"
				style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" }}>
				<GraduationCap className="h-10 w-10 text-white" />
			</div>
			<h2>Your Areas of Expertise</h2>
			<p>Help us understand your specialties</p>
		</div>

		<Input
			placeholder="Type a specialty and press Enter"
			value={specialtyInput}
			onChange={(e) => setSpecialtyInput(e.target.value)}
			onKeyPress={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					addSpecialty(specialtyInput);
				}
			}}
			className="... focus:border-purple-400 focus:ring-purple-100"
		/>

		{/* Suggested specialties grid */}
		{suggestedSpecialties.map((specialty) => (
			<button onClick={() => addSpecialty(specialty)}>
				+ {specialty}
			</button>
		))}

		{/* Selected specialties display */}
		{specialties.length > 0 && (
			<div className="... from-blue-50 to-purple-50 ... border-purple-200">
				{specialties.map((specialty) => (
					<button onClick={() => removeSpecialty(specialty)}>
						{specialty} <X />
					</button>
				))}
			</div>
		)}
	</div>
)}
```

### Step 3: Institution & Location
```typescript
{currentStep === 3 && (
	<div className="space-y-8 animate-fade-in-up">
		<div className="text-center mb-8">
			<div className="w-20 h-20 ... animate-scale-bounce"
				style={{ background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)" }}>
				<Building2 className="h-10 w-10 text-white" />
			</div>
			<h2>Where do you work?</h2>
			<p>Tell us about your institution</p>
		</div>

		<Label htmlFor="institution">Institution</Label>
		<Input
			id="institution"
			placeholder="e.g., Harvard Medical School, Johns Hopkins University"
			value={institution}
			onChange={(e) => setInstitution(e.target.value)}
		/>

		<div className="grid grid-cols-2 gap-4">
			<Input id="city" placeholder="e.g., Boston, London" value={city} onChange={...} />
			<Input id="country" placeholder="e.g., USA, UK" value={country} onChange={...} />
		</div>

		<div className="... from-blue-50 to-purple-50 ... border-blue-200">
			<MapPin className="text-blue-600" />
			<p>This helps patients find experts near them</p>
		</div>
	</div>
)}
```

### Step 4: Research Profiles (Optional)
```typescript
{currentStep === 4 && (
	<div className="space-y-8 animate-fade-in-up">
		<div className="text-center mb-8">
			<div className="w-20 h-20 ... animate-float"
				style={{ background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)" }}>
				<Link2 className="h-10 w-10 text-white" />
			</div>
			<h2>Connect Your Profiles</h2>
			<p>Link your academic profiles (Optional)</p>
		</div>

		{/* ORCID ID */}
		<Label>ORCID ID</Label>
		<Input
			placeholder="0000-0002-1234-5678"
			value={orcidId}
			onChange={(e) => setOrcidId(e.target.value)}
			className="... focus:border-pink-400 focus:ring-pink-100"
		/>

		{/* ResearchGate */}
		<Label>ResearchGate Profile</Label>
		<Input
			placeholder="https://researchgate.net/profile/..."
			value={researchGateUrl}
			onChange={(e) => setResearchGateUrl(e.target.value)}
		/>

		{/* Research Interests */}
		<p>What interests you most?</p>
		<div className="grid grid-cols-2 gap-3">
			{suggestedInterests.map((interest) => (
				<button
					onClick={() => interests.includes(interest) ? removeInterest(interest) : addInterest(interest)}
					className={interests.includes(interest) ? "... from-pink-400 to-purple-400 ..." : "..."}
				>
					{interests.includes(interest) && <Check />}
					{interest}
				</button>
			))}
		</div>

		{/* Meeting Availability Checkbox */}
		<div className="flex items-start ... from-blue-50 to-purple-50 ... border-blue-200">
			<input
				type="checkbox"
				id="acceptsMeetings"
				checked={acceptsMeetings}
				onChange={(e) => setAcceptsMeetings(e.target.checked)}
			/>
			<Label>I'm available for meeting requests from patients</Label>
		</div>
	</div>
)}
```

### Step 5: Confirmation
```typescript
{currentStep === 5 && !loading && (
	<div className="space-y-6 animate-fade-in-up">
		<div className="text-center mb-6">
			<div className="... from-blue-500 to-purple-500 ... animate-success-pop">
				<Check className="h-8 w-8 text-white" />
			</div>
			<h2 className="... from-blue-500 to-purple-500">Perfect! You're all set 🎉</h2>
		</div>

		<div className="... from-blue-50 to-purple-50 ... border-blue-200">
			{/* Display summary of: researchFocus, specialties, institution, location */}
		</div>

		<div className="... from-purple-50 to-pink-50 ... border-purple-200">
			<p><Sparkles /> What happens next?</p>
			<ul>
				<li><Check /> Your profile becomes visible to patients</li>
				<li><Check /> Receive collaboration opportunities</li>
				<li><Check /> Access trial management tools</li>
				<li><Check /> Connect with potential trial participants</li>
			</ul>
		</div>
	</div>
)}
```

---

## Color Theme Summary

**Researcher Theme Colors:**
- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Accent: Pink (#ec4899) to Red (#f43f5e)

**Gradients:**
- Progress bar: Blue → Purple → Pink → Red
- Step 1: Blue → Purple
- Step 2: Purple → Pink
- Step 3: Blue → Purple
- Step 4: Pink → Purple

**Focus colors:**
- Step 1: `focus:border-blue-400 focus:ring-blue-100`
- Step 2: `focus:border-purple-400 focus:ring-purple-100`
- Step 3: `focus:border-blue-400 focus:ring-blue-100`
- Step 4: `focus:border-pink-400 focus:ring-pink-100`

---

## Affirmation Messages (Bottom of Screen)
```typescript
{currentStep > 1 && currentStep < 5 && !loading && (
	<p className="text-center mt-4 text-sm text-white/80 animate-fade-in">
		{currentStep === 2 && "Great! Your expertise shines ✨"}
		{currentStep === 3 && "Perfect. Thanks for sharing 🙏"}
		{currentStep === 4 && "You're doing amazing! 💪"}
	</p>
)}
```

---

## Implementation Status

✅ **Component structure** - Copied from patient onboarding  
✅ **State variables** - Updated to researcher-specific  
✅ **Helper functions** - Added specialty/interest management  
✅ **Validation logic** - Updated for researcher requirements  
✅ **Submit handler** - Sends researcher data  
✅ **Step titles/messages** - Researcher-specific content  
⚠️ **Step UI content** - Needs manual updates (see sections above)  
⚠️ **Color theme** - Needs gradient/color updates throughout  

---

## Quick Start

1. Open `app/researcher/onboarding/page.tsx`
2. Update imports (add Flask, Link2, GraduationCap, Building2; remove Heart)
3. Replace all state variables with researcher versions
4. Update helper functions (addSpecialty, removeSpecialty)
5. Update canProgress() validation
6. Update handleSubmit() data structure
7. Change gradient-hopeful → gradient-research
8. Update each step's UI content following the templates above
9. Update colors throughout (blue/purple theme)

---

## Testing Checklist

- [ ] Step 1: Can enter research focus and proceed
- [ ] Step 2: Can add/remove specialties, required to have at least one
- [ ] Step 3: Can enter institution, city, country (all required)
- [ ] Step 4: Can optionally enter profiles and select interests
- [ ] Step 5: Shows summary and submits successfully
- [ ] Progress bar animates correctly
- [ ] Progress dots show correct state (completed/current/pending)
- [ ] Colors match researcher theme (blue/purple/pink)
- [ ] Affirmation messages show at bottom
- [ ] Loading state works properly
- [ ] Redirects to /researcher/dashboard on completion

---

## File Created
`app/researcher/onboarding/page.tsx` - Currently a copy of patient onboarding awaiting full customization

**Next Steps:** Apply the changes documented in this guide to complete the researcher onboarding implementation.
