# Task List: Launch Preparation

**PRD:** `.arc/active/feature/prd-launch-preparation.md`
**Created:** 2026-02-06
**Branch:** `feature/launch-preparation`
**Base Branch:** `main`
**Status:** In Progress

## Overview

**Purpose:** Consolidate all remaining pre-deployment work into a single work unit — dev
infrastructure, content polish, SEO, custom error pages, and deployment to Vercel with
dual-domain configuration.

## Scope

### Will Do

- Dev page production gating via `NODE_ENV`
- In-development badge on `ProjectDetail` pages
- Feature flag system cleanup for future extensibility
- Surface-tuning sandbox extraction to `/dev/surface`
- Project content copy pass (descriptions, features → highlights merge, type cleanup)
- Custom 404, error boundary, and global error pages (TWM-themed)
- Per-page metadata for all public routes
- Dynamic metadata (`generateMetadata`) for project detail routes
- Open Graph tags with project hero images
- Sitemap and robots.txt route handlers
- Favicon creation and configuration
- JSON-LD structured data (Person, BreadcrumbList)
- Canonical URLs
- Vercel deployment with GitHub integration
- Vercel KV database for contact form rate limiting
- Dual-domain setup (`andrewcreekmore.dev` primary, `.com` redirect)
- Lighthouse baseline validation (90+ all categories)
- NexusMods API app registration

### Won't Do

