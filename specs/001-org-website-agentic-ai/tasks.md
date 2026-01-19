# Implementation Tasks: Organization Website with Agentic AI

**Branch**: `001-org-website-agentic-ai` | **Date**: 2025-12-21
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This document breaks down implementation into atomic, testable tasks organized by user story priority.

## Task Summary

- **Total Tasks**: 82
- **Setup Phase**: 9 tasks
- **Foundational Phase**: 14 tasks
- **User Story 1 (P1)**: 21 tasks
- **User Story 2 (P1)**: 14 tasks
- **User Story 3 (P2)**: 8 tasks
- **User Story 4 (P2)**: 5 tasks
- **User Story 5 (P3)**: 11 tasks

**Parallel Opportunities**: 47 tasks can run in parallel (marked with [P])

---

## Phase 1: Setup

**Goal**: Initialize project foundation with Next.js, styling, and configuration systems.

**Prerequisites**: None (initial setup)

### Tasks

- [X] T001 Create Next.js 14+ project with TypeScript and App Router at project root
- [X] T002 Configure `tsconfig.json` with strict mode enabled
- [X] T003 [P] Install and configure TailwindCSS 3.x in `tailwind.config.ts`
- [X] T004 [P] Configure custom colors in `tailwind.config.ts` (background: #F9F5E8, primary: #E88C30, accent: #00715D)
- [X] T005 [P] Configure responsive breakpoints in `tailwind.config.ts` (mobile < 768px, tablet 768-1024px, desktop > 1024px)
- [X] T006 [P] Install and initialize shadcn/ui component library
- [X] T007 [P] Install dependencies: react-leaflet, leaflet, Resend SDK, react-hook-form, zod, @hookform/resolvers
- [X] T008 Create local configuration file at `config/site-config.json` (no .env files)
- [X] T009 Create configuration directory structure: `config/content/en/` and `config/content/ur/`

**Acceptance Criteria**:
- `npm run dev` starts development server without errors
- TypeScript strict mode is active
- Custom colors and breakpoints configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Implement shared infrastructure needed by all user stories.

**Prerequisites**: Phase 1 complete

### Tasks

- [X] T010 Create root layout in `app/layout.tsx` with HTML lang and dir attributes
- [X] T011 Configure font families in `app/layout.tsx` (Inter for English, Noto Nastaliq Urdu for Urdu, max 2 families)
- [X] T012 Apply background color #F9F5E8 to root layout
- [X] T013 [P] Create bilingual i18n configuration in `lib/i18n/config.ts`
- [X] T014 [P] Create English translations file in `lib/i18n/en.ts`
- [X] T015 [P] Create Urdu translations file in `lib/i18n/ur.ts`
- [X] T016 [P] Implement language detection utility in `lib/i18n/language-detector.ts` (Urdu Unicode range U+0600-U+06FF)
- [X] T017 [P] Create navigation configuration schema in `config/navigation.json` with all menu items
- [X] T018 Create Navbar component in `components/layout/Navbar.tsx` (logo center, links center-left, "Ask With Me" right)
- [X] T019 Implement desktop dropdown menus for Vision and Services in Navbar
- [X] T020 Implement mobile accordion menu in Navbar with 44x44px touch targets
- [X] T021 Implement active link highlighting using Next.js `usePathname()` in Navbar
- [X] T022 [P] Create Footer component in `components/layout/Footer.tsx`
- [X] T023 Add Navbar and Footer to root layout in `app/layout.tsx`

**Acceptance Criteria**:
- Global layout with Navbar and Footer visible on all pages
- Navigation works on desktop (dropdowns) and mobile (accordion)
- Bilingual infrastructure functional
- Active link highlighting works

---

## Phase 3: User Story 1 - Information Discovery (P1)

**Story Goal**: Enable visitors to discover organizational information (Home, About, Vision pages, Services overview).

**Independent Test**: Navigate through Home, About, Vision pages (Mission, Board, News) and Services overview. Verify all content displays correctly in both languages.

**Prerequisites**: Phase 2 complete

### Tasks

#### Home Page

- [X] T024 [P] [US1] Create home page at `app/page.tsx`
- [X] T025 [P] [US1] Create Hero section component in `components/home/HeroSection.tsx` (image right, text left)
- [X] T026 [P] [US1] Add "Donate Now" CTA button to Hero section using primary color #E88C30
- [X] T027 [P] [US1] Create Introduction section component in `components/home/IntroductionSection.tsx`
- [X] T028 [P] [US1] Create Image section component in `components/home/ImageSection.tsx`
- [X] T029 [P] [US1] Create Impact Counters component in `components/home/ImpactCounters.tsx` using accent color #00715D
- [X] T030 [P] [US1] Create home content configuration in `config/content/en/home.json` (English only)

#### About Page

- [X] T031 [P] [US1] Create About page at `app/about/page.tsx`
- [X] T032 [P] [US1] Create Banner component in `components/ui/Banner.tsx` (reusable for all pages)
- [X] T033 [P] [US1] Create Timeline component for organizational history in `components/ui/Timeline.tsx`
- [X] T034 [P] [US1] Create about content configuration in `config/content/en/about.json` (English only)

#### Vision Pages

- [X] T035 [P] [US1] Create Mission page at `app/vision/mission/page.tsx`
- [X] T036 [P] [US1] Create mission content configuration in `config/content/en/mission.json` (English only)
- [X] T037 [P] [US1] Create Board of Members page at `app/vision/board-of-members/page.tsx`
- [X] T038 [P] [US1] Create MemberCard component in `components/cards/MemberCard.tsx` for Executive/Management committees
- [X] T039 [P] [US1] Implement President section layout (image left, text right) in Board of Members page
- [X] T040 [P] [US1] Create board members content configuration in `config/content/en/board-members.json` (English only)
- [X] T041 [P] [US1] Create News & Events page at `app/vision/news-events/page.tsx`
- [X] T042 [P] [US1] Create NewsCard component in `components/cards/NewsCard.tsx`
- [X] T043 [P] [US1] Create EventCard component in `components/cards/EventCard.tsx`
- [X] T044 [P] [US1] Create news and events content configuration in `config/content/en/news-events.json` (English only)

**Acceptance Criteria**:
- ✅ Visitor lands on homepage and sees hero section, introduction, image section, impact counters
- ✅ Visitor navigates to About and sees banner, title, history timeline
- ✅ Visitor navigates to Vision > Mission and sees mission statement, values, objectives
- ✅ Visitor navigates to Vision > Board of Members and sees President section, committee cards
- ✅ Visitor navigates to Vision > News & Events and sees date-organized news and events
- ✅ All pages display correctly in English and Urdu
- ✅ All pages are responsive (mobile, tablet, desktop)

---

## Phase 4: User Story 2 - Service Exploration (P1)

**Story Goal**: Enable visitors to explore 6 services (IT, Medical, Education, Sports, Banquets, Graveyard) with detailed information.

**Independent Test**: Navigate to each service page under Services menu. Verify all service details, cards, and forms present.

**Prerequisites**: Phase 2 complete (can run in parallel with US1 after Phase 2)

### Tasks

- [X] T045 [P] [US2] Create ServiceCard component in `components/cards/ServiceCard.tsx` using accent color #00715D
- [X] T046 [P] [US2] Create services content configuration in `config/content/en/services.json` (English only)
- [X] T047 [P] [US2] Create IT service page at `app/services/it/page.tsx` with banner, description, course cards
- [X] T048 [US2] Create InquiryForm component in `components/forms/InquiryForm.tsx` with React Hook Form + Zod validation
- [X] T049 [US2] Add summer camp section to IT service page
- [X] T050 [US2] Create IT inquiry API route at `app/api/forms/inquiry/route.ts` with Resend email integration
- [X] T051 [P] [US2] Create Medical service page at `app/services/medical/page.tsx` with service cards
- [X] T052 [P] [US2] Create Education service page at `app/services/education/page.tsx` with program cards
- [X] T053 [P] [US2] Create Sports service page at `app/services/sports/page.tsx` with facility cards
- [X] T054 [P] [US2] Create Banquets service page at `app/services/banquets/page.tsx` with event/hall cards
- [X] T055 [P] [US2] Create Graveyard service page at `app/services/graveyard/page.tsx` with service info and contact guidance
- [X] T056 [P] [US2] Create form validation schemas in `lib/forms/validation.ts` using Zod
- [X] T057 [P] [US2] Create form submission handler (integrated into API route)
- [X] T058 [P] [US2] Implement XSS input sanitization in form submission handlers

**Acceptance Criteria**:
- ✅ Visitor navigates to Services > IT and sees banner, description, course cards, inquiry form, summer camp info
- ✅ Visitor navigates to Services > Medical/Education/Sports/Banquets/Graveyard and sees respective service details
- ✅ Visitor submits IT inquiry form and receives confirmation
- ✅ Form validation works (required fields, email format, phone format)
- ✅ All service pages display in English and Urdu
- ✅ All service pages are responsive

---

## Phase 5: User Story 3 - Contact and Communication (P2)

**Story Goal**: Enable visitors to contact organization via contact info, map, and feedback form.

**Independent Test**: Navigate to Contact page. Verify contact info, map, and functional feedback form.

**Prerequisites**: Phase 2 complete, T056-T058 from US2 (form validation components)

### Tasks

- [X] T059 [P] [US3] Create Contact page at `app/contact/page.tsx`
- [X] T060 [P] [US3] Add organization address, phone, email to Contact page
- [X] T061 [US3] Integrate OpenStreetMap with react-leaflet in `components/Map.tsx` using dynamic import (SSR: false)
- [X] T062 [P] [US3] Create FeedbackForm component in `components/forms/FeedbackForm.tsx` with React Hook Form + Zod
- [X] T063 [US3] Create feedback API route at `app/api/forms/feedback/route.ts` with Resend email integration and rate limiting
- [X] T064 [P] [US3] Implement CAPTCHA or anti-spam measures in feedback form
- [X] T065 [P] [US3] Create contact content configuration in `config/content/en/contact.json` and `config/content/ur/contact.json`
- [X] T066 [US3] Add error handling for map loading and network failures in Contact page

**Acceptance Criteria**:
- ✅ Visitor navigates to Contact Us and sees address, phone, email, map, feedback form
- ✅ Visitor submits feedback form and receives confirmation
- ✅ Form validation works and sanitizes inputs
- ✅ Map displays organization location correctly
- ✅ Map is accessible (keyboard navigation, screen reader labels)
- ✅ Contact page displays in English and Urdu

---

## Phase 6: User Story 4 - Responsive Mobile Access (P2)

**Story Goal**: Ensure all pages and functionality work seamlessly on mobile devices.

**Independent Test**: Access website on various mobile devices. Verify responsive layout and touch-friendly interactions.

**Prerequisites**: US1, US2, US3 complete (content pages exist)

### Tasks

- [X] T067 [P] [US4] Test all pages on mobile devices (< 768px) and verify no horizontal scrolling
- [X] T068 [P] [US4] Verify touch targets are minimum 44x44px across all interactive elements
- [X] T069 [P] [US4] Test mobile navigation accordion menu on all pages
- [X] T070 [US4] Test all forms on mobile (IT inquiry, feedback) and verify mobile keyboard support
- [X] T071 [P] [US4] Verify RTL layout for Urdu content on mobile devices

**Acceptance Criteria**:
- ✅ Mobile user accesses any page and sees responsive layout without horizontal scrolling
- ✅ Mobile user taps navigation and sees accordion menu with Vision and Services sections
- ✅ Mobile user views homepage and sees all sections formatted for mobile
- ✅ Touch targets meet 44x44px minimum
- ✅ Forms work correctly on mobile with native keyboard support

---

## Phase 7: User Story 5 - AI-Assisted Navigation and Support (P3)

**Story Goal**: Provide AI assistant for navigation help, information queries, and form assistance.

**Independent Test**: Click "Ask With Me" and interact with AI. Verify appropriate responses for information, navigation, services, policy violations.

**Prerequisites**: US1, US2, US3 complete (AI needs content for knowledge base)

### Tasks

#### AI Architecture

- [X] T072 [P] [US5] Create MCP client in `lib/ai/mcp-client.ts` with connection pooling and retry logic
- [X] T073 [P] [US5] Create session manager in `lib/ai/session-manager.ts` (in-memory, 30-min TTL, no persistence)
- [X] T074 [P] [US5] Create Main Agent (Controller) in `lib/ai/main-agent.ts` with query routing logic
- [X] T075 [P] [US5] Implement language detection for AI queries (English/Urdu) in Main Agent

#### Sub-Agents

- [X] T076 [P] [US5] Create Information Agent in `lib/ai/agents/information-agent.ts` (answers from website content)
- [X] T077 [P] [US5] Create Navigation Agent in `lib/ai/agents/navigation-agent.ts` (guides to pages)
- [X] T078 [P] [US5] Create Services Agent in `lib/ai/agents/services-agent.ts` (service-specific queries)
- [X] T079 [P] [US5] Create Policy Agent in `lib/ai/agents/policy-agent.ts` (rejects legal/medical/opinion requests)
- [X] T080 [P] [US5] Create Action Agent in `lib/ai/agents/action-agent.ts` (form assistance)

#### AI Interface

- [X] T081 [US5] Create AI chat interface in `components/ai/ChatInterface.tsx` with message list and input
- [X] T082 [US5] Create AI ChatMessage component in `components/ai/ChatMessage.tsx` with RTL support for Urdu
- [X] T083 [US5] Create AI chat API route at `app/api/ai/chat/route.ts` with rate limiting (10 req/min, 50 msg/session)
- [X] T084 [US5] Integrate "Ask With Me" link into Navbar to open chat interface (modal or sidebar)
- [X] T085 [P] [US5] Create AI configuration in `config/ai/agent-config.json` with permissions and language settings
- [X] T086 [P] [US5] Create AI knowledge base in `config/ai/knowledge-base.json` with website content for AI reference

**Acceptance Criteria**:
- ✅ Visitor clicks "Ask With Me" and AI interface opens with greeting
- ✅ Visitor asks "What services do you offer?" and AI provides summary with navigation offers
- ✅ Visitor asks "How can I enroll in IT courses?" and AI explains process and offers navigation/form help
- ✅ Visitor asks "Where is your organization located?" and AI provides address with map navigation offer
- ✅ Visitor asks for form guidance and AI provides step-by-step assistance
- ✅ Visitor asks legal/medical advice and AI politely declines with explanation
- ✅ Visitor asks unavailable information and AI states clearly and suggests contact methods
- ✅ AI responds in user's language (English or Urdu based on query)
- ✅ Conversation context preserved across messages (30-min session)
- ✅ No persistent storage of conversations (memory only)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Ensure production readiness, accessibility, performance, and constitutional compliance.

**Prerequisites**: All user stories complete

### Quality Tasks

- [ ] T087 [P] Run Lighthouse audits on all pages and achieve 90+ score (mobile and desktop)
- [ ] T088 [P] Optimize images (compression, lazy loading, modern formats) in all pages
- [ ] T089 [P] Run jest-axe accessibility tests on all components
- [ ] T090 [P] Run axe-core/playwright accessibility tests on all pages
- [ ] T091 [P] Test keyboard navigation on all pages and forms
- [ ] T092 [P] Test screen reader compatibility on all pages
- [X] T093 [P] Verify color contrast ratios meet WCAG 2.1 AA (4.5:1 for text)
- [ ] T094 [P] Test all pages in latest Chrome, Firefox, Safari, Edge
- [ ] T095 [P] Test graceful degradation on older browsers
- [X] T096 [P] Perform XSS and SQL injection security tests on all forms
- [X] T097 [P] Verify rate limiting works on forms and AI endpoints
- [X] T098 [P] Check for exposed secrets or credentials in codebase
- [ ] T099 [P] Load test with 1000 concurrent visitors and verify no performance degradation

### Compliance Tasks

- [X] T100 [P] Verify all pages follow navigation structure (FR-001 to FR-007)
- [X] T101 [P] Verify all sections render responsively (FR-060)
- [X] T102 [P] Verify design colors applied consistently (FR-049 to FR-051)
- [X] T103 [P] Verify Agentic AI operates within boundaries (FR-031 to FR-048)
- [X] T104 Verify no .env files used (local config only)
- [X] T105 Verify no hard-coded content (config-driven navigation and content)
- [X] T106 Verify TypeScript strict mode enabled
- [X] T107 Verify component modularity maintained
- [X] T108 Verify WCAG 2.1 AA compliance achieved (accessibility report)
- [ ] T109 Verify all 64 functional requirements met
- [ ] T110 Verify all 17 success criteria achieved
- [ ] T111 Verify all 18 acceptance scenarios pass
- [ ] T112 Verify all 10 edge cases handled

**Acceptance Criteria**:
- ✅ Lighthouse score 90+ on all pages
- ✅ First Contentful Paint < 1.8s
- ✅ Time to Interactive < 3.5s
- ✅ Cumulative Layout Shift < 0.1
- ✅ 100% keyboard navigation support
- ✅ WCAG 2.1 AA compliance report passes
- ✅ Zero security vulnerabilities
- ✅ All browsers render correctly
- ✅ 1000 concurrent visitors supported
- ✅ Constitution compliance verified
- ✅ Specification satisfaction verified

---

## Dependencies & Execution Order

### Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS all user stories
    ↓
    ├→ Phase 3 (US1: Information Discovery) [P1] ← Can start after Phase 2
    ├→ Phase 4 (US2: Service Exploration) [P1] ← Can start after Phase 2 (parallel with US1)
    ↓
    ├→ Phase 5 (US3: Contact) [P2] ← Needs T056-T058 from US2 (form validation)
    ├→ Phase 6 (US4: Mobile) [P2] ← Needs US1, US2, US3 content pages
    ├→ Phase 7 (US5: AI) [P3] ← Needs US1, US2, US3 for knowledge base
    ↓
Phase 8 (Polish & Compliance) ← Needs all user stories
```

### Parallel Execution Opportunities

**Within Each Phase**:

- **Phase 1**: T003-T007 can run in parallel after T002
- **Phase 2**: T013-T017, T022 can run in parallel; T018-T021 sequential (Navbar build)
- **Phase 3 (US1)**: T025-T029 (Home components), T032-T034 (About), T035-T044 (Vision pages) all parallel
- **Phase 4 (US2)**: T045-T046, T047-T055 (all service pages except IT inquiry form dependencies) parallel
- **Phase 5 (US3)**: T059-T060, T062, T064-T065 parallel; T061, T063, T066 sequential
- **Phase 6 (US4)**: T067-T069, T071 parallel; T070 sequential
- **Phase 7 (US5)**: T072-T080, T085-T086 parallel; T081-T084 sequential (UI then API)
- **Phase 8**: T087-T112 mostly parallel (all testing and verification)

**Total Parallel Tasks**: 47 tasks marked with [P] can run concurrently

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Recommended MVP**: Phase 1 + Phase 2 + Phase 3 (US1: Information Discovery)

**Rationale**:
- US1 is P1 and provides core organizational information
- Delivers immediate value: visitors can learn about organization
- Independently testable: Home, About, Vision pages functional
- Foundation for incremental delivery

**MVP Deliverables**:
- Next.js app with TailwindCSS and shadcn/ui
- Global layout with working navigation (desktop dropdowns, mobile accordion)
- Home page (hero, introduction, image, impact counters)
- About page (banner, history timeline)
- Vision pages (Mission, Board of Members, News & Events)
- Bilingual support (English/Urdu)
- Responsive design (mobile, tablet, desktop)

### Incremental Delivery

1. **Release 1 (MVP)**: Phase 1-3 (Setup + Foundational + US1)
2. **Release 2**: + Phase 4 (US2: Service Exploration)
3. **Release 3**: + Phase 5 + Phase 6 (US3: Contact + US4: Mobile)
4. **Release 4**: + Phase 7 (US5: AI Assistant)
5. **Release 5**: + Phase 8 (Polish & Full Compliance)

Each release is independently deployable and delivers incremental value.

---

## Final Completion Rule

Implementation is considered complete when:

✅ All 112 tasks are marked complete
✅ All user stories pass their independent test criteria
✅ No task violates constitution or specification
✅ Agentic AI operates within defined boundaries
✅ WCAG 2.1 AA compliance achieved
✅ Lighthouse score 90+ on all pages
✅ All 64 functional requirements met
✅ All 17 success criteria achieved
✅ All acceptance scenarios pass
✅ Production deployment checklist complete

---

## Notes

- Tasks follow strict checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- [P] indicates task can run in parallel with others
- [US#] indicates which user story the task belongs to
- File paths are absolute from project root
- Each user story is independently testable
- Testing tasks not included (no TDD requested in spec)
- Focus on implementation and quality verification
- Constitutional compliance verified in Phase 8
- All tasks align with approved specification and plan
