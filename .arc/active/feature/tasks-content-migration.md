# Task List: Content Migration from Squarespace

**PRD:** `.arc/active/feature/prd-content-migration.md`
**Created:** 2025-10-25
**Branch:** `feature/content-migration`
**Base Branch:** `main`
**Status:** In Progress

## Overview

**Purpose:** Migrate all portfolio content from legacy Squarespace site to Next.js, establishing type-safe data
structures, display components, and proper routing for projects, skills, education, and contact sections.

## Scope

### Will Do

- Define TypeScript interfaces for all content types (projects, skills, education, bio, contact)
- Migrate 9 software projects with images, descriptions, and metadata
- Create modular display components (sections, cards, detail pages)
- Implement tabbed project pages with software/mods separation (mods deferred via feature flag)
- Establish navigation and routing between all pages

### Won't Do

- Final visual design/styling (deferred to TWM Layout System feature)
- Mod content migration (deferred to backlog, feature flag disabled)
- Performance optimization (separate enhancement)

---

## Tasks

### **Phase 1:** Data Structures & Type Definitions

- [x] 1.0 Define TypeScript interfaces and sample data structures
    - [x] 1.1 Create Project interface in `src/types/project.ts`
    - [x] 1.2 Create Skills interface in `src/types/skills.ts`
    - [x] 1.3 Create Education interface in `src/types/education.ts`
    - [x] 1.4 Create About/Bio interface in `src/types/about.ts`
    - [x] 1.5 Create Contact interface in `src/types/contact.ts`
    - [x] 1.6 Create sample data files in `src/data/` demonstrating proper interface usage
    - [x] 1.7 Create centralized data exports in `src/data/index.ts`
    - [x] 1.8 Configure Vitest and React Testing Library for testing
    - [x] 1.9 Write basic type validation tests for interfaces
    - [x] 1.10 Verify TypeScript compilation passes with zero errors
    - [x] 1.11 Run incremental quality checks (type-check, lint, format, test)

### **Phase 2:** Content Migration

- [x] 2.0 Migrate project data from Squarespace (9 projects)
    - [x] 2.1 Migrate priority project 1: CineXplorer (new project with full details)
    - [x] 2.2 Migrate priority project 2: arc-agentic-dev-framework (new project)
    - [x] 2.3 Migrate priority project 3: arc-portfolio (new project - this portfolio)
    - [x] 2.4 Migrate existing project 4: TaskFocus (from Squarespace)
    - [x] 2.5 Migrate existing project 5: PetResort (from Squarespace)
    - [x] 2.6 Migrate existing project 6: NewGame+ Customizer for DOOM (from Squarespace)
    - [x] 2.7 Migrate existing project 7: Action RPG Project (from Squarespace)
    - [x] 2.8 Migrate existing project 8: Survival Horror Project (from Squarespace)
    - [x] 2.9 Migrate existing project 9: Pong Clone (from Squarespace)
    - [x] 2.10 Verify all projects have correct `order` field (1-9) and accurate links
    - [x] 2.11 Write data validation tests for projects data file
    - [x] 2.12 Run incremental quality checks (type-check, lint, format, test)

- [x] 3.0 Migrate skills, education, bio, and contact data
    - [x] 3.1 Migrate and reorganize skills data into updated category structure
    - [x] 3.2 Add skills from new projects (AI/LLM tools, modern frameworks)
    - [x] 3.3 Migrate education credentials (2 degrees: OSU CS, UTD Psychology)
    - [x] 3.4 Migrate bio content from Squarespace (3 paragraphs with markdown)
    - [x] 3.5 Migrate contact information (email + 3 social links)
    - [x] 3.6 Write data validation tests for skills, education, bio, contact data
    - [x] 3.7 Run incremental quality checks (type-check, lint, format, test)

