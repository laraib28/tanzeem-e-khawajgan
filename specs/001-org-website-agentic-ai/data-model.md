# Data Model: Organization Website with Agentic AI

**Date**: 2025-12-21
**Branch**: `001-org-website-agentic-ai`
**Based on**: [spec.md](./spec.md), [research.md](./research.md)

This document defines the data structures for the 9 key entities identified in the specification.

## 1. Page Entity

Represents a website page with title, banner, sections, and navigation metadata.

**TypeScript Interface**:
```typescript
interface Page {
  id: string;
  slug: string;
  title: {
    en: string;
    ur: string;
  };
  banner?: {
    imageUrl: string;
    imageAlt: {
      en: string;
      ur: string;
    };
  };
  sections: PageSection[];
  metadata: {
    description: {
      en: string;
      ur: string;
    };
    keywords: string[];
  };
  parent?: string; // For nested pages (Vision, Services)
  order: number; // Display order in navigation
}

interface PageSection {
  type: 'hero' | 'text' | 'cards' | 'timeline' | 'counters' | 'form' | 'map';
  content: any; // Section-specific content
  order: number;
}
```

**JSON Example** (config/content/en/home.json):
```json
{
  "id": "home",
  "slug": "/",
  "title": { "en": "Home", "ur": "ہوم" },
  "sections": [
    {
      "type": "hero",
      "order": 1,
      "content": {
        "heading": "Welcome to Tanzeem-e-Khawajgan",
        "subheading": "Serving the community since 1985",
        "ctaText": "Donate Now",
        "ctaUrl": "/donate",
        "imageUrl": "/images/hero/main.jpg"
      }
    }
  ]
}
```

---

## 2. Service Entity

Represents an organizational service with specific attributes.

**TypeScript Interface**:
```typescript
interface Service {
  id: string;
  slug: string;
  name: {
    en: string;
    ur: string;
  };
  description: {
    en: string;
    ur: string;
  };
  banner: {
    imageUrl: string;
    imageAlt: { en: string; ur: string };
  };
  type: 'it' | 'medical' | 'education' | 'sports' | 'banquets' | 'graveyard';
  content: ITServiceContent | MedicalServiceContent | EducationServiceContent | SportsServiceContent | BanquetsServiceContent | GraveyardServiceContent;
}

interface ITServiceContent {
  courses: Course[];
  summerCamp: {
    description: { en: string; ur: string };
    schedule: string;
  };
  inquiryFormEnabled: boolean;
}

interface Course {
  title: { en: string; ur: string };
  description: { en: string; ur: string };
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}
```

---

## 3. Board Member Entity

Represents organization leadership with biography and photo.

**TypeScript Interface**:
```typescript
interface BoardMember {
  id: string;
  name: {
    en: string;
    ur: string;
  };
  designation: {
    en: string;
    ur: string;
  };
  biography: {
    en: string;
    ur: string;
  };
  photoUrl: string;
  photoAlt: { en: string; ur: string };
  committee: 'president' | 'executive' | 'management';
  order: number; // Display order
  email?: string;
  phone?: string;
}
```

---

## 4. News Item Entity

Represents a news article or announcement.

**TypeScript Interface**:
```typescript
interface NewsItem {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  content: {
    en: string;
    ur: string;
  };
  excerpt: {
    en: string;
    ur: string;
  };
  imageUrl?: string;
  imageAlt?: { en: string; ur: string };
  publishedDate: string; // ISO 8601
  author?: string;
  tags: string[];
}
```

---

## 5. Event Entity

Represents an organizational event.

**TypeScript Interface**:
```typescript
interface Event {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  description: {
    en: string;
    ur: string;
  };
  startDate: string; // ISO 8601
  endDate?: string; // ISO 8601
  location: {
    en: string;
    ur: string;
  };
  imageUrl?: string;
  imageAlt?: { en: string; ur: string };
  registrationRequired: boolean;
  registrationUrl?: string;
}
```

---

## 6. AI Conversation Entity

Represents a user session with the AI assistant (in-memory only, not persisted).

