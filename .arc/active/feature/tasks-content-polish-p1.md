# Task List: Content Polish P1 - Project Showcase

**PRD:** `.arc/active/feature/prd-content-polish-p1.md`
**Created:** 2026-01-13
**Branch:** `feature/content-polish-p1`
**Base Branch:** `main`
**Status:** Complete
**Completed:** 2026-01-16

## Overview

**Purpose:** Transform project showcase from functional placeholder to polished portfolio - Home Featured
section, Project Detail pages with proper headers and image galleries, Games tab, and mod content migration.

## Scope

### Will Do

- Create `DetailHeader` component with sticky header, hero image, back button, category badges
- Implement image gallery with lightbox for project screenshots
- Integrate new components into all project detail pages
- Add Games tab to Projects page (3-tab structure: Software/Games/Mods)
- Migrate 6-9 mods with images and copy
- Redesign Home Featured section (4 cards, type labels, randomization)
- Light copy editing pass for all projects

### Won't Do

- Deep content rewrites (light editing only)
- Skills page changes (P2)
- Contact form (P2)
- Animation/transitions (Visual Polish phase)

---

## Tasks

### **Phase 1:** Project Detail Infrastructure

**Purpose:** Create reusable components for project detail pages before integrating them.

- [x] **1.1 Create `DetailHeader` component**

    **Goal:** Sticky header with hero image background, title, back button, and category badges.

    - [x] **1.1.a Design component interface and props**

        **Interface:**

        ```tsx
        interface DetailHeaderProps {
          title: string;
          categories?: string[];
          heroImage?: string;  // Falls back to bg-card
          backHref: string;
          backLabel: string;
        }
        ```

        **Architecture decisions:**
        - Sibling to PageHeader (not extension) - both work in PageLayout's header slot
        - Shares bottom divider pattern (`mx-4 border-b border-border/50`)
        - Title: `text-3xl` (between PageHeader's 2xl and old ProjectDetail's 4xl)
        - Hero image: Full background with overlay, `bg-card` fallback
        - Back button: Icon (ArrowLeft) + text
        - Badges: Below title
        - Description: Not in header (stays in scrollable content)

    - [x] **1.1.b Write tests for `DetailHeader` behavior**
        - 15 behavior-focused tests (title, categories, back button, hero image, accessibility)
        - Tests verify contracts/behavior, not styling specifics
        - Created `src/components/projects/__tests__/DetailHeader.test.tsx`

    - [x] **1.1.c Implement base `DetailHeader` component**
        - Created `src/components/projects/DetailHeader.tsx`
        - Hero image with gradient overlay, `bg-card` fallback
        - All 15 tests passing

    - [x] **1.1.d Implement sticky behavior**
        - Sticky behavior is architectural (PageLayout's `header` prop handles fixed positioning)
        - Component structured for PageLayout integration
        - Visual verification deferred to 2.1 integration

    - [x] **1.1.e Run quality gates**
        - Type check, lint, format, markdown lint: all pass
        - Build: success
        - Tests: 878 passing

- [x] **1.2 Implement image gallery with lightbox**

    **Goal:** Clickable thumbnail grid that opens full-size images in modal.

    - [x] **1.2.a Evaluate lightbox approach**

        **Decision:** Use `yet-another-react-lightbox` library

        **Rationale:**
        - ~15-20KB bundle, active maintenance, full a11y (ARIA, keyboard nav)
        - Mobile: horizontal swipe, pull-down-to-close built-in
        - Zoom plugin available but skipped initially (evaluate on real hardware)
        - CSS variables for theming (`--yarl__*`), can use our tokens
        - Full-viewport mode initially (evaluate TWM aesthetic impact later)
        - Counter and optional captions supported

    - [x] **1.2.b Write tests for `ImageGallery` behavior**
        - 12 behavior-focused tests (thumbnails, click, empty states, accessibility)
        - Tests wrapper interface, not YARL library internals
        - Created `src/components/projects/__tests__/ImageGallery.test.tsx`

    - [x] **1.2.c Implement gallery thumbnail grid**
        - Created `src/components/projects/ImageGallery.tsx`
        - Responsive grid: 2 cols mobile (`grid-cols-2`), 3 cols desktop (`sm:grid-cols-3`)
        - 16:9 aspect ratio via `aspect-video`, Next.js Image with `fill`

    - [x] **1.2.d Implement lightbox with yet-another-react-lightbox**
        - Full-viewport modal with Counter plugin
        - Themed: `--yarl__color_backdrop` → `hsl(var(--card) / 0.95)`
        - Lucide icons (ChevronLeft, ChevronRight, X)
        - Pull-down-to-close enabled, finite carousel (no wrap)

    - [x] **1.2.e Run quality gates**
        - Type check, lint, format, markdown lint: all pass
        - Build: success
        - Tests: 890 passing (12 new ImageGallery tests)
        - Added CSS mocks to test setup for YARL stylesheets

### **Phase 2:** Project Detail Integration

**Purpose:** Integrate new components into existing project detail pages.

- [x] **2.1 Update `ProjectDetail` component**

    - [x] **2.1.a Integrate `DetailHeader`**
        - Page components now pass DetailHeader to PageLayout's header slot
        - Added `getBackDestination` helper to ProjectDetail for computing back nav
        - Hero image: thumbnail, fallback to first screenshot
        - Updated both software and mods page routes

    - [x] **2.1.b Integrate `ImageGallery`**
        - Added Screenshots section with ImageGallery component
        - Only renders when `project.images.screenshots.length > 0`
        - ProjectDetail now receives only `project` prop (simplified interface)

    - [x] **2.1.c Update tests for `ProjectDetail`**
        - Updated ProjectDetail tests: removed header-related tests (now in DetailHeader)
        - Added gallery section tests, getBackDestination helper tests
        - Updated integration routing tests to use DetailHeader
        - All 889 tests passing

- [x] **2.2 Layout and visual polish**

    **Goal:** Refine DetailHeader, ImageGallery, and content layout based on visual review.

    - [x] **2.2.a Improve `DetailHeader` layout**
        - Changed to 3.5:1 aspect ratio (banner-optimized, matches NexusMods header format)
        - Repositioned: back button absolute top-left, title+badges absolute bottom-left
        - Bottom-only gradient overlay (`from-black/80 via-black/30 to-transparent`)
        - Solid muted back button style (`bg-muted/90 backdrop-blur-sm`)
        - Added rounded corners (`rounded-lg`)
        - Removed bottom divider
        - Added external links (GitHub, Demo, etc.) to header bottom-right
        - Moved links from ProjectDetail body to header

    - [x] **2.2.b Implement collapsing header on scroll**

        **Goal:** Reclaim body content space by transitioning to compact header as user scrolls.

        **Implementation approach:** Crossfade between full hero header and compact header.
        Sticky positioning caused feedback loops with OverlayScrollbars; fixed positioning
        required fragile pixel calculations. Crossfade approach works within existing architecture.

        - [x] **2.2.b.1 Create compact header component**
            - `DetailHeaderCompact`: slim single-row header (back button | title | links)
            - Grid height animation (`grid-template-rows: 0fr/1fr`) for smooth expand/collapse
            - Renders in PageLayout header slot

        - [x] **2.2.b.2 Implement coordinated crossfade**
            - Full `DetailHeader` fades out as user scrolls (opacity 1→0)
            - `DetailHeaderCompact` fades in inversely (opacity 0→1)
            - Transition zone = full header height (smooth dissolve effect)
            - Moved `ScrollProvider` in PageLayout to wrap both header and children

        - [x] **2.2.b.3 Extract shared logic to hook**
            - `useHeaderCrossfade(direction: 'in' | 'out')` hook
            - Handles scroll tracking, resize listening, opacity calculation
            - Exports `DETAIL_HEADER_ASPECT_RATIO` constant (3.5)
            - Uses `tuiFrameMaxWidth` from layout tokens

        - [x] **2.2.b.4 Cleanup: document padding constant**
            - Added explanatory comment for `64` magic number in hook
            - Desktop: 64px correct; mobile: 48px (difference negligible for transition zone)
            - Deferred token derivation pending phone hardware testing

    - [x] **2.2.c Simplify `ImageGallery` display**
        - Single row grid (`grid-cols-3`), max 3 thumbnails visible
        - "+X more" overlay on 3rd thumbnail when >3 images (dark overlay with count)
        - Lightbox opens at clicked index with full image set for navigation
        - Screenshots header removal done in earlier session

    - [x] **2.2.d Reorder `ProjectDetail` content sections**
        - Reordered: Tech Stack → Description → Screenshots → Key Features → rest
        - Links already in header from 2.2.a-b work
        - Spacing unchanged (`space-y-8` works well for new order)

    - [x] **2.2.e Visual review and iteration**
        - Desktop and mobile viewports tested via browser and Cloudflare tunnel
        - DRY refactoring: extracted BackToTopButton, DetailCard, BulletList/MetadataRow helpers
        - DetailHeaderCompact: responsive two-row layout on mobile, TouchTarget compliance
        - ImageGallery: added Zoom plugin for mobile pinch-to-zoom
        - Adjusted spacing throughout (section margins, description gaps)

    - [x] **2.2.f Mobile layout for full DetailHeader**
        - **Problem solved:** iOS Safari scroll jank from header height animations during momentum scroll
        - **Solution:** Redesigned mobile AND desktop to avoid height changes entirely
        - **New architecture (both viewports):**
            - `DetailHeaderCompact`: Always visible on mobile (no animation), crossfade on desktop
            - `DetailHeader`: Hero image with minimal overlay (back + title), footer section below
            - Footer: category badges (left) + icon-only links (right) with ghost button styling
        - **New components:**
            - `DetailBannerMobile`: Mobile body content (hero + badges + icon links)
            - `buildIconLinkItems()`: Icon link builder (GitHub, Globe, Download, NexusMods icons)
        - **Removed:** `DetailHeaderMobile.tsx` (replaced by banner)
        - **Added:** `compactTitle` field for long titles (e.g., "NewGame+ Customizer")
        - **Styling:** Consistent icon links, TouchTarget WCAG compliance, conditional padding

    - [x] **2.2.g Update tests for layout changes**
        - **Pre-work cleanup:** Renamed `DetailHeaderHeroBanner` → `DetailBannerMobile`,
          `HERO_THRESHOLD` → `HOME_HERO_THRESHOLD` for naming consistency
        - **New tests added:** 35 tests total (17 buildLinkItems, 13 DetailHeaderCompact, 5 icon links)
        - **Coverage results:** projects components 98.89% (target 80%), all new components at 100%
        - **Full suite:** 900 tests passing

- [x] **2.3 Light copy editing for software projects**

    **Goal:** Polish existing project descriptions without major rewrites.

    - [x] **2.3.a Review and edit CineXplorer copy**
        - Trimmed techStack from 10 to 7 items (removed Pydantic, Vite, Redis from badges)
        - Added Redis to production infrastructure feature (captured in text)
        - Project still in progress; deeper copy work deferred until complete

    - [x] **2.3.b Review and edit TaskFocus copy**
        - Already reviewed in prior pass; no changes needed

    - [x] **2.3.c Review and edit remaining software projects**
        - **ARC Framework:** Fixed "Tookit" → "Toolkit" typo; naming evaluated and confirmed
        - **arc-portfolio:** Major revision - removed "bleeding-edge" language, added Server Actions,
          accessibility testing, WCAG contrast validation to description/features/highlights;
          removed version numbers from techStack badges (kept in prose)
        - **PetResort:** Removed "enterprise-level" overclaims, reframed as "business application demo",
          clarified it's a portfolio demonstration project

    - [x] **2.3.d Verify all project images exist**
        - Complete projects (TaskFocus, PetResort, mods) have all assets present
        - Feature-flagged projects (CineXplorer, ARC Framework) still need assets (expected)
        - arc-portfolio assets TBD closer to deployment; may use header image only (no gallery)
          since screenshots of "the site you're on" have limited value

- [x] **2.4 Run Phase 2 quality gates**
    - [x] 2.4.a Run full test suite - 900 tests passing
    - [x] 2.4.b Run lint and type-check - all pass
    - [x] 2.4.c Manual verification of detail pages in browser - confirmed

### **Phase 3:** Projects Page - Games Tab

**Purpose:** Split games into dedicated tab for clearer categorization.

- [x] **3.1 Write tests for 3-tab structure**

    - [x] **3.1.a Update `ProjectTabs` tests for three tabs**
        - 26 tests: 3-tab rendering, tab order, active states, switching, keyboard nav, query params, ARIA
        - Tests FAIL as expected (16/26) - Games tab not yet implemented

    - [x] **3.1.b Write tests for Games tab content**
        - 10 tests: Games tab content filtering, project card links, Software tab exclusion, default behavior
        - Added ResizeObserver mock to test setup (required for PageLayout)
        - Tests FAIL as expected (8/10) - Games tab filtering not yet implemented

- [x] **3.2 Implement 3-tab structure**

    - [x] **3.2.a Update `ProjectTabs` component**
        - Refactored to data-driven approach with TABS array and TAB_LABELS record
        - 3 tabs: Software, Games, Mods
        - All 26 tests pass

    - [x] **3.2.b Update project categorization logic**
        - `isGameProject()` helper checks for `category.includes("Game")`
        - Software tab filters out games, Games tab filters for games only
        - Feature flag renamed: `SHOW_MODS_TAB` → `SHOW_PROJECT_TABS`

    - [x] **3.2.c Update routing and URL params**
        - Created `/projects/games/[slug]` route for game detail pages
        - Updated `getBackDestination()` to support "games" tab
        - All detail pages handle "software" | "games" | "mods" tab preservation
        - `ProjectCard` accepts `categoryType: "games"` for correct routing
        - All 117 project tests pass

- [x] **3.3 Create Games tab content**

    - [x] **3.3.a Filter and display game projects**
        - Games panel with grid layout matching Software tab
        - 3 game projects: Action RPG, Survival Horror, Pong Clone

    - [x] **3.3.b Update game project detail routing**
        - Created dedicated `/projects/games/[slug]` route
        - Back navigation preserves tab state via query param

- [x] **3.4 Re-enable ProjectTabs and style**

    **Goal:** Polish tab styling for production use. Feature flag already enabled during 3.2 implementation.

    - [x] **3.4.a Enable tabs**
        - Feature flag `SHOW_PROJECT_TABS` set to `true`
        - Tabs render correctly on Projects page
    - [x] **3.4.b Visual iteration on tab styling**
        - Typography: `font-mono text-sm font-semibold` (matches Navigation)
        - Labels: ALL CAPS (SOFTWARE, GAMES, MODS)
        - Active state: `text-secondary border-secondary` (consistent with nav bg)
        - Layout: left-aligned, `mx-4` width constraint, `items-end` alignment
        - Divider: `border-border/50` matches PageHeader; added `hideDivider` prop
        - Touch targets: `min-h-11 lg:min-h-0` with `pb-2 pt-3` for WCAG compliance
        - Removed subtitle from Projects page (tabs fill that visual space)

- [x] **3.5 Run Phase 3 quality gates**
    - [x] 3.5.a Run full test suite - 924 tests pass
    - [x] 3.5.b Run lint and type-check - all pass
    - [x] 3.5.c Manual verification of all three tabs - confirmed

### **Phase 4:** Mod Content Migration

**Purpose:** Migrate real mod content and enable Mods tab.

- [x] **4.1 Prepare mod data structure**

    - [x] **4.1.a Select 6-9 mods to feature**
        - Selected 6 mods: Lies of P Hardcore Mode + 5 others (pending migration)
        - DOOM NG+ Customizer will appear in both Software and Mods tabs

    - [x] **4.1.b Identify Featured pool subset**
        - All 6 selected mods qualify for Home Featured rotation
        - May add 3 more mods later (non-featured)

- [x] **4.2 Migrate mod content**

    - [x] **4.2.a Migrate first mod (template)**
        - Lies of P: Hardcore Mode migrated with full content
        - Established patterns: hero images, `game` field, `ContentItem` type, `sectionLabels`
        - Added react-markdown for formatting support
        - Added "More Information" section linking to NexusMods
        - PageHeader title hidden on phone (nav provides context)

    - [x] **4.2.b Migrate remaining mods**
        - Migrated 5 additional mods (6 total):
          1. RE4R: Improved Weapon Balance (comprehensive scope)
          2. Elden Ring: Guard Parry (animation/frame data)
          3. Lies of P: Hardcore Mode (balance design)
          4. SoR4: Improved Movement (community + commissioned art)
          5. RE Village: Aim-Dependent Crosshair (Lua/REFramework)
          6. SH2: Never Holster Weapons (problem-solving/lateral thinking)
        - Created `TextLink` component for consistent link styling
        - Fixed `ProjectCard` to show `game` field for mods instead of `category`
        - All images converted to WebP

    - [x] **4.2.c Add mod images to `public/projects/mods/`**
        - Images organized by mod slug in `public/projects/{slug}/`
        - Hero images and thumbnails for all 6 mods

- [x] **4.3 Enable Mods tab**

    - [x] **4.3.a Remove placeholder content**
        - No placeholder content present; tab was clean

    - [x] **4.3.b Verify Mods tab displays correctly**
        - Grid layout matches Software/Games tabs
        - Mod cards render with game badge (not category)
        - Links to mod detail pages work

    - [x] **4.3.c Verify mod detail pages**
        - `DetailHeader` works with mod data
        - Custom section labels (Approach Comparison, Frame Data, etc.)
        - External "More Information" links to NexusMods

- [x] **4.4 Run Phase 4 quality gates**
    - [x] 4.4.a Run full test suite (924/924 passing)
    - [x] 4.4.b Run lint and type-check (all passing)
    - [x] 4.4.c Build successful

- [x] **4.5 Add NexusMods download stats infrastructure**

    **Goal:** Display dynamic download stats from NexusMods API for mods (individual + aggregate).

    - [x] **4.5.a Setup NexusMods integration config**
        - Created `.env.example` with `NEXUSMODS_API_KEY` template
        - Created `src/config/nexusmods.ts` with mod registry (35 mods)
        - 7 displayed mods with `portfolioSlug` for matching
        - 28 additional mods for aggregate totals
        - 3 hidden mods tracked separately for profile total comparison

    - [x] **4.5.b Create server action for fetching stats**
        - Created `src/app/actions/nexusmods.ts`
        - `getModStats(game, modId)` - individual mod with 24hr cache
        - `getModStatsBySlug(slug)` - lookup by portfolio slug
        - `getAggregateStats()` - sums all 35 mods in parallel
        - `getDisplayedModStats()` - batch fetch for 7 displayed mods
        - Returns: `downloads`, `uniqueDownloads`, `endorsements`, `updatedAt`
        - Error handling: NO_API_KEY, RATE_LIMITED, NOT_FOUND, API_ERROR
        - `isModStatsError()` type guard for error checking

    - [x] **4.5.c Write tests for NexusMods utilities**
        - Created `src/lib/nexusmods.ts` with utility functions
        - `parseNexusModsUrl()` - 11 tests (valid URLs, edge cases, invalid inputs)
        - `formatStatNumber()` - 10 tests (K/M formatting, decimals, trailing zeros)
        - `buildNexusModsUrl()` - 3 tests
        - Created `src/app/actions/__tests__/nexusmods.test.ts` - 10 tests
        - `isModStatsError()` type guard tests
        - Type structure validation for ModStats, ModStatsError, AggregateStats
        - Total: 34 new tests, all passing

    - [x] **4.5.d Create `ModStatsBadge` component**
        - Created `src/components/projects/ModStatsBadge.tsx`
        - `ModStatsBadge` - single stat with icon (Users, ThumbsUp, Download)
        - `ModStatsGroup` - convenience wrapper for multiple stats
        - Uses `formatStatNumber()` for K/M formatting
        - Accessible: aria-labels with full number, aria-hidden icons
        - 16 tests covering rendering, formatting, accessibility, styling

    - [x] **4.5.e Integrate into displayed project detail pages**
        - Added `stats` prop to `DetailHeader`, `DetailBannerMobile`, `DetailHeaderDesktop`
        - Stats display in footer next to category badges (both mobile + desktop)
        - Mod detail pages fetch stats via `getModStatsBySlug(slug)`
        - Software page conditionally fetches for projects with NexusMods links
        - Graceful fallback: no stats shown if API error or unavailable
        - Created `src/lib/nexusmods-types.ts` for types + type guard (Turbopack compatibility)

    - [x] **4.5.f Add aggregate stats to About and Contact pages**
        - `AboutSection` accepts `uniqueDownloads` prop, uses placeholder substitution
        - About page fetches `getAggregateStats()`, passes `totalUniqueDownloads`
        - Fallback: "over 300 thousand"; API value styled as inline `<code>`
        - Included hidden mods in aggregate via `HIDDEN_MODS_DOWNLOAD_TALLY`
        - Reduced cache TTL from 24h to 6h
        - Contact page skipped (doesn't fit page purpose)

    - [x] **4.5.g Visual polish of stats badges**
        - Fixed icon/text alignment: `leading-none` + `mt-px` optical adjustment
        - Added hover tooltips on desktop (Endorsements, Unique Downloads, Total Downloads)
        - Added total downloads as third stat badge
        - Phone: compact combined badge `[👍 · 👥 · ⬇️]` saves horizontal space
        - Desktop: separate badges with tooltips
        - NexusMods link: `min-h-6` matching category badges, outline button on phone
        - About page download count: inline code styling when API value available
        - Secondary token strength issue deferred to ATOMIC-TASKS.md

    - [x] **4.5.h Run Phase 4.5 quality gates**
        - All quality gates pass (type check, lint, format, markdown lint, build, tests)
        - 978 tests passing

### **Phase 5:** Home Featured Section

**Purpose:** Redesign Featured section with category labels and randomization.

- [x] **5.1 Write tests for Featured section behavior**

    - [x] **5.1.a Write tests for randomization utility**
        - 19 tests for `selectFeaturedProjects()`: structure, slot types, pool selection, deterministic random
        - Created `src/lib/__tests__/featured-projects.test.ts`

    - [x] **5.1.b Write tests for Featured card rendering**
        - 13 tests for `FeaturedSection`: card count, titles, type labels, links, accessibility
        - Created `src/components/sections/__tests__/FeaturedSection.test.tsx`

- [x] **5.2 Implement randomization logic**

    - [x] **5.2.a Define card slot configuration**
        - Chose: Software, Framework, Game, Mod (one of each type)

    - [x] **5.2.b Define card pools**
        - Software: cinexplorer, taskfocus
        - Framework: arc-agentic-dev-framework (always)
        - Game: action-rpg-project, survival-horror-project
        - Mod: 5 mods (excludes sh2r-never-holster-weapons)

    - [x] **5.2.c Implement `selectFeaturedProjects()` utility**
        - Created `src/lib/featured-projects.ts`
        - Created `src/components/sections/FeaturedSection.tsx` (client component)
        - 32 tests passing

- [x] **5.3 Update Featured card design**

    - [x] **5.3.a Add category type labels**
        - Lowercase type labels at top of each card

    - [x] **5.3.b Add background tokens for header/body**
        - Type tag + title uses `bg-card/80`, description uses `bg-background/80`

    - [x] **5.3.c Update section header**
        - Changed to "Featured"

    - [x] **5.3.d Integrate randomization with client component**
        - Replaced inline Home page code with `FeaturedSection` component
        - Simplified `page.tsx` from 45 lines to 15 lines
        - Grid layout: 2x2 on desktop, stacked on mobile

- [x] **5.4 Run Phase 5 quality gates**
    - [x] 5.4.a Run full test suite (1007 tests passing)
    - [x] 5.4.b Run lint and type-check (pass)
    - [x] 5.4.c Manual verification of Home page (4 cards, randomization, correct links)

- [x] **5.5 Mobile header/scroll behavior for Home page**

    **Problem:** On mobile, Hero wasn't fixed and ScrollShadow appeared awkwardly above it.

    - [x] **5.5.a Make Hero fixed on mobile**
        - Moved Hero to PageLayout's `header` prop (fixed above scroll area)
        - Added `stickyHeader` prop to remove content top padding

    - [x] **5.5.b Condense tagline when `isPhone`**
        - Phone (< 640px): Shows only "Full-stack developer" (no second line)
        - Tablet: Two-line tagline
        - Desktop: Single line with pipe separator

    - [x] **5.5.c Resolve ScrollShadow alignment**
        - Chose Option B: Moved "Featured Projects" h2 heading into Hero
        - ScrollShadow now aligns naturally at header/content boundary
        - Removed divider (not needed with heading approach)

    - [x] **5.5.d Run quality gates**
        - Type check, lint, format: pass
        - Unit tests: 1006 passing (updated FeaturedSection test, fixed h3→h2 for a11y)
        - Visual verification: confirmed on mobile/desktop

### **Phase 6:** Final Quality Gates

**Purpose:** Comprehensive verification before completion.

- [x] **6.1 Full test suite**
    - [x] 6.1.a Run all unit tests (1006 passing)
    - [x] 6.1.b Run all E2E tests (199 passing - Chrome, Mobile, Tablet, Firefox)
    - [x] 6.1.c Address any failures (updated FeaturedSection test, fixed h3→h2 for a11y)
    - [x] 6.1.d Research Firefox/WSL2 timeout issues
        - Root cause: DISPLAY env var + Firefox slower performance + WSL2 networking
        - Fix: Clear DISPLAY, extend timeout to 60s, add retry in playwright.config.ts
        - All Firefox tests now pass (44/44)

- [x] **6.2 Code quality**
    - [x] 6.2.a Run lint (0 errors)
    - [x] 6.2.b Run type-check (0 errors)
    - [x] 6.2.c Run format check (pass)

- [x] **6.3 Manual verification**

    - [x] **6.3.a Verify Home page**
        - Hero fixed in header with "Featured Projects" heading
        - 4 cards with type labels, randomization works
        - Cards link to correct detail pages

    - [x] **6.3.b Verify Projects page**
        - All three tabs work (Software, Games, Mods)
        - Correct projects in each tab
        - Tab state preserved through back navigation
        - **Intentional behavior:** Tab resets to Software on refresh/external navigation

    - [x] **6.3.c Verify Project Detail pages**
        - `DetailHeader` displays correctly (hero image or thumbnail fallback)
        - `ImageGallery` opens lightbox
        - All sections render correctly
        - Back button returns to correct tab

    - [x] **6.3.d Cross-browser/viewport check**
        - Desktop, tablet, mobile all verified

- [x] **6.4 Visual regression**
    - [x] 6.4.a Update baseline screenshots (Hero layout changes)
    - [x] 6.4.b Run visual regression tests (18 theme + 5 page baselines pass)
    - [x] 6.4.c Address any regressions (increased threshold to 5% for Featured randomization)

---

## Success Criteria

- [x] Home Featured section displays 4 cards with category type labels and randomization
- [x] Projects page has 3 functional tabs (Software, Games, Mods)
- [x] All project detail pages have sticky `DetailHeader` with hero image and badges
- [x] All project detail pages have functional `ImageGallery` with lightbox
- [x] 6-9 mods fully migrated with images and copy
- [x] All existing software projects have light copy editing pass completed
- [x] All game projects properly categorized in Games tab
- [x] All quality gates pass (tests, lint, type-check)
- [x] Ready for merge to main
