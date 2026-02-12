# Task List: Post-Launch Validation

**Parent:** Follows `tasks-launch-preparation.md` (Phase 5 → archive → PR → merge)
**Created:** 2026-02-12
**Branch:** `main` (no feature branch — operational follow-up after launch preparation merge)
**Status:** Not Started

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

### **Phase 1:** Domain Configuration

- [ ] **1.1 Register and configure domains**

    **Note:** Domain registration, DNS configuration, and domain transfers are manual tasks
    performed outside the codebase. Subtasks here track the operational steps.

    - [ ] **1.1.a Register new domains**
        - `andrewcreekmore.dev` (primary)
        - `andrewrcr.dev` and `andrewrcr.com` (handle-based, easier to share verbally)
        - Register at chosen registrar (Cloudflare, Namecheap, etc.)
        - Configure DNS for all three to point to Vercel

    - [ ] **1.1.b Transfer `andrewcreekmore.com` from Squarespace**
        - Initiate transfer to same registrar as `.dev` domains
        - Configure DNS to point to Vercel
        - **Note:** Domain transfers can take 5–7 days; do not block other tasks on this

    - [ ] **1.1.c Add all domains to Vercel project**
        - Set `andrewcreekmore.dev` as primary domain
        - Add `andrewcreekmore.com`, `andrewrcr.dev`, `andrewrcr.com` as aliases
          (Vercel auto-308 redirects to primary)
        - Verify SSL certificates provisioned for all domains
        - **DNS gotchas:**
            - If using Cloudflare: DNS records must be "DNS Only" (gray cloud), NOT proxied
              (orange cloud) — Cloudflare proxy breaks Vercel's Let's Encrypt SSL validation
            - If any CAA records exist on the domain: add `0 issue "letsencrypt.org"` or SSL
              generation will silently fail
            - DNS propagation can take up to 48 hours (usually under 1 hour in practice)

    - [ ] **1.1.d Verify domains resolve correctly**
        - `https://andrewcreekmore.dev` loads the site
        - `https://andrewcreekmore.com` redirects (308) to `.dev`
        - `https://andrewrcr.dev` and `https://andrewrcr.com` redirect (308) to `.dev`
        - SSL certificates valid for all domains (no browser warnings)

- [ ] **1.2 Update live site references**

    - [ ] **1.2.a Update `liveDemo` link in project data**
        - `src/data/projects.ts` → `arc-portfolio` entry → `links.liveDemo` is currently
          `undefined`
        - Set to final production URL

    - [ ] **1.2.b Update README with live site URL**
        - Replace placeholder (if used during Phase 5) with actual production URL

    - [ ] **1.2.c Run quality gates and commit**
        - Type-check, lint, format, build, tests
        - Commit directly to `main`

### **Phase 2:** Production Validation

- [ ] **2.1 Lighthouse baseline audit**

    **Goal:** Verify META-PRD target of 90+ across all four Lighthouse categories.

    - [ ] **2.1.a Run Lighthouse against production deployment**
        - Test key pages: Home, Projects, a project detail, Skills, About, Contact
        - Record scores: Performance, Accessibility, Best Practices, SEO
        - Document baseline in completion doc

    - [ ] **2.1.b Address any scores below 90**
        - Investigate and fix issues if any category falls below target
        - Commit fixes directly to `main` (atomic fixes)
        - Re-run until all four categories meet 90+ threshold

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
