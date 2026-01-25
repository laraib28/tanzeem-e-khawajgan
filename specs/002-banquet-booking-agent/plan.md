# Banquet Booking Agent - Implementation Plan

**Feature ID**: 002-banquet-booking-agent
**Version**: 2.0.0
**Created**: 2026-01-20
**Updated**: 2026-01-22
**Phase**: 4 (Information-Only with OpenAI Agents SDK + MCP + ChatKit)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js App Router)                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    OpenAI ChatKit UI Component                    │  │
│  │              (SSE streaming, thread management)                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ POST /chatkit (SSE)
                                     │ POST /api/chat/message (JSON fallback)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Backend (FastAPI - Self-Hosted)                 │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    OpenAI Agents SDK Controller                   │  │
│  │         (Agent orchestration, function tool routing)              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                     │                                   │
│                                     │ Tool calls                        │
│                                     ▼                                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         MCP Server Layer                          │  │
│  │     ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │  │
│  │     │ search_     │  │ get_service │  │ get_available_      │    │  │
│  │     │ content     │  │ _info       │  │ services            │    │  │
│  │     └─────────────┘  └─────────────┘  └─────────────────────┘    │  │
│  │     ┌─────────────┐  ┌─────────────┐                             │  │
│  │     │ get_org_    │  │ health_     │                             │  │
│  │     │ info        │  │ status      │                             │  │
│  │     └─────────────┘  └─────────────┘                             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                     │                                   │
│                                     │ Query                             │
│                                     ▼                                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     RAG Service (TF-IDF Indexed)                  │  │
│  │               config/content/en/*.json (READONLY)                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Specifications

### 2.1 OpenAI Agents SDK Controller

**Location**: `backend/agents/openai_agent.py`

**Responsibilities**:
- Initialize Agent with system instructions
- Register MCP tools as function tools
- Handle conversation context (non-persistent)
- Route tool calls to MCP server
- Enforce information-only responses (Phase 4)

**Model**: `gpt-4o-mini` (cost-effective for information queries)

**System Instructions** (governance-enforced):
- ONLY use MCP tools for information retrieval
- NEVER hallucinate or make assumptions
- Cite sources when providing information
- Reject booking/action requests with polite redirect
- Support English and Urdu responses

### 2.2 MCP Server

**Location**: `backend/mcp/server.py`

**Exposed Tools**:

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `search_content` | Query RAG for information | `query: str`, `service?: str` | Ranked results with sources |
| `get_service_info` | Get complete service details | `service: str` | Structured service data |
| `get_available_services` | List all services | None | Service list with descriptions |
| `get_organization_info` | Get org details | None | Contact, address, social |
| `health_status` | System health check | None | Component status |

**Constraints**:
- Read-only access to RAG index
- No database writes
- No external API calls
- All responses include source attribution

### 2.3 ChatKit Integration

**Frontend Package**: `@openai/chatkit-react`

**Backend Endpoint**: `POST /chatkit` (SSE streaming)

**ChatKit Configuration**:
```typescript
{
  api: {
    url: `${BACKEND_URL}/chatkit`,
    domainKey: 'tanzeem-chatbot'
  }
}
```

**Fallback**: Custom chat UI via `/api/chat/message` (JSON)

### 2.4 RAG Service (Existing)

**Location**: `backend/rag/query_service.py`

**Status**: Complete and indexed

**Content Sources**:
- `config/content/en/medical.json`
- `config/content/en/it.json`
- `config/content/en/education.json`
- `config/content/en/sports.json`
- `config/content/en/banquets.json`
- `config/content/en/graveyard.json`
- `config/site-config.json`

---

## 3. API Contracts

### 3.1 ChatKit Endpoint (Primary)

```
POST /chatkit
Content-Type: application/json
Accept: text/event-stream

Request:
{
  "messages": [
    {"role": "user", "content": "Tell me about IT courses"}
  ],
  "session_id": "optional-session-id"
}

Response (SSE):
event: start
data: {"timestamp": "2026-01-22T10:00:00Z"}

event: text
data: {"content": "Tanzeem-e-Khawajgan offers..."}

event: metadata
data: {"intent": "information", "service": "it", "sources": ["config/content/en/it.json"]}

event: end
data: {"timestamp": "2026-01-22T10:00:01Z"}
```

### 3.2 Chat Message Endpoint (Fallback)

```
POST /api/chat/message
Content-Type: application/json

Request:
{
  "message": "What medical services do you offer?",
  "session_id": "optional-session-id"
}

Response:
{
  "response": "We offer diagnostic services, consultations...",
  "intent": "information",
  "service": "medical",
  "confidence": 0.92,
  "sources": ["config/content/en/medical.json"],
  "can_help": true,
  "follow_up": null,
  "timestamp": "2026-01-22T10:00:00Z"
}
```

### 3.3 Health Endpoint

```
GET /chatkit/health

Response:
{
  "status": "healthy",
  "openai_configured": true,
  "rag_indexed": true,
  "mcp_tools": 5,
  "timestamp": "2026-01-22T10:00:00Z"
}
```

---

## 4. Environment Configuration

### 4.1 Backend (`backend/.env`)

```env
# Required
OPENAI_API_KEY=sk-...

# Database (existing)
MYSQL_USER=root
MYSQL_PASSWORD=...
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=tanzeem_membership
```

### 4.2 Frontend (`.env.local`)

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# ChatKit toggle (true = ChatKit, false = custom UI)
NEXT_PUBLIC_USE_CHATKIT=true
```

---

## 5. File Structure

```
backend/
├── agents/
│   ├── __init__.py
│   ├── chatbot.py              # Legacy fallback
│   ├── information_agent.py    # Existing RAG agent
│   └── openai_agent.py         # NEW: OpenAI Agents SDK controller
├── mcp/
│   ├── __init__.py             # NEW
│   └── server.py               # NEW: MCP server with tools
├── rag/
│   ├── content_loader.py       # Existing
│   ├── indexer.py              # Existing
│   └── query_service.py        # Existing
├── routers/
│   ├── chatbot.py              # Updated: conditional agent import
│   └── chatkit.py              # NEW: ChatKit SSE endpoint
├── main.py                     # Updated: include chatkit router
└── requirements.txt            # Updated: new dependencies

components/
└── ai/
    ├── ChatInterface.tsx       # Existing: fallback UI
    ├── ChatKitInterface.tsx    # NEW: ChatKit wrapper
    ├── ChatMessage.tsx         # Existing
    └── ChatWidget.tsx          # Updated: ChatKit toggle
```

---

## 6. Dependency Matrix

### 6.1 Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `openai-agents` | >=0.6.0 | Agent orchestration |
| `openai-chatkit` | >=0.0.2 | ChatKit backend SDK |
| `mcp` | >=1.0.0 | MCP protocol support |
| `httpx` | >=0.27.0 | Async HTTP client |

### 6.2 Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@openai/chatkit` | latest | ChatKit core |
| `@openai/chatkit-react` | latest | React integration |

---

## 7. Phase Boundaries

### Phase 4 (Current) - Information Only

**Included**:
- OpenAI Agents SDK integration
- MCP server with RAG tools
- ChatKit frontend
- All service information queries
- Source attribution

**Excluded (Future Phases)**:
- Booking actions
- Form submissions via agent
- Database writes
- WhatsApp notifications
- Priority escalation

### Future Phase Hooks

The architecture supports future action capabilities via:
1. Additional MCP tools (e.g., `create_booking`, `check_availability`)
2. Action Agent sub-component in OpenAI Agent
3. Database write permissions (gated by phase flag)

---

## 8. Governance Compliance

| Requirement | Implementation |
|-------------|----------------|
| No hallucinations | MCP tools are ONLY knowledge source |
| No persistent storage | Session context cleared per request |
| Source attribution | All responses include `sources` array |
| Information-only (Phase 4) | System instructions reject actions |
| Constitution compliance | Agent instructions reference governance |

---

## 9. Error Handling

| Scenario | Response |
|----------|----------|
| OpenAI API unavailable | Fallback to legacy chatbot |
| MCP tool failure | Return error with retry suggestion |
| No RAG results | "I don't have information about that" |
| Action request (Phase 4) | Polite redirect to contact info |

---

## 10. Success Criteria

- [ ] ChatKit UI renders and connects to `/chatkit`
- [ ] Agent responds using MCP tools only
- [ ] All service queries return sourced information
- [ ] No hallucinated responses
- [ ] Booking requests rejected with contact info
- [ ] Health endpoint returns all green
- [ ] Build passes with no type errors

---

**Plan Version**: 2.0.0 | **Author**: AI Architect | **Status**: Approved
