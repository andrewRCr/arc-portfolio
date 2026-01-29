# Technical Backlog

**Purpose:** Organized collection of technical work ideas and plans - infrastructure, tooling,
modernization, and quality improvements.

**Processing:** Items move here from `TASK-INBOX.md` during weekly review. When ready to work on an item,
create a PRD/plan in `.arc/active/technical/` and begin the standard workflow.

---

## High Priority

### Vercel KV Database Setup (Deployment Prerequisite)

**Trigger:** During initial Vercel deployment

**Context:** Contact form rate limiting uses Vercel KV for distributed state across serverless functions.
Code is implemented in `src/app/api/contact/route.ts` with graceful fallback to in-memory for local dev.

**Required setup:**

1. Create KV database in Vercel dashboard (Project Settings → Storage → Create Database → KV)
2. Link to project (automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars)
3. Verify rate limiting works in production (submit 6+ rapid requests, expect 429 on 6th)

**Cost:** Free tier includes 30K requests/month - more than sufficient for portfolio traffic.

**Why tracked:** Serverless functions are stateless; in-memory rate limiting doesn't persist across
invocations. KV provides distributed state that actually works in production.

**Origin:** Contact form implementation - Task 5.3 - `tasks-content-polish-p2.md` (2026-01-21)

---

### NexusMods API App Registration (Deployment Prerequisite)

**Trigger:** Shortly before or immediately after initial deployment (once GitHub is public)

**Context:** NexusMods API integration (download counts) requires app registration per their acceptable
use policy. Contacted NexusMods support who confirmed current usage is compliant and provided
registration requirements.

**Required for registration:**

1. Application name
2. Short description
3. Logo suitable for viewing on dark backgrounds
4. GitHub repository link (must be public)

**Notes:**

- Can optionally provide live site link if registering post-deployment
- Registration is compliance-oriented, not blocking for functionality (API works without registration)
- NexusMods may reach out if they notice unregistered high-volume usage

**Why tracked:** Policy compliance for the NexusMods API integration implemented in Content Polish P1.
Registration ensures continued API access and establishes good standing with the platform.

**Origin:** NexusMods support correspondence (2026-01-29)

---

## Medium Priority

### Lighthouse Performance & Accessibility Baseline

**Trigger:** Pre-deployment (part of SEO & Analytics work unit)

**Context:** TWM Layout System deferred Lighthouse testing (Performance ≥90, Accessibility ≥95) to this
phase. Current test coverage validates functionality and WCAG AA compliance, but doesn't measure
Core Web Vitals (LCP, FID, CLS) or full Lighthouse scores.

**Proposed work:**

- Run Lighthouse CI against production build
- Establish baseline scores for Performance, Accessibility, Best Practices, SEO
- Document Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1)
- Consider integrating Lighthouse CI into GitHub Actions for regression detection

**Why deferred:** Static Next.js portfolio with optimized images should perform well by default.
Existing E2E tests, vitest-axe, and design review provide adequate quality assurance pre-deployment.
Lighthouse adds value for ongoing monitoring, not blocking initial deployment.

**Origin:** TWM Layout System feature completion (2026-01-05)

---

## Lower Priority / Ideas

### Semantic Status Tokens (Success/Warning/Info)

**Trigger:** When app needs success, warning, or info status indicators

**Context:** Design system has `destructive` + `destructive-foreground` as a WCAG-compliant semantic
pair, but lacks equivalent tokens for success/warning/info states. Current accent colors
(accent-green, accent-orange, accent-blue) are decorative only - not validated for text contrast.

**Proposed tokens:**

- `success` + `success-foreground` (green-based, WCAG AA compliant)
- `warning` + `warning-foreground` (orange/yellow-based, WCAG AA compliant)
- `info` + `info-foreground` (blue-based, WCAG AA compliant)

**Why deferred:** No current app need. Add when building features requiring semantic status feedback.

**Origin:** CodeRabbit PR #2 review (2025-12-30)

---
