# Banquet Booking Agent - Implementation Tasks

**Feature ID**: 002-banquet-booking-agent
**Version**: 2.0.0
**Created**: 2026-01-20
**Updated**: 2026-01-22
**Phase**: 4 (Information-Only with OpenAI Agents SDK + MCP + ChatKit)

---

## Completed Phases (Do Not Repeat)

| Phase | Status | Deliverables |
|-------|--------|--------------|
| Phase 1 | COMPLETE | Database schema, SQLAlchemy models |
| Phase 2 | COMPLETE | Core API endpoints (halls, availability) |
| Phase 3 | COMPLETE | RAG indexing, Information Agent |

---

## Phase 4: OpenAI Agents SDK + MCP + ChatKit

### 4.1 Backend Dependencies

**Task 4.1.1**: Update requirements.txt

```bash
cd backend
```

Add to `requirements.txt`:
```
openai-agents>=0.6.0
openai-chatkit>=0.0.2
mcp>=1.0.0
httpx>=0.27.0
```

**Verify**:
```bash
pip install -r requirements.txt
pip list | grep -E "openai|mcp|httpx"
```

**Acceptance**: All packages install without errors.

---

### 4.2 MCP Server Implementation

**Task 4.2.1**: Create MCP module structure

```bash
mkdir -p backend/mcp
touch backend/mcp/__init__.py
touch backend/mcp/server.py
```

**Task 4.2.2**: Implement MCP Server

**File**: `backend/mcp/server.py`

**Required Tools**:

| Tool | Signature | Description |
|------|-----------|-------------|
| `search_content` | `(query: str, service?: str) -> MCPToolResult` | Query RAG index |
| `get_service_info` | `(service: str) -> MCPToolResult` | Get service details |
| `get_available_services` | `() -> MCPToolResult` | List all services |
| `get_organization_info` | `() -> MCPToolResult` | Get org info |
| `health_status` | `() -> MCPToolResult` | System health |

**Constraints**:
- Read-only RAG access
- Source attribution in all results
- No external API calls

**Verify**:
```python
from mcp.server import create_mcp_server
server = create_mcp_server()
result = server.call_tool("get_available_services", {})
assert result.success == True
assert len(result.data) == 6  # medical, it, education, sports, banquets, graveyard
```

**Acceptance**: All 5 tools return valid results with sources.

---

### 4.3 OpenAI Agent Controller

**Task 4.3.1**: Create OpenAI Agent module

**File**: `backend/agents/openai_agent.py`

**Implementation Requirements**:

1. Initialize `Agent` with system instructions
2. Register MCP tools as `@function_tool` decorators
3. Implement `chat()` method (sync) and `chat_async()` (async)
4. Handle session context (non-persistent)
5. Detect intent and service from query

**System Instructions Template**:
```
You are the AI Assistant for Tanzeem-e-Khawajgan.

CRITICAL RULES:
1. ONLY use MCP tools for information. Never hallucinate.
2. If no information found, say "I don't have information about that."
3. Always cite sources.
4. Reject booking/action requests politely.
5. Support English and Urdu.

PHASE 4 LIMITATIONS:
- Information ONLY
- No bookings, reservations, or form submissions
- For actions, direct to: +92 300 1234567
```

**Verify**:
```python
from agents.openai_agent import get_agent_controller
controller = get_agent_controller()
response = controller.chat("What IT courses do you offer?")
assert "sources" in response
assert response["can_help"] == True
```

**Acceptance**: Agent responds with sourced information only.

---

### 4.4 ChatKit Backend Endpoint

**Task 4.4.1**: Create ChatKit router

**File**: `backend/routers/chatkit.py`

**Endpoint**: `POST /chatkit`

**Response Format**: Server-Sent Events (SSE)

```
event: start
data: {"timestamp": "..."}

event: text
data: {"content": "chunk of response"}

event: metadata
data: {"intent": "...", "service": "...", "sources": [...]}

event: end
data: {"timestamp": "..."}
```

**Task 4.4.2**: Add health endpoint

**Endpoint**: `GET /chatkit/health`

**Response**:
```json
{
  "status": "healthy",
  "openai_configured": true,
  "rag_indexed": true,
  "mcp_tools": 5
}
```

**Task 4.4.3**: Register router in main.py

```python
from routers.chatkit import router as chatkit_router
app.include_router(chatkit_router)
```

**Verify**:
```bash
curl -X POST http://localhost:8000/chatkit \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

**Acceptance**: SSE stream returns with events.

---

### 4.5 Update Chatbot Router

**Task 4.5.1**: Add conditional agent import

**File**: `backend/routers/chatbot.py`

**Logic**:
```python
import os
if os.getenv("OPENAI_API_KEY"):
    from agents.openai_agent import get_agent_controller as get_chatbot_service
else:
    from agents.chatbot import get_chatbot_service
