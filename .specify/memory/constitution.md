# Tanzeem-e-Khawajgan Organization Website Constitution

## Project Purpose

The purpose of this project is to design and develop a professional, modern, and AI-enabled organization website that serves as the official digital presence of Tanzeem-e-Khawajgan.

The website will:
- Communicate the organization's vision, mission, and services
- Provide transparent governance and public information
- Enable structured navigation across all departments
- Integrate an Agentic AI system for guided assistance and actions
- Be scalable, maintainable, and specification-driven

This project is not a static website; it is an AI-assisted, rule-governed software system.

## Core Principles

### I. Accuracy
All content must reflect verified and approved organizational information. No assumptions, placeholders, or unverified data may be published.

### II. Clarity
Content and UI must be understandable to a general public audience. Technical jargon should be avoided in user-facing content.

### III. Consistency
Design, navigation, and behavior must remain uniform across all pages. Pattern deviations require explicit specification.

### IV. Maintainability
The system must be modular and spec-driven for future growth. Hard-coded values, navigation, or content violate this principle.

### V. AI Governance
AI behavior must be controlled, explainable, and bounded by rules. The AI system is an Agentic AI, not a generic chatbot, with defined sub-agents and clear permissions.

### VI. Specification-Driven Development
All features must follow the workflow: Constitution → Specification → Plan → Tasks → Implementation. No feature may be implemented without an approved specification.

## Scope Definition

### In Scope
The website includes the following primary sections:

**Core Pages:**
- Home
- About
- Contact Us

**Vision Section:**
- Mission
- Board of Members
- News & Events

**Services Section:**
- IT (courses, inquiry form, summer camp)
- Medical (medical services)
- Education (educational programs)
- Sports (facilities and programs)
- Banquets (hall and event information)
- Graveyard (service description)

**AI System:**
- Agentic AI Assistant with sub-agents (Information, Navigation, Services, Policy, Action)

### Out of Scope
Any feature or behavior outside the defined scope requires a new approved specification. This includes:
- E-commerce functionality
- User authentication/login systems
- Content management system
- Blog or dynamic content authoring
- Third-party integrations not explicitly specified

### External Dependencies
- Next.js framework
- TailwindCSS
- shadcn/ui components
- MCP server (provided via context)

## Technical Standards

### Technology Stack
**Frontend:**
- Next.js (App Router)
- TailwindCSS
- shadcn/ui

**Backend:**
- Next.js API Routes
- MCP server provided via context

**Configuration:**
- Local configuration file (copy-paste friendly)
- NO `.env` files for secrets
- All configuration must be documented

**Specification System:**
- Spec-Kit Plus
- Workflow: Constitution → Specification → Plan → Tasks → Implementation

### Code Quality
- TypeScript strict mode required
- Component modularity mandatory
- No hard-coded content (use configuration)
- Clear separation of concerns
- Comprehensive error handling

### Testing Requirements
- Component testing for all UI components
- Integration testing for AI agent system
- E2E testing for critical user flows
- Accessibility testing compliance

### Performance Standards
- Mobile-first and responsive design
- Lighthouse score: 90+ on all metrics
- First Contentful Paint < 1.8s
- Time to Interactive < 3.5s
- Cumulative Layout Shift < 0.1

### Security Requirements
- No persistent storage of user conversations
- No tracking without explicit approval
- Secure API access
- No exposed credentials
- Input validation on all forms
- HTTPS enforcement

## Branding & Design Standards

### Color Palette
- **Background**: `#F9F5E8`
- **Primary Buttons**: `#E88C30`
- **Accent / Cards**: `#00715D`

### Design Rules
- Clean and professional aesthetic
- Organization-first (no decorative excess)
- Mobile-first and responsive
- Accessibility compliance (WCAG 2.1 AA minimum)
- Typography limited to maximum of two font families
- Animations must be subtle and performance-safe

### Visual Hierarchy
- Consistent heading sizes (H1-H6)
- Clear visual distinction between sections
- Sufficient contrast ratios
- Readable line lengths and spacing

## Global Layout Standards

### Layout Rules
- Navbar and Footer must appear on all pages
- Layout consistency across the site is mandatory
- Responsive breakpoints: mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)
- Minimum touch target size: 44x44px

### Typography
- Maximum two font families
- Clear hierarchy (H1 > H2 > H3 > body)
- Readable line-height (1.5-1.7)
- Sufficient color contrast

### Components
- Reusable component library
- Props validation required
- Accessibility attributes mandatory
- Responsive by default

## Navigation Constitution

### Navigation Structure
The navigation system must be dynamic and configuration-driven.

**Navbar Layout:**
- Logo positioned at center
- Navigation links placed center-left
- AI access link placed on right ("Ask With Me")

**Primary Navigation:**
```
Home
About

Vision
 ├─ Mission
 ├─ Board of Members
 └─ News & Events

Services
 ├─ IT
 ├─ Medical
 ├─ Education
 ├─ Sports
 ├─ Banquets
 └─ Graveyard

Contact Us
```

### Navigation Rules
- **Desktop**: Dropdown menus for multi-level navigation
- **Mobile**: Accordion menu
- **Active Link**: Highlighting mandatory
- **Hard-coded Navigation**: Not allowed (must use configuration)
- **Accessibility**: Keyboard navigation support required

## Page-Specific Standards

