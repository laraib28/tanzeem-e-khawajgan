---
name: Pending Membership Number Message
description: Show "Membership number will be issued after approval — Pending" for members without a number
type: general
stage: green
date: 2026-07-06
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: laraib-adnan
labels: ["membership", "ui", "member-lookup"]
---

## Prompt

jin ko member ship no h us ko thore bolnas h ye Membership number will be issued after approval pending

## Response

Updated `app/member-lookup/page.tsx` member card header to show:

> "Membership number will be issued after approval — **PENDING**"

for any member who has no `membership_no` and is not rejected (covers both explicit `pending` status and cases where status is not set).

## Files Modified

 - app/member-lookup/page.tsx