- Blog/CMS functionality (deferred post-v1.0; flag infrastructure supports future addition)
- Resume/CV download (portfolio is the primary artifact)
- Vercel Analytics integration (trivial post-launch addition)
- Lighthouse CI in GitHub Actions (establish baseline manually first)
- Performance optimization beyond meeting Lighthouse targets
- Semantic status tokens (single contact form doesn't justify token system)

---

## Tasks

### **Phase 1:** Infrastructure & Dev Tooling

- [x] **1.1 Gate dev pages from production**

    **Goal:** Prevent `/dev/*` routes from being accessible in production builds.

    - [x] **1.1.a Create `src/app/dev/layout.tsx` with `NODE_ENV` guard**
        - Created layout with `notFound()` call when `NODE_ENV === "production"`
        - Wraps children in fragment (no extra markup)

    - [x] **1.1.b Verify dev pages still accessible in development**
        - All four dev pages return HTTP 200: `/dev/sandbox`, `/dev/theme-debug`,
          `/dev/typography`, `/dev/wallpaper-test`

- [x] **1.2 Add in-development badge to project detail pages**

    **Goal:** Consistent in-development badge across all project views.

    - [x] **1.2.a Write test for in-development badge on `DetailHeader`**
        - 3 tests added: renders when `status === "in-development"`, hidden when
          `status === "released"`, hidden when undefined

    - [x] **1.2.b Extract shared `InDevelopmentBadge` component + implement in `DetailHeader`**
        - Created `src/components/projects/InDevelopmentBadge.tsx` with `compact` prop
          (default: "In Development" full-size; compact: "In Dev" smaller)
        - Added `status` to `DetailHeaderProps`, threaded through Desktop + Mobile
        - Badge overlaid on hero image (bottom-right), matching `ProjectCard` pattern
        - Refactored `ProjectCard` and `FeaturedSection` to use shared component
        - All 3 detail pages (`software`, `games`, `mods`) pass `status` prop
        - 4 unit tests for badge component, 3 new tests for DetailHeader integration

    - [x] **1.2.c Run quality gates (type-check, lint, related tests)**
        - Type-check, lint, 27 tests pass (4 badge + 23 DetailHeader)

- [x] **1.3 Reframe and harden feature flag for non-software project visibility**

    **Goal:** Reframe `SHOW_PROJECT_TABS` as `SHOW_ALL_PROJECT_TYPES` — a clean
    switch between full portfolio (software + games + mods with tabs) and
    software-only mode. Close existing gaps so the flag-off state is coherent:
    filter UI stays available but scoped to software, all non-software routes
    return 404, no data leaks through direct URLs.

    - [x] **1.3.a Rename flag + update JSDoc in `features.ts`**
        - Renamed `SHOW_PROJECT_TABS` → `SHOW_ALL_PROJECT_TYPES` in `features.ts`
        - Updated JSDoc to describe semantic (controls non-software project
          visibility across tabs, routes, and filter data)
        - Added pattern comment block (define flag → import → guard)
        - Updated all existing import sites (`projects/page.tsx`,
          `mods/[slug]/page.tsx`); games route has no import yet (added in 1.3.c)

    - [x] **1.3.b Decouple filter UI from tabs + gate data source by flag**
        - Extracted filter UI (SkillFilterControl, FilterIndicator) from the
          flag-gated block — filter button always visible, filter indicator
          shows when filtering regardless of flag
        - Renamed `allProjectsAndMods` → `filterableProjects`, gated by flag:
          all types when true, software-only when false
        - Tabs (`ProjectTabs`, `Crossfade`) remain gated by flag
        - `hideDivider` stays tied to flag (tabs replace divider; filter button
          alone doesn't); `withTabAttributes` unchanged (already correct)

    - [x] **1.3.c Add flag guard to `games/[slug]/page.tsx`**
        - Added `FEATURES` import and `notFound()` route guard (matches mods pattern)
        - Added `generateStaticParams` guard (returns `[]` when flag off)

    - [x] **1.3.d Verify flag-off coherence**
        - Set flag to `false`, verified:
            - Projects page: 200 (loads correctly)
            - Software detail route: 200 (`/projects/software/cinexplorer`)
            - Games detail route: 404 (`/projects/games/action-rpg-project`)
            - Mods detail route: 404 (`/projects/mods/lies-of-p-hardcore-mode`)
            - Type-check and full build pass with flag off
        - Restored flag to `true`, all routes return 200

    - [x] **1.3.e Run quality gates (type-check, lint, related tests)**
        - Type-check: pass
        - Lint: pass (all files)
        - Format: pass
        - Unit tests: 1384/1384 pass (81 test files)
        - Build: pass (verified with flag both on and off)

- [x] **1.4 Build surface-tuning dev tool at `/dev/surface`**

    **Goal:** Robust, isolated dev tool for comparing current production surface values
    with experimental ones, previewing changes live, and exporting new values as
    TypeScript for easy theme definition updates.

    - [x] **1.4.a Promote light-mode border/shadow to surface tokens**
        - Added `SurfaceShadow` type and `surfaceBorderStrong`/`surfaceShadow` fields
          to `ModeSurfaceConfig` in `types.ts`
        - Updated all 6 theme definitions (light: `true`/`"md"`, dark: `false`/`"none"`)
        - Updated `generate-css-defaults.ts` to emit `--surface-border-color` and
          `--surface-shadow` per mode; added `:root` fallback defaults
        - Replaced hardcoded `.light .bg-surface-card` CSS rule with universal
          variable-driven rule referencing new tokens
        - Fixed `InDevelopmentBadge` — removed `dark:bg-background/80` override
        - Type-check and lint pass

    - [x] **1.4.b Create `/dev/surface` page scaffold**
        - Created `src/app/dev/surface/page.tsx` with `useHasMounted`, `PageLayout`,
          `DevPageHeader` (with `showEnvPreview`)
        - Reads active theme's `surfaces` config via `useThemeContext` + `themes` registry
        - CSS variable overrides applied on mount, removed on unmount via `removeCssOverrides()`
        - Re-syncs experimental values when theme palette changes

    - [x] **1.4.c Build surface tuning UI**
        - 4 `SliderControl` components for opacity/darken params with live prod comparison
        - Toggle buttons for `surfaceBorderStrong` and `surfaceShadow`
        - Dark/light mode switcher via `useThemeTransition`
        - "Reset to production" button (disabled when values match)
        - Side-by-side production vs experimental `ValueDisplay` panels
        - Changes always apply live to all page surfaces (no separate toggle needed —
          production values are visible in the comparison panel)

    - [x] **1.4.d Add TypeScript export**
        - `formatExport()` produces complete `ThemeSurfaces` object with `surfaceHierarchy`
          from production, ready to paste into a theme definition
        - Copy-to-clipboard with confirmation feedback
        - Shows "(has changes)" / "(no changes)" status

    - [x] **1.4.e Remove `SurfaceOpacityComparison` from sandbox**
        - Removed entire `SurfaceOpacityComparison` component and all related code
          (ValueSet type, defaults, helpers) from `sandbox/page.tsx`
        - Sandbox page now renders as empty scratch space
        - Added `[surface]` link to `FooterBar.tsx` dev nav alongside existing dev page links
        - Both routes return 200, type-check and lint pass

    - [x] **1.4.f Manual verification**
        - Verified tool loads with production values, sliders apply live,
          border/shadow visible on preview cards and control panel
        - Full quality gates pass: type-check, lint, format, lint:md, build,
          1390/1390 tests

- [ ] **1.5 Phase 1 quality gates**
    - [ ] 1.5.a Type-check modified files
    - [ ] 1.5.b Lint modified files
    - [ ] 1.5.c Run related unit tests
    - [ ] 1.5.d Run E2E tests for affected areas (layout, navigation)

### **Phase 2:** Content & Copy

- [ ] **2.1 Review and polish project descriptions**

    **Goal:** Ensure `shortDescription` fields are concise, compelling, and consistent
    in tone — these will feed directly into meta descriptions and OG tags.

    - [ ] **2.1.a Audit all `shortDescription` fields in `projects.ts` and `mods.ts`**
        - Review each for: conciseness, compelling language, consistent tone
        - Check for typos, awkward phrasing, or overly technical language
        - Flag any that need rewriting

    - [ ] **2.1.b Rewrite flagged descriptions**
        - Target: clear, professional, showcases the project's value
        - Keep under ~160 characters where possible (meta description length)

    - [ ] **2.1.c User review of final descriptions**

- [ ] **2.2 Merge features into highlights**

    **Goal:** Curate the best points from each project's `features` array into
    `highlights`, then remove the unused `features` field.

    - [ ] **2.2.a Draft highlights for all projects**
        - Target ~4-6 highlights per project focusing on impressive/notable aspects
        - **Priority:** `re8-aim-dependent-crosshair` and `sh2r-never-holster-weapons`
          have features but no highlights — their detail pages currently show no
          content sections
        - Review existing highlights and merge best `features` entries
        - Consider if any items belong in `architectureNotes` instead

    - [ ] **2.2.b User review of curated highlights**

    - [ ] **2.2.c Finalize highlights in data files**
        - Apply approved changes to `src/data/projects.ts` and `src/data/mods.ts`

- [ ] **2.3 Remove `features` field from project types**

    **Goal:** Clean up the type system now that highlights is the single content field.

    - [ ] **2.3.a Remove `features` from `Project` type in `src/types/project.ts`**
        - Remove `features` field from interface
        - Remove `features` from `sectionLabels` type
        - Update JSDoc/docstring in `ProjectDetail.tsx` if it references features

    - [ ] **2.3.b Remove `features` data from all project entries**
        - Remove `features` arrays from `src/data/projects.ts`
        - Remove `features` arrays from `src/data/mods.ts`
        - Remove `sectionLabels.features` overrides from any entries that have them

    - [ ] **2.3.c Verify no broken references**
        - Search codebase for remaining references to `features` on project types
        - Run type-check to catch any compile errors
        - Run unit tests to verify data validation still passes

- [ ] **2.4 Phase 2 quality gates**
    - [ ] 2.4.a Type-check (`npm run type-check`)
    - [ ] 2.4.b Lint (`npm run lint`)
    - [ ] 2.4.c Run unit tests (`npm test`)

### **Phase 3:** Error Pages & SEO

- [ ] **3.1 Create custom error pages**

    **Goal:** Replace generic Next.js/Vercel error pages with TWM-themed alternatives
    that maintain the site's visual identity.

    - [ ] **3.1.a Create `src/app/not-found.tsx` (custom 404)**
        - Renders inside root layout — TWM frame, theme, wallpaper all inherited
        - Terminal-style messaging to match TWM aesthetic
          (e.g., `> 404: page not found`, suggested navigation links)
        - Include link back to home and possibly to projects
        - Keep it simple and on-brand

    - [ ] **3.1.b Create `src/app/error.tsx` (error boundary)**
        - Must be `"use client"` component
        - Renders inside root layout (theme/frame available)
        - Show user-friendly error message with terminal styling
        - Include reset button (`error.reset()`) and link to home
        - Log error details to console for debugging

    - [ ] **3.1.c Create `src/app/global-error.tsx` (root layout error fallback)**
        - Catches errors in root layout itself
        - Renders *outside* layout — must include own `<html>` and `<body>` tags
        - Minimal styling (theme system not available)
        - Basic error message + reset button + link to home

    - [ ] **3.1.d Write tests for error pages**
        - Test: 404 page renders expected content
        - Test: Error boundary renders error message and reset button
        - Test: Error boundary calls `reset()` on button click

    - [ ] **3.1.e Verify error pages manually**
        - Navigate to non-existent route → custom 404 displays
        - Verify 404 respects current theme and layout

- [ ] **3.2 Expand site configuration for SEO**

    **Goal:** Centralize site identity data needed by metadata, OG tags, and
    structured data.

    - [ ] **3.2.a Extend `src/config/site.ts` with SEO fields**
        - Add `url` (production URL: `https://andrewcreekmore.dev`)
        - Add `author` (full name)
        - Add `locale` (`en_US`)
        - Add social links object (`github`, `linkedin`)
        - Add `jobTitle` or similar for structured data

    - [ ] **3.2.b Add OG default image to `public/`**
        - Use `profile-photo.webp` as default OG image
        - Ensure dimensions are appropriate (may need a cropped/resized version
          at 1200×630 for optimal social previews — TBD by user)

- [ ] **3.3 Add per-page static metadata**

    **Goal:** Every public page gets a unique title and description for search results.

    - [ ] **3.3.a Add `metadata` export to `src/app/page.tsx` (Home)**
        - Title, description, OG tags with default image

    - [ ] **3.3.b Add `metadata` export to `src/app/projects/page.tsx` (Projects)**
        - Title, description, OG tags

    - [ ] **3.3.c Add `metadata` exports to remaining pages**
        - `src/app/skills/page.tsx`
        - `src/app/about/page.tsx`
        - `src/app/contact/page.tsx`
        - Each with unique title and description

    - [ ] **3.3.d Update root `layout.tsx` metadata with OG defaults**
        - Add `openGraph` object with site name, locale, type, default image
        - Add `twitter` card configuration (`summary_large_image`)
        - Add `metadataBase` with production URL (enables relative OG image paths)

- [ ] **3.4 Add dynamic metadata for project detail routes**

    **Goal:** Each project page gets unique SEO with project-specific title,
    description, and hero image.

    - [ ] **3.4.a Implement `generateMetadata()` in `src/app/projects/software/[slug]/page.tsx`**
        - Pull project data by slug
        - Set title: `"{project.name} - Andrew Creekmore Portfolio"`
        - Set description from `shortDescription`
        - Set OG image from hero image (fall back to thumbnail, then default)
        - Handle not-found case (return empty metadata)

    - [ ] **3.4.b Implement `generateMetadata()` in remaining project routes**
        - `src/app/projects/games/[slug]/page.tsx`
        - `src/app/projects/mods/[slug]/page.tsx`
        - Same pattern as software route

    - [ ] **3.4.c Write test for `generateMetadata` output**
        - Test: Returns expected title and description for known project
        - Test: Returns empty/default metadata for unknown slug
        - Test: OG image set from project hero image

- [ ] **3.5 Create sitemap and robots.txt**

    - [ ] **3.5.a Create `src/app/sitemap.ts` route handler**
        - Enumerate all static routes (`/`, `/projects`, `/skills`, `/about`,
          `/contact`)
        - Enumerate all dynamic project routes from data files
        - Set appropriate `changeFrequency` and `priority` values
        - Use `MetadataRoute.Sitemap` return type

    - [ ] **3.5.b Create `src/app/robots.ts` route handler**
        - Allow crawling of all public routes
        - Disallow `/dev/*` and `/api/*`
        - Reference sitemap URL

    - [ ] **3.5.c Write test for sitemap generation**
        - Test: All expected routes present
        - Test: No dev or API routes included
        - Test: Dynamic project routes generated from data

- [ ] **3.6 Configure favicon**

    **Note:** Favicon design is a manual task (user will create the asset). This task
    covers integration once the asset exists.

    - [ ] **3.6.a Create favicon assets**
        - Design TBD (options: ARC initials, terminal prompt motif, other)
        - Minimum required: `favicon.ico`, `apple-touch-icon.png` (180×180)
        - Nice to have: `icon.svg` for modern browsers, `manifest.webmanifest`

    - [ ] **3.6.b Configure favicon in Next.js**
        - Place files in `src/app/` (Next.js auto-detects `icon.ico`,
          `apple-icon.png` in app directory) or `public/`
        - Verify favicon appears in browser tabs across browsers

- [ ] **3.7 Add JSON-LD structured data**

    **Goal:** Help search engines understand the site semantically for richer results.

    - [ ] **3.7.a Add `Person` schema to home and about pages**
        - Schema fields: `name`, `jobTitle`, `url`, `sameAs` (social links)
        - Render as `<script type="application/ld+json">` in page component
        - Pull data from `SITE` config

    - [ ] **3.7.b Add `BreadcrumbList` schema to project detail pages**
        - Breadcrumbs: Home → Projects → {Category} → {Project Name}
        - Generate from route params and project data

    - [ ] **3.7.c Write test for JSON-LD output**
        - Test: Person schema contains expected fields
        - Test: BreadcrumbList contains correct hierarchy

- [ ] **3.8 Set canonical URLs**

    - [ ] **3.8.a Add `alternates.canonical` to root metadata**
        - Use `metadataBase` set in 3.3.d as foundation
        - Per-page canonical URLs derived from route paths

- [ ] **3.9 Phase 3 quality gates (full suite)**
    - [ ] 3.9.a Type-check (`npm run type-check`)
    - [ ] 3.9.b Lint (`npm run lint`)
    - [ ] 3.9.c Format check (`npm run format:check`)
    - [ ] 3.9.d Markdown lint (`npm run lint:md`)
    - [ ] 3.9.e Build (`npm run build`)
    - [ ] 3.9.f Unit tests (`npm test`)
    - [ ] 3.9.g E2E tests (`npm run test:e2e`)

### **Phase 4:** Deployment & Validation

- [ ] **4.1 Connect repository to Vercel**

    - [ ] **4.1.a Link GitHub repo to Vercel project**
        - Import repo in Vercel dashboard
        - Configure framework preset (Next.js auto-detected)
        - Verify preview deployment succeeds on current `main`

    - [ ] **4.1.b Configure environment variables**
        - Add Zeptomail API credentials (`ZEPTOMAIL_API_KEY`, etc.)
        - Verify variables match what `src/app/api/contact/route.ts` expects

- [ ] **4.2 Set up Vercel KV for rate limiting**

    - [ ] **4.2.a Create KV database in Vercel dashboard**
        - Project Settings → Storage → Create Database → KV
        - Link to project (auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`)
        - Free tier: 30K requests/month (sufficient for portfolio traffic)

    - [ ] **4.2.b Verify rate limiting works in deployment**
        - Submit 6+ rapid contact form requests
        - Expect 429 response on 6th request

- [ ] **4.3 Configure domains**

    **Note:** Domain registration and DNS transfer are manual tasks. This covers
    Vercel-side configuration.

    - [ ] **4.3.a Register new domains**
        - `andrewcreekmore.dev` (primary)
        - `andrewrcr.dev` and `andrewrcr.com` (handle-based, easier verbal)
        - Register at chosen registrar (Cloudflare, Namecheap, etc. — TBD)
        - Configure DNS for all three to point to Vercel

    - [ ] **4.3.b Transfer `andrewcreekmore.com` from Squarespace**
        - Initiate transfer to same registrar as `.dev`
        - Configure DNS to point to Vercel

    - [ ] **4.3.c Add all domains to Vercel project**
        - Set `andrewcreekmore.dev` as primary domain
        - Add `andrewcreekmore.com`, `andrewrcr.dev`, `andrewrcr.com` as redirects
          (Vercel auto-308s to primary)
        - Verify SSL certificates provisioned for all domains

    - [ ] **4.3.d Update `SITE.url` and `metadataBase` if domain changed**
        - Verify canonical URLs, sitemap, and OG tags use final production domain

- [ ] **4.4 Lighthouse baseline audit**

    **Goal:** Verify META-PRD target of 90+ across all four Lighthouse categories.

    - [ ] **4.4.a Run Lighthouse against production deployment**
        - Test key pages: Home, Projects, a project detail, Skills, About, Contact
        - Record scores: Performance, Accessibility, Best Practices, SEO
        - Document baseline in completion doc

    - [ ] **4.4.b Address any scores below 90**
        - Investigate and fix issues if any category falls below target
        - Re-run until all four categories meet 90+ threshold

- [ ] **4.5 Production smoke test**

    - [ ] **4.5.a Verify all public pages load**
        - Home, Projects, Skills, About, Contact, project detail pages
        - Test on desktop and mobile viewports

    - [ ] **4.5.b Verify functionality**
        - Contact form submits successfully (email received)
        - Rate limiting works (429 on excessive requests)
        - Theme toggle persists across sessions
        - Wallpaper selection persists
        - Navigation and page transitions work smoothly

    - [ ] **4.5.c Verify SEO implementation**
        - View page source — meta tags, OG tags, canonical URLs present
        - Test social preview with LinkedIn/Twitter sharing debugger tools
        - Verify sitemap accessible at `/sitemap.xml`
        - Verify robots.txt accessible at `/robots.txt`

    - [ ] **4.5.d Verify production gating**
        - Navigate to `/dev/sandbox`, `/dev/typography`, etc. — all return 404
        - Verify custom 404 page displays (not Vercel default)

    - [ ] **4.5.e Verify error handling**
        - Custom 404 page displays for non-existent routes
        - Error boundary renders for runtime errors (if testable)

- [ ] **4.6 NexusMods API app registration**

    **Note:** Compliance task, not code. Requires public GitHub repo and live site.

    - [ ] **4.6.a Make GitHub repository public**

    - [ ] **4.6.b Submit NexusMods app registration**
        - Application name
        - Short description
        - Logo (suitable for dark backgrounds)
        - GitHub repository URL
        - Live site URL

---

## Success Criteria

- [ ] Dev pages (`/dev/*`) return 404 in production
- [ ] In-development badge displays on project detail pages where applicable
- [ ] Feature flag system documented and extensible for future flags
- [ ] Surface tuner stable at `/dev/surface` with no CSS variable leaks
- [ ] All project descriptions polished and highlights populated
- [ ] `features` field removed from project types (highlights is sole content field)
- [ ] Custom 404 and error pages display with TWM theme
- [ ] Every public page has unique metadata (title, description, OG tags)
- [ ] Project detail pages have dynamic metadata with hero images
- [ ] Sitemap and robots.txt serve correct content
- [ ] Favicon displays in browser tabs
- [ ] JSON-LD structured data present (Person, BreadcrumbList)
- [ ] Site deployed at `andrewcreekmore.dev`
- [ ] All secondary domains redirect to `.dev` (`.com`, `andrewrcr.dev`, `andrewrcr.com`)
- [ ] Lighthouse 90+ across Performance, Accessibility, Best Practices, SEO
- [ ] Contact form rate limiting functional in production
- [ ] NexusMods API registration submitted
- [ ] All quality gates pass
- [ ] Ready for archival
