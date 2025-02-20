# 📱 CuraLink Mobile-First Implementation Guide

## 🎨 Hopeful Medical Aesthetic

A unified, mobile-first design system for connecting patients and researchers with hope, clarity, and emotional support.

---

## 🌈 Color Palette: Teal → Indigo → Lavender

### Gradient System
```tsx
// Three-color hopeful gradient
className="gradient-hopeful"  // Teal → Indigo → Lavender

// Two-color gradients
className="gradient-teal-indigo"      // Teal → Indigo
className="gradient-indigo-lavender"  // Indigo → Lavender
className="gradient-soft"             // Soft pastel gradient

// Mesh gradient for backgrounds
className="gradient-mesh"  // Multi-point radial gradients
```

### Text Gradients
```tsx
<h1 className="text-gradient-hopeful">
  Find Hope in Medical Research
</h1>

<h2 className="text-gradient-teal-indigo">
  Connect with Experts
</h2>
```

---

## 📦 Mobile-First Cards

### Basic Card with Hover Lift & Shadow Bloom
```tsx
<div className="card-hopeful">
  <h3>Clinical Trial</h3>
  <p>Description...</p>
</div>

// Interactive card (clickable)
<div className="card-hopeful-interactive" onClick={handleClick}>
  <h3>Expert Profile</h3>
  <p>Specialization...</p>
</div>
```

### Trial/Expert/Paper Cards
```tsx
<div className="trial-card">
  <div className="trial-icon">
    <Flask className="h-8 w-8 text-medical-teal-500" />
  </div>
  <h3 className="text-lg font-semibold">Cancer Immunotherapy</h3>
  <p className="text-medical-soft-500">Phase III Study</p>
  
  {/* Animated stats */}
  <div className="flex gap-4">
    <div>
      <div className="stat-number">245</div>
      <div className="stat-label">Participants</div>
    </div>
  </div>
</div>
```

---

## 🎯 Eligibility Score Rings

Circular progress indicators showing match percentage:

```tsx
<div className="score-ring">
  <svg className="h-24 w-24">
    {/* Define gradients */}
    <defs>
      <linearGradient id="gradient-teal-indigo">
        <stop offset="0%" stopColor="#14b8a6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    
    {/* Track (background) */}
    <circle
      className="score-ring-track"
      cx="48"
      cy="48"
      r="40"
    />
    
    {/* Progress (animated) */}
    <circle
      className="score-ring-progress score-ring-high"
      cx="48"
      cy="48"
      r="40"
      strokeDasharray={`${(score / 100) * 251} 251`}
    />
  </svg>
  
  {/* Center text */}
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-2xl font-bold text-gradient-hopeful">{score}%</span>
    <span className="text-xs text-medical-soft-500">Match</span>
  </div>
</div>
```

Score tiers:
- `score-ring-high` (80-100%): Teal → Indigo gradient
- `score-ring-medium` (50-79%): Indigo → Lavender gradient  
- `score-ring-low` (0-49%): Gray

---

## ✅ Verification Badges

Trust indicators with wiggle animation:

```tsx
<span className="badge-verified">
  <CheckCircle className="badge-verified-icon" />
  Verified Expert
</span>

<span className="badge-stat">
  <Users className="h-3.5 w-3.5" />
  1,245 Patients Helped
</span>
```

---

## 🎛️ Filter Panel with Spring Motion

Mobile bottom sheet, desktop sticky sidebar:

```tsx
const [filterOpen, setFilterOpen] = useState(false);

<div className={`filter-panel ${filterOpen ? 'open' : 'closed'}`}>
  <h3 className="section-title">Filters</h3>
  
  {/* Filter chips */}
  <div className="flex flex-wrap gap-2">
    <button 
      className={`filter-chip ${activeFilter === 'phase3' ? 'active' : ''}`}
      onClick={() => setActiveFilter('phase3')}
    >
      Phase III
    </button>
    <button className="filter-chip">
      Recruiting
    </button>
  </div>
</div>
```

---

## 📱 Bottom Sheet Modals

Mobile-first modals that slide up from bottom:

```tsx
const [sheetOpen, setSheetOpen] = useState(false);

{/* Backdrop */}
{sheetOpen && (
  <div 
    className="bottom-sheet-backdrop"
    onClick={() => setSheetOpen(false)}
  />
)}

{/* Sheet */}
<div className={`bottom-sheet ${sheetOpen ? 'translate-y-0' : 'translate-y-full'}`}>
  <div className="bottom-sheet-handle" />
  
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Trial Details</h2>
    <p>Content...</p>
  </div>
</div>
```

---

## 📌 Sticky Bottom CTA

Mobile action bar (auto-hides on desktop):

```tsx
<div className="sticky-cta safe-area-bottom">
  <button 
    className="sticky-cta-button"
    onClick={handleApply}
    disabled={!eligible}
  >
    Apply to Trial
  </button>
  
  <p className="microcopy-supportive text-center mt-2">
    We're here to support your journey
  </p>
</div>
```

