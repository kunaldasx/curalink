# CuraLink AI Care Assistant

## Overview
A comprehensive AI-powered assistant that helps patients understand clinical trials through empathetic, 8th-grade level explanations with visual feedback.

## Features Implemented

### 1. **Trial Simplification** 🧠
- Translates complex clinical trial descriptions into simple language
- Breaks down trials into 6 easy sections:
  - **Summary**: One-sentence friendly explanation
  - **Purpose**: Why the study exists
  - **What Happens**: Step-by-step participation process
  - **Time Commitment**: How much time required
  - **Risks**: Things to be aware of (honest but not scary)
  - **Benefits**: How it might help
- **Visual**: Color-coded cards with icons for each section

### 2. **Eligibility Estimation** ✅
- Analyzes trial criteria against patient information
- Provides:
  - **Match Score** (0-100) with circular progress indicator
  - **Level Badge** (High/Medium/Low) with color coding
  - **Positive Factors**: What makes them a good match ✨
  - **Negative Factors**: Potential exclusions ⚠️
  - **Neutral Factors**: Areas needing more info ❓
- **Visual**: Animated circular progress bar with gradient, categorized factor lists

### 3. **Travel Burden Calculator** 🗺️
- Calculates travel commitment based on:
  - Trial location
  - Patient location
  - Visit frequency
- Provides:
  - **Burden Score** (0-100) with progress bar
  - **Level** (Low/Medium/High) with emoji indicators
  - **Factors** affecting travel
  - **Recommendations** to make travel easier
- **Visual**: Progress bar, emoji indicators, helpful tips

### 4. **Personalized Next Steps** 💡
- Generates actionable guidance based on patient situation
- Organized into 3 timeframes:
  - **This Week** (Immediate actions)
  - **This Month** (Short-term goals)
  - **Long Term** (Bigger picture)
- **Resources** section with helpful contacts
- **Visual**: Timeline-style cards with numbered steps, color-coded by timeframe

### 5. **Medical Jargon Translator** 🌐
- Translates complex medical terms into simple language
- 8th-grade reading level
- **Visual**: Clean translation display with confirmation badge

## Design Philosophy

### Empathetic Language
- Warm, supportive tone throughout
- "We're here to help" messaging
- Encouraging but honest
- Avoids medical jargon

### Visual Clarity
- **Progress Bars**: Show scores and levels
- **Badges**: Quick visual status indicators
- **Color Coding**:
  - Green (Emerald): Positive/Good
  - Amber/Yellow: Caution/Medium
  - Blue: Information
  - Purple: Planning/Future
  - Gray: Neutral/Unknown
- **Icons**: Contextual Lucide icons throughout

### Accessibility
- 8th-grade reading level
- Clear section headers
- Visual + text information
- Gradient themes from CuraLink brand

## Technical Stack

### AI Functions (`utils/ai.ts`)
- `simplifyTrial()`: Converts trial data to simple sections
- `estimateEligibility()`: Analyzes match with scoring
- `calculateTravelBurden()`: Assesses travel commitment
- `generateNextSteps()`: Creates personalized action plan
- `translateMedicalJargon()`: Converts medical text to simple language

### UI Components
- **Mode Selector**: 5 gradient-themed cards
- **Input Forms**: Context-specific for each mode
- **Results Display**: Animated fade-in with rich visuals
- **Progress Indicators**: Circular and linear progress bars
- **Factor Lists**: Categorized with icons

### Styling
- CuraLink gradient theme (teal → indigo → lavender)
- Rounded corners (rounded-2xl, rounded-3xl)
- Soft shadows for depth
- Hover effects and transitions
- Mobile-responsive design

## User Journey

1. **Select Mode**: Click one of 5 assistant modes
2. **Provide Input**: Fill in relevant information
3. **Get Results**: AI analyzes and provides empathetic response
4. **Visual Feedback**: See scores, badges, progress bars, categorized lists
5. **Take Action**: Use insights to make informed decisions

## Navigation

Added to Patient Sidebar as **"AI Assistant"** with Sparkles icon ✨
- Positioned second (after Dashboard) for easy access
- Available to all patients

## Example Use Cases

1. **Patient finds complex trial**: Use "Simplify Trial" to understand it
2. **Wondering about eligibility**: Use "Check Eligibility" for estimate
3. **Concerned about travel**: Use "Travel Burden" to assess commitment
4. **Needs guidance**: Use "Next Steps" for personalized plan
5. **Confused by medical terms**: Use "Translate Jargon" for clarity

## Empathy-First Features

- ✅ Warm, friendly language
- 🎨 Visual progress indicators
- 📊 Clear categorization
- 💚 Encouraging messaging
- 🌟 Accessible design
- 🤝 Supportive tone

## Future Enhancements

- Save conversation history
- Export results as PDF
- Integration with trial matching
- Voice input support
- Multi-language translation
- Comparison mode (compare multiple trials)
