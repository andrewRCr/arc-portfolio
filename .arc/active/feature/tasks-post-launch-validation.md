# Task List: Post-Launch Validation

**Parent:** Follows `tasks-launch-preparation.md` (Phase 5 → archive → PR → merge)
**Created:** 2026-02-12
**Branch:** `main` (no feature branch — operational follow-up after launch preparation merge)
**Status:** In Progress

## Overview

**Purpose:** Complete deployment validation and domain configuration after the launch
preparation branch merges to `main`. The merge triggers a production deployment on Vercel;
this task list covers everything that requires a live production deployment to validate or
configure.

**Prerequisites:**

- `feature/launch-preparation` merged to `main` via PR
- Vercel production deployment live at `.vercel.app` URL
- Environment variables and Upstash Redis configured (done in Phase 5 of launch preparation)

**Note on commits:** Any code fixes discovered during validation (Lighthouse issues, smoke
test bugs) are committed directly to `main` as atomic fixes. Domain and NexusMods tasks are
manual/dashboard work with no code changes.

---

## Tasks

### **Phase 0:** PR Preview Validation

**When:** During PR review, before merging `feature/launch-preparation` to `main`.
Vercel auto-generates a preview deployment when the PR is opened.

- [x] **0.1 Validate preview deployment**

    Validated on Vercel PR preview during `feature/launch-preparation` PR #9 review.

    - [x] Contact form submits successfully (email received)
    - [x] Rate limiting returns 429 on 6th rapid request
    - [x] Dev pages (`/dev/*`) return 404 (production gating via `NODE_ENV`)
    - [x] Custom 404 and error pages render (not Vercel/Next.js defaults)
    - [x] All public pages load; theme and wallpaper toggles persist
    - [x] View page source: meta tags, OG tags, canonical URLs present
    - [x] Sitemap at `/sitemap.xml`, robots.txt at `/robots.txt`

### **Phase 1:** Domain Configuration

- [ ] **1.1 Register and configure domains**

    **Note:** Domain registration, DNS configuration, and domain transfers are manual tasks
    performed outside the codebase. Subtasks here track the operational steps.

    - [x] **1.1.a Register new domains**
        - Registered at Cloudflare: `andrewcreekmore.dev` (primary),
          `andrewrcr.dev`, `andrewrcr.com`
        - Configured DNS (A + CNAME) for all three pointing to Vercel
        - Added anti-spoofing TXT records (SPF `-all`, DMARC `p=reject`)

    - [ ] **1.1.b Transfer `andrewcreekmore.com` from Squarespace**
        - Transfer unlocked and auth code requested at Squarespace
        - **Waiting:** Auth code delivery (up to 24 hours)
        - Once received, initiate transfer at Cloudflare
        - **Note:** Domain transfers can take 5–7 days; do not block other tasks on this

    - [x] **1.1.c Add all domains to Vercel project**
        - `andrewcreekmore.dev` set as primary domain
        - `www` subdomains and `andrewrcr.dev`/`.com` (+ their `www`) configured
          as 308 redirects to primary
        - SSL certificates provisioned and verified for all domains
        - No CAA records present (verified via Google DNS) — no SSL blockers
        - Cloudflare DNS set to "DNS Only" (gray cloud) per Vercel requirements

    - [x] **1.1.d Verify domains resolve correctly**
        - `https://andrewcreekmore.dev` → 200 (loads site)
        - `https://www.andrewcreekmore.dev` → 308 to apex
        - `https://andrewrcr.dev` → 308 to `andrewcreekmore.dev`
        - `https://www.andrewrcr.dev` → 308 to `andrewcreekmore.dev`
        - `https://andrewrcr.com` → 308 to `andrewcreekmore.dev`
        - `https://www.andrewrcr.com` → 308 to `andrewcreekmore.dev`
        - SSL valid on all domains
        - **Remaining:** `andrewcreekmore.com` pending transfer (Task 1.1.b)

- [x] **1.2 Configure Zeptomail sender domain and verify contact form**

    - [x] **1.2.a Add `andrewcreekmore.dev` as verified sender domain in Zeptomail**
        - Added domain, configured DKIM (TXT) and bounce CNAME at Cloudflare
        - Both records verified in Zeptomail dashboard
    - [x] **1.2.b Update `CONTACT_EMAIL_FROM` env var in Vercel if needed**
        - Verified existing config matches Zeptomail sender address
    - [x] **1.2.c Test contact form end-to-end on production**
        - Contact form submission → email received
        - 6 rapid POST requests → 429 on 6th (rate limiting confirmed)
    - [x] **1.2.d Mark deferred Phase 0 subtasks complete**
        - Phase 0.1 contact form and rate limiting items checked off

- [x] **1.3 Update live site references**

    - [x] **1.3.a Update `liveDemo` link in project data**
        - Set `src/data/projects.ts` arc-portfolio `links.liveDemo` to
          `https://andrewcreekmore.dev`
    - [x] **1.3.b Update README with live site URL**
        - Already had correct URL (`andrewcreekmore.dev`) — no change needed
    - [x] **1.3.c Run quality gates and commit**
        - Type-check, lint, format, tests pass; committed to `main`

### **Phase 2:** Production Validation