- [x] 4.0 Complete image migration from Squarespace to Next.js structure
    - [x] 4.1 Create directory structure and download images from Squarespace using browser extension
    - [x] 4.2 Organize downloaded images into Next.js structure with proper naming (`{slug}.webp` for thumbnails,
        `screenshot-{n}.webp` for screenshots)
    - [x] 4.3 Update project data image paths from `.jpg` to `.webp` format for all 9 projects
    - [x] 4.4 Create `public/projects/README.md` documenting structure, conventions, and actual image counts
    - [x] 4.5 Verify all images load correctly in development (npm run dev)
    - [x] 4.6 Add image validation tests and audit existing test brittleness
        - Created `projects-images.test.ts` with 28 tests validating image paths, naming conventions, and data integrity
        - Tests caught real bug: ARC Framework image paths had wrong slug (`arc-framework` vs `arc-agentic-dev-framework`)
        - Audited all 5 data validation test files for brittleness
        - Refactored tests to use minimum thresholds (`.toBeGreaterThanOrEqual()`) instead of exact counts (`.toBe()`)
        - Removed hardcoded exact values (project counts, GPA values, array lengths)
        - Renamed migration-specific test sections to feature-focused names
        - Result: Tests remain comprehensive but are now future-proof for content growth
        - Test count: 246 passing (28 new image tests, 1 consolidated from refactoring)
    - [x] 4.7 Run incremental quality checks (type-check, lint, format, build)

### **Phase 3:** Placeholder Display Components

- [x] 5.0 Build basic navigation and layout foundation
    - [x] 5.1 Write behavior tests for Navigation (links, hrefs, content rendering - TDD: test first)
    - [x] 5.2 Create basic Navigation component (placeholder - semantic HTML + structural Tailwind only)
    - [x] 5.3 Add Navigation to root layout with links: Home, Projects, Skills, About, Contact
    - [x] 5.4 Verify navigation renders and links are functional (may link to non-existent pages - OK for now)
    - [x] 5.5 Clear starter Next.js homepage content (page.tsx)
    - [x] 5.6 Run incremental quality checks (type-check, lint, format, test)

    **Completed**: Created basic Navigation component with behavior tests, AdaptiveHero component with Framer Motion
    animations, and placeholder pages (/projects, /skills, /about, /contact). All tests passing (251 total).

    **Lessons Learned**: v0.dev workflow not effective for this project - direct collaboration in codebase more
    productive for creative layout work. Comprehensive testing, design review, and style documentation deferred to
    TWM Layout System feature (see `.arc/backlog/feature/prd-twm-layout-system.md`) where overall layout will be
    finalized.

- [x] 6.0 Create modular content section components and individual pages
    - [x] 6.1 Write behavior tests for SkillsSection (data rendering, structure - TDD: test first)
    - [x] 6.2 Create SkillsSection component displaying categorized skills (modular, reusable)
    - [x] 6.3 Create `/skills` page using SkillsSection component
    - [x] 6.4 Write behavior tests for EducationSection (data rendering, structure - TDD: test first)
    - [x] 6.5 Create EducationSection component displaying degrees (modular, reusable)
    - [x] 6.6 Write behavior tests for AboutSection (markdown rendering, content - TDD: test first)
    - [x] 6.7 Create AboutSection component with markdown support (modular, reusable)
    - [x] 6.8 Create `/about` page using both EducationSection and AboutSection components
    - [x] 6.9 Write behavior tests for ContactSection (links, external link attributes - TDD: test first)
    - [x] 6.10 Create ContactSection component with social links (modular, reusable)
    - [x] 6.11 Create `/contact` page using ContactSection component
    - [x] 6.12 Run incremental quality checks (type-check, lint, format, test)

    **Completed**: Created 3 modular content section components (Skills, Education, About, Contact) with TDD
    approach (30 new tests). Restructured `src/components/` to use `layout/`, `sections/`, and `projects/`
    directories with `__tests__/` subdirs. Implemented basic markdown link parsing for AboutSection. All pages
    (`/skills`, `/about`, `/contact`) now display real content. Fixed `.prettierignore` to exclude `.arc/`
    (handled by markdownlint). Quality metrics: 293 tests passing (100%), zero linting/type errors.

