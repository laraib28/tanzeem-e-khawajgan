---
name: Membership Approval Gating - Number Assignment
description: Membership number is hidden/blocked until admin approves the form; auto-assigned on approval
type: general
stage: green
date: 2026-06-26
surface: agent
model: claude-sonnet-4-6
feature: membership
branch: main
user: laraib-adnan
command: chat
labels: ["membership", "approval", "backend", "access-control"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/main.py
  - app/membership-form/page.tsx
  - app/member-lookup/page.tsx
tests: []
---

## Prompt

jab tak memnership form approve na ho jaye no nhi dya jayega
aur jab membership form fill ho jaye aur jan no approve ho ga to show krna

## Response

Implemented membership number gating:

**Backend (`backend/main.py`)**:
- `POST /submit-membership`: Force `membership_no=None` on all new submissions — number never assigned at form time
- `GET /lookup-member` → `format_member()`: Returns `membership_no=None` unless `approval_status == "approved"`
- `POST /approve-member/{id}`: New endpoint — approves member, auto-generates `TK-XXXXX` sequential number, sets `membership_issued_date = today`

**Frontend (`app/membership-form/page.tsx`)**:
- Replaced editable membership number input with read-only info box: "Will be assigned after approval"
- Removed `membership_no` from form submit payload

**Frontend (`app/member-lookup/page.tsx`)**:
- `approved` + has number → shows `# TK-XXXXX`
- `pending` → shows "Membership number will be issued after approval" (yellow)
- `rejected` → shows "Application rejected — no membership number assigned" (red)
