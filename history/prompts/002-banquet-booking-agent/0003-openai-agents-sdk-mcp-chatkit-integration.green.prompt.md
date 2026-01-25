---
id: 0003
title: OpenAI Agents SDK + MCP + ChatKit Integration
stage: green
date: 2026-01-22
surface: agent
model: claude-opus-4-5
feature: 002-banquet-booking-agent
branch: main
user: developer
command: none
labels: ["openai-agents", "mcp", "chatkit", "phase-4", "backend", "frontend"]
links:
  spec: specs/002-banquet-booking-agent/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/mcp/__init__.py
  - backend/mcp/server.py
  - backend/agents/openai_agent.py
  - backend/agents/__init__.py
  - backend/routers/chatbot.py
  - backend/routers/chatkit.py
  - backend/main.py
  - backend/requirements.txt
  - backend/.env.example
  - components/ai/ChatKitInterface.tsx
  - components/ai/ChatWidget.tsx
  - .env.example
tests:
  - Frontend build verification passed
---

## Prompt

Proceed with Phase 4 using OpenAI Agents SDK + MCP + ChatKit.

Goals:
- Replace basic chatbot API with OpenAI Agent controller
- Connect MCP as the only knowledge source
- Implement ChatKit UI in Next.js App Router
- Keep chatbot information-only for now
- Follow existing constitution, spec, plan, and tasks

## Response snapshot

Implemented a complete Phase 4 chatbot system using OpenAI Agents SDK, MCP, and ChatKit:

### Backend Changes

1. **MCP Server** (`backend/mcp/server.py`):
   - Exposes RAG content as MCP tools
   - Tools: `search_content`, `get_service_info`, `get_available_services`, `get_organization_info`
   - Ensures all knowledge comes from indexed content (no hallucinations)

2. **OpenAI Agent Controller** (`backend/agents/openai_agent.py`):
   - Uses OpenAI Agents SDK with function tools
   - Integrates MCP server as the ONLY knowledge source
   - System instructions enforce information-only responses
   - Handles conversation context and session management
   - Model: gpt-4o-mini for cost-effective information queries

3. **ChatKit Router** (`backend/routers/chatkit.py`):
   - SSE streaming endpoint at `/chatkit`
   - Compatible with OpenAI ChatKit frontend
   - Streams response chunks for better UX

4. **Updated Chatbot Router** (`backend/routers/chatbot.py`):
   - Conditional import: uses OpenAI Agent if OPENAI_API_KEY is set
   - Fallback to basic chatbot for environments without OpenAI

### Frontend Changes

1. **ChatKit Interface** (`components/ai/ChatKitInterface.tsx`):
   - Uses `@openai/chatkit-react` components
   - Connects to custom `/chatkit` backend endpoint
   - Mobile responsive with shadcn/ui integration

2. **Updated ChatWidget** (`components/ai/ChatWidget.tsx`):
   - Conditional rendering: ChatKit vs custom UI
   - Controlled via `NEXT_PUBLIC_USE_CHATKIT` env variable
   - Lazy loading for ChatKit to improve initial load

### Dependencies Added

- Backend: `openai-agents>=0.6.0`, `openai-chatkit>=0.0.2`, `mcp>=1.0.0`, `httpx>=0.27.0`
- Frontend: `@openai/chatkit`, `@openai/chatkit-react`

### Architecture

```
Frontend (Next.js)
    │
    ├── ChatKit UI (/chatkit endpoint)
    │       │
    │       ▼
    └── ChatInterface (/api/chat/message endpoint)
            │
            ▼
Backend (FastAPI)
    │
    ├── /chatkit (SSE streaming)
    │       │
    │       ▼
    └── OpenAI Agent Controller
            │
            ├── MCP Tools (search_content, get_service_info, etc.)
            │       │
            │       ▼
            └── RAG Service (content indexed from JSON files)
```

## Outcome

- Impact: Complete Phase 4 information-only chatbot with production-grade architecture
- Tests: Frontend build passed
- Files: 12 files created/modified
- Next prompts: Add OPENAI_API_KEY to backend .env, test with live OpenAI API
- Reflection: Conditional loading ensures graceful fallback when OpenAI not configured

## Evaluation notes (flywheel)

- Failure modes observed: Initial build failures due to unused imports (fixed)
- Graders run and results: Build PASS
- Prompt variant: N/A
- Next experiment: Add streaming to custom ChatInterface, implement error boundary for ChatKit

## References

- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [ChatKit Python SDK](https://openai.github.io/chatkit-python/)
- [ChatKit.js](https://openai.github.io/chatkit-js/)
