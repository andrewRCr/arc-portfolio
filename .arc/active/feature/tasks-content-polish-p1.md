# Task List: Content Polish P1 - Project Showcase

**PRD:** `.arc/active/feature/prd-content-polish-p1.md`
**Created:** 2026-01-13
**Branch:** `feature/content-polish-p1`
**Base Branch:** `main`
**Status:** In Progress

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
        - Tests wrapper interface, not YAML library internals
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
        - Added CSS mocks to test setup for YAML stylesheets

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

- [ ] **4.1 Prepare mod data structure**

    - [ ] **4.1.a Select 6-9 mods to feature**
        - Review 35 published mods on NexusMods
        - Select highest impact/most complex ones
        - Document selection with brief rationale

    - [ ] **4.1.b Identify Featured pool subset**
        - From the 6-9, select smaller subset for Home Featured rotation
        - Criteria: Visual appeal, technical interest, variety

- [ ] **4.2 Migrate mod content**

    - [ ] **4.2.a Migrate first mod (template)**
        - Copy description from NexusMods
        - Download and process images (thumbnail, banner)
        - Remove text overlays from images
        - Add to `src/data/mods.ts`
        - Verify renders correctly on detail page

    - [ ] **4.2.b Migrate remaining mods**
        - Repeat process for remaining 5-8 mods
        - Ensure consistent data structure
        - Process all images (WebP optimization)

    - [ ] **4.2.c Add mod images to `public/projects/mods/`**
        - Organize by mod slug
        - Include thumbnail and banner/hero
        - Include content screenshots where available

- [ ] **4.3 Enable Mods tab**

    - [ ] **4.3.a Remove placeholder content**
        - Delete placeholder mod entries
        - Remove "coming soon" messaging

    - [ ] **4.3.b Verify Mods tab displays correctly**
        - Grid layout matches Software/Games tabs
        - Mod cards render with correct data
        - Links to mod detail pages work

    - [ ] **4.3.c Verify mod detail pages**
        - `DetailHeader` works with mod data
        - `ImageGallery` displays mod screenshots
        - External link to NexusMods works

- [ ] **4.4 Run Phase 4 quality gates**
    - [ ] 4.4.a Run full test suite
    - [ ] 4.4.b Run lint and type-check
    - [ ] 4.4.c Manual verification of Mods tab and detail pages

### **Phase 5:** Home Featured Section

**Purpose:** Redesign Featured section with category labels and randomization.

- [ ] **5.1 Write tests for Featured section behavior**

    - [ ] **5.1.a Write tests for randomization utility**
        - Test: `selectFeaturedProjects()` returns 4 projects
        - Test: Framework slot always returns ARC Framework
        - Test: Software slots draw from correct pool
        - Test: Game/Mod slots draw from correct pools
        - Mock random for deterministic tests
        - Expect tests to FAIL initially

    - [ ] **5.1.b Write tests for Featured card rendering**
        - Test: 4 cards render
        - Test: Each card has type label
        - Test: Framework card always shows ARC Framework
        - Expect tests to FAIL initially

- [ ] **5.2 Implement randomization logic**

    - [ ] **5.2.a Define card slot configuration**
        - Decide: Option A (Software, Software, Framework, Game OR Mod)
        - Or: Option B (Software, Framework, Game, Mod)
        - Document decision in code comments

    - [ ] **5.2.b Define card pools**
        - Software pool: CineXplorer, TaskFocus
        - Framework: ARC Framework (always)
        - Game pool: ActionRPGProject, SurvivalHorrorProject
        - Mod pool: subset from Phase 4.1.b

    - [ ] **5.2.c Implement `selectFeaturedProjects()` utility**
        - Select one from each pool per slot rules
        - Handle "Game OR Mod" logic if Option A chosen
        - Randomization tests should now PASS

- [ ] **5.3 Update Featured card design**

    - [ ] **5.3.a Add category type labels**
        - Replace `[project]` with type: "software", "framework", "game", "mod"
        - Lowercase styling
        - Position at top of card (current bracket position)

    - [ ] **5.3.b Add `bg-card` background for description**
        - Type tag + title: keep transparent (current behavior)
        - Description text: use `bg-card` (solid, like existing `ProjectCard`)
        - Maintain visual hierarchy

    - [ ] **5.3.c Update section header**
        - Change "Featured Projects" to "Featured"
        - Maintain existing styling

    - [ ] **5.3.d Integrate randomization with client component**
        - Randomize on page load (client component or useEffect)
        - Update grid layout for 4 cards
        - Verify responsive behavior (2x2 on mobile?)
        - Card rendering tests should now PASS

- [ ] **5.4 Run Phase 5 quality gates**
    - [ ] 5.4.a Run full test suite
    - [ ] 5.4.b Run lint and type-check
    - [ ] 5.4.c Manual verification of Home page

### **Phase 6:** Final Quality Gates

**Purpose:** Comprehensive verification before completion.

- [ ] **6.1 Full test suite**
    - [ ] 6.1.a Run all unit tests (target: 100% pass)
    - [ ] 6.1.b Run all E2E tests (target: 100% pass)
    - [ ] 6.1.c Address any failures

- [ ] **6.2 Code quality**
    - [ ] 6.2.a Run lint (0 errors)
    - [ ] 6.2.b Run type-check (0 errors)
    - [ ] 6.2.c Run format check

- [ ] **6.3 Manual verification**

    - [ ] **6.3.a Verify Home page**
        - Featured section displays 4 cards with correct labels
        - Randomization works on refresh
        - Cards link to correct detail pages

    - [ ] **6.3.b Verify Projects page**
        - All three tabs work (Software, Games, Mods)
        - Correct projects in each tab
        - Tab state preserved through navigation

    - [ ] **6.3.c Verify Project Detail pages**
        - `DetailHeader` displays correctly with hero image
        - `ImageGallery` opens lightbox
        - All sections render (description, tech stack, features, etc.)
        - Back button returns to correct tab

    - [ ] **6.3.d Cross-browser/viewport check**
        - Desktop Chrome
        - Mobile viewport
        - Tablet viewport

- [ ] **6.4 Visual regression**
    - [ ] 6.4.a Update baseline screenshots if needed
    - [ ] 6.4.b Run visual regression tests
    - [ ] 6.4.c Address any regressions

---

## Success Criteria

- [ ] Home Featured section displays 4 cards with category type labels and randomization
- [ ] Projects page has 3 functional tabs (Software, Games, Mods)
- [ ] All project detail pages have sticky `DetailHeader` with hero image and badges
- [ ] All project detail pages have functional `ImageGallery` with lightbox
- [ ] 6-9 mods fully migrated with images and copy
- [ ] All existing software projects have light copy editing pass completed
- [ ] All game projects properly categorized in Games tab
- [ ] All quality gates pass (tests, lint, type-check)
- [ ] Ready for merge to main
