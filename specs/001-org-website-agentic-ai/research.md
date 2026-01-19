# Research Findings: Organization Website with Agentic AI

**Date**: 2025-12-21
**Branch**: `001-org-website-agentic-ai`
**Plan**: [plan.md](./plan.md)

This document contains research findings and decisions for all technical unknowns identified in the implementation plan.

## Research Task 1: Mapping Service Selection

### Decision
**OpenStreetMap with react-leaflet**

### Rationale
1. **No API costs**: OpenStreetMap is free and open-source with no usage limits or API keys required
2. **No .env compliance**: Meets constitutional requirement of no .env files - no API keys needed
3. **Next.js compatibility**: react-leaflet works well with Next.js App Router using dynamic imports
4. **Embedding capabilities**: Full customization with markers, popups, and custom styling
5. **Privacy**: No tracking or data collection compared to Google Maps

### Alternatives Considered
- **Google Maps**: Rejected due to API key requirements (violates no-.env rule), costs after free tier ($200/month), and privacy concerns
- **Mapbox**: Rejected due to API token requirements and complexity

### Implementation Approach
```typescript
// Dynamic import to avoid SSR issues
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

// Using react-leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
```

---

## Research Task 2: Email Service Selection

### Decision
**Resend**

### Rationale
1. **Modern Next.js integration**: Built specifically for Next.js with official SDK
2. **Generous free tier**: 100 emails/day, 3,000/month free - sufficient for organizational website
3. **TypeScript native**: Full TypeScript support out of the box
4. **Simple configuration**: Can store API key in local config file (meets constitutional requirement)
5. **Excellent deliverability**: High inbox placement rates
6. **Developer experience**: Clean API, good documentation, easy testing

### Alternatives Considered
- **SendGrid**: Rejected due to more complex setup and lower free tier (100/day limit)
- **Nodemailer with SMTP**: Rejected due to complexity of managing SMTP credentials and lower reliability
- **AWS SES**: Rejected due to AWS account requirements and more complex setup

### Implementation Approach
```typescript
// lib/email/send.ts
import { Resend } from 'resend';
import siteConfig from '@/config/site-config.json';

const resend = new Resend(siteConfig.email.resendApiKey);

export async function sendFeedbackEmail(data: FeedbackFormData) {
  const { data: emailData, error } = await resend.emails.send({
    from: siteConfig.email.fromAddress,
    to: siteConfig.email.toAddress,
    subject: `Feedback: ${data.subject}`,
    html: `<p>${data.message}</p>`,
  });

  if (error) throw error;
  return emailData;
}
```

**Configuration** (config/site-config.json):
```json
{
  "email": {
    "resendApiKey": "re_xxxxx",
    "fromAddress": "noreply@tanzeem-e-khawajgan.org",
    "toAddress": "admin@tanzeem-e-khawajgan.org"
  }
}
```

---

## Research Task 3: Form Validation Library

### Decision
**React Hook Form + Zod**

### Rationale
1. **TypeScript-first**: Zod provides runtime type safety and TypeScript inference
2. **Performance**: React Hook Form minimizes re-renders, uncontrolled components by default
3. **Accessibility**: Built-in ARIA attribute support and error handling
4. **Bilingual support**: Easy to customize error messages per language
5. **Bundle size**: Lightweight (~9KB for RHF + ~8KB for Zod)
6. **Next.js compatibility**: Works seamlessly with Server Actions and API routes
7. **Developer experience**: Excellent TypeScript DX, clear error messages

### Alternatives Considered
- **Formik + Yup**: Rejected due to larger bundle size and less TypeScript-native approach
- **Custom validation**: Rejected due to reinventing wheel and missing accessibility features

### Implementation Approach
```typescript
// lib/forms/validation.ts (Zod schemas)
import { z } from 'zod';

export const feedbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Bilingual error messages
const errorMessages = {
  en: {
    nameMin: 'Name must be at least 2 characters',
    emailInvalid: 'Invalid email address',
  },
  ur: {
    nameMin: 'نام کم از کم 2 حروف کا ہونا چاہیے',
    emailInvalid: 'غلط ای میل ایڈریس',
  },
};

// Component usage
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(feedbackSchema),
  defaultValues: { name: '', email: '', subject: '', message: '' },
});
```