---

## 📊 Animated Stats

Numbers with hopeful gradients:

```tsx
<div className="space-y-2">
  <div className="stat-number">
    {animatedCount}
  </div>
  <div className="stat-label">
    Active Trials
  </div>
  
  {/* Trend indicator */}
  <div className="stat-trend-up">
    <TrendingUp className="h-4 w-4" />
    12% this month
  </div>
</div>
```

---

## 💙 Supportive Empty States

Friendly, reassuring messages when no data:

```tsx
<div className="empty-state">
  <Search className="empty-state-icon" />
  <h3 className="empty-state-title">
    No trials found yet
  </h3>
  <p className="empty-state-message">
    We're constantly adding new research opportunities. 
    Try adjusting your filters or check back soon!
  </p>
  <button className="empty-state-cta">
    Browse All Trials
  </button>
</div>
```

---

## 🎉 Success Animations

Celebratory feedback:

```tsx
<div className="success-message">
  <div className="success-checkmark">
    <Check className="h-8 w-8" />
  </div>
  <h2 className="success-title">
    Application Submitted!
  </h2>
  <p className="success-description">
    The research team will review your application and reach out within 48 hours.
  </p>
</div>
```

---

## 🏗️ Masonry Grid Layout

Responsive card grid (mobile: 1 col, tablet: 2 cols, desktop: 3 cols):

```tsx
<div className="masonry-grid">
  {trials.map((trial) => (
    <div key={trial.id} className="masonry-item">
      <div className="trial-card">
        {/* Card content */}
      </div>
    </div>
  ))}
</div>
```

---

## 🎨 Buttons

### Primary (Hopeful Gradient)
```tsx
<button className="btn-primary">
  Find Matching Trials
</button>
```

### Secondary (Outlined)
```tsx
<button className="btn-secondary">
  Learn More
</button>
```

### Ghost (Text Only)
```tsx
<button className="btn-ghost">
  Skip for now
</button>
```

---

## 📝 Form Inputs

With focus glow effect:

```tsx
<input 
  type="text"
  placeholder="Search conditions..."
  className="input-hopeful"
/>
```

---

## 🏷️ Chips & Tags

Interactive tags with micro-animations:

```tsx
{/* Basic chip */}
<span className="chip">
  Oncology
</span>

{/* Removable chip */}
<span className="chip-removable" onClick={handleRemove}>
  Diabetes
  <X className="chip-remove-icon" />
</span>
```

---

## 🔔 Notification Badges

Attention-grabbing count indicators:

```tsx
<div className="relative">
  <Bell className="h-6 w-6" />
  <span className="notification-badge">
    5
  </span>
</div>
```

---

## 🔄 Toggle Switches

Smooth spring animation:

```tsx
<button 
  className={`toggle ${enabled ? 'toggle-checked' : 'toggle-unchecked'}`}
  onClick={() => setEnabled(!enabled)}
>
  <span className={`toggle-thumb ${enabled ? 'toggle-thumb-checked' : 'toggle-thumb-unchecked'}`} />
</button>
```

---

## 📈 Progress Bars

Hopeful gradient fill:

```tsx
<div className="progress-bar">
  <div 
    className="progress-fill"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## ⏳ Loading States

### Spinner with Message
```tsx
<div className="loading-state">
  <div className="loading-spinner" />
  <p className="loading-message">
    Finding the best matches for you...
  </p>
</div>
```

### Skeleton Loader
```tsx
<div className="space-y-4">
  <div className="skeleton h-24 w-full" />
  <div className="skeleton-text w-3/4" />
  <div className="skeleton-text w-1/2" />
</div>
```

---

## 💬 Friendly Microcopy

Supportive helper text:

```tsx
<p className="microcopy-supportive">
  Your information is secure and confidential
</p>

<p className="microcopy">
  Updated 2 minutes ago
</p>
```

---

## 📱 Mobile-First Containers

Responsive containers with proper padding:

```tsx
{/* Full width with responsive padding */}
<div className="container-mobile">

{/* Max-width containers */}
<div className="container-mobile-sm">  {/* max-w-640px */}
<div className="container-mobile-md">  {/* max-w-768px */}
<div className="container-mobile-lg">  {/* max-w-1024px */}
```

---

## 📐 Safe Area Support

For iOS notch and bottom bar:

```tsx
<header className="safe-area-top">
  {/* Header content */}
</header>

<footer className="safe-area-bottom">
  {/* Footer content */}
</footer>

{/* All safe areas */}
<div className="safe-area-inset">
  {/* Content */}
</div>
```

---

## 🎨 Section Headers

Mobile-friendly headings:

```tsx
<div className="section-header">
  <div>
    <h2 className="section-title">Recommended Trials</h2>
    <p className="section-subtitle">Based on your profile</p>
  </div>
  <button className="btn-ghost">See All</button>
