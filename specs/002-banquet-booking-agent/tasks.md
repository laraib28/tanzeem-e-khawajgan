# Banquet Booking Agent - Implementation Tasks

**Feature ID**: 002-banquet-booking-agent
**Version**: 1.0.0
**Created**: 2026-01-20

---

## Phase 1: Database & Models

### Task 1.1: Create Database Tables
- [ ] Create `banquet_halls` table with columns: id, name, capacity, amenities (JSON), price_per_hour, status, created_at
- [ ] Create `bookings` table with all required columns and foreign key to halls
- [ ] Create `booking_audit_log` table
- [ ] Create `notification_log` table
- [ ] Add indexes: idx_hall_date, idx_booking_date, idx_status, idx_priority

**Test**: Run SQL migration, verify tables exist with `SHOW TABLES`

### Task 1.2: Create SQLAlchemy Models
- [ ] Create `BanquetHall` model in `backend/models.py`
- [ ] Create `Booking` model with relationships
- [ ] Create `BookingAuditLog` model
- [ ] Create `NotificationLog` model

**Test**: Import models, verify no errors

### Task 1.3: Create Pydantic Schemas
- [ ] Create `backend/schemas/banquet.py`: HallResponse, HallList
- [ ] Create `backend/schemas/booking.py`: BookingCreate, BookingResponse, BookingEscalate
- [ ] Create `backend/schemas/notification.py`: WhatsAppRequest, WhatsAppResponse

**Test**: Instantiate schemas with sample data

### Task 1.4: Seed Initial Hall Data
- [ ] Insert Grand Hall (capacity 500)
- [ ] Insert Conference Room A (capacity 50)
- [ ] Insert Garden Lawn (capacity 300)

**Test**: Query halls, verify 3 records returned

---

## Phase 2: Core API Endpoints

### Task 2.1: Create Halls Endpoint
- [ ] Create `backend/routers/banquets.py`
- [ ] Implement `GET /api/banquets/halls` - list all active halls
- [ ] Implement `GET /api/banquets/halls/{id}` - get hall by ID
- [ ] Register router in `main.py`

**Test**:
```bash
curl http://localhost:8000/api/banquets/halls
```

### Task 2.2: Create Availability Endpoint
- [ ] Create `backend/services/availability.py`
- [ ] Implement availability check logic (query bookings for date)
- [ ] Implement `GET /api/banquets/availability?date=YYYY-MM-DD&hall_id=X`
- [ ] Return available_slots and booked_slots

**Test**: Check availability for future date, verify slots returned

### Task 2.3: Create Booking Endpoint
- [ ] Create `backend/routers/bookings.py`
- [ ] Create `backend/services/booking.py`
- [ ] Implement booking reference generator: `BK-YYYYMMDD-XXXX`
- [ ] Implement `POST /api/banquets/bookings`
- [ ] Validate: hall exists, slot available, date is future
- [ ] Auto-calculate priority based on guest_count and date

**Test**: Create booking, verify reference returned

### Task 2.4: Create Get Booking Endpoint
- [ ] Implement `GET /api/banquets/bookings/{id}`
- [ ] Implement `GET /api/banquets/bookings/ref/{reference}`

**Test**: Retrieve created booking by ID and reference

---

## Phase 3: Escalation & Audit

### Task 3.1: Implement Priority Calculation
- [ ] Create `backend/services/escalation.py`
- [ ] Normal: default
- [ ] High: guests >= 100 OR date <= 7 days
- [ ] Urgent: guests >= 200 OR date <= 48 hours

**Test**: Create bookings with different guest counts, verify priority

### Task 3.2: Implement Escalation Endpoint
- [ ] Implement `POST /api/banquets/bookings/{id}/escalate`
- [ ] Accept: priority, reason
- [ ] Update booking priority
- [ ] Trigger notifications

**Test**: Escalate booking, verify priority changed

### Task 3.3: Implement Audit Logging
- [ ] Create `backend/services/audit.py`
- [ ] Log: booking_created, booking_escalated, booking_confirmed, booking_cancelled
- [ ] Include actor, timestamp, details (JSON)

**Test**: Create booking, verify audit log entry exists

---

## Phase 4: WhatsApp Integration

### Task 4.1: Create WhatsApp Service
- [ ] Create `backend/services/whatsapp.py`
- [ ] Implement WhatsApp Business API client
- [ ] Configure templates: booking_received, booking_confirmed, escalation_alert, status_update

