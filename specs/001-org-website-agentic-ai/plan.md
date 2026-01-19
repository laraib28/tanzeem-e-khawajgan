# Implementation Plan: Organization Website with Agentic AI

**Branch**: `001-org-website-agentic-ai` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-org-website-agentic-ai/spec.md`

**Note**: This plan follows the phased implementation strategy provided by the user and expands it with technical details, architectural decisions, and research tasks.

## Summary

Build a professional organization website for Tanzeem-e-Khawajgan using Next.js (App Router) with an integrated Agentic AI system. The website will serve as the official digital presence with bilingual support (English/Urdu), featuring a governed AI assistant with 5 specialized sub-agents (Information, Navigation, Services, Policy, Action). Implementation follows a phased approach: Foundation → Navigation → Content Pages → Services → Contact → AI System → Quality Assurance, ensuring specification compliance and constitutional governance at each stage.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+ (App Router)
**Primary Dependencies**:
- Next.js (App Router)
- React 18+
- TailwindCSS 3.x
- shadcn/ui component library
- MCP server (for AI integration)
- [NEEDS CLARIFICATION: Mapping service - Google Maps or OpenStreetMap]
- [NEEDS CLARIFICATION: Email service for form submissions - Resend, SendGrid, or Nodemailer]
- [NEEDS CLARIFICATION: Form validation library - React Hook Form + Zod, or Formik]

**Storage**:
- Static JSON/YAML configuration files for content (no database)
- Local configuration file (no .env files per constitution)
- [NEEDS CLARIFICATION: Content storage format - JSON, YAML, or Markdown with frontmatter]

**Testing**:
- Vitest or Jest for unit tests
- React Testing Library for component tests
- Playwright or Cypress for E2E tests
- [NEEDS CLARIFICATION: Accessibility testing tool - axe-core, Pa11y, or Lighthouse CI]

**Target Platform**: Web (responsive: mobile < 768px, tablet 768-1024px, desktop > 1024px)

**Project Type**: Web application (Next.js App Router structure)

**Performance Goals**:
- Lighthouse score 90+ (mobile and desktop)
- First Contentful Paint < 1.8s
- Time to Interactive < 3.5s
- Cumulative Layout Shift < 0.1
- Support 1000 concurrent visitors without degradation

**Constraints**:
- WCAG 2.1 AA accessibility compliance (mandatory)
- No .env files (local config only per constitution)
- No hard-coded content (configuration-driven)
- TypeScript strict mode required
- Maximum 2 font families
- Bilingual support (English/Urdu) required

**Scale/Scope**:
- 13 pages total (Home, About, Contact, 3 Vision pages, 6 Service pages)
- 1 Agentic AI system with 5 sub-agents
- 9 key entities (Page, Service, Board Member, News Item, Event, AI Conversation, Form Submission, Impact Metric, Navigation Item)
- 64 functional requirements
- 17 success criteria

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitutional Compliance

✅ **Technology Stack**: Next.js (App Router), TailwindCSS, shadcn/ui - COMPLIANT
✅ **Configuration Management**: Local config file, no .env - COMPLIANT
✅ **TypeScript Strict Mode**: Required - COMPLIANT
✅ **Component Modularity**: Mandatory - COMPLIANT
✅ **No Hard-coded Content**: Configuration-driven - COMPLIANT
✅ **Accessibility**: WCAG 2.1 AA minimum - COMPLIANT
✅ **Performance**: Mobile-first, Lighthouse 90+ - COMPLIANT
✅ **AI Governance**: Agentic AI with sub-agents and permissions - COMPLIANT
✅ **Specification-Driven**: Following Constitution → Spec → Plan → Tasks → Implementation - COMPLIANT
✅ **Branding Standards**: Colors (#F9F5E8, #E88C30, #00715D), max 2 fonts - COMPLIANT

### Gates Status

| Gate | Status | Notes |
|------|--------|-------|
| Technology stack matches constitution | ✅ PASS | Next.js, TailwindCSS, shadcn/ui as required |
| No .env files | ✅ PASS | Using local configuration file |
| TypeScript strict mode | ✅ PASS | Required in tsconfig.json |
| No hard-coded content | ✅ PASS | Config-driven navigation and content |
| WCAG 2.1 AA compliance | ✅ PASS | Mandatory requirement in spec |
| AI governance rules | ✅ PASS | Agentic AI with Policy Agent enforcing boundaries |
| Specification-driven workflow | ✅ PASS | Following complete workflow |

**Re-check Required After Phase 1**: Verify data model and API contracts maintain constitutional compliance.

## Project Structure

### Documentation (this feature)

```text
specs/001-org-website-agentic-ai/
├── spec.md                          # Feature specification (completed)
├── plan.md                          # This file (/sp.plan output)
├── research.md                      # Phase 0 output (research findings)
├── data-model.md                    # Phase 1 output (entity models)
├── quickstart.md                    # Phase 1 output (developer guide)
├── contracts/                       # Phase 1 output (API contracts)
│   ├── forms-api.md                # Form submission contracts
│   └── ai-agent-contracts.md       # AI agent interfaces
├── checklists/
│   └── requirements.md              # Specification quality checklist (completed)
└── tasks.md                         # Phase 2 output (/sp.tasks - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Next.js App Router Structure (Web Application)