### Home Page
**Required Elements:**
- Hero section (image right, text left)
- "Donate Now" primary CTA
- Introduction to Khawajgan
- Image-led informational sections
- Impact counters (education, medical, IT)
- Footer

### About Page
**Required Elements:**
- Banner image
- Page title
- Organizational history timeline

### Mission Page
**Required Elements:**
- Banner image
- Mission statement
- Values and objectives

### Board of Members Page
**Required Elements:**
- President section (image left, text right)
- Executive committee cards
- Management committee cards

### News & Events Page
**Required Elements:**
- News listings
- Event highlights
- Date-based organization

### Services Pages
**All Service Pages Must Include:**
- Banner image
- Clear service description
- Cards where applicable

**Service-Specific Requirements:**

**IT:**
- Courses listing
- Inquiry form
- Summer camp information

**Medical:**
- Medical services cards

**Education:**
- Educational program cards

**Sports:**
- Sports facilities and programs

**Banquets:**
- Hall and event cards

**Graveyard:**
- Service description
- Contact guidance

### Contact Page
**Required Elements:**
- Physical address
- Phone number
- Email
- Map location
- Feedback form

## Agentic AI System Constitution

### Architecture
The AI system must be implemented as an **Agentic AI**, not a generic chatbot.

**Main Agent (Controller):**
- Routes requests to appropriate sub-agents
- Maintains conversation context
- Enforces governance rules

**Sub-Agents:**
1. **Information Agent**: Answers questions based on website content
2. **Navigation Agent**: Guides users through navigation
3. **Services Agent**: Handles service-specific queries
4. **Policy Agent**: Ensures compliance with governance rules
5. **Action Agent**: Performs approved actions (forms, inquiries)

### AI Capabilities
**The AI Agent Must:**
- Answer questions based on website content only
- Guide users through navigation
- Perform approved actions (forms, inquiries)
- Reject unapproved requests with clear explanation
- Use professional and neutral language
- Rely only on verified content
- State clearly when information is unavailable

**The AI Agent Must Not:**
- Provide personal opinions
- Give legal, medical, or financial advice
- Act outside defined permissions
- Make assumptions or hallucinations
- Store conversations persistently
- Access unauthorized data

### AI Behavior Standards
**Language & Tone:**
- Professional and neutral
- Clear and concise
- Culturally appropriate
- Empathetic but bounded

**Error Handling:**
- Clear fallback messages
- Graceful degradation
- Error logging (no user data)

**Permissions:**
- Read-only access to website content
- Form submission (with validation)
- Navigation assistance
- No data modification
- No external API calls without approval

## Development Workflow

### Specification-Driven Process
1. **Constitution**: Establish project principles (this document)
2. **Specification**: Define feature requirements (`specs/<feature>/spec.md`)
3. **Plan**: Create architecture and design (`specs/<feature>/plan.md`)
4. **Tasks**: Break down into testable tasks (`specs/<feature>/tasks.md`)
5. **Implementation**: Execute with tests
6. **Documentation**: Create PHRs and ADRs

### Prompt History Records (PHR)
**Routing (all under `history/prompts/`):**
- Constitution → `history/prompts/constitution/`
- Feature-specific → `history/prompts/<feature-name>/`
- General → `history/prompts/general/`

**PHR Creation Required For:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

### Architecture Decision Records (ADR)
**ADR Significance Test:**
- **Impact**: Long-term consequences? (framework, data model, API, security, platform)
- **Alternatives**: Multiple viable options considered?
- **Scope**: Cross-cutting and influences system design?

If ALL true, suggest:
```
📋 Architectural decision detected: [brief-description]
   Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`
```

**ADR Guidelines:**
- Wait for consent; never auto-create ADRs
- Group related decisions into one ADR when appropriate
- Store in `history/adr/`

## Constraints & Non-Negotiables

### Technical Constraints
- No WordPress or CMS shortcuts
- No uncontrolled AI interaction
- No hard-coded secrets
- No undocumented features
- No persistent storage of user conversations
- No `.env` files

### Process Constraints
- All features require approved specifications
- No feature exists outside this constitution
- Changes to constitution require explicit approval
- All code must be specification-driven

### Quality Gates
- All tests must pass before merge
- Accessibility compliance mandatory
- Performance budgets enforced
- Security review for AI features

## Success Criteria

The project is considered successful when:

✅ All pages follow the defined navigation structure
✅ All content aligns with organizational approval
✅ Agentic AI follows governance rules
✅ No functionality exists outside the constitution
✅ The system is spec-complete and reproducible
✅ Performance standards met (Lighthouse 90+)
✅ Accessibility compliance (WCAG 2.1 AA)
✅ Security requirements satisfied
✅ All documentation complete (PHRs, ADRs)

## Governance

This constitution is the **highest authority** for this project.

### Governance Rules
- All PRs/reviews must verify compliance with this constitution
- Any implementation that violates this document is considered invalid until re-specified
- Amendments require documentation, approval, and migration plan
- Complexity must be justified and documented
- All architectural decisions must be recorded in ADRs

### Compliance
- Constitution supersedes all other practices
- Violations must be corrected before merge
- Exceptions require explicit documentation and approval

### Amendment Process
1. Propose change with rationale
2. Document impact on existing specifications
3. Obtain approval
4. Update constitution
5. Create migration plan if needed
6. Update all dependent artifacts

**Version**: 1.0.0 | **Ratified**: 2025-12-21 | **Last Amended**: 2025-12-21
