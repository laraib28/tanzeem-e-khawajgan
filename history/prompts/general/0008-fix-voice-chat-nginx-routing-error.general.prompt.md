---
name: Fix voice/chat "An unexpected error occurred" — nginx routing + error handling
description: Fixed chat API routing bypassing nginx /api/ proxy; fixed error throwing; added parsed.error handling in SSE loop
type: general
stage: general
date: 2026-07-09
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: laraib-adnan
labels: ["bugfix", "voice-chat", "nginx", "error-handling", "sse"]
---

## Prompt

An unexpected error occurred (voice chatbot and text chat both failing)

## Root Cause

Two issues:
1. **Nginx routing**: `location /api/` proxies to FastAPI backend. `/api/ai/chat` was being sent to FastAPI as `/ai/chat` → 404. Next.js API route never reached.
2. **Error throwing**: `throw Object.assign(new Error(), { status, body })` creates an Error with empty `.message`, so `getErrorMessage()` fell through to "An unexpected error occurred".

## Changes

- **Created** `app/ai-chat/route.ts` — identical to `app/api/ai/chat/route.ts` but at path `/ai-chat`, which nginx routes to Next.js via `location /` instead of FastAPI
- **Updated** `components/ai/ChatInterface.tsx`:
  - `fetch('/api/ai/chat')` → `fetch('/ai-chat')`
  - `throw Object.assign(new Error(), ...)` → `throw new ApiError(res.status, body)`
  - Added `parsed.error` handling in SSE loop
- **Updated** `components/ai/VoiceChatWidget.tsx`: same fixes as ChatInterface

## Files Modified

 - app/ai-chat/route.ts (created)
 - components/ai/ChatInterface.tsx
 - components/ai/VoiceChatWidget.tsx

## Note for deployment

`OPENAI_API_KEY` must be passed to the Next.js Docker container:
```
docker run -e OPENAI_API_KEY=sk-... tanzeem-web
```