app/                                  # Next.js App Router pages
├── layout.tsx                       # Root layout (Navbar + Footer)
├── page.tsx                         # Home page
├── about/
│   └── page.tsx                    # About page
├── vision/
│   ├── mission/page.tsx            # Mission page
│   ├── board-of-members/page.tsx   # Board of Members page
│   └── news-events/page.tsx        # News & Events page
├── services/
│   ├── it/page.tsx                 # IT service page
│   ├── medical/page.tsx            # Medical service page
│   ├── education/page.tsx          # Education service page
│   ├── sports/page.tsx             # Sports service page
│   ├── banquets/page.tsx           # Banquets service page
│   └── graveyard/page.tsx          # Graveyard service page
├── contact/
│   └── page.tsx                    # Contact Us page
└── api/
    ├── forms/
    │   ├── feedback/route.ts       # Feedback form submission
    │   └── inquiry/route.ts        # IT inquiry form submission
    └── ai/
        └── chat/route.ts           # AI assistant endpoint

components/                          # Reusable React components
├── layout/
│   ├── Navbar.tsx                  # Navigation bar (config-driven)
│   └── Footer.tsx                  # Footer component
├── home/
│   ├── HeroSection.tsx             # Hero section
│   ├── IntroductionSection.tsx     # Introduction section
│   ├── ImageSection.tsx            # Image section
│   └── ImpactCounters.tsx          # Impact/counter section
├── cards/
│   ├── ServiceCard.tsx             # Service card component
│   ├── MemberCard.tsx              # Board member card
│   ├── NewsCard.tsx                # News item card
│   └── EventCard.tsx               # Event card
├── forms/
│   ├── FeedbackForm.tsx            # Contact feedback form
│   └── InquiryForm.tsx             # IT inquiry form
├── ai/
│   ├── ChatInterface.tsx           # AI chat interface
│   └── ChatMessage.tsx             # Chat message component
└── ui/                             # shadcn/ui components
    └── [generated by shadcn CLI]

lib/                                 # Utility libraries
├── config/
│   ├── navigation.ts               # Navigation configuration
│   ├── site.ts                     # Site-wide configuration
│   └── content.ts                  # Content configuration
├── ai/
│   ├── main-agent.ts               # Main Agent (Controller)
│   ├── agents/
│   │   ├── information-agent.ts    # Information Agent
│   │   ├── navigation-agent.ts     # Navigation Agent
│   │   ├── services-agent.ts       # Services Agent
│   │   ├── policy-agent.ts         # Policy Agent
│   │   └── action-agent.ts         # Action Agent
│   └── mcp-client.ts              # MCP server integration
├── forms/
│   ├── validation.ts               # Form validation schemas
│   └── submission.ts               # Form submission handlers
├── i18n/
│   ├── config.ts                   # i18n configuration
│   ├── en.ts                       # English translations
│   └── ur.ts                       # Urdu translations
└── utils/
    ├── cn.ts                       # Class name utility (from shadcn)
    └── formatting.ts               # Text/date formatting

public/                              # Static assets
├── images/
│   ├── logo.png                    # Organization logo
│   ├── hero/                       # Hero section images
│   ├── banners/                    # Page banner images
│   ├── members/                    # Board member photos
│   └── services/                   # Service images
└── fonts/                          # Custom fonts (max 2 families)

config/                              # Configuration files (no .env)
├── site-config.json                # Site-wide configuration
├── navigation.json                 # Navigation structure
├── content/
│   ├── en/                         # English content
│   │   ├── home.json
│   │   ├── about.json
│   │   ├── mission.json
│   │   ├── board-members.json
│   │   ├── news-events.json
│   │   ├── services.json
│   │   └── contact.json
│   └── ur/                         # Urdu content
│       └── [same structure as en/]
└── ai/
    ├── agent-config.json           # AI agent configuration
    └── knowledge-base.json         # AI knowledge base (website content)

