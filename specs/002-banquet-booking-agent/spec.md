# Banquet Booking Agent System Specification

**Feature ID**: 002-banquet-booking-agent
**Version**: 1.0.0
**Status**: Draft
**Created**: 2026-01-20
**Constitution Reference**: Amendment 001

---

## 1. Overview

### 1.1 Purpose

Extend the existing Agentic AI system to support banquet hall availability checking, conversational booking through an AI agent, and priority escalation with optional WhatsApp notifications.

### 1.2 Scope

**In Scope:**
- Banquet hall availability checking from database
- Booking Agent sub-agent for conversational booking
- Automatic form filling from conversation context
- Priority escalation system (Normal, High, Urgent)
- WhatsApp notification integration (opt-in)
- Booking status tracking

**Out of Scope:**
- Payment processing
- Calendar sync (Google/Outlook)
- Multi-language support (future enhancement)
- Recurring bookings
- Waitlist management

### 1.3 Unified Chatbot Scope

This feature extends the existing Agentic AI into a **single unified chatbot** that provides information and actions for ALL organizational services.

**Covered Services:**

| Service | Information (RAG) | Actions (Agent) |
|---------|-------------------|-----------------|
| Medical | Service descriptions, timings, facilities | Appointment inquiry |
| IT | Courses, programs, summer camp details | Course inquiry form submission |
| Education | Programs, scholarships, enrollment | Program inquiry |
| Sports | Facilities, schedules, programs | Facility booking inquiry |
| Banquet | Halls, pricing, amenities | Availability check, booking, escalation |

**Information Retrieval:**
- All informational responses MUST be sourced from website-approved content
- RAG (Retrieval-Augmented Generation) system for content retrieval
- No hallucinated or assumed information permitted
- Source attribution when providing information

**Action Execution:**
- All actions executed via internal agents and backend APIs
- Booking Agent handles banquet-specific actions
- Action Agent handles general form submissions
- Services Agent routes to appropriate action handlers

**RAG Content Sources:**
- `/config/content/en/*.json` - Page content
- `/config/site-config.json` - Organization info
- Service pages content - Medical, IT, Education, Sports, Banquets
- News and events content

**Unified Agent Architecture:**
```
Main Agent (Controller)
├── Information Agent (RAG-powered)
│   ├── Medical Info Handler
│   ├── IT Info Handler
│   ├── Education Info Handler
│   ├── Sports Info Handler
│   └── Banquet Info Handler
├── Navigation Agent
├── Services Agent (Router)
├── Policy Agent
├── Action Agent
│   ├── Inquiry Form Handler
│   └── General Form Handler
└── Booking Agent (Banquet-specific)
    ├── Availability Checker
    ├── Form Filler
    ├── Submission Handler
    └── Escalation Manager
```

### 1.4 Success Criteria

- [ ] Unified chatbot answers questions for all services (Medical, IT, Education, Sports, Banquet)
- [ ] All information responses sourced from RAG system (no hallucinations)
- [ ] Users can check banquet availability via AI chat
- [ ] Booking Agent collects all required information conversationally
- [ ] Forms are auto-populated from conversation data
- [ ] Priority escalation triggers within 30 seconds
- [ ] WhatsApp notifications delivered within 60 seconds (when opted-in)
- [ ] All booking operations logged for audit

---

## 2. Functional Requirements

### 2.1 Banquet Availability Checking

**FR-2.1.1**: System shall query database for hall availability by date.

**FR-2.1.2**: System shall support date range queries (up to 30 days).

**FR-2.1.3**: System shall filter halls by:
- Capacity (minimum guests)
- Date availability
- Hall status (active only)

**FR-2.1.4**: System shall return availability with:
- Hall name and ID
- Available time slots
- Capacity
- Price per hour

### 2.2 Booking Agent

**FR-2.2.1**: Booking Agent shall be integrated as a sub-agent of the main Agentic AI controller.

**FR-2.2.2**: Booking Agent shall collect the following information conversationally:
- Preferred date
- Preferred time (start/end)
- Hall preference (if any)
- Event type
- Expected guest count
- Customer name
- Customer phone
- Customer email
- Special requirements (optional)

**FR-2.2.3**: Booking Agent shall validate availability before proceeding with booking.

**FR-2.2.4**: Booking Agent shall present a summary and request confirmation before submission.

**FR-2.2.5**: Booking Agent shall auto-populate the booking form with collected data.

**FR-2.2.6**: Booking Agent shall provide booking reference number upon successful submission.

### 2.3 Form Auto-Fill

**FR-2.3.1**: System shall extract structured data from conversation context.

**FR-2.3.2**: System shall map conversation data to form fields:

| Conversation Intent | Form Field |
|---------------------|------------|
| "for 50 people" | guest_count: 50 |
| "on January 25th" | booking_date: 2026-01-25 |
| "wedding reception" | event_type: wedding |
| "my name is Ali" | customer_name: Ali |
| "call me at 0300..." | customer_phone: 0300... |

**FR-2.3.3**: System shall validate extracted data before form population.

**FR-2.3.4**: System shall allow user correction of auto-filled data.

### 2.4 Priority Escalation

