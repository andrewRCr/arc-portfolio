# Task List: Content Polish P1 - Project Showcase

**PRD:** `.arc/backlog/feature/prd-content-polish-p1.md`
**Created:** 2026-01-13
**Branch:** `feature/content-polish-p1`
**Base Branch:** `main`
**Status:** Pending

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

- [ ] **1.1 Create `DetailHeader` component**

    **Goal:** Sticky header with hero image background, title, back button, and category badges.

    - [ ] **1.1.a Design component interface and props**
        - Props: `title`, `heroImage`, `categories`, `backHref`, `backLabel`
        - Consider extending or composing with `PageHeader` patterns
        - Plan for sticky positioning within `WindowContainer` scroll context

    - [ ] **1.1.b Implement base `DetailHeader` component**
        - Create `src/components/projects/DetailHeader.tsx`
        - Hero image as background with overlay for text readability
        - Title with monospace styling (consistent with current)
        - Category badges with `bg-accent` styling
        - Smart back button (uses `backHref` prop, defaults to `/projects`)

    - [ ] **1.1.c Implement sticky behavior**
        - Header sticks to top while content scrolls beneath
        - Coordinate with `WindowContainer` and `ScrollShadow` if needed
        - Test across viewports (desktop, tablet, mobile)

    - [ ] **1.1.d Write tests for `DetailHeader`**
        - Test: Renders title and categories correctly
        - Test: Back button navigates to correct href
        - Test: Hero image displays when provided
        - Test: Fallback when no hero image
        - Test: Accessibility (heading hierarchy, button labels)

    - [ ] **1.1.e Run quality gates**
        - Lint and type-check pass
        - All tests pass

- [ ] **1.2 Implement image gallery with lightbox**

    **Goal:** Clickable thumbnail grid that opens full-size images in modal.

    - [ ] **1.2.a Evaluate lightbox approach**
        - Option A: Build custom modal with `Dialog` from shadcn/ui
        - Option B: Use existing library (yet-another-react-lightbox, etc.)
        - Decision criteria: Bundle size, accessibility, keyboard nav, touch support

    - [ ] **1.2.b Implement gallery thumbnail grid**
        - Create `src/components/projects/ImageGallery.tsx`
        - Responsive grid (2-3 columns depending on viewport)
        - Thumbnail aspect ratio consistent (16:9 or similar)
        - Click handler opens lightbox at selected index

    - [ ] **1.2.c Implement lightbox modal**
        - Full-screen or near-full-screen image display
        - Previous/Next navigation (arrows + keyboard)
        - Close button (X + Escape key)
        - Image counter ("2 of 6")
        - Accessible focus management

    - [ ] **1.2.d Write tests for `ImageGallery`**
        - Test: Renders correct number of thumbnails
        - Test: Click opens lightbox at correct index
        - Test: Keyboard navigation works (arrows, escape)
        - Test: Renders nothing gracefully when no images
        - Test: Accessibility (alt text, focus trap in modal)

    - [ ] **1.2.e Run quality gates**
        - Lint and type-check pass
        - All tests pass

### **Phase 2:** Project Detail Integration

**Purpose:** Integrate new components into existing project detail pages.

- [ ] **2.1 Update `ProjectDetail` component**

    - [ ] **2.1.a Integrate `DetailHeader`**
        - Replace current simple back button + title with `DetailHeader`
        - Pass hero image from `project.images.thumbnail` or first screenshot
        - Pass categories from `project.category`
        - Move description out of header into scrollable content

    - [ ] **2.1.b Integrate `ImageGallery`**
        - Add gallery section after description
        - Use `project.images.screenshots` array
        - Only render if screenshots exist and have entries

    - [ ] **2.1.c Verify layout and spacing**
        - Content flows correctly beneath sticky header
        - Gallery integrates with existing sections (tech stack, features, etc.)
        - Mobile layout remains usable

    - [ ] **2.1.d Update tests for `ProjectDetail`**
        - Test: `DetailHeader` renders with correct props
        - Test: `ImageGallery` renders when screenshots present
        - Test: No gallery section when screenshots empty
        - Existing tests continue to pass

