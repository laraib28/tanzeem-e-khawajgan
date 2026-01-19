# API Contracts: Organization Website

**Date**: 2025-12-21
**Branch**: `001-org-website-agentic-ai`

This document defines the API contracts for all Next.js API routes.

## 1. Feedback Form API

**Endpoint**: `POST /api/forms/feedback`

**Purpose**: Submit user feedback from Contact page

**Request**:
```typescript
{
  name: string; // Min 2 chars, max 100 chars
  email: string; // Valid email format
  subject: string; // Min 5 chars, max 200 chars
  message: string; // Min 10 chars, max 2000 chars
  language: 'en' | 'ur';
}
```

**Response (Success - 200)**:
```typescript
{
  success: true;
  message: string; // Confirmation message in user's language
}
```

**Response (Validation Error - 400)**:
```typescript
{
  success: false;
  error: string;
  fields?: {
    [fieldName: string]: string; // Field-specific errors
  };
}
```

**Response (Rate Limit - 429)**:
```typescript
{
  success: false;
  error: 'Too many requests. Please try again later.';
  retryAfter: number; // Seconds
}
```

---

## 2. IT Inquiry Form API

**Endpoint**: `POST /api/forms/inquiry`

**Purpose**: Submit IT course inquiry

**Request**:
```typescript
{
  name: string;
  email: string;
  phone: string; // International format
  course: string; // Course ID or name
  message: string;
  language: 'en' | 'ur';
}
```

**Responses**: Same as Feedback Form API

---

## 3. AI Chat API

**Endpoint**: `POST /api/ai/chat`

**Purpose**: Send user query to Agentic AI system

**Request**:
```typescript
{
  message: string; // User query
  sessionId?: string; // Optional: for continuing conversation
  language?: 'en' | 'ur'; // Optional: auto-detected if not provided
}
```

**Response (Success - 200)**:
```typescript
{
  success: true;
  response: string; // AI response in detected/requested language
  sessionId: string; // Session ID for conversation continuity
  language: 'en' | 'ur'; // Detected language
  agent: string; // Which sub-agent handled the query
}
```

**Response (Policy Violation - 200)**:
```typescript
{
  success: true;
  response: string; // Polite refusal message
  sessionId: string;
  language: 'en' | 'ur';
  agent: 'policy'; // Policy Agent rejected request
  violation: 'legal' | 'medical' | 'opinion';
}
```

**Response (Error - 500)**:
```typescript
{
  success: false;
  error: 'An error occurred. Please try again.';
  fallback: string; // Fallback message suggesting contact methods
}
```

**Rate Limiting**:
- 10 requests per minute per IP
- 50 messages per session

---

## Security Requirements

All APIs must implement:
1. **Input Sanitization**: XSS prevention using DOMPurify or similar
2. **CSRF Protection**: Next.js built-in CSRF protection
3. **Rate Limiting**: Using middleware or edge functions
4. **Validation**: Zod schemas for all inputs
5. **Error Handling**: Never expose internal errors to client

## Testing Requirements

Each API endpoint must have:
1. Unit tests for validation logic
2. Integration tests for full request/response cycle
3. Security tests (XSS, injection attempts)
4. Rate limiting tests
