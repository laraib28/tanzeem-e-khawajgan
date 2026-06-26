---
id: "0005"
title: UI Improvements Fonts Sections Footer
stage: general
date: 2026-06-24
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: laraibadnan297@gmail.com
command: implement UI improvements
labels: ["ui", "fonts", "next/font", "tailwind", "components"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - app/layout.tsx
  - app/globals.css
  - components/home/IntroductionSection.tsx
  - components/home/ProgramsSection.tsx
  - components/home/ImpactCounters.tsx
  - components/layout/Footer.tsx
tests:
  - none
---

## Prompt

You are implementing UI improvements for a Next.js 14 app for "Tanzeem-e-Khawajgan" - a Pakistani Islamic community organization. The design uses: background #F9F5E8 (warm cream), primary #E88C30 (orange), accent #00715D (teal). Tailwind CSS is used. No tailwindcss-animate plugin. Font setup is broken (uses a fake inter object).

Here are the specific changes to make:

1. Fix layout.tsx — proper Next.js font loading (Inter + Playfair_Display from next/font/google)
2. Update globals.css — add font-display utility in @layer utilities
3. Redesign IntroductionSection — label pill, font-display heading, decorative divider, teal check cards
4. Redesign ProgramsSection cards — color gradients, ArrowRight CTA, font-display headings, bg-[#F2EDD9]
5. Improve ImpactCounters — add icons (Users, Heart, Clock, Layers), decorative circles, "Numbers That Matter" heading
6. Improve Footer — add Donate CTA strip, logo image, 4-column grid, DonateModal integration

## Response snapshot

All 6 files were updated as specified:

- `app/layout.tsx`: Replaced fake inter object with proper `Inter` and `Playfair_Display` imports from `next/font/google`. Both font CSS variables are now injected via `body` className.
- `app/globals.css`: Added `@layer utilities { .font-display { font-family: var(--font-display), Georgia, serif; } }` after the existing `@layer base` block.
- `components/home/IntroductionSection.tsx`: Complete rewrite — label pill ("Who We Are"), font-display heading, decorative orange divider, teal-bordered highlight cards with filled circle checkmarks.
- `components/home/ProgramsSection.tsx`: Complete rewrite — per-card gradient color overlays, ArrowRight "Learn More" link, font-display card titles, section background changed to `#F2EDD9`.
- `components/home/ImpactCounters.tsx`: Complete rewrite — Lucide icons (Users, Heart, Clock, Layers) per counter, decorative white/5 circles, "Our Impact" pill + "Numbers That Matter" h2, bordered cards with scale-on-hover icons.
- `components/layout/Footer.tsx`: Complete rewrite — primary-colored Donate CTA strip with DonateModal integration, logo image, 4-column grid (logo+desc, quick links, contact), social icons condensed inline with copyright row.

## Outcome

- Impact: Six UI components improved with consistent design system (font-display, color tokens, spacing, interactive states)
- Tests: none run — visual/UI changes only
- Files: 6 files modified
- Next prompts: verify build compiles, check logo-khawajgan.png exists in public/, test DonateModal opens from footer
- Reflection: All changes were strictly scoped to the specified files with no unrelated edits

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): verify next build passes with next/font imports