**FR-2.4.1**: System shall support three priority levels:
- **Normal**: Default priority
- **High**: Expedited processing
- **Urgent**: Immediate attention

**FR-2.4.2**: System shall auto-escalate to High priority when:
- Guest count >= 100
- Booking date within 7 days

**FR-2.4.3**: System shall auto-escalate to Urgent priority when:
- Guest count >= 200
- Booking date within 48 hours
- User explicitly requests urgent handling

**FR-2.4.4**: Escalation shall trigger:
- Database priority flag update
- Admin notification (email)
- Optional WhatsApp notification

### 2.5 WhatsApp Notifications

**FR-2.5.1**: System shall support WhatsApp notifications via WhatsApp Business API.

**FR-2.5.2**: Notifications shall be opt-in only (explicit user consent).

**FR-2.5.3**: System shall support the following notification templates:

| Template ID | Trigger | Recipient |
|-------------|---------|-----------|
| booking_received | New booking created | Customer |
| booking_confirmed | Booking confirmed by admin | Customer |
| escalation_alert | Priority escalation | Admin |
| status_update | Status change | Customer |

**FR-2.5.4**: System shall validate phone number format before sending.

**FR-2.5.5**: System shall fallback to email if WhatsApp delivery fails.

**FR-2.5.6**: System shall rate-limit to maximum 5 WhatsApp messages per booking.

---

## 3. Non-Functional Requirements

### 3.1 Performance

**NFR-3.1.1**: Availability query response time < 500ms (p95).

**NFR-3.1.2**: Booking submission response time < 2 seconds.

**NFR-3.1.3**: WhatsApp notification delivery < 60 seconds.

**NFR-3.1.4**: System shall handle 50 concurrent booking sessions.

### 3.2 Reliability

**NFR-3.2.1**: Booking system availability: 99.5% uptime.

**NFR-3.2.2**: No duplicate bookings for the same slot.

**NFR-3.2.3**: Graceful degradation if WhatsApp API unavailable.

### 3.3 Security

**NFR-3.3.1**: Phone numbers encrypted at rest (AES-256).

**NFR-3.3.2**: WhatsApp API credentials stored in secure vault.

**NFR-3.3.3**: Rate limiting: 5 booking submissions per IP per hour.

**NFR-3.3.4**: All booking operations audit-logged.

**NFR-3.3.5**: Admin endpoints require authentication.

### 3.4 Scalability

**NFR-3.4.1**: Database queries optimized with proper indexing.

**NFR-3.4.2**: Notification queue for async processing.

---

## 4. Data Model

### 4.1 Database Schema

```sql
-- Banquet Halls Table
CREATE TABLE banquet_halls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    amenities JSON,
    price_per_hour DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hall_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    event_type VARCHAR(100),
    guest_count INT NOT NULL,
    special_requirements TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    priority ENUM('normal', 'high', 'urgent') DEFAULT 'normal',
    whatsapp_optin BOOLEAN DEFAULT FALSE,
    booking_reference VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hall_id) REFERENCES banquet_halls(id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_hall_date (hall_id, booking_date),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);

-- Booking Audit Log
CREATE TABLE booking_audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    action VARCHAR(50) NOT NULL,
    actor VARCHAR(100),
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Notification Log
CREATE TABLE notification_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    channel ENUM('whatsapp', 'email', 'sms') NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

### 4.2 Booking Reference Format

Format: `BK-YYYYMMDD-XXXX`

Example: `BK-20260120-0001`

---

## 5. API Contracts

### 5.1 Get All Halls

```
GET /api/banquets/halls

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Grand Hall",
      "capacity": 500,
      "amenities": ["AC", "Stage", "Sound System"],
      "price_per_hour": 5000.00,
      "status": "active"
    }
  ]
}
```

### 5.2 Check Availability

```
GET /api/banquets/availability?date=2026-01-25&hall_id=1

Response 200:
{
  "success": true,
  "data": {
    "hall_id": 1,
    "date": "2026-01-25",
    "available_slots": [
      {"start": "09:00", "end": "13:00"},
      {"start": "18:00", "end": "23:00"}
    ],
    "booked_slots": [
      {"start": "14:00", "end": "17:00"}
    ]
  }
}
```

### 5.3 Create Booking

```
POST /api/banquets/bookings

Request:
{
  "hall_id": 1,
  "booking_date": "2026-01-25",
  "start_time": "18:00",
  "end_time": "23:00",
  "customer_name": "Muhammad Ali",
  "customer_phone": "+923001234567",
  "customer_email": "ali@example.com",
  "event_type": "wedding",
  "guest_count": 150,
  "special_requirements": "Vegetarian menu required",
  "whatsapp_optin": true
}

Response 201:
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "booking_reference": "BK-20260125-0001",
    "status": "pending",
    "priority": "high"
  }
}
```

### 5.4 Escalate Booking

```
POST /api/banquets/bookings/{id}/escalate

Request:
{
  "priority": "urgent",
  "reason": "Customer requested immediate confirmation"
}