---

## Research Task 4: Content Storage Format

### Decision
**JSON (Typed with TypeScript interfaces)**

### Rationale
1. **Type safety**: Can define TypeScript interfaces for content structure
2. **Validation**: Easy to validate JSON against schema
3. **Next.js integration**: Native import support, no additional parsing needed
4. **Tooling**: Excellent editor support (IntelliSense, validation)
5. **Simplicity**: Straightforward structure for non-technical content editors
6. **i18n structure**: Easy to organize by language (en/, ur/) with identical structure
7. **Performance**: Fast parsing, can be imported at build time

### Alternatives Considered
- **YAML**: Rejected due to need for additional parsing library and less type safety
- **Markdown with frontmatter**: Rejected due to complexity for structured data (cards, navigation)
- **MDX**: Rejected as overkill for this use case (no component embedding needed in content)

### Implementation Approach

**Content Structure**:
```
config/content/
├── en/
│   ├── home.json
│   ├── about.json
│   ├── mission.json
│   ├── board-members.json
│   ├── news-events.json
│   ├── services.json
│   └── contact.json
└── ur/
    └── [same structure as en/]
```

**Type Definitions** (lib/types/content.ts):
```typescript
export interface HomeContent {
  hero: {
    heading: string;
    subheading: string;
    ctaText: string;
    ctaUrl: string;
    imageUrl: string;
    imageAlt: string;
  };
  introduction: {
    title: string;
    description: string;
  };
  impactCounters: Array<{
    label: string;
    value: number;
    description: string;
  }>;
}

export interface ServiceContent {
  it: { title: string; description: string; courses: Array<...>; };
  medical: { title: string; services: Array<...>; };
  // ... etc
}
```

**Usage Example**:
```typescript
import homeContentEn from '@/config/content/en/home.json';
import homeContentUr from '@/config/content/ur/home.json';
import { useLanguage } from '@/lib/i18n/use-language';

export function HomePage() {
  const { language } = useLanguage();
  const content = language === 'ur' ? homeContentUr : homeContentEn;

  return <Hero {...content.hero} />;
}
```

---

## Research Task 5: Accessibility Testing Approach

### Decision
**Combination approach: axe-core (automated) + jest-axe (unit) + Lighthouse CI (integration)**

### Rationale
1. **Comprehensive coverage**: Automated tests catch ~40% of WCAG issues, manual required for rest
2. **Multi-level testing**: Unit (components), integration (pages), CI/CD (continuous)
3. **WCAG 2.1 AA focus**: axe-core specifically tests WCAG criteria
4. **Developer workflow**: Jest-axe integrates with existing test suite
5. **CI/CD integration**: Lighthouse CI provides automated audits on every commit
6. **Reporting**: Clear, actionable reports with remediation guidance

### Alternatives Considered
- **Pa11y alone**: Rejected due to less granular component-level testing
- **Manual testing only**: Rejected as insufficient for continuous compliance
- **Lighthouse alone**: Rejected as missing component-level testing

### Implementation Approach