- [x] **2.1 Lighthouse baseline audit**

    **Goal:** Verify META-PRD target of 90+ across all four Lighthouse categories.

    - [x] **2.1.a Run Lighthouse against production deployment**

        Ran Lighthouse CLI (v12.8.2) via Playwright Chromium, mobile strategy,
        against production (`andrewcreekmore.dev`). Six pages tested.

        **Baseline scores (mobile):**

        | Page               | Perf | A11y | BP  | SEO |
        |--------------------|------|------|-----|-----|
        | Home `/`           | 62   | 100  | 100 | 100 |
        | Projects           | 76   | 100  | 100 | 100 |
        | Project Detail     | 77   | 100  | 100 | 100 |
        | Skills             | 54   | 100  | 100 | 100 |
        | About              | 79   | 100  | 100 | 100 |
        | Contact            | 77   | 100  | 100 | 100 |

        **A11y, Best Practices, SEO: 100 across all pages — target met.**

        **Performance below 90 on all pages.** Root causes:

        - **LCP (all pages):** "andrewRCr" text span is LCP element on every page.
          Intro animation intentionally holds content at `opacity: 0` during
          sequence, causing 5–17s render delay. This is a design tradeoff, not a
          bug — the intro is polished, intentional UX.
        - **Home/Skills worse** (62/54 vs 76–79): Heavier JS evaluation
          (`scriptParseCompile` 463–548ms) plus Hero h1 gated by later animation
          phase (`contentVisible` vs `windowVisible`).
        - **Wallpaper image oversized on mobile:** 1920w image served for 412px
          viewport (only 1920w and 2560w variants exist). ~280KB waste.
        - **Unused JS:** ~83KB across two chunks on all pages.

        **Assessment:** 90+ Performance on mobile is not achievable without
        compromising the intro animation design. LCP score is dominated by
        intentional animation delay. Genuine performance improvements (mobile
        wallpaper variants, JS reduction, TBT) are worth pursuing regardless.
        Recommend updating META-PRD target to acknowledge the animation tradeoff.

    - [x] **2.1.b Address scores below 90**

        Two workstreams addressed genuine performance issues identified in 2.1.a:

        **Workstream A** (committed `0aeabb5`): Build-time simple-icons extraction.
        Eliminated ~5MB client JS bundle by extracting 36 used icons at build time
        instead of importing all 3,384. Addressed unused JS (~83KB) and Home/Skills
        TBT (~400-500ms `scriptParseCompile`).

        **Workstream B**: Mobile wallpaper variants (1280w) via Sharp script.
        40 variants generated, avg 146KB (down from 282KB, ~48% reduction).
        Added 3-point srcSet (`1280w, 1920w, 2560w`) to `WallpaperBackground`
        and preload link. Mobile devices now download ~135KB less per wallpaper.

        Files created: `scripts/generate-wallpaper-mobile.ts`,
        `public/wallpaper/optimized-mobile/` (40 WebP files, 5.7MB total).
        Files modified: `types.ts` (`srcMobile`), `index.ts` (36 entries),
        `WallpaperContext.tsx`, `WallpaperBackground.tsx`, `LayoutWrapper.tsx`,
        `layout.tsx` (preload), `package.json`.

        **Re-run Lighthouse**: Requires push + deploy to measure production impact.
        LCP still dominated by intentional intro animation (design tradeoff).

- [ ] **2.2 Production smoke test**

    - [ ] **2.2.a Verify all public pages load**
        - Home, Projects, Skills, About, Contact, project detail pages
        - Test on desktop and mobile viewports

    - [ ] **2.2.b Verify functionality**
        - Contact form submits successfully (email received)
        - Rate limiting works (429 on excessive requests)
        - Theme toggle persists across sessions
        - Wallpaper selection persists
        - Navigation and page transitions work smoothly

    - [ ] **2.2.c Verify SEO implementation**
        - View page source — meta tags, OG tags, canonical URLs present
        - Test social preview with LinkedIn/Twitter sharing debugger tools
        - Verify sitemap accessible at `/sitemap.xml`
        - Verify robots.txt accessible at `/robots.txt`

    - [ ] **2.2.d Verify production gating**
        - Navigate to `/dev/sandbox`, `/dev/typography`, etc. — all return 404
        - Verify custom 404 page displays (not Vercel default)

    - [ ] **2.2.e Verify error handling**
        - Custom 404 page displays for non-existent routes
        - Error boundary renders for runtime errors (if testable)

### **Phase 3:** External Registration

- [ ] **3.1 NexusMods API app registration**

    **Note:** Compliance task, not code. Requires public GitHub repo and live site — both
    should be in place by this point.

    - [ ] **3.1.a Submit NexusMods app registration**
        - Application name
        - Short description
        - Logo (suitable for dark backgrounds)
        - GitHub repository URL (public)
        - Live site URL

---

## Success Criteria

- [ ] Site live and accessible at `andrewcreekmore.dev`
- [ ] All secondary domains redirect (308) to primary `.dev` domain
- [ ] SSL certificates valid for all domains
- [ ] Lighthouse 90+ across Performance, Accessibility, Best Practices, SEO
- [ ] Contact form delivers email in production
- [ ] Rate limiting returns 429 on excessive requests in production
- [ ] All public pages load on desktop and mobile
- [ ] Theme and wallpaper preferences persist across sessions
- [ ] SEO artifacts verified (meta tags, OG tags, sitemap, robots.txt, social previews)
- [ ] Dev pages return 404 in production
- [ ] Custom error pages display correctly
- [ ] NexusMods API registration submitted
- [ ] Project data and README updated with live site URL