Response 200:
{
  "success": true,
  "message": "Booking escalated to urgent priority",
  "data": {
    "booking_reference": "BK-20260125-0001",
    "new_priority": "urgent",
    "notifications_sent": ["whatsapp", "email"]
  }
}
```

### 5.5 Send WhatsApp Notification

```
POST /api/notifications/whatsapp

Request:
{
  "booking_id": 1,
  "template_id": "booking_confirmed",
  "recipient_phone": "+923001234567"
}

Response 200:
{
  "success": true,
  "message": "WhatsApp notification queued",
  "data": {
    "notification_id": 123,
    "status": "pending"
  }
}
```

---

## 6. User Interface

### 6.1 Booking Agent Conversation Flow

```
User: I want to book a banquet hall

Agent: I'd be happy to help you book a banquet hall. Let me check availability for you.
       What date are you looking at for your event?

User: January 25th

Agent: Great! January 25, 2026. How many guests are you expecting?

User: Around 150 people

Agent: For 150 guests, I'd recommend our Grand Hall (capacity 500).
       What time would you like to start and end?

User: 6 PM to 11 PM

Agent: Perfect. Let me check availability...
       ✅ Grand Hall is available on Jan 25, 2026 from 6:00 PM to 11:00 PM.

       What type of event is this? (wedding, corporate, birthday, etc.)

User: It's a wedding reception

Agent: Wonderful! I'll need a few more details to complete your booking:
       - Your full name
       - Contact phone number
       - Email address (optional)

User: Muhammad Ali, 0300-1234567, ali@email.com

Agent: Thank you! Here's your booking summary:

       📋 BOOKING SUMMARY
       ━━━━━━━━━━━━━━━━━━━
       Hall: Grand Hall
       Date: January 25, 2026
       Time: 6:00 PM - 11:00 PM
       Event: Wedding Reception
       Guests: 150
       Name: Muhammad Ali
       Phone: 0300-1234567
       Email: ali@email.com

       Would you like to receive WhatsApp updates for this booking? (yes/no)

User: Yes

Agent: Would you like me to submit this booking now?

User: Yes, please

Agent: ✅ Booking submitted successfully!

       📌 Your Booking Reference: BK-20260125-0001
       Status: Pending Confirmation

       You'll receive a WhatsApp notification once confirmed.
       Is there anything else I can help you with?
```

### 6.2 Form Integration

The Booking Agent shall populate a hidden form that can be displayed for user review:

```tsx
// Booking form state populated from conversation
{
  hall_id: 1,
  booking_date: "2026-01-25",
  start_time: "18:00",
  end_time: "23:00",
  customer_name: "Muhammad Ali",
  customer_phone: "0300-1234567",
  customer_email: "ali@email.com",
  event_type: "wedding",
  guest_count: 150,
  whatsapp_optin: true
}
```

---

## 7. Error Handling

### 7.1 Error Codes

| Code | Message | User-Facing Message |
|------|---------|---------------------|
| E001 | Hall not found | The selected hall is not available |
| E002 | Slot not available | This time slot is already booked |
| E003 | Invalid date | Please select a future date |
| E004 | Guest count exceeds capacity | This hall cannot accommodate that many guests |
| E005 | Phone validation failed | Please provide a valid phone number |
| E006 | WhatsApp delivery failed | We couldn't send WhatsApp notification, email sent instead |
| E007 | Rate limit exceeded | Too many requests, please try again later |

### 7.2 Fallback Behavior

- If WhatsApp fails → Send email notification
- If email fails → Log for manual follow-up
- If database unavailable → Show cached availability with disclaimer

---

## 8. Testing Requirements

### 8.1 Unit Tests

- Availability query logic
- Booking validation
- Priority escalation triggers
- Phone number validation
- Booking reference generation

### 8.2 Integration Tests

- Full booking flow via API
- WhatsApp notification delivery
- Database transaction handling
- Escalation workflow

### 8.3 E2E Tests

- Complete conversational booking flow
- Form auto-fill verification
- Priority escalation with notification

---

## 9. Dependencies

### 9.1 External Dependencies

| Dependency | Purpose | Required |
|------------|---------|----------|
| WhatsApp Business API | Notifications | Optional |
| MySQL Database | Data storage | Required |
| Email Service (existing) | Fallback notifications | Required |

### 9.2 Internal Dependencies

- Existing Agentic AI system
- Existing notification infrastructure
- Existing authentication system (for admin)

---

## 10. Acceptance Criteria

- [ ] AC-1: User can ask AI agent about banquet availability and receive accurate response
- [ ] AC-2: Booking Agent collects all required fields through conversation
- [ ] AC-3: Booking form is auto-populated with conversation data
- [ ] AC-4: User can review and confirm booking details before submission
- [ ] AC-5: Booking reference is generated and returned upon successful submission
- [ ] AC-6: Priority is auto-calculated based on guest count and date
- [ ] AC-7: Admin receives notification for high/urgent priority bookings
- [ ] AC-8: Customer receives WhatsApp confirmation (if opted-in)
- [ ] AC-9: All booking operations are logged in audit table
- [ ] AC-10: System gracefully handles WhatsApp API failures

---

**Specification Version**: 1.0.0 | **Author**: Agent | **Review Status**: Pending
