---
id: 0001
title: Add Membership Form Feature
stage: green
date: 2026-01-20
surface: agent
model: claude-opus-4-5-20251101
feature: membership-form
branch: main
user: user
command: direct-request
labels: ["membership", "form", "feature", "navbar"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - config/navigation.json
  - app/membership-form/page.tsx
tests:
  - N/A (UI component)
---

## Prompt

Add a Membership Form feature to an existing Next.js App Router project.

PART 1 – NAVBAR
- Add a new navbar link labeled "Membership Form"
- Route must be /membership-form
- Preserve existing navbar structure and styles
- Use Next.js Link
- If shadcn/ui navigation is used, follow the same pattern

PART 2 – MEMBERSHIP FORM
Create page: app/membership-form/page.tsx

Use:
- "use client"
- Next.js App Router
- shadcn/ui components
- Controlled form with useState

FORM STRUCTURE:
- Organization heading: Tanzeem-e-Khawajgan
- Organization address
- Logo placeholder
- Title: Membership Form
- Applicant photo placeholder

FIELDS:
- Membership Number
- Gender (Radio: Male, Female)
- Full Name
- Son of / Wife of / Daughter of
- Father-in-Law Name
- CNIC
- Country (ALL countries dropdown)
- City (Bhera, Miani, Pind Dadan Khan)
- Date of Birth (calendar)
- Cast (Roar, Wohra, Sethi, Mehta, Sehgal, Dogal, Kapoor, Other)
- Source of Income (dropdown)
- Education (dropdown)
- Occupation (dropdown)
- Profession
- Number of Dependents
- Relationship with Dependents

OFFICE USE ONLY:
- Form Received Date
- Verified By
- Verification Remarks
- Approval Status
- Membership Issued Date
- Official Signature
- Office Stamp / Seal

## Response snapshot

Implemented the Membership Form feature with two parts:

1. **Navbar Update**: Added "Membership Form" link to `config/navigation.json` with route `/membership-form`

2. **Membership Form Page**: Created `app/membership-form/page.tsx` with:
   - Client-side form using useState for controlled inputs
   - Organization header with logo and applicant photo placeholders
   - All applicant fields: Membership Number, Gender (radio), Full Name, Relationship Type (Son of/Wife of/Daughter of), Father-in-Law Name, CNIC, Country (all 195 countries), City (Bhera/Miani/Pind Dadan Khan), Date of Birth (calendar), Cast (8 options + Other), Source of Income, Education, Occupation, Profession, Number of Dependents, Relationship with Dependents
   - Office Use Only section: Form Received Date, Verified By, Verification Remarks, Approval Status, Membership Issued Date, Official Signature area, Office Stamp/Seal area
   - Consistent styling with existing project patterns using Tailwind CSS

## Outcome

- ✅ Impact: Added complete membership form feature with navbar link and form page
- 🧪 Tests: N/A (UI component, manual testing recommended)
- 📁 Files: 2 files modified/created (navigation.json, membership-form/page.tsx)
- 🔁 Next prompts: Form validation, API endpoint for form submission, database integration
- 🧠 Reflection: Followed existing project patterns for navigation and form styling

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add form validation with Zod and React Hook Form