</div>
```

---

## ✨ Animation Examples

### Page Transition
```tsx
<div className="page-enter">
  {/* Page content fades in with upward slide */}
</div>
```

### Fade-Slide Elements
```tsx
<div className="animate-fade-slide">
  {/* Slides in from left with fade */}
</div>
```

### Success Pop
```tsx
<div className="animate-success-pop">
  ✅ Saved!
</div>
```

### Icon Pulse
```tsx
<div className="icon-pulse">
  <Heart className="h-6 w-6 text-medical-teal-500" />
</div>
```

---

## 🎯 Complete Example: Trial Card

```tsx
<div className="trial-card">
  {/* Header with icon */}
  <div className="flex items-start gap-3">
    <div className="trial-icon p-3 rounded-2xl bg-gradient-soft">
      <Flask className="h-6 w-6 text-medical-teal-600" />
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-1">
        CAR T-Cell Therapy for Lymphoma
      </h3>
      <span className="badge-verified">
        <CheckCircle className="badge-verified-icon" />
        Verified Trial
      </span>
    </div>
  </div>

  {/* Eligibility score */}
  <div className="flex items-center gap-4">
    <div className="score-ring">
      {/* SVG ring component */}
    </div>
    <div>
      <p className="text-sm text-medical-soft-500">
        You're a strong match for this trial
      </p>
    </div>
  </div>

  {/* Stats */}
  <div className="flex gap-4">
    <div className="badge-stat">
      <Users className="h-3.5 w-3.5" />
      245 enrolled
    </div>
    <div className="badge-stat">
      <MapPin className="h-3.5 w-3.5" />
      3 miles away
    </div>
  </div>

  {/* CTA */}
  <button className="btn-primary w-full">
    View Details
  </button>

  {/* Microcopy */}
  <p className="microcopy-supportive">
    We'll guide you through every step
  </p>
</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
base:     0px - 360px+  (default)
sm:       640px+        (tablet)
md:       768px+        (small laptop)
lg:       1024px+       (desktop)
xl:       1280px+       (large desktop)
```

---

## ♿ Accessibility (WCAG AA)

All components meet accessibility standards:

- ✅ **Contrast ratios**: 4.5:1 minimum for text
- ✅ **Focus states**: Visible focus rings on all interactive elements
- ✅ **Keyboard navigation**: Tab order and Enter/Space support
- ✅ **Screen readers**: Semantic HTML and ARIA labels
- ✅ **Touch targets**: Minimum 44x44px on mobile

---

## 🎭 Emotion & Tone

Every interaction should feel:

- **🤗 Supportive**: "We're here for you"
- **💪 Empowering**: "You've got this"
- **🌟 Hopeful**: "Better days ahead"
- **🧘 Calm**: No anxiety-inducing language
- **👥 Human**: Friendly, not clinical

---

## 🚀 Quick Start Checklist

When building a new page:

- [ ] Use `container-mobile` for responsive width
- [ ] Apply `page-enter` animation to main container
- [ ] Use `section-header` for page sections
- [ ] Implement `masonry-grid` for card layouts
- [ ] Add `card-hopeful-interactive` to clickable cards
- [ ] Use `btn-primary` for main actions
- [ ] Add `sticky-cta` for mobile CTAs
- [ ] Include `empty-state` for no-data scenarios
- [ ] Use `loading-state` or `skeleton` while loading
- [ ] Add `success-message` for confirmations
- [ ] Include `microcopy-supportive` for reassurance
- [ ] Test on mobile (360px width minimum)
- [ ] Verify WCAG AA contrast
- [ ] Check keyboard navigation

---

## 🎨 Animation Timing

```css
/* Micro-interactions */
hover: 200ms ease-smooth
active: 200ms ease-smooth

/* Page transitions */
enter: 400-600ms cubic-bezier(0.16, 1, 0.3, 1)

/* Spring motion (filters, sheets) */
open/close: 500ms ease-spring

/* Success celebrations */
pop: 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Stats/rings */
progress: 1000ms ease-spring
```

---

## 💡 Best Practices

### DO ✅
- Start with mobile (360px)
- Use hopeful gradients for primary actions
- Add micro-animations to all interactions
- Provide supportive empty states
- Include friendly microcopy
- Test with real patient language
- Celebrate successes with animations

### DON'T ❌
- Use clinical/cold language
- Overwhelm with too many colors
- Create anxiety with harsh red errors
- Ignore touch targets (<44px)
- Forget loading states
- Skip empty state messages
- Use sharp edges or corners

---

## 🔗 Related Files

- `tailwind.config.ts` - Design tokens
- `app/globals.css` - Component styles
- `DESIGN_SYSTEM.md` - Original design system

---

**Every screen should feel alive, supportive, and effortless. Prioritize comfort, clarity, and hope for people navigating difficult health journeys.** 💙