**TypeScript Interface**:
```typescript
interface AIConversation {
  sessionId: string;
  messages: AIMessage[];
  language: 'en' | 'ur';
  createdAt: number; // Timestamp
  lastActivityAt: number; // Timestamp
  metadata: {
    userAgent?: string;
    ipAddress?: string; // For rate limiting only
  };
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  agent?: string; // Which sub-agent handled (for logging)
}

// Validation rules:
// - sessionId: UUID v4
// - TTL: 30 minutes from lastActivityAt
// - Max messages per session: 50
// - Not persisted to disk (memory only)
```

---

## 7. Form Submission Entity

Represents user-submitted data from inquiry or feedback forms.

**TypeScript Interface**:
```typescript
interface FormSubmission {
  id: string;
  type: 'feedback' | 'inquiry';
  data: FeedbackFormData | InquiryFormData;
  submittedAt: string; // ISO 8601
  ipAddress: string; // For spam prevention
  status: 'pending' | 'processed' | 'spam';
  language: 'en' | 'ur';
}

interface FeedbackFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
}

// Validation (Zod schemas):
// - name: min 2 chars, max 100 chars
// - email: valid email format
// - subject/message: min 5 chars, max 1000 chars
// - phone: valid phone format (international)
// - Sanitization: XSS prevention on all text fields
```

---

## 8. Impact Metric Entity

Represents statistical counters displayed on homepage.

**TypeScript Interface**:
```typescript
interface ImpactMetric {
  id: string;
  name: {
    en: string;
    ur: string;
  };
  value: number;
  description: {
    en: string;
    ur: string;
  };
  icon?: string;
  order: number;
  lastUpdated: string; // ISO 8601
}
```

**JSON Example** (config/content/en/home.json - impactCounters):
```json
{
  "impactCounters": [
    {
      "id": "students-supported",
      "name": { "en": "Students Supported", "ur": "طلباء کی حمایت" },
      "value": 1250,
      "description": { "en": "Receiving fee support", "ur": "فیس کی حمایت حاصل کر رہے ہیں" },
      "order": 1
    }
  ]
}
```

---

## 9. Navigation Item Entity

Represents a menu entry loaded from configuration.

**TypeScript Interface**:
```typescript
interface NavigationItem {
  id: string;
  label: {
    en: string;
    ur: string;
  };
  path: string;
  parent?: string; // For nested items
  children?: NavigationItem[];
  order: number;
  icon?: string;
  visibility: 'always' | 'mobile-only' | 'desktop-only';
}
```

**JSON Example** (config/navigation.json):
```json
{
  "navigation": [
    {
      "id": "home",
      "label": { "en": "Home", "ur": "ہوم" },
      "path": "/",
      "order": 1,
      "visibility": "always"
    },
    {
      "id": "vision",
      "label": { "en": "Vision", "ur": "ویژن" },
      "path": "/vision",
      "order": 3,
      "visibility": "always",
      "children": [
        {
          "id": "mission",
          "label": { "en": "Mission", "ur": "مشن" },
          "path": "/vision/mission",
          "order": 1
        }
      ]
    }
  ]
}
```

---

## Relationships

```
NavigationItem
    ↓ references
Page
    ↓ contains
PageSection (hero, text, cards, timeline, etc.)

Service
    ↓ specialized type of
Page

BoardMember
    ↓ rendered as cards on
Page (Board of Members)

NewsItem & Event
    ↓ rendered as cards on
Page (News & Events)

ImpactMetric
    ↓ rendered as counters on
Page (Home)

AIConversation
    ↓ creates
FormSubmission (through Action Agent)
```

## Storage Strategy

1. **Configuration Files** (JSON):
   - Pages, Services, BoardMembers, News, Events, ImpactMetrics, NavigationItems
   - Location: `config/content/en/` and `config/content/ur/`
   - Type-safe loading with TypeScript interfaces

2. **Runtime Only** (In-Memory):
   - AIConversation: Session-based, 30-minute TTL, no persistence

3. **Email Processing**:
   - FormSubmission: Submitted via API, sent to email, not stored

## Validation

All entities use Zod schemas for runtime validation:

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const PageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.object({ en: z.string(), ur: z.string() }),
  // ... etc
});

export const FormSubmissionSchema = z.object({
  type: z.enum(['feedback', 'inquiry']),
  data: z.union([FeedbackFormDataSchema, InquiryFormDataSchema]),
  // ... etc
});
```

## Next Steps

- Create API contracts for form submission and AI chat endpoints
- Write quickstart.md with developer setup instructions
- Update agent context with technology stack
