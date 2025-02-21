# Floating AI Chat Widget

## Overview
A beautiful, minimizable floating AI chat widget that appears on every page for both patients and researchers.

## Features

### 🎯 **Position & Behavior**
- **Fixed bottom-right corner** of screen
- **Floating button** when closed (pulsing animation)
- **Expandable widget** when opened
- **Minimizable** to header-only view
- **Always accessible** across all authenticated pages

### 💬 **Chat Interface**

#### **Compact Design:**
- **Width**: 384px (w-96)
- **Max Height**: 600px when expanded
- **Minimized Height**: 60px (header only)
- **Smooth transitions** between states

#### **Features:**
- Real-time conversational AI
- Role-aware responses (patient/researcher)
- Conversation history within session
- Auto-scroll to latest message
- Timestamp on each message
- Enter to send, auto-resize textarea

### 🎨 **Visual Design**

#### **Floating Button:**
- Circular button (64x64px)
- Gradient: Teal → Indigo
- Pulsing animation when closed
- Sparkle badge indicator
- Hover: Scale up + shadow increase

#### **Chat Widget:**
- **Header**: Gradient background with role badge
- **Messages**: Alternating user/assistant bubbles
- **User messages**: Teal-Indigo gradient, right-aligned
- **Assistant messages**: White with border, left-aligned
- **Icons**: Bot (assistant), User (you)
- **Input**: Clean textarea with send button

### 🤖 **Role-Specific Content**

#### **Patient Mode:**
- "Ask about trials, treatments, or conditions"
- Suggested prompts:
  - "What should I know about clinical trials?"
  - "How do I find the right trial?"
  - "What is a placebo?"

#### **Researcher Mode:**
- "Ask about trial design or recruitment"
- Suggested prompts:
  - "How can I improve patient recruitment?"
  - "Best practices for informed consent?"
  - "Patient retention strategies?"

### ⚡ **Technical Details**

#### **Component Structure:**
- `components/FloatingAIChat.tsx` - Main widget component
- Integrated into `context/AuthProvider.tsx`
- Available globally to all authenticated users
- Uses existing `chat()` function from `utils/ai.ts`

#### **State Management:**
- `isOpen` - Widget visibility
- `isMinimized` - Minimized state
- `messages` - Chat history
- `input` - Current message input
- `loading` - AI response loading state

#### **Session Handling:**
- Only shows for authenticated users
- Detects user role from session
- Persists messages during session
- Clears when widget is closed

### 🎯 **User Interactions**

#### **Open Chat:**
1. Click pulsing button in bottom-right
2. Widget expands with welcome message
3. See suggested prompts

#### **Send Message:**
1. Type in textarea
2. Press Enter or click Send button
3. Message appears on right (gradient bubble)
4. AI response appears on left (white bubble)

#### **Minimize:**
1. Click minimize icon in header
2. Widget collapses to header-only
3. Click again to expand

#### **Close:**
1. Click X icon in header
2. Widget closes completely
3. Floating button reappears

### 📱 **Responsive Behavior**
- Fixed positioning works on all screen sizes
- Widget stays in bottom-right corner
- Scrollable message area
- Mobile-friendly touch interactions

### 🎨 **Animations**
- **Button**: Pulse animation when closed
- **Button hover**: Scale up to 110%
- **Widget**: Smooth height transitions
- **Messages**: Fade in on appear
- **Auto-scroll**: Smooth scroll to bottom

### 💡 **Usage Example**

**Patient Opens Chat:**
1. Sees floating button with sparkle badge
2. Clicks to open
3. Greeted with "How can I help?"
4. Clicks suggested prompt or types question
5. Gets empathetic, simple-language response
6. Can continue conversation
7. Minimizes when done, reopens anytime

**Researcher Opens Chat:**
1. Same floating button
2. Opens to researcher-specific prompts
3. Asks about trial design
4. Gets professional, evidence-based guidance
5. Can reference conversation history
6. Keeps chat open while working on other pages

### 🔧 **Integration**

#### **Files Modified:**
- `context/AuthProvider.tsx` - Added FloatingAIChat component

#### **Files Created:**
- `components/FloatingAIChat.tsx` (350+ lines)
- `FLOATING_CHAT_README.md` (this file)

#### **Global Availability:**
The widget is wrapped in `AuthProvider`, making it available on:
- All patient pages
- All researcher pages
- Dashboard, AI Assistant, Clinical Trials, etc.
- Anywhere the user is authenticated

### ✨ **Benefits**

**For Users:**
- Instant AI help without leaving current page
- No need to navigate to chat page
- Contextual assistance while browsing
- Minimize when not needed, expand when helpful

**For Platform:**
- Increased AI engagement
- Better user experience
- Reduced navigation friction
- Always-available support

### 🎯 **Future Enhancements**

Potential additions:
- Save conversation history across sessions
- Export chat transcript
- Quick actions (save to favorites, share)
- Voice input/output
- File/image sharing
- Multi-language support
- Custom chat themes

### 📊 **Technical Specs**

- **Framework**: Next.js 14 + React
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini 2.5 Flash
- **State**: React hooks (useState, useRef, useEffect)
- **Auth**: NextAuth session detection
- **Type Safety**: Full TypeScript support

---

**The floating chat widget is now live and accessible to all authenticated users on every page!** 🎉
