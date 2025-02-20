# Duolingo-Inspired Theme Implementation Guide

## Overview
Apply this consistent theme across all patient and researcher pages for a hopeful, energizing experience.

## Page Header Template
Replace existing page headers with:
```tsx
<div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-lg animate-fade-in-up">
  <h1 className="text-3xl md:text-4xl font-bold mb-3"
    style={{
      background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}
  >
    Page Title
  </h1>
  <p className="text-lg text-gray-700">
    Page description with emoji 👋
  </p>
</div>
```

## Card Styles
### Main Cards
```tsx
<Card className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in">
  {/* Optional gradient top border */}
  <div className="h-2 bg-gradient-to-r from-medical-teal-400 to-medical-indigo-400" />
  <CardHeader>
    {/* Icon box */}
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-teal-100 to-medical-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
      <Icon className="h-8 w-8 text-medical-teal-600" />
    </div>
    <CardTitle className="text-xl font-bold text-gray-800">Title</CardTitle>
  </CardHeader>
</Card>
```

## Button Styles
### Primary Gradient Button
```tsx
<Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg group">
  Button Text <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
</Button>
```

### Secondary Outline Button
```tsx
<Button className="px-6 py-5 rounded-xl font-semibold bg-white border-2 border-medical-teal-300 text-medical-teal-600 hover:bg-gradient-to-r hover:from-medical-teal-50 hover:to-medical-indigo-50 hover:border-medical-teal-400 transition-all duration-200 hover:scale-105 hover:shadow-lg">
  Button Text
</Button>
```

## Badge Styles
```tsx
<Badge className="px-4 py-2 rounded-xl bg-gradient-to-r from-medical-teal-100 to-medical-indigo-100 text-medical-teal-700 border border-medical-teal-300 font-medium hover:scale-105 transition-transform duration-200">
  Badge Text
</Badge>
```

## Search/Filter Sections
```tsx
<Card className="mb-8 rounded-2xl shadow-lg border-0">
  <CardContent className="pt-6">
    <div className="flex flex-col md:flex-row gap-4">
      <Input 
        placeholder="Search..." 
        className="flex-1 rounded-xl border-2 border-gray-200 focus:border-medical-teal-400 focus:ring-4 focus:ring-medical-teal-100 transition-all duration-200 p-4"
      />
      <Button className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105">
        <Search className="mr-2 h-5 w-5" />
        Search
      </Button>
    </div>
  </CardContent>
</Card>
```

## Empty State
```tsx
<div className="text-center py-12">
  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-medical-teal-100 to-medical-indigo-100 flex items-center justify-center">
    <Icon className="h-10 w-10 text-medical-teal-600" />
  </div>
  <h3 className="text-xl font-bold text-gray-800 mb-2">Empty State Title</h3>
  <p className="text-gray-600 mb-6">Empty state description</p>
  <Button className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105">
    Action Button
  </Button>
</div>
```

## List Items (Clickable/Hoverable)
```tsx
<div className="block border-l-4 border-medical-teal-400 pl-4 pr-3 py-3 hover:bg-gradient-to-r hover:from-medical-teal-50 hover:to-medical-indigo-50 transition-all rounded-r-xl hover:scale-102 cursor-pointer group">
  <h3 className="font-semibold text-gray-800 group-hover:text-medical-teal-700">Item Title</h3>
  <p className="text-sm text-gray-600 mt-1">Item description</p>
</div>
```

## Dialog/Modal Styling
```tsx
<DialogContent className="rounded-2xl border-0 shadow-2xl max-w-2xl">
  <DialogHeader>
    <DialogTitle className="text-2xl font-bold text-gray-800">Dialog Title</DialogTitle>
    <DialogDescription className="text-base text-gray-600">Description</DialogDescription>
  </DialogHeader>
  {/* Content */}
  <DialogFooter className="gap-3">
    <Button variant="outline" className="px-6 py-3 rounded-xl">Cancel</Button>
    <Button className="px-6 py-3 rounded-xl bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500">
      Confirm
    </Button>
  </DialogFooter>
</DialogContent>
```

## Color Gradients Reference
- **Teal → Indigo**: `from-medical-teal-400 to-medical-indigo-400`
- **Indigo → Lavender**: `from-medical-indigo-400 to-medical-lavender-400`
- **Lavender → Teal**: `from-medical-lavender-400 to-medical-teal-400`
- **Full Spectrum**: `from-medical-teal-400 via-medical-indigo-400 to-medical-lavender-400`

## Animation Classes
- Fade in: `animate-fade-in`
- Fade in up: `animate-fade-in-up`
- Fade slide: `animate-fade-slide`
- Scale bounce: `animate-scale-bounce`
- With delays: `style={{ animationDelay: '100ms' }}`

## Mobile Responsiveness
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Gap: `gap-4 md:gap-6`
- Padding: `p-4 md:p-6 lg:p-8`
- Text: `text-lg md:text-xl lg:text-2xl`

## Implementation Checklist
For each page, update:
- [ ] Page header with gradient background
- [ ] All Card components with rounded corners and shadows
- [ ] All Button components with gradients and hover effects
- [ ] All Badge components with gradient backgrounds
- [ ] Search/filter sections
- [ ] Empty states with icons
- [ ] List items with hover effects
- [ ] Dialogs/modals styling
- [ ] Mobile responsive spacing

## Files to Update
### Patient Pages:
- ✅ `/app/patient/dashboard/page.tsx`
- ✅ `/app/patient/onboarding/page.tsx`
- ⏳ `/app/patient/experts/page.tsx`
- ⏳ `/app/patient/clinical-trials/page.tsx`
- ⏳ `/app/patient/meetings/page.tsx`
- ⏳ `/app/patient/messages/page.tsx`
- ⏳ `/app/patient/publications/page.tsx`
- ⏳ `/app/patient/forums/page.tsx`
- ⏳ `/app/patient/favorites/page.tsx`
- ⏳ `/app/patient/profile/page.tsx`

### Researcher Pages:
- ✅ `/app/researcher/dashboard/page.tsx`
- ⏳ `/app/researcher/collaborators/page.tsx`
- ⏳ `/app/researcher/clinical-trials/page.tsx`
- ⏳ `/app/researcher/publications/page.tsx`
- ⏳ `/app/researcher/meeting-requests/page.tsx`
- ⏳ `/app/researcher/messages/page.tsx`
- ⏳ `/app/researcher/forums/page.tsx`
- ⏳ `/app/researcher/favorites/page.tsx`
- ⏳ `/app/researcher/profile/page.tsx`
