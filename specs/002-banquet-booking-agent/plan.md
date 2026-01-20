# Banquet Booking Agent - Implementation Plan

**Feature ID**: 002-banquet-booking-agent
**Version**: 1.0.0
**Created**: 2026-01-20

---

## 1. Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           Unified AI Chat Interface                 │ │
│  │  (Medical | IT | Education | Sports | Banquet)      │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │
│  │ /banquets│  │ /bookings│  │ /notify  │  │ /rag    │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘  │
└──────────────────────────────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
┌───────────────┐  ┌─────────────┐  ┌────────────────┐
│    MySQL      │  │  RAG Store  │  │ WhatsApp API   │
│  (bookings)   │  │  (content)  │  │ (notifications)│
└───────────────┘  └─────────────┘  └────────────────┘
```

---

## 2. Unified Agent Architecture

```
Main Agent (Controller)
│
├── Information Agent (RAG-powered)
│   ├── Medical Info → /config/content/en/medical.json
│   ├── IT Info → /config/content/en/it.json
│   ├── Education Info → /config/content/en/education.json
│   ├── Sports Info → /config/content/en/sports.json
│   └── Banquet Info → /config/content/en/banquets.json
│
├── Navigation Agent
├── Services Agent (Router)
├── Policy Agent
│
├── Action Agent
│   ├── Inquiry Form Handler → POST /api/forms/inquiry
│   └── Feedback Form Handler → POST /api/forms/feedback
│
└── Booking Agent (Banquet)
    ├── Availability Checker → GET /api/banquets/availability
    ├── Form Filler → Extract from conversation
    ├── Submission Handler → POST /api/banquets/bookings
    └── Escalation Manager → POST /api/banquets/bookings/{id}/escalate
```

---

## 3. Database Schema

```sql
-- Banquet Halls
CREATE TABLE banquet_halls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    amenities JSON,
    price_per_hour DECIMAL(10,2),
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
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
    status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    priority ENUM('normal','high','urgent') DEFAULT 'normal',
    whatsapp_optin BOOLEAN DEFAULT FALSE,
    booking_reference VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hall_id) REFERENCES banquet_halls(id),
    INDEX idx_hall_date (hall_id, booking_date)
);

-- Audit Log
CREATE TABLE booking_audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    action VARCHAR(50),
    actor VARCHAR(100),
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Log
CREATE TABLE notification_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    channel ENUM('whatsapp','email','sms'),
    template_id VARCHAR(50),
    recipient VARCHAR(255),
    status ENUM('pending','sent','delivered','failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. File Structure

```
backend/
├── routers/
│   ├── banquets.py      # Hall & availability endpoints
│   ├── bookings.py      # Booking CRUD & escalation
│   └── notifications.py # WhatsApp dispatch
├── schemas/
│   ├── banquet.py
│   ├── booking.py
│   └── notification.py
├── services/
│   ├── availability.py
│   ├── booking.py
│   ├── escalation.py
│   ├── audit.py
│   └── whatsapp.py
├── models.py
└── main.py

app/
├── components/
│   └── ai/
│       ├── ChatInterface.tsx (extend)
│       └── agents/
│           └── BookingAgent.ts
└── lib/
    └── rag/
        └── content-loader.ts
```

---

## 5. Implementation Phases

| Phase | Deliverables |
|-------|--------------|
| **1** | Database tables, SQLAlchemy models, Pydantic schemas |
| **2** | GET /halls, GET /availability, POST /bookings |
| **3** | Escalation logic, audit logging |
| **4** | WhatsApp notification integration |
| **5** | RAG content indexing for all services |
| **6** | Booking Agent integration with AI controller |
| **7** | Frontend chat enhancements |

---

## 6. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/banquets/halls | List active halls |
| GET | /api/banquets/halls/{id} | Hall details |
| GET | /api/banquets/availability | Check date availability |
| POST | /api/banquets/bookings | Create booking |
| GET | /api/banquets/bookings/{id} | Get booking |
| POST | /api/banquets/bookings/{id}/escalate | Escalate priority |
| POST | /api/notifications/whatsapp | Send notification |

---

## 7. Priority Escalation

| Condition | Priority |
|-----------|----------|
| Default | normal |
| guests >= 100 OR date <= 7 days | high |
| guests >= 200 OR date <= 48 hours | urgent |

---

## 8. RAG Content Sources

| Service | Source Path |
|---------|-------------|
| Medical | config/content/en/medical.json |
| IT | config/content/en/it.json |
| Education | config/content/en/education.json |
| Sports | config/content/en/sports.json |
| Banquets | config/content/en/banquets.json |
| General | config/site-config.json |

---

## 9. Environment Variables

```env
# WhatsApp
WHATSAPP_API_URL=https://graph.facebook.com/v17.0
WHATSAPP_PHONE_NUMBER_ID=xxx
WHATSAPP_ACCESS_TOKEN=xxx

# Encryption
PHONE_ENCRYPTION_KEY=xxx
```

---

**Plan Version**: 1.0.0
