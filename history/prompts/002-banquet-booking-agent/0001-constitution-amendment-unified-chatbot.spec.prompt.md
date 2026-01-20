---
id: 0001
title: Constitution Amendment - Unified Chatbot with Booking Agent
stage: spec
date: 2026-01-20
surface: agent
model: claude-opus-4-5-20251101
feature: 002-banquet-booking-agent
branch: main
user: user
command: direct-request
labels: ["constitution", "amendment", "chatbot", "booking", "rag", "whatsapp"]
links:
  spec: specs/002-banquet-booking-agent/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - specs/002-banquet-booking-agent/spec.md
  - specs/002-banquet-booking-agent/plan.md
  - specs/002-banquet-booking-agent/tasks.md
tests:
  - N/A (specification phase)
---

## Prompt

Append an amendment to the existing constitution.
Do not modify or remove anything.
Only add support for:
- Banquet availability checking from database
- Agent-based booking and form filling
- Priority escalation with optional WhatsApp notification

Then regenerate specification, plan, and tasks.
Follow Spec-Kit Plus workflow.

Additional scope (edit):
- Unified chatbot covering ALL services (Medical, IT, Education, Sports, Banquet)
- RAG system for information retrieval from website-approved content
- Actions executed via internal agents and backend APIs

## Response snapshot

### Constitution Amendment 001
Added to `.specify/memory/constitution.md`:
- Banquet Availability Checking (database integration, data model)
- Agent-Based Booking and Form Filling (Booking Agent sub-agent)
- Priority Escalation System (Normal, High, Urgent levels)
- WhatsApp Notification Integration (opt-in, templates, fallback)
- Updated AI Architecture with Booking Agent hierarchy
- API Contracts for new endpoints
- Security and Compliance requirements

### Specification (spec.md)
Created comprehensive specification including:
- Unified Chatbot Scope covering all 5 services
- RAG content sources and information retrieval rules
- Functional requirements for availability, booking, escalation, WhatsApp
- Non-functional requirements (performance, security, reliability)
- Database schema with 4 tables
- API contracts for 7 endpoints
- Conversation flow examples
- Error handling and acceptance criteria

### Plan (plan.md)
Created implementation plan including:
- System architecture diagram
- Unified Agent architecture with sub-agents
- Database schema SQL
- File structure for backend and frontend
- 7 implementation phases
- API endpoint summary
- Environment variables

### Tasks (tasks.md)
Created 28 implementation tasks across 8 phases:
1. Database & Models (4 tasks)
2. Core API Endpoints (4 tasks)
3. Escalation & Audit (3 tasks)
4. WhatsApp Integration (3 tasks)
5. RAG Content System (3 tasks)
6. Booking Agent Integration (5 tasks)
7. Frontend Integration (3 tasks)
8. Testing & Documentation (3 tasks)

## Outcome

- ✅ Impact: Constitution amended, full SDD artifacts generated for unified chatbot feature
- 🧪 Tests: N/A (specification phase)
- 📁 Files: 4 files created/modified
- 🔁 Next prompts: Begin Phase 1 implementation (database tables and models)
- 🧠 Reflection: Expanded scope to unified chatbot with RAG for all services

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implement Phase 1 database tasks