- [x] 7.0 Create tabbed project pages with software projects + stub mods
    - [x] 7.1 Update project order values in `src/data/projects.ts` (TaskFocus moves to position 2)
    - [x] 7.2 Verify all projects have appropriate `category` values for badge display
        **Completed**: Changed `category` from single string to string array for multiple categories.
        Updated all 9 projects with simplified category names. New categories: "Web App", "Desktop App",
        "Framework", "Game", "Modding Tool". TaskFocus now has ["Desktop App", "Web App"], DOOM NG+
        Customizer has ["Desktop App", "Modding Tool"]. Updated tests to handle array format. All 307 tests passing.
    - [x] 7.3 Write behavior tests for ProjectTabs component (tab switching, query param handling, active state - TDD)
    - [x] 7.4 Create ProjectTabs component (Software/Mods tabs with query param state: `?tab=mods`)
        **Completed**: Created ProjectTabs component with 12 comprehensive behavior tests. Component uses Next.js
        router and search params to manage tab state via query parameters (?tab=software or ?tab=mods). Defaults
        to Software tab. Handles keyboard navigation (Enter/Space). Proper ARIA roles for accessibility (tablist,
        tab, aria-selected). Uses theme semantic colors (border-border, text-accent, etc). All 319 tests passing.
    - [x] 7.5 Write behavior tests for ProjectCard (data rendering, category badge, tech tags, link - TDD)
    - [x] 7.6 Create ProjectCard component with category badge (prominent, first) + tech stack tags (secondary)
        **Completed**: Created ProjectCard component with 17 comprehensive behavior tests. Component displays
        project thumbnail, title, short description, category badges (prominent with bg-accent), and tech stack
        tags (secondary with border). Links to project detail page (/projects/{software|mods}/{slug}). Limits
        tech display to 3 items with "+N" indicator. Uses theme semantic colors throughout (bg-background,
        text-foreground, border-border, etc). Proper accessibility. All 336 tests passing.
    - [x] 7.7 Create projects list page at `/projects` with ProjectTabs component
        **Completed**: Updated `/projects/page.tsx` to integrate ProjectTabs component. Page includes header with
        title and description, ProjectTabs for navigation, and placeholder content area. Uses semantic theme colors
        and responsive layout (max-width container). Page renders correctly with
        functional tab switching. Zero type errors, zero linting violations.
    - [x] 7.8 Draft intro text for Software tab (emphasizes current focus, breadth)
    - [x] 7.9 Draft intro text for Mods tab (community work, maintenance, professionalism)
    - [x] 7.10 Implement software projects grid in Software tab (9 existing projects, revised order)
        **Completed (Tasks 7.8-7.10 batched)**: Enhanced `/projects/page.tsx` with tab-specific content. Software
        tab displays 2-paragraph intro emphasizing full-stack expertise and current focus areas, followed by
        responsive grid (md:2-col, lg:3-col) showing all 9 projects sorted by order field. Mods tab shows 2-paragraph
        intro highlighting community work and professional approach, with placeholder message for Task 8.0. Page uses
        useSearchParams to conditionally render tab content. Zero type errors, zero linting violations.
    - [x] 7.11 Create `src/data/mods.ts` with 2 placeholder mod entries (uses Project interface)
    - [x] 7.12 Implement placeholder mods grid in Mods tab (2 placeholders, same UI as software)
    - [x] 7.13 Export mods from `src/data/index.ts`
        **Completed (Tasks 7.11-7.13 batched)**: Created `src/data/mods.ts` with 2 placeholder mod entries
        (Skyrim and Fallout 4 mods with obvious dummy data). Mods use same Project interface, validating component
        reusability. Updated `/projects/page.tsx` to display mods grid in Mods tab using same responsive layout
        (md:2-col, lg:3-col) and ProjectCard component with `categoryType="mods"`. Added note indicating placeholder
        status. Exported mods from `src/data/index.ts`. Zero type errors, zero linting violations.
    - [x] 7.14 Write behavior tests for ProjectDetail (data display, external links, back button - TDD)
    - [x] 7.15 Create ProjectDetail component with back button (preserves tab state via query param)
        **Completed (Tasks 7.14-7.15 batched)**: TDD approach - wrote 20 comprehensive behavior tests first, then
        implemented ProjectDetail component. Tests cover: basic rendering (title, description, categories, tech
        stack, features), external links (GitHub, live demo, download, NexusMods with proper target="_blank" and
        rel attributes), back button (preserves tab state via query param, defaults to software tab), optional
        metadata (teamSize, duration, role, highlights, architectureNotes), and accessibility (semantic headings,
        aria-labels). Component uses theme semantic colors throughout. All 20 tests passing. Zero type errors,
        zero linting violations.
    - [x] 7.16 Create dynamic detail page at `/projects/software/[slug]`
    - [x] 7.17 Create dynamic detail page at `/projects/mods/[slug]` (placeholder support)
    - [x] 7.18 Implement `generateStaticParams` for software project slugs
    - [x] 7.19 Implement `generateStaticParams` for placeholder mod slugs
        **Completed (Tasks 7.16-7.19 batched)**: Created dynamic route pages for both software and mods categories.
        Both pages use ProjectDetail component and preserve tab state via query param. Software page defaults to
        'software' tab, mods page defaults to 'mods' tab. Implemented generateStaticParams for static generation
        at build time - 9 software project pages + 2 mod pages (11 total). Build confirms all pages generated
        successfully. Pages use async params/searchParams per Next.js 15 conventions. Zero type errors, zero
        linting violations.
    - [x] 7.20 Verify tab switching, routing, back navigation, and all links functional
        **Completed**: User verified in-browser testing - tab switching works correctly, routing between list and
        detail pages functional, back button preserves tab state, all external links open correctly.
    - [x] 7.21 Run incremental quality checks (type-check, lint, format, test)
        **Completed**: All quality gates passing - TypeScript (zero errors), ESLint (zero violations, 1 pre-existing
        warning), Prettier (all formatted), Markdown lint (zero violations), Build (success - 11 static pages generated),
        Tests (356/356 passing, 100% pass rate).

