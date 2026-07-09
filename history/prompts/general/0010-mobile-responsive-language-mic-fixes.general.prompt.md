---
name: Mobile responsiveness, Urdu language fix, mic auto-stop, greeting
description: Fixed Whisper forced English, silence detection threshold, greeting text, and mobile padding/layout issues
type: general
stage: general
date: 2026-07-09
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: laraib-adnan
labels: ["mobile", "voice", "language", "bugfix", "responsive"]
---

## Prompt

Check mobile responsive, Urdu response in English bug, mic auto-stop not working, chatbot greeting text

## Fixes

1. **Urdu language bug** (`backend/routers/voice.py`): Removed forced `language="en"` from Whisper. Now auto-detects — Urdu speech transcribes as Urdu script, AI responds in Urdu.

2. **Mic auto-stop** (`VoiceChatWidget.tsx`): Raised SILENCE_THRESHOLD 10→18 (real mics have background noise), SILENCE_AFTER_MS 1800→2000, MIN_RECORD_MS 800→1000.

3. **Greeting text** (`VoiceChatWidget.tsx`): Changed to "اسلام علیکم! Khawajgan Bot mein khush aamdeed 🌙"

4. **Mobile responsive** — fixed in:
   - `app/membership-form/page.tsx` — p-8→p-4 md:p-8, logo/photo w-24→w-16 md:w-24
   - `app/member-lookup/page.tsx` — search flex-col sm:flex-row, card header px-4 md:px-6
   - `app/services/banquets/page.tsx` — content p-8→p-4 md:p-8
   - `app/contact/page.tsx` — all cards p-6→p-4 md:p-6, gaps gap-8→gap-4 md:gap-8, headings text-2xl md:text-3xl
   - `app/services/medical/page.tsx` — stats gap-8→gap-4 md:gap-8, table cells px-3 sm:px-6 py-3 sm:py-4
   - `components/home/ImpactCounters.tsx` — cards p-8→p-4 md:p-8, grid gap-6→gap-3 md:gap-6

## Files Modified

 - backend/routers/voice.py
 - components/ai/VoiceChatWidget.tsx
 - app/membership-form/page.tsx
 - app/member-lookup/page.tsx
 - app/services/banquets/page.tsx
 - app/contact/page.tsx
 - app/services/medical/page.tsx
 - components/home/ImpactCounters.tsx