```

**Acceptance**: Router uses OpenAI agent when API key present, fallback otherwise.

---

### 4.6 Frontend Dependencies

**Task 4.6.1**: Install ChatKit packages

```bash
npm install @openai/chatkit @openai/chatkit-react
```

**Verify**:
```bash
npm list | grep chatkit
```

**Acceptance**: Both packages installed.

---

### 4.7 ChatKit UI Component

**Task 4.7.1**: Create ChatKitInterface component

**File**: `components/ai/ChatKitInterface.tsx`

**Requirements**:
- Use `useChatKit` hook from `@openai/chatkit-react`
- Configure API URL from `NEXT_PUBLIC_BACKEND_URL`
- Handle close button and escape key
- Mobile responsive

**Task 4.7.2**: Update ChatWidget with toggle

**File**: `components/ai/ChatWidget.tsx`

**Logic**:
```typescript
const USE_CHATKIT = process.env.NEXT_PUBLIC_USE_CHATKIT === 'true'

// Render ChatKitInterface if USE_CHATKIT, else ChatInterface
```

**Verify**:
```bash
npm run build
```

**Acceptance**: Build passes, no type errors.

---

### 4.8 Environment Configuration

**Task 4.8.1**: Update backend .env.example

Add:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Task 4.8.2**: Update frontend .env.example

Add:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_USE_CHATKIT=true
```

**Acceptance**: Environment variables documented.

---

### 4.9 Integration Testing

**Task 4.9.1**: Test MCP tool responses

| Query | Expected Tool | Expected Result |
|-------|---------------|-----------------|
| "What IT courses do you offer?" | `search_content` | IT course list |
| "Tell me about medical services" | `get_service_info` | Medical service details |
| "What services do you have?" | `get_available_services` | 6 services listed |
| "How can I contact you?" | `get_organization_info` | Contact info |

**Task 4.9.2**: Test action rejection

| Query | Expected Response |
|-------|-------------------|
| "I want to book a hall" | Polite redirect to contact info |
| "Can you reserve a room?" | Polite redirect to contact info |
| "Submit my application" | Polite redirect to contact info |

**Task 4.9.3**: Test hallucination prevention

| Query | Expected Behavior |
|-------|-------------------|
| "What are your opening hours?" (not in RAG) | "I don't have information about that" |
| "Tell me about services you don't offer" | No fabricated response |

**Verify**:
```bash
# Start backend
cd backend && uvicorn main:app --reload

# Start frontend
npm run dev

# Test via ChatKit UI
```

**Acceptance**: All test cases pass.

---

### 4.10 Final Verification

**Task 4.10.1**: Health check

```bash
curl http://localhost:8000/chatkit/health
```

Expected:
```json
{
  "status": "healthy",
  "openai_configured": true,
  "rag_indexed": true,
  "mcp_tools": 5
}
```

**Task 4.10.2**: Build verification

```bash
npm run build
```

**Acceptance**: Build completes with 0 errors.

**Task 4.10.3**: Governance compliance check

| Rule | Verified |
|------|----------|
| No hallucinations | [ ] |
| No persistent storage | [ ] |
| Source attribution | [ ] |
| Information-only | [ ] |
| Constitution compliance | [ ] |

---

## Task Summary

| Task | Description | Status |
|------|-------------|--------|
| 4.1.1 | Update backend dependencies | [ ] |
| 4.2.1 | Create MCP module structure | [ ] |
| 4.2.2 | Implement MCP Server | [ ] |
| 4.3.1 | Create OpenAI Agent Controller | [ ] |
| 4.4.1 | Create ChatKit router | [ ] |
| 4.4.2 | Add health endpoint | [ ] |
| 4.4.3 | Register router in main.py | [ ] |
| 4.5.1 | Update chatbot router | [ ] |
| 4.6.1 | Install ChatKit packages | [ ] |
| 4.7.1 | Create ChatKitInterface | [ ] |
| 4.7.2 | Update ChatWidget | [ ] |
| 4.8.1 | Update backend .env.example | [ ] |
| 4.8.2 | Update frontend .env.example | [ ] |
| 4.9.1 | Test MCP tool responses | [ ] |
| 4.9.2 | Test action rejection | [ ] |
| 4.9.3 | Test hallucination prevention | [ ] |
| 4.10.1 | Health check | [ ] |
| 4.10.2 | Build verification | [ ] |
| 4.10.3 | Governance compliance | [ ] |

**Total Tasks**: 19
**Phase**: 4 (Information-Only)

---

## Future Phases (Not Implemented)

| Phase | Scope | Trigger |
|-------|-------|---------|
| Phase 5 | Booking Agent (MCP tools for create_booking, check_availability) | Product decision |
| Phase 6 | WhatsApp Integration | Phase 5 complete |
| Phase 7 | Priority Escalation | Phase 6 complete |

---

**Tasks Version**: 2.0.0 | **Author**: AI Architect | **Status**: Ready for Implementation
