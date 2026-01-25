---
id: 0002
title: Frontend Chatbot UI Implementation
stage: green
date: 2026-01-21
surface: agent
model: claude-opus-4-5
feature: 002-banquet-booking-agent
branch: main
user: developer
command: none
labels: ["chatbot", "frontend", "next.js", "shadcn-ui", "phase-4"]
links:
  spec: specs/002-banquet-booking-agent/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - components/ai/ChatInterface.tsx
  - components/ai/ChatMessage.tsx
  - components/ai/ChatWidget.tsx
  - components/ui/button.tsx
  - components/ui/input.tsx
  - components/ui/card.tsx
  - components/ui/scroll-area.tsx
  - lib/ai/types.ts
  - app/layout.tsx
tests:
  - Build verification passed
---

## Prompt

Proceed to Phase 4.

Create a frontend chatbot UI in Next.js App Router that:
- Uses shadcn/ui components only
- Connects to backend endpoint /api/chat/message
- Shows a floating chat widget on all pages
- Allows users to type questions
- Displays chatbot responses clearly
- Is mobile responsive
- Information-only (no booking, no forms yet)

## Response snapshot

Created a complete chatbot UI implementation with the following components:

1. **ChatWidget** (`components/ai/ChatWidget.tsx`): Floating widget wrapper that shows/hides the chat interface, positioned fixed bottom-right on all pages. Includes:
   - Toggle button with message icon
   - Escape key to close
   - Tooltip hint for users
   - SSR-safe with hydration handling

2. **ChatInterface** (`components/ai/ChatInterface.tsx`): Main chat panel using shadcn/ui Card, CardHeader, CardContent, ScrollArea, Button, and Input. Features:
   - Connects to `POST /api/chat/message` endpoint
   - Session ID generation for conversation tracking
   - Initial greeting message
   - Auto-scroll to latest messages
   - Loading indicator while waiting for response
   - Error handling with fallback message
   - Follow-up message support from backend

3. **ChatMessage** (`components/ai/ChatMessage.tsx`): Individual message display with:
   - User/Bot avatars with icons
   - Distinct styling for user vs assistant messages
   - Timestamps
   - Responsive text wrapping

4. **shadcn/ui components installed**: Button, Input, Card, ScrollArea

5. **Types added** (`lib/ai/types.ts`): ChatMessageRequest and ChatMessageResponse matching backend API

6. **Root layout updated** (`app/layout.tsx`): Added ChatWidget to body for site-wide availability

## Outcome

- ✅ Impact: Complete chatbot frontend for Phase 4 - information-only queries
- 🧪 Tests: Build passed successfully
- 📁 Files: 9 files modified/created
- 🔁 Next prompts: Test integration with backend, add Urdu language support
- 🧠 Reflection: Reused existing ChatMessage/ChatInterface structure, updated to use shadcn/ui and correct backend endpoint

## Evaluation notes (flywheel)

- Failure modes observed: None - build passed on first attempt
- Graders run and results (PASS/FAIL): Build PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add loading skeleton, message typing animation