tests/                               # Test suites
├── unit/
│   ├── components/                 # Component unit tests
│   ├── lib/                        # Library unit tests
│   └── ai/                         # AI agent unit tests
├── integration/
│   ├── forms/                      # Form integration tests
│   └── ai/                         # AI integration tests
└── e2e/
    ├── navigation.spec.ts          # Navigation E2E tests
    ├── forms.spec.ts               # Form submission E2E tests
    ├── accessibility.spec.ts       # Accessibility E2E tests
    └── ai.spec.ts                  # AI assistant E2E tests

.specify/                            # Spec-Kit Plus files
├── memory/
│   └── constitution.md             # Project constitution
├── templates/                      # Templates
└── scripts/                        # Automation scripts
```

**Structure Decision**: Next.js App Router structure (Option 2: Web application) selected because:
- Feature is a web application with frontend pages and API routes
- App Router provides file-system routing aligned with page requirements (13 pages)
- API routes colocated with frontend for form submissions and AI chat
- Server Components enable optimal performance for content-heavy pages
- Clear separation between pages (app/), components, libraries, and configuration

## Complexity Tracking

> No constitutional violations - all gates pass. This section intentionally left empty.

## Implementation Phases

### Phase 0: Research & Clarifications

**Goal**: Resolve all technical unknowns and establish architectural patterns before design phase.

**Prerequisites**: None (first phase)

**Research Tasks**:

1. **Mapping Service Selection**
   - **Question**: Should we use Google Maps or OpenStreetMap for the Contact page map?
   - **Research Focus**:
     - API pricing and usage limits
     - Integration complexity with Next.js
     - Compliance with organizational requirements
     - Embedding capabilities and customization
   - **Deliverable**: Recommended mapping service with rationale

2. **Email Service Selection**
   - **Question**: Which email service should handle form submissions (feedback, IT inquiry)?
   - **Options**: Resend, SendGrid, Nodemailer (with SMTP), AWS SES
   - **Research Focus**:
     - Free tier limits
     - Next.js integration patterns
     - Reliability and deliverability
     - Configuration without .env files (per constitution)
   - **Deliverable**: Recommended email service with integration approach

3. **Form Validation Library**
   - **Question**: Which validation approach best suits our needs?
   - **Options**: React Hook Form + Zod, Formik + Yup, custom validation
   - **Research Focus**:
     - TypeScript integration
     - Performance impact
     - Accessibility support
     - Bilingual error message support
   - **Deliverable**: Recommended validation library with schema examples

4. **Content Storage Format**
   - **Question**: How should bilingual content be stored in config files?
   - **Options**: JSON, YAML, Markdown with frontmatter, MDX
   - **Research Focus**:
     - Type safety with TypeScript
     - Ease of editing for content updates
     - i18n best practices
     - Next.js integration
   - **Deliverable**: Content structure format with sample files

5. **Accessibility Testing Approach**
   - **Question**: Which accessibility testing tools ensure WCAG 2.1 AA compliance?
   - **Options**: axe-core (with jest-axe), Pa11y, Lighthouse CI, combination approach
   - **Research Focus**:
     - Automated vs manual testing balance
     - CI/CD integration
     - Coverage of WCAG 2.1 AA criteria
     - Reporting and remediation workflow
   - **Deliverable**: Testing strategy with tool recommendations

6. **MCP Server Integration Patterns**
   - **Question**: What are the best practices for integrating MCP server with Next.js API routes?
   - **Research Focus**:
     - Connection management and pooling
     - Error handling and retry strategies
     - Bilingual support for AI responses
     - Session management for AI conversations
   - **Deliverable**: Integration architecture and code patterns

7. **Bilingual i18n Strategy**
   - **Question**: How to implement English/Urdu bilingual support with AI language detection?
   - **Research Focus**:
     - Language detection libraries (e.g., franc, langdetect)
     - Next.js i18n routing vs custom approach
     - RTL (Right-to-Left) layout for Urdu
     - Font selection for Urdu text rendering
   - **Deliverable**: i18n implementation strategy with language detection approach

8. **Agentic AI Architecture Patterns**
   - **Question**: What are the established patterns for multi-agent AI systems?
   - **Research Focus**:
     - Agent orchestration and routing patterns
     - Context preservation across sub-agents
     - Permission enforcement (Policy Agent)
     - Sub-agent communication protocols
   - **Deliverable**: Agentic AI architecture blueprint

**Output**: `research.md` with decisions, rationale, and alternatives for all 8 research tasks

---

### Phase 1: Technical Foundation & Project Setup

**Goal**: Establish the technical and structural foundation with running Next.js application and global layout.

**Prerequisites**: `research.md` complete with all clarifications resolved

**Activities**:

1. **Initialize Next.js Project**
   - Create Next.js 14+ project with TypeScript
   - Configure `tsconfig.json` with strict mode
   - Set up App Router structure
   - Install core dependencies: React, Next.js, TypeScript

2. **Configure TailwindCSS and Design System**
   - Install and configure TailwindCSS 3.x
   - Configure custom colors in `tailwind.config.ts`:
     - Background: `#F9F5E8`
     - Primary buttons: `#E88C30`
     - Accent/cards: `#00715D`
   - Set up maximum 2 font families
   - Configure responsive breakpoints (mobile < 768px, tablet 768-1024px, desktop > 1024px)