**1. Unit Testing with jest-axe**:
```typescript
// tests/unit/components/Navbar.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Navbar } from '@/components/layout/Navbar';

expect.extend(toHaveNoViolations);

test('Navbar should not have accessibility violations', async () => {
  const { container } = render(<Navbar />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**2. E2E Testing with Playwright + axe-core**:
```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Home page should not have accessibility violations', async ({ page }) => {
  await page.goto('/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**3. CI/CD with Lighthouse CI**:
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install && npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

**Lighthouse CI Config** (lighthouserc.json):
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:performance": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

**Manual Testing Checklist**:
- Keyboard navigation (Tab, Shift+Tab, Enter, Space, Arrow keys)
- Screen reader testing (NVDA on Windows, VoiceOver on Mac)
- Color contrast verification (manual check with contrast checker)
- Form error announcement testing
- ARIA attribute verification

---

## Research Task 6: MCP Server Integration Patterns

### Decision
**Server-side integration with connection pooling and retry logic**

### Rationale
1. **Security**: API calls to MCP server from Next.js API routes (not client-side)
2. **Performance**: Connection pooling reduces latency
3. **Reliability**: Exponential backoff retry strategy handles transient failures
4. **Session management**: Use in-memory session store (no persistent storage per constitution)
5. **Bilingual support**: Pass language context with every request

### Implementation Approach

**MCP Client** (lib/ai/mcp-client.ts):
```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import siteConfig from '@/config/site-config.json';

class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;

  async connect() {
    if (this.client) return this.client;

    this.transport = new StdioClientTransport({
      command: siteConfig.mcp.command,
      args: siteConfig.mcp.args,
    });

    this.client = new Client({
      name: 'tanzeem-khawajgan-ai',
      version: '1.0.0',
    }, {
      capabilities: {
        sampling: {},
      },
    });

    await this.client.connect(this.transport);
    return this.client;
  }

  async sendMessage(message: string, language: 'en' | 'ur', context: any) {
    const client = await this.connect();

    // Send message with language and context
    const response = await client.request({
      method: 'sampling/createMessage',
      params: {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: message,
          },
        }],
        systemPrompt: `You are a helpful assistant for Tanzeem-e-Khawajgan. Respond in ${language === 'ur' ? 'Urdu' : 'English'}. Context: ${JSON.stringify(context)}`,
        maxTokens: 1000,
      },
    });

    return response;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.transport = null;
    }
  }
}

export const mcpClient = new MCPClient();
```

**Error Handling with Retry Logic**:
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const response = await withRetry(() => mcpClient.sendMessage(query, language, context));
```

**Session Management** (in-memory, no persistence):
```typescript
// lib/ai/session-manager.ts
interface Session {
  id: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  language: 'en' | 'ur';
  createdAt: number;
}

class SessionManager {
  private sessions = new Map<string, Session>();
  private readonly TTL = 30 * 60 * 1000; // 30 minutes

  createSession(language: 'en' | 'ur'): string {
    const id = crypto.randomUUID();
    this.sessions.set(id, {
      id,
      messages: [],
      language,
      createdAt: Date.now(),
    });

    // Cleanup old sessions
    this.cleanup();
    return id;
  }

  getSession(id: string): Session | undefined {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    // Check TTL
    if (Date.now() - session.createdAt > this.TTL) {
      this.sessions.delete(id);
      return undefined;
    }

    return session;
  }

  private cleanup() {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.createdAt > this.TTL) {
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionManager = new SessionManager();
```

---

## Research Task 7: Bilingual i18n Strategy

### Decision
**Custom language detection with react-i18next + next-i18next for UI, manual AI language detection**

### Rationale
1. **Flexibility**: Custom approach allows fine control over language detection for AI
2. **RTL support**: next-i18next has built-in RTL support for Urdu
3. **SEO**: Can use Next.js routing for language-specific URLs if needed later
4. **AI language detection**: Simple pattern matching for initial query, then persist in session
5. **Font support**: Use Noto Nastaliq Urdu font for proper Urdu rendering

### Alternatives Considered
- **franc library**: Rejected as overkill for 2-language detection, adds bundle size
- **Next.js i18n routing**: Deferred as optional enhancement (not required for initial launch)

### Implementation Approach

**Language Detection for AI** (lib/ai/language-detector.ts):
```typescript
export function detectLanguage(text: string): 'en' | 'ur' {
  // Simple Urdu script detection (Unicode range U+0600 to U+06FF)
  const urduRegex = /[\u0600-\u06FF]/;

  if (urduRegex.test(text)) {
    return 'ur';
  }

  return 'en'; // Default to English
}
```

**i18n Configuration** (lib/i18n/config.ts):
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './en';
import urTranslations from './ur';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ur: { translation: urTranslations },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

**RTL Layout Support** (app/layout.tsx):
```typescript
export default function RootLayout({ children }: { children: React.Node }) {
  const { language } = useLanguage();
  const dir = language === 'ur' ? 'rtl' : 'ltr';

  return (
    <html lang={language} dir={dir}>
      <body className={language === 'ur' ? 'font-urdu' : 'font-sans'}>
        {children}
      </body>
    </html>
  );
}
```

**Font Configuration** (tailwind.config.ts):
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // English font
        urdu: ['Noto Nastaliq Urdu', 'serif'], // Urdu font
      },
    },
  },
};

export default config;
```

**Fonts** (app/layout.tsx):
```typescript
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoNastaliqUrdu = localFont({
  src: '../public/fonts/NotoNastaliqUrdu-Regular.ttf',
  variable: '--font-urdu',
});
```

---

## Research Task 8: Agentic AI Architecture Patterns

### Decision
**Router-Agent Pattern with Sub-Agent Delegation**

### Rationale
1. **Clear separation of concerns**: Each sub-agent has single responsibility
2. **Governance enforcement**: Policy Agent acts as gatekeeper for all requests
3. **Scalability**: Easy to add new sub-agents without modifying existing ones
4. **Context preservation**: Main Agent maintains conversation context across sub-agents
5. **Permission boundaries**: Policy Agent enforces constitutional AI governance rules

### Architecture Blueprint

```
┌─────────────────────────────────────────────────────────────┐
│                        Main Agent                           │
│                       (Controller)                          │
│                                                             │
│  Responsibilities:                                          │
│  - Receive user query                                       │
│  - Detect language (en/ur)                                  │
│  - Analyze intent                                           │
│  - Route to appropriate sub-agent                           │
│  - Maintain conversation context                            │
│  - Return response to user                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ (Always checks with Policy Agent first)
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                      Policy Agent                           │
│                                                             │
│  Responsibilities:                                          │
│  - Validate request against permission boundaries           │
│  - Reject: legal advice, medical advice, opinions           │
│  - Log rejected requests (without user data)                │
│  - Return ALLOWED or DENIED + reason                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ (If ALLOWED, route to appropriate agent)
                  ↓
    ┌─────────────┴─────────────┬─────────────────┬──────────────┐
    │                           │                 │              │
    ↓                           ↓                 ↓              ↓
┌───────────┐    ┌──────────────────┐  ┌────────────┐  ┌────────────┐
│Information│    │   Navigation     │  │  Services  │  │   Action   │
│  Agent    │    │     Agent        │  │   Agent    │  │   Agent    │
└───────────┘    └──────────────────┘  └────────────┘  └────────────┘
│                │                     │              │
│ Answers        │ Guides users       │ Provides     │ Assists with
│ questions      │ to pages           │ service      │ form filling
│ from website   │                    │ information  │
│ content        │                    │              │
└────────────────┴─────────────────────┴──────────────┴──────────────┘
```

### Implementation Pattern

**Agent Interface** (lib/ai/types.ts):
```typescript
export interface AgentContext {
  sessionId: string;
  language: 'en' | 'ur';
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  knowledgeBase: any;
}

export interface AgentResponse {
  content: string;
  action?: 'navigate' | 'fill_form' | 'none';
  actionData?: any;
  confidence: number;
}

export interface Agent {
  name: string;
  canHandle(query: string, context: AgentContext): boolean;
  process(query: string, context: AgentContext): Promise<AgentResponse>;
}
```

**Main Agent** (lib/ai/main-agent.ts):
```typescript
import { PolicyAgent } from './agents/policy-agent';
import { InformationAgent } from './agents/information-agent';
import { NavigationAgent } from './agents/navigation-agent';
import { ServicesAgent } from './agents/services-agent';
import { ActionAgent } from './agents/action-agent';

export class MainAgent {
  private policyAgent: PolicyAgent;
  private agents: Agent[];

  constructor() {
    this.policyAgent = new PolicyAgent();
    this.agents = [
      new InformationAgent(),
      new NavigationAgent(),
      new ServicesAgent(),
      new ActionAgent(),
    ];
  }

  async process(query: string, context: AgentContext): Promise<AgentResponse> {
    // 1. Check with Policy Agent first
    const policyCheck = await this.policyAgent.validate(query, context);

    if (!policyCheck.allowed) {
      return {
        content: policyCheck.reason,
        confidence: 1.0,
      };
    }

    // 2. Find appropriate sub-agent
    for (const agent of this.agents) {
      if (agent.canHandle(query, context)) {
        return await agent.process(query, context);
      }
    }

    // 3. Fallback: information agent
    return await this.agents[0].process(query, context);
  }
}
```

**Sub-Agent Communication Protocol**:
- Each sub-agent receives: query, context (session, language, history, knowledge base)
- Each sub-agent returns: content, optional action, confidence score
- Main Agent decides which response to use based on confidence scores if multiple agents can handle

**Permission Enforcement**:
```typescript
// lib/ai/agents/policy-agent.ts
export class PolicyAgent {
  private readonly restrictedPatterns = [
    // Legal advice patterns
    /\b(legal|lawyer|sue|court|lawsuit)\b/i,
    // Medical advice patterns
    /\b(diagnose|treatment|medicine|prescription|doctor)\b/i,
    // Personal opinion patterns
    /\b(think|believe|opinion|feel|personally)\b/i,
  ];

  async validate(query: string, context: AgentContext) {
    for (const pattern of this.restrictedPatterns) {
      if (pattern.test(query)) {
        return {
          allowed: false,
          reason: context.language === 'en'
            ? 'I apologize, but I cannot provide legal, medical advice, or personal opinions. I can help you with information about our organization and services.'
            : 'معذرت، لیکن میں قانونی، طبی مشورہ، یا ذاتی رائے نہیں دے سکتا۔ میں آپ کو ہماری تنظیم اور خدمات کے بارے میں معلومات میں مدد کر سکتا ہوں۔',
        };
      }
    }

    return { allowed: true };
  }
}
```

---

## Summary of Decisions

| Research Task | Decision | Key Benefit |
|---------------|----------|-------------|
| 1. Mapping Service | OpenStreetMap with react-leaflet | No API costs, no .env files needed |
| 2. Email Service | Resend | Next.js native, generous free tier, simple config |
| 3. Form Validation | React Hook Form + Zod | TypeScript-first, performance, accessibility |
| 4. Content Storage | JSON with TypeScript interfaces | Type safety, Next.js native, simple editing |
| 5. Accessibility Testing | axe-core + jest-axe + Lighthouse CI | Comprehensive WCAG 2.1 AA coverage, CI/CD integration |
| 6. MCP Integration | Server-side with pooling & retry | Security, performance, reliability |
| 7. Bilingual i18n | Custom detection + react-i18next | Flexibility, RTL support, AI language detection |
| 8. Agentic AI Architecture | Router-Agent Pattern | Clear separation, governance, scalability |

## Updated Technical Context

All clarifications have been resolved. The updated technical context:

**Language/Version**: TypeScript 5.x with Next.js 14+ (App Router)
**Primary Dependencies**:
- Next.js (App Router)
- React 18+
- TailwindCSS 3.x
- shadcn/ui component library
- MCP server (for AI integration)
- **react-leaflet + leaflet** (OpenStreetMap)
- **Resend** (email service)
- **React Hook Form + Zod** (form validation)

**Storage**:
- **JSON files** for bilingual content (config/content/en/, config/content/ur/)
- Local configuration file (config/site-config.json)

**Testing**:
- Vitest or Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests
- **jest-axe** (component accessibility)
- **axe-core/playwright** (page accessibility)
- **Lighthouse CI** (continuous accessibility & performance)

**Target Platform**: Web (responsive: mobile < 768px, tablet 768-1024px, desktop > 1024px)

**Project Type**: Web application (Next.js App Router structure)

## Next Steps

Proceed to Phase 1 execution:
1. Generate `data-model.md` defining all 9 key entities
2. Create API contracts in `contracts/` directory
3. Write `quickstart.md` developer guide
4. Update agent context with new technology decisions