- [-] ~~Migrate and integrate mod data from NexusMods~~ *(was Task 8.0 - deferred)*
    **DEFERRED**: Moved to backlog (`.arc/backlog/feature/BACKLOG-FEATURE.md`). Mods tab disabled via feature flag
    (`FEATURES.SHOW_MODS_TAB` in `src/config/features.ts`). All mods code/routes preserved for future re-enablement.

- [ ] **8.0 Verify routing and navigation integration**
    - [ ] 8.1 Verify routing works between all pages (Home ↔ Projects ↔ Skills ↔ About ↔ Contact)
    - [ ] 8.2 Ensure all internal navigation links are functional
    - [ ] 8.3 Verify project detail pages render correctly and back button works
    - [ ] 8.4 Confirm `/about` page displays both Education and About sections correctly
    - [ ] 8.5 Write integration tests for navigation and routing flows
    - [ ] 8.6 Run incremental quality checks (type-check, lint, format, test)

### **Phase 4:** Validation & Quality Assurance

- [ ] **9.0 Validate content accuracy, type safety, and display functionality**
    - [ ] 9.1 Verify zero TypeScript errors across all files
    - [ ] 9.2 Verify all content section pages render correctly (`/skills`, `/about`, `/contact`)
    - [ ] 9.3 Verify `/about` page displays both Education and About sections correctly
    - [ ] 9.4 Verify all 9 software projects display correctly with accurate data
    - [ ] 9.5 Verify category badges display correctly for software projects
    - [ ] 9.6 Verify all external links open correctly in new tabs
    - [ ] 9.7 Verify project ordering matches revised priority (CineXplorer-1, TaskFocus-2, etc.)
    - [ ] 9.8 Verify skills categories are complete with technologies from all projects
    - [ ] 9.9 Verify education, bio, and contact data accuracy
    - [ ] 9.10 Verify navigation header shows all sections and links work correctly
    - [ ] 9.11 Run full test suite and verify all tests pass
    - [ ] 9.12 Test all navigation and routing flows manually (all pages accessible)
    - [ ] 9.13 Run full quality gate suite (type-check, lint, format, markdown, build, test)
    - [ ] 9.14 Verify build succeeds and site renders without runtime errors

---

## Success Criteria

- [ ] TypeScript interfaces defined for all content types (projects, skills, education, bio, contact)
- [ ] All 9 software projects migrated with accurate data and images
- [ ] Skills, education, bio, and contact data migrated from Squarespace
- [ ] Modular display components created (sections, cards, detail pages)
- [ ] Navigation and routing functional between all pages
- [ ] All quality gates pass (type-check, lint, format, markdown, build, tests)
- [ ] Ready for merge to main