3. **Install and Configure shadcn/ui**
   - Initialize shadcn/ui CLI
   - Install base components needed for layout
   - Configure component theming with brand colors

4. **Create Global Layout**
   - Implement `app/layout.tsx` with Navbar + Footer structure
   - Apply global color system
   - Set up font loading
   - Add metadata for SEO

5. **Build Navbar Component (Configuration-Driven)**
   - Create `components/layout/Navbar.tsx`
   - Load navigation structure from `config/navigation.json`
   - Implement:
     - Logo positioned center
     - Navigation links center-left
     - "Ask With Me" AI link on right
     - Desktop dropdown menus for Vision and Services
     - Mobile accordion menu
     - Active link highlighting
   - Ensure responsive behavior

6. **Build Footer Component**
   - Create `components/layout/Footer.tsx`
   - Add organization information
   - Ensure consistent styling

7. **Create Local Configuration System**
   - Set up `config/` directory structure
   - Create `config/site-config.json` for site-wide settings
   - Create `config/navigation.json` for navigation structure
   - Document configuration format in `quickstart.md`
   - No .env files (per constitutional requirement)

8. **Set up i18n Infrastructure**
   - Implement bilingual support based on research findings
   - Create `lib/i18n/config.ts`
   - Create language files: `lib/i18n/en.ts` and `lib/i18n/ur.ts`
   - Implement language detection utility
   - Configure RTL support for Urdu

9. **Configure Development Environment**
   - Set up ESLint with TypeScript rules
   - Configure Prettier for code formatting
   - Set up Git hooks (if needed)
   - Create initial README.md

**Deliverables**:
- Running Next.js application accessible at `http://localhost:3000`
- Global layout (Navbar + Footer) applied and functional
- Configuration system established
- Design system integrated and ready
- Bilingual infrastructure in place
- `quickstart.md` with setup instructions

---

### Phase 2: Navigation System Enhancement

**Goal**: Complete the dynamic, scalable navigation system with full dropdown functionality and mobile responsiveness.

**Prerequisites**: Phase 1 complete (global layout exists)

**Activities**:

1. **Implement Vision Dropdown**
   - Add Vision menu with sub-links:
     - Mission (`/vision/mission`)
     - Board of Members (`/vision/board-of-members`)
     - News & Events (`/vision/news-events`)
   - Implement dropdown behavior for desktop
   - Implement accordion behavior for mobile

2. **Implement Services Dropdown**
   - Add Services menu with sub-links:
     - IT (`/services/it`)
     - Medical (`/services/medical`)
     - Education (`/services/education`)
     - Sports (`/services/sports`)
     - Banquets (`/services/banquets`)
     - Graveyard (`/services/graveyard`)
   - Implement dropdown behavior for desktop
   - Implement accordion behavior for mobile

3. **Implement Active Link Highlighting**
   - Use Next.js `usePathname()` hook
   - Apply active styles to current page link
   - Handle sub-menu active states

4. **Enhance Mobile Navigation**
   - Implement mobile menu toggle
   - Add accordion animations
   - Ensure touch targets meet 44x44px minimum
   - Test on various mobile screen sizes (down to 320px)

5. **Add Keyboard Navigation Support**
   - Implement keyboard navigation for dropdowns
   - Add ARIA attributes for accessibility
   - Test with screen readers