- [ ] **2.2 Light copy editing for software projects**

    **Goal:** Polish existing project descriptions without major rewrites.

    - [ ] **2.2.a Review and edit CineXplorer copy**
        - Check description clarity, feature list, highlights
        - Fix typos, awkward phrasing
        - Ensure tech stack is current

    - [ ] **2.2.b Review and edit TaskFocus copy**
        - Same checks as above

    - [ ] **2.2.c Review and edit remaining software projects**
        - ARC Framework, arc-portfolio, PetResort
        - Brief review each, fix obvious issues

    - [ ] **2.2.d Verify all project images exist**
        - Check `public/projects/` for each project's assets
        - Ensure thumbnails and screenshots are present
        - Note any missing assets for follow-up

- [ ] **2.3 Run Phase 2 quality gates**
    - [ ] 2.3.a Run full test suite
    - [ ] 2.3.b Run lint and type-check
    - [ ] 2.3.c Manual verification of detail pages in browser

### **Phase 3:** Projects Page - Games Tab

**Purpose:** Split games into dedicated tab for clearer categorization.

- [ ] **3.1 Update tab structure to 3 tabs**

    - [ ] **3.1.a Update `ProjectTabs` component**
        - Add "Games" tab between Software and Mods
        - Update tab IDs and labels
        - Verify ARIA attributes and keyboard navigation still work

    - [ ] **3.1.b Update project categorization logic**
        - Define which projects are "games" vs "software"
        - Games: ActionRPGProject, SurvivalHorrorProject, Pong
        - Update filtering logic in Projects page

    - [ ] **3.1.c Update routing and URL params**
        - Support `?tab=games` in addition to `software` and `mods`
        - Default tab remains `software`
        - Back navigation from detail pages preserves tab state

- [ ] **3.2 Create Games tab content**

    - [ ] **3.2.a Filter and display game projects**
        - Reuse existing `ProjectCard` component
        - Same grid layout as Software tab
        - Verify game projects appear correctly

    - [ ] **3.2.b Update game project detail routing**
        - Games may need `/projects/games/[slug]` route
        - Or reuse `/projects/software/[slug]` with category detection
        - Decision: Simplest approach that preserves back navigation

- [ ] **3.3 Update tests for Projects page**

    - [ ] **3.3.a Update `ProjectTabs` tests**
        - Test: Three tabs render (Software, Games, Mods)
        - Test: Tab switching works for all three
        - Test: Keyboard navigation across three tabs

    - [ ] **3.3.b Add integration tests for Games tab**
        - Test: Games tab shows correct projects
        - Test: Game project cards link to correct detail pages
        - Test: Back navigation returns to Games tab

- [ ] **3.4 Run Phase 3 quality gates**
    - [ ] 3.4.a Run full test suite
    - [ ] 3.4.b Run lint and type-check
    - [ ] 3.4.c Manual verification of all three tabs

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

- [ ] **5.1 Update Featured card design**

    - [ ] **5.1.a Add category type labels**
        - Replace `[project]` with type: "software", "framework", "game", "mod"
        - Lowercase styling
        - Position at top of card (current bracket position)

    - [ ] **5.1.b Add `bg-card` background for description**
        - Type tag + title: keep transparent (current behavior)
        - Description text: use `bg-card` (solid, like existing `ProjectCard`)
        - Maintain visual hierarchy

    - [ ] **5.1.c Update section header**
        - Change "Featured Projects" to "Featured"
        - Maintain existing styling

- [ ] **5.2 Implement 4-card randomized layout**

    - [ ] **5.2.a Define card slot configuration**
        - Decide: Option A (Software, Software, Framework, Game OR Mod)
        - Or: Option B (Software, Framework, Game, Mod)
        - Document decision in code comments

    - [ ] **5.2.b Define card pools**
        - Software pool: CineXplorer, TaskFocus
        - Framework: ARC Framework (always)
        - Game pool: ActionRPGProject, SurvivalHorrorProject
        - Mod pool: subset from Phase 4.1.b

    - [ ] **5.2.c Implement client-side randomization**
        - Randomize on page load (client component or useEffect)
        - Select one from each pool per slot rules
        - Handle "Game OR Mod" logic if Option A chosen

    - [ ] **5.2.d Update grid layout for 4 cards**
        - Adjust grid columns if needed
        - Verify responsive behavior (2x2 on mobile?)

- [ ] **5.3 Write tests for Featured section**

    - [ ] **5.3.a Test card rendering**
        - Test: 4 cards render
        - Test: Each card has type label
        - Test: Framework slot always shows ARC Framework

    - [ ] **5.3.b Test randomization behavior**
        - Test: Software slots draw from correct pool
        - Test: Game/Mod slots draw from correct pools
        - Mock random for deterministic tests

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