**Test**: Mock API call, verify request format

### Task 4.2: Create Notification Endpoint
- [ ] Create `backend/routers/notifications.py`
- [ ] Implement `POST /api/notifications/whatsapp`
- [ ] Validate phone number format
- [ ] Log notification attempt

**Test**: Send test notification, verify log entry

### Task 4.3: Implement Notification on Booking
- [ ] Trigger WhatsApp on booking creation (if opted-in)
- [ ] Trigger WhatsApp on escalation (to admin)
- [ ] Implement email fallback on WhatsApp failure

**Test**: Create booking with whatsapp_optin=true, verify notification sent

---

## Phase 5: RAG Content System

### Task 5.1: Index Service Content
- [ ] Create `app/lib/rag/content-loader.ts`
- [ ] Load and parse: medical.json, it.json, education.json, sports.json, banquets.json
- [ ] Create content index structure

**Test**: Load all content files, verify no errors

### Task 5.2: Implement RAG Query
- [ ] Create semantic search function
- [ ] Match user query to relevant content
- [ ] Return sourced responses with attribution

**Test**: Query "medical services", verify relevant content returned

### Task 5.3: Integrate RAG with Information Agent
- [ ] Update Information Agent to use RAG
- [ ] Route queries by service type
- [ ] Ensure no hallucinated responses

**Test**: Ask about IT courses, verify response matches config content

---

## Phase 6: Booking Agent Integration

### Task 6.1: Create Booking Agent
- [ ] Create `app/components/ai/agents/BookingAgent.ts`
- [ ] Implement conversation state machine
- [ ] Define booking flow stages: date → guests → time → event → contact → confirm

**Test**: Simulate conversation, verify state transitions

### Task 6.2: Implement Form Filler
- [ ] Extract structured data from conversation
- [ ] Map intents to form fields
- [ ] Validate extracted data

**Test**: Parse "150 guests on Jan 25", verify guest_count=150, date=2026-01-25

### Task 6.3: Implement Availability Checker
- [ ] Connect to GET /api/banquets/availability
- [ ] Format availability response for chat
- [ ] Handle no availability scenario

**Test**: Query availability via agent, verify formatted response

### Task 6.4: Implement Submission Handler
- [ ] Connect to POST /api/banquets/bookings
- [ ] Format confirmation message
- [ ] Display booking reference

**Test**: Complete booking flow, verify reference displayed

### Task 6.5: Integrate with Main Agent Controller
- [ ] Register Booking Agent as sub-agent
- [ ] Implement intent routing: "book banquet" → Booking Agent
- [ ] Handle handoff back to main agent

**Test**: Say "I want to book a hall", verify Booking Agent activates

---

## Phase 7: Frontend Integration

### Task 7.1: Extend Chat Interface
- [ ] Update `ChatInterface.tsx` to support Booking Agent
- [ ] Add booking form preview component
- [ ] Add confirmation dialog

**Test**: UI renders booking summary correctly

### Task 7.2: Create Booking Form Component
- [ ] Create `BanquetBookingForm.tsx`
- [ ] Pre-populate from agent conversation
- [ ] Allow manual edits

**Test**: Form displays pre-filled data from agent

### Task 7.3: Add WhatsApp Opt-in UI
- [ ] Add checkbox for WhatsApp notifications
- [ ] Validate phone number format
- [ ] Show consent message

**Test**: Toggle opt-in, verify state persists

---

## Phase 8: Testing & Documentation

### Task 8.1: Unit Tests
- [ ] Test availability service
- [ ] Test priority calculation
- [ ] Test booking reference generation
- [ ] Test phone validation

### Task 8.2: Integration Tests
- [ ] Test full booking API flow
- [ ] Test escalation flow
- [ ] Test notification dispatch

### Task 8.3: E2E Tests
- [ ] Test conversational booking flow
- [ ] Test form auto-fill
- [ ] Test RAG responses for all services

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| 1. Database & Models | 4 | Pending |
| 2. Core API | 4 | Pending |
| 3. Escalation & Audit | 3 | Pending |
| 4. WhatsApp | 3 | Pending |
| 5. RAG Content | 3 | Pending |
| 6. Booking Agent | 5 | Pending |
| 7. Frontend | 3 | Pending |
| 8. Testing | 3 | Pending |
| **Total** | **28** | |

---

**Tasks Version**: 1.0.0