6. **Test Navigation Responsiveness**
   - Test on mobile (< 768px)
   - Test on tablet (768-1024px)
   - Test on desktop (> 1024px)
   - Verify sticky behavior (if specified)

**Deliverables**:
- Fully functional dynamic navigation
- Responsive behavior across all devices
- Accessibility-compliant navigation
- Configuration-driven navigation structure

---

### Phase 3: Home Page Implementation

**Goal**: Create a high-impact landing page aligned with branding and specification.

**Prerequisites**: Phase 2 complete (navigation functional)

**Activities**:

1. **Implement Hero Section**
   - Create `components/home/HeroSection.tsx`
   - Layout: Image on right, text on left
   - Add heading and supporting text from config
   - Implement "Donate Now" primary CTA button
   - Use primary button color (#E88C30)
   - Ensure responsive layout

2. **Build Introduction Section**
   - Create `components/home/IntroductionSection.tsx`
   - Load introduction content about Tanzeem-e-Khawajgan from config
   - Implement trust-building content layout
   - Ensure bilingual support

3. **Create Image Section**
   - Create `components/home/ImageSection.tsx`
   - Follow reference layout (from user-provided reference image)
   - Implement responsive image handling
   - Optimize images for performance

4. **Build Impact/Counter Section**
   - Create `components/home/ImpactCounters.tsx`
   - Display three counters:
     - Number of students receiving fee support
     - Number of people receiving medical support
     - Number of IT students
   - Use accent color (#00715D) for counters
   - Load counter values from config
   - Implement number animation (optional enhancement)

5. **Create Home Page**
   - Implement `app/page.tsx`
   - Compose all sections in order:
     1. Hero
     2. Introduction
     3. Image Section
     4. Impact Counters
     5. (Footer from global layout)

6. **Create Content Configuration**
   - Create `config/content/en/home.json` with English content
   - Create `config/content/ur/home.json` with Urdu content
   - Document content structure in `quickstart.md`

7. **Test Home Page**
   - Verify all sections render correctly
   - Test responsive behavior on all breakpoints
   - Verify bilingual content switching
   - Test "Donate Now" button link

**Deliverables**:
- Complete Home page with all 4 sections
- Responsive and visually aligned layout
- Bilingual content support
- Performance-optimized images

---

### Phase 4: About & Vision Pages

**Goal**: Present organizational identity, history, mission, leadership, and news clearly and professionally.

**Prerequisites**: Phase 3 complete (Home page functional)

**Activities**:

1. **Build About Page**
   - Create `app/about/page.tsx`
   - Add banner image component
   - Implement page title rendering
   - Create history timeline component
   - Implement chronological visual layout
   - Load content from `config/content/en/about.json` and `config/content/ur/about.json`

2. **Build Mission Page**
   - Create `app/vision/mission/page.tsx`
   - Add banner image component
   - Display mission statement
   - Display values and objectives
   - Use clear, simple language
   - Load content from `config/content/en/mission.json` and `config/content/ur/mission.json`

3. **Build Board of Members Page**
   - Create `app/vision/board-of-members/page.tsx`
   - Implement President section layout (image left, text right)
   - Create `components/cards/MemberCard.tsx` for committee members
   - Display Executive Committee cards (with image, name, designation)
   - Display Management Committee cards (with image, name)
   - Load content from `config/content/en/board-members.json` and `config/content/ur/board-members.json`

4. **Build News & Events Page**
   - Create `app/vision/news-events/page.tsx`
   - Create `components/cards/NewsCard.tsx` for news items
   - Create `components/cards/EventCard.tsx` for events
   - Implement date-based organization
   - Display news listings
   - Display event highlights
   - Load content from `config/content/en/news-events.json` and `config/content/ur/news-events.json`

5. **Create Reusable Banner Component**
   - Create `components/ui/Banner.tsx` for page banners
   - Support dynamic images and titles
   - Ensure responsive behavior

6. **Test Vision Section**
   - Verify all pages render correctly
   - Test navigation between Vision sub-pages
   - Verify bilingual content
   - Test responsive layouts

**Deliverables**:
- Fully navigable Vision section (4 pages)
- Structured governance presentation
- Reusable card and banner components
- Bilingual content for all pages

---

### Phase 5: Services Module

**Goal**: Deliver structured service pages with reusable components and consistent layouts.

**Prerequisites**: Phase 4 complete (Vision pages functional)

**Activities**:

1. **Create Service Card Component**
   - Create `components/cards/ServiceCard.tsx`
   - Support image, title, description
   - Use accent color (#00715D) for cards
   - Ensure responsive layout

2. **Build IT Service Page**
   - Create `app/services/it/page.tsx`
   - Add banner image
   - Add image + text section
   - Display course cards using ServiceCard component
   - Create `components/forms/InquiryForm.tsx` for IT inquiry
   - Add summer camp information section
   - Load content from `config/content/en/services.json` (IT section)

3. **Build Medical Service Page**
   - Create `app/services/medical/page.tsx`
   - Add banner image and description
   - Display medical service cards
   - Load content from config

4. **Build Education Service Page**
   - Create `app/services/education/page.tsx`
   - Add banner image and description
   - Display educational program cards
   - Load content from config

5. **Build Sports Service Page**
   - Create `app/services/sports/page.tsx`
   - Add banner image and description
   - Display sports facility cards
   - Load content from config

6. **Build Banquets Service Page**
   - Create `app/services/banquets/page.tsx`
   - Add banner image and description
   - Display event/hall cards
   - Load content from config

7. **Build Graveyard Service Page**
   - Create `app/services/graveyard/page.tsx`
   - Add banner image and description
   - Display service information
   - Add contact guidance
   - Load content from config

8. **Create IT Inquiry Form**
   - Implement form validation (based on research findings)
   - Add input sanitization (XSS prevention)
   - Implement bilingual field labels and error messages
   - Create API route: `app/api/forms/inquiry/route.ts`
   - Integrate email service (based on research)
   - Add form submission confirmation

9. **Test Services Module**
   - Verify all 6 service pages render correctly
   - Test IT inquiry form submission
   - Verify form validation (all fields)
   - Test bilingual content
   - Verify consistent card layouts

**Deliverables**:
- All 6 service pages live and functional
- Reusable service card component
- Functional IT inquiry form with validation
- Bilingual service content
- Email integration for form submissions

---

### Phase 6: Contact Page

**Goal**: Enable user communication through comprehensive contact information and functional feedback form.

**Prerequisites**: Phase 5 complete (Services module functional)

**Activities**:

1. **Build Contact Page Layout**
   - Create `app/contact/page.tsx`
   - Display organization address
   - Display phone number
   - Display email address
   - Ensure responsive layout

2. **Integrate Map Component**
   - Integrate mapping service (based on research decision)
   - Embed interactive map showing organization location
   - Handle map loading and errors gracefully
   - Ensure map is accessible (keyboard navigation, screen reader labels)

3. **Create Feedback Form**
   - Create `components/forms/FeedbackForm.tsx`
   - Add form fields (name, email, subject, message)
   - Implement validation (based on research findings)
   - Add input sanitization
   - Implement bilingual labels and error messages
   - Add CAPTCHA or anti-spam measure (if needed)

4. **Create Feedback API Route**
   - Create `app/api/forms/feedback/route.ts`
   - Implement form validation on server side
   - Integrate email service (based on research)
   - Add rate limiting to prevent spam
   - Return appropriate success/error responses

5. **Test Contact Page**
   - Verify all contact information displays correctly
   - Test map loading and interaction
   - Test feedback form validation (all fields)
   - Test form submission end-to-end
   - Verify confirmation message
   - Test bilingual content
   - Test error handling (network errors, validation errors)

**Deliverables**:
- Fully functional Contact Us page
- Interactive map display
- Working feedback form with validation and submission
- Email integration for feedback
- Bilingual contact page content

---

### Phase 7: Agentic AI System

**Goal**: Integrate a governed, bilingual, action-capable Agentic AI assistant with 5 specialized sub-agents.

**Prerequisites**: Phase 6 complete (all website pages functional)

**Activities**:

1. **Design Agentic AI Architecture**
   - Create `data-model.md` entity for AI Conversation
   - Create `contracts/ai-agent-contracts.md` defining:
     - Main Agent interface
     - Sub-agent interfaces (Information, Navigation, Services, Policy, Action)
     - Agent communication protocol
     - Permission boundaries
   - Document architecture in `quickstart.md`

2. **Implement Main Agent (Controller)**
   - Create `lib/ai/main-agent.ts`
   - Implement query routing logic:
     - Analyze user intent
     - Route to appropriate sub-agent
     - Maintain conversation context
     - Enforce governance rules
   - Implement language detection (English/Urdu)
   - Implement session management

3. **Implement Information Agent**
   - Create `lib/ai/agents/information-agent.ts`
   - Load knowledge base from `config/ai/knowledge-base.json`
   - Implement content-based question answering
   - Only use verified website content
   - Clearly state when information is unavailable
   - Support bilingual responses

4. **Implement Navigation Agent**
   - Create `lib/ai/agents/navigation-agent.ts`
   - Guide users to appropriate pages
   - Understand navigation requests in both languages
   - Provide page URLs and descriptions

5. **Implement Services Agent**
   - Create `lib/ai/agents/services-agent.ts`
   - Provide information about specific services (IT, Medical, Education, Sports, Banquets, Graveyard)
   - Handle service-specific queries
   - Direct users to relevant service pages

6. **Implement Policy Agent**
   - Create `lib/ai/agents/policy-agent.ts`
   - Enforce permission boundaries:
     - Reject legal advice requests
     - Reject medical advice requests
     - Reject personal opinion requests
   - Provide polite refusal messages with explanations
   - Log rejected requests (without user data)

7. **Implement Action Agent**
   - Create `lib/ai/agents/action-agent.ts`
   - Assist with form completion (IT inquiry, feedback)
   - Guide users through form fields
   - Validate form data before submission
   - Support bilingual form assistance

8. **Integrate MCP Server**
   - Create `lib/ai/mcp-client.ts`
   - Implement connection management (based on research)
   - Implement error handling and retry logic
   - Configure bilingual AI model support
   - Ensure no persistent storage of conversations (per constitution)

9. **Create AI Chat Interface**
   - Create `components/ai/ChatInterface.tsx`
   - Implement chat UI with message list
   - Add input field for user queries
   - Display AI responses with typing indicator
   - Support bilingual input and output
   - Handle loading and error states

10. **Create AI Chat Message Component**
    - Create `components/ai/ChatMessage.tsx`
    - Display user and AI messages
    - Support RTL layout for Urdu messages
    - Add timestamp display

11. **Create AI API Route**
    - Create `app/api/ai/chat/route.ts`
    - Receive user queries
    - Call Main Agent with query and context
    - Return AI response
    - Implement rate limiting
    - Add error handling

12. **Integrate "Ask With Me" Link**
    - Update Navbar to include "Ask With Me" link (positioned right)
    - Open AI chat interface when clicked
    - Implement modal or sidebar UI for chat

13. **Create AI Configuration**
    - Create `config/ai/agent-config.json` with:
      - Agent settings
      - Permission rules
      - Language settings
    - Create `config/ai/knowledge-base.json` with:
      - Website content for AI reference
      - Service information
      - FAQs (if applicable)

14. **Test AI System**
    - Test query routing (each sub-agent)
    - Test Information Agent with website content questions
    - Test Navigation Agent with navigation requests
    - Test Services Agent with service queries
    - Test Policy Agent with restricted requests (legal, medical, opinion)
    - Test Action Agent with form assistance
    - Test bilingual queries (English and Urdu)
    - Test mixed-language queries
    - Test conversation context preservation
    - Test error handling (MCP server errors, network issues)
    - Verify no persistent storage of conversations

**Deliverables**:
- Working Agentic AI assistant with 5 sub-agents
- Bilingual AI support (English/Urdu)
- Controlled action execution via Policy Agent
- AI chat interface integrated into website
- MCP server integration
- AI configuration and knowledge base

---

### Phase 8: Quality, Performance & Governance

**Goal**: Ensure production readiness, constitutional compliance, and specification satisfaction.

**Prerequisites**: Phase 7 complete (AI system integrated)

**Activities**:

1. **Cross-Page Testing**
   - Test navigation between all 13 pages
   - Verify consistent layout (Navbar + Footer) on all pages
   - Test all links and CTAs
   - Verify bilingual content on all pages

2. **Responsive Testing**
   - Test all pages on mobile (< 768px)
   - Test all pages on tablet (768-1024px)
   - Test all pages on desktop (> 1024px)
   - Test on very small screens (< 320px)
   - Verify touch targets are 44x44px minimum

3. **Accessibility Checks**
   - Run automated accessibility tests (based on research tool)
   - Test keyboard navigation on all pages
   - Test screen reader compatibility
   - Verify ARIA attributes
   - Check color contrast ratios (WCAG 2.1 AA)
   - Test form accessibility
   - Verify AI chat accessibility
   - Generate accessibility report

4. **Performance Optimization**
   - Run Lighthouse audits (mobile and desktop)
   - Optimize images (compression, lazy loading, modern formats)
   - Implement code splitting
   - Optimize font loading
   - Minimize bundle size
   - Implement caching strategies
   - Achieve target metrics:
     - Lighthouse score 90+
     - First Contentful Paint < 1.8s
     - Time to Interactive < 3.5s
     - Cumulative Layout Shift < 0.1

5. **Security Testing**
   - Test form input validation (XSS, injection attempts)
   - Verify input sanitization
   - Test rate limiting on forms and AI
   - Check for exposed secrets or credentials
   - Verify HTTPS enforcement
   - Test CAPTCHA or anti-spam measures

6. **Browser Compatibility Testing**
   - Test on latest Chrome, Firefox, Safari, Edge
   - Test graceful degradation on older browsers
   - Verify JavaScript-disabled fallback

7. **Load Testing**
   - Simulate 1000 concurrent visitors
   - Verify no performance degradation
   - Test AI system under load
   - Identify bottlenecks

8. **Constitution Compliance Review**
   - ✅ All pages follow defined navigation structure (FR-001 to FR-007)
   - ✅ All sections render responsively (FR-060)
   - ✅ Design colors applied consistently (FR-049 to FR-051)
   - ✅ Agentic AI operates within defined boundaries (FR-031 to FR-048)
   - ✅ No functionality outside specification
   - ✅ No .env files used
   - ✅ No hard-coded content
   - ✅ TypeScript strict mode enabled
   - ✅ Component modularity maintained
   - ✅ WCAG 2.1 AA compliance achieved

9. **Specification Satisfaction Review**
   - Verify all 64 functional requirements are met
   - Verify all 17 success criteria are achieved
   - Verify all 18 acceptance scenarios pass
   - Verify all 10 edge cases are handled
   - Document any deviations (none expected)

10. **Create Production Checklist**
    - Deployment readiness checklist
    - Configuration verification
    - Content verification (all bilingual content present)
    - Performance verification
    - Security verification
    - Accessibility verification

**Deliverables**:
- Production-ready website passing all quality gates
- Governance-compliant AI system
- Performance report (Lighthouse scores)
- Accessibility report (WCAG 2.1 AA compliance)
- Security audit results
- Constitution compliance verification
- Specification satisfaction verification

---

## Phase Dependencies

```text
Phase 0 (Research)
    ↓
Phase 1 (Foundation) → Data Model & Contracts
    ↓
Phase 2 (Navigation)
    ↓
Phase 3 (Home Page)
    ↓
Phase 4 (Vision Pages)
    ↓
Phase 5 (Services)
    ↓
Phase 6 (Contact)
    ↓
Phase 7 (AI System) ← Uses all previous pages for knowledge base
    ↓
Phase 8 (Quality & Governance)
```

**Critical Path**: Research → Foundation → Navigation → Content Pages → AI System → Quality

**Parallel Work Opportunities**:
- After Phase 2: Home, About, and Vision pages can be developed in parallel
- Services pages (Phase 5) can be developed in parallel after service card component is ready
- Testing activities (Phase 8) can begin incrementally after each phase

## Acceptance Criteria

This plan is considered complete and approved when:

✅ All 8 phases are clearly defined with goals, activities, and deliverables
✅ Dependencies between phases are explicit and sequential
✅ No phase violates approved specification or constitution
✅ All research clarifications (NEEDS CLARIFICATION) are resolved in Phase 0
✅ Technical context is complete with no unknowns
✅ Data model and API contracts defined in Phase 1
✅ Implementation can proceed without assumptions
✅ All constitutional gates pass
✅ All 64 functional requirements are addressed across phases
✅ All 17 success criteria are measurable in Phase 8

## Next Steps

After plan approval:

1. **Execute Phase 0**: Create `research.md` with findings for all 8 research tasks
2. **Execute Phase 1**: Generate `data-model.md`, `contracts/`, and `quickstart.md`
3. **Run** `/sp.tasks` to break down implementation phases into atomic, testable tasks
4. **Begin Implementation**: Follow task-driven development with TDD approach

## Notes

- This plan follows the user-provided 8-phase structure and expands it with technical details
- Bilingual support (English/Urdu) is integrated throughout all phases
- Agentic AI system is deferred to Phase 7 after all content pages are functional (provides knowledge base)
- Configuration-driven approach ensures no hard-coded content (constitutional requirement)
- Local config files (no .env) maintained throughout
- Accessibility and performance are continuous concerns, formalized in Phase 8
- Each phase builds incrementally on previous phases
- Clear separation between research, design, implementation, and quality assurance phases
