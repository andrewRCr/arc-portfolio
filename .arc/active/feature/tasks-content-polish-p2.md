# Task List: Content Polish P2 - Supporting Pages

**PRD:** `.arc/active/feature/prd-content-polish-p2.md`
**Created:** 2026-01-19
**Branch:** `feature/content-polish-p2`
**Base Branch:** `main`
**Status:** In Progress

## Overview

**Purpose:** Complete Skills, Contact, and About pages with visual polish, functional contact form, and modular
skills logo system with project filtering.

## Scope

### Will Do

- Create modular `SkillLogoGrid` component using SVG logos from `simple-icons`
- Add featured skills row to Home page (6-8 core skills)
- Reorganize Skills page with DetailCard-styled categories and content audit
- Implement skill-to-project filtering (click logo → filtered Projects view)
- Build contact form with Zeptomail delivery, honeypot, and rate limiting
- Polish About page: EducationCard component, photo integration, copy revision

### Won't Do

- Full filtering controls on Projects page (only skill-click filter with clear)
- Proficiency indicators / skill level bars
- Availability status on Contact page
- Performance optimization (separate work if needed)

---

## Tasks

### **Phase 1:** Skills Data and Logo Component Foundation

**Purpose:** Establish data structure and reusable component for skill logos.

- [x] **1.1 Enhance skills data structure**

    **Approach:** Forward migration - update type, data, and all consumers together. No backward compat.

    - [x] **1.1.a Update `Skills` type in `src/types/skills.ts`**
        - Added `Skill` interface with `name`, `featured?: boolean`, `iconSlug?: string`
        - Updated `Skills` mapped type to use `Skill[]` instead of `string[]`

    - [x] **1.1.b Update `src/data/skills.ts` with enhanced structure**
        - Migrated all skills to `{ name, featured?, iconSlug? }` object format
        - Marked 6 featured: TypeScript, React, Python, Django, C#, .NET
        - Added iconSlug mappings for ~40 skills with simple-icons identifiers

    - [x] **1.1.c Migrate all consumers to new data structure**
        - Updated `SkillsSection` to render `skill.name`
        - Refactored test files to test structure/behavior over content
        - Removed brittle content-coupled tests from data validation

    - [x] **1.1.d Run type checking to verify all consumers updated**
        - Type check passes, all 965 tests pass

- [x] **1.2 Install and configure simple-icons**

    - [x] **1.2.a Install `simple-icons` package**
        - Installed simple-icons v16.6.0

    - [x] **1.2.b Create utility for icon retrieval**
        - Created `src/lib/skill-icons.ts` with `getSkillIcon()` and `hasSkillIcon()`
        - Lazy-initialized Map lookup by slug for efficiency

    - [x] **1.2.c Verify icons load correctly for test skills**
        - 36 valid icons, 17 skills without icons (intentional)
        - Fixed invalid slugs: `css3`→`css`, removed non-existent slugs

    - [x] **1.2.d Source custom icons for skills not in simple-icons**
        - **C#**: Added custom icon from devicon (MIT license), re-enabled `featured: true`
        - **Claude Code**: Uses `claude` slug (already in simple-icons v16.6.0)
        - **Gemini CLI**: Uses `googlegemini` slug (already in simple-icons v16.6.0)
        - **Codex CLI**: Added OpenAI custom icon from Wikimedia Commons (CC0, official brand)
        - **SQL Server**: Skipped - complex multi-path SVG, not a featured skill
        - Added custom icon infrastructure to `skill-icons.ts` for future additions
        - Note: No "Clio mascot" exists for Claude - only sunburst logo

- [x] **1.3 Create SkillLogoGrid component**

    - [x] **1.3.a Write tests for `SkillLogoGrid` component**
        - Created `src/components/skills/__tests__/SkillLogoGrid.test.tsx`
        - 19 tests across 6 describe blocks: Logo Rendering, Layout Prop, Size Prop, Link Behavior, Missing Icons
        Handling, Accessibility

    - [x] **1.3.b Implement `SkillLogoGrid` component**
        - Created `src/components/skills/SkillLogoGrid.tsx`
        - Props: `skills`, `layout` (row | grid), `size` (sm | md | lg), `linkToProjects`, `className`
        - SVG rendering via `getSkillIcon()`, graceful skip for missing icons
        - Optional Link wrapping to `/projects?skill=SkillName`

    - [x] **1.3.c Run tests - all 19 tests pass**

    - [x] **1.3.d Run quality gates - type-check, lint, format all pass**

### **Phase 2:** Home Page Skills Row Integration

**Purpose:** Add featured skills visual to Home page below FeaturedProjects.

- [x] **2.1 Integrate SkillLogoGrid on Home page**

    - [x] **2.1.a Update `src/app/page.tsx` to include skills row**
        - Added `featuredSkills` extraction with explicit ecosystem ordering
        - Order: TypeScript, React, Python, Django, C#, .NET
        - Rendered `SkillLogoGrid` with `layout="row"`, `linkToProjects={true}`

    - [x] **2.1.b Verify no-scroll behavior on desktop (1440p)** - Confirmed

    - [x] **2.1.c Handle mobile layout** - Keep on mobile, defer sizing to 2.2

    - [x] **2.1.d Run quality gates** - All pass

    **Additional fixes during integration:**
    - Added `viewBox` field to `SkillIconData` interface for custom icon support
    - C# and OpenAI custom icons now render correctly with proper viewBox values

- [x] **2.2 Visual refinement**

    - [x] **2.2.a Adjust spacing and positioning**
        - Implemented responsive positioning: hero on mobile, below FeaturedSection on tablet/desktop
        - Stabilized card heights with `min-h-24` to prevent layout shift
        - Tuned spacing: `mt-6 md:mt-16` for below-featured position

    - [x] **2.2.b Verify logo sizing and mobile layout**
        - Desktop: 10 icons in single row below FeaturedSection
        - Mobile boxed: curated 6 icons (single row) in hero
        - Mobile fullscreen: full 10 icons (5/5 split) in hero
        - Responsive skill selection based on viewport and layout mode

    - [x] **2.2.c Add styled tooltip on skill icon hover**
        - Added shadcn/ui Tooltip to SkillLogoGrid component
        - Positioned below icon, shows skill name on hover

### **Phase 3:** Skills Page Reorganization

**Purpose:** Transform Skills page from text dump to structured, visually engaging presentation.

- [x] **3.1 Content audit & data restructuring**

    - [x] **3.1.a Review skills against project portfolio**
        - Used Explore agents to audit CineXplorer and TaskFocus repos
        - Identified skills with project evidence vs "resume padding"
        - Confirmed featured skills align with actual project usage

    - [x] **3.1.b Restructure skills data**
        - Pruned: MySQL, v0.dev, CI/CD, GitHub (redundant), Caliburn Micro, EJS
        - Added: Vite, TanStack Query, Dapper, Playwright, Pytest, SQLite
        - Demoted to text-only: Bootstrap
        - Reordered categories: Frontend, Backend, Databases, DevOps, AI, Testing
        - Languages get special hero treatment (no card, centered row)
        - Methodologies excluded from display

- [x] **3.2 SkillsSection visual implementation**

    - [x] **3.2.a Update SkillsSection component**
        - Languages displayed as centered hero row above cards
        - 6 categories in 2-column DetailCard grid
        - Primary skills (with icons) as centered SkillLogoGrid rows
        - Secondary skills (text-only) as linked text lists below
        - All skills link to `/projects?skill=` filter

    - [x] **3.2.b Visual polish for desktop**
        - Reduced grid gap (gap-4) to fit 1440p without scroll
        - Centered icon grids and text lists within cards
        - Updated page subtitle: "Proficiencies across the full stack."

- [x] **3.3 Tests & mobile verification**

    - [x] **3.3.a Write/update tests for SkillsSection**
        - 9 tests in `SkillsSection.test.tsx` covering all requirements
        - Languages hero row, category cards, icon/text skill rendering, semantic structure, category order

    - [x] **3.3.b Verify mobile responsiveness**
        - Languages hero: curated 5 icons on mobile (TS, JS, Python, C#, C++), `responsiveLg` size, `relaxed` gap
        - Added `useDelayedShow` fade-in to prevent hydration flash
        - TouchTarget wrapping on secondary skill text links with `-my-2` for compact layout
        - Cards stack single column, touch targets WCAG 44px compliant

    - [x] **3.3.c Run quality gates** - All passed (type-check, lint, format, markdown, build, 986 tests)

### **Phase 4:** Skills-to-Projects Filtering

**Purpose:** Enable multi-skill filtering on Projects page with popover controls and skill logo entry points.

**Design decisions (from UX research):**

- **OR logic** for multi-skill filtering (show projects matching ANY selected skill)
- Filter popover always visible (right-aligned in header row)
- When filtered: tabs hidden, filter indicator chips shown (left-aligned), smooth crossfade transition
- Categorized skills in popover (matching Skills page organization)
- Searchable filter list (40+ skills warrants search)
- Result counts per skill option ("React (5)")
- Semantic checkboxes with fieldset/legend for accessibility
- ARIA live region for result count announcements

- [x] **4.1 Implement filtered Projects view (single-skill foundation)**

    - [x] **4.1.a Write tests for skill filtering logic**
        - Created `src/lib/__tests__/project-filters.test.ts` with 14 tests
        - Tests cover: basic filtering, case-insensitivity, sorting by order, cross-project-type filtering,
          empty results, edge cases (spaces, special chars, partial matches, whitespace trimming)

    - [x] **4.1.b Create filter utility function**
        - Created `src/lib/project-filters.ts` with `filterProjectsBySkill()`
        - Case-insensitive matching against project `tags` array
        - Returns filtered results sorted by `order` field

    - [x] **4.1.c Run tests - all 14 tests pass**

- [x] **4.2 Extend filter utility for multi-skill support**

    - [x] **4.2.a Write tests for multi-skill filtering (OR logic)**
        - Added 14 new tests to `src/lib/__tests__/project-filters.test.ts`
        - Tests cover: OR logic, empty array handling, sorting, deduplication, cross-project-type,
          case-insensitivity, whitespace trimming, empty strings in array, special characters

    - [x] **4.2.b Implement `filterProjectsBySkills()` function**
        - Added to `src/lib/project-filters.ts`
        - OR logic: project matches if `tags` contains ANY of the skills
        - Empty array returns all projects (no filtering)
        - Normalizes skills (trim, lowercase, filter empty)
        - Sorted by order field

    - [x] **4.2.c Run tests - all 28 tests pass**

- [x] **4.3 Data audit: Ensure skill-to-project coverage**

    - [x] **4.3.a Audit skills with icons vs project tags**
        - Found 22 skills with icons not in any project tags
        - Categories: naming mismatches, testing tools, DevOps, AI tools, basic languages

    - [x] **4.3.b Update project tags to close gaps**
        - **CineXplorer**: Added 24 tags (Vite, Vitest, RTL, Pytest, Swagger, GitHub Actions, Caddy,
          Pydantic, TanStack Query, Redis, HTML/CSS/JS, Claude Code, Codex CLI, Copilot, Warp, CodeRabbit)
        - **ARC Framework**: Added AI tools (Claude Code, Codex CLI, Gemini CLI, Copilot, Warp, CodeRabbit)
        - **arc-portfolio**: Added 17 tags (testing, CI/CD, Framer Motion, AI tools, HTML/CSS/JS)
        - **TaskFocus**: Added Swagger, Postman, HTML/CSS/JS
        - **PetResort**: Fixed "Express" → "Express.js", added Postman, HTML/CSS/JS
        - **SQLite**: Removed iconSlug (not used in any project)
        - **Framer Motion**: Uncommented with conditional note (remove if startup animation not implemented)
        - All skills with icons now have matching project tags (verified: 0 gaps)

    - [x] **4.3.c Run quality gates** - All passed (type-check, lint, 1014 tests)

- [x] **4.4 Create SkillFilterPopover component**

    - [x] **4.4.a Write tests for SkillFilterPopover**
        - Created `src/components/projects/__tests__/SkillFilterPopover.test.tsx`
        - 22 tests across 7 describe blocks: Trigger Button, Popover Opening, Search Functionality,
          Skill Selection, Result Counts, Accessibility, Clear All
        - Tests cover: filter count display, categorized skills (excluding Methodologies),
          search filtering, checkbox toggling, result counts, keyboard accessibility

    - [x] **4.4.b Install shadcn/ui Command component**
        - Installed Command component via `npx shadcn@latest add command`
        - Command provides searchable list pattern with cmdk integration
        - Created `src/components/ui/command.tsx`

    - [x] **4.4.c Implement SkillFilterPopover component**
        - Created `src/components/projects/SkillFilterPopover.tsx`
        - Uses Popover + Command (cmdk) for searchable categorized list
        - Filters to skills with icons AND matching projects (excludes Methodologies)
        - Displays result counts per skill, supports checkbox selection

    - [x] **4.4.d Run tests - all 23 tests pass**
        - Added scrollIntoView mock to test setup (required for cmdk)

- [x] **4.5 Create FilterIndicator component**

    - [x] **4.5.a Write tests for FilterIndicator**
        - Created `src/components/projects/__tests__/FilterIndicator.test.tsx`
        - 13 tests across 5 describe blocks: Rendering, Dismiss Buttons, Clear All, Accessibility, Empty State

    - [x] **4.5.b Implement FilterIndicator component**
        - Created `src/components/projects/FilterIndicator.tsx`
        - Uses Badge with dismiss buttons, "Filtering by:" label, Clear all button
        - Returns null when skills array is empty

    - [x] **4.5.c Run tests - all 13 tests pass**

- [x] **4.6 Create state-based crossfade utility**

    - [x] **4.6.a Write tests for Crossfade component**
        - Created `src/components/ui/__tests__/Crossfade.test.tsx`
        - 14 tests: content rendering, transition classes, reduced motion, layout, accessibility

    - [x] **4.6.b Implement Crossfade component**
        - Created `src/components/ui/Crossfade.tsx`
        - State-driven opacity toggle with `active`, `activeContent`, `inactiveContent` props
        - Visible content in flow, hidden content absolute (prevents layout shift)
        - Includes motion-reduce:transition-none for accessibility
        - Added docstring distinguishing from useDelayedShow (timer) and useHeaderCrossfade (scroll)

    - [x] **4.6.c Run tests - all 14 tests pass**

- [x] **4.7 Update Projects page layout and state**

    - [x] **4.7.a Write tests for Projects page filtered state**
        - Created `src/app/projects/__tests__/page-filtering.test.tsx`
        - 17 tests: query param handling, header layout states, filtered results, ARIA live region, interactions

    - [x] **4.7.b Update Projects page header layout**
        - Flex layout with Crossfade between Tabs (normal) and FilterIndicator (filtered)
        - SkillFilterPopover always visible on right
        - Updated `src/app/projects/page.tsx`

    - [x] **4.7.c Implement filtered state logic**
        - Parses `?skills=React,TypeScript` query param
        - Filters across all project types using `filterProjectsBySkills()`
        - URL updates on skill selection/removal
        - ARIA live region announces result count

    - [x] **4.7.d Run tests - all 27 Projects page tests pass**

    - [x] **4.7.e Run quality gates - type check and lint pass**

- [x] **4.8 Connect skill logos to filtered view (entry points)**

    - [x] **4.8.a Update `SkillLogoGrid` links**
        - Changed link from `?skill=` to `?skills=` to match filtering URL format
        - Updated docstring and test to reflect new URL structure
        - Single skill in URL (entry point), user can add more via popover

    - [x] **4.8.b Manual testing of full flow**
        - Click skill logo on Home → filtered Projects view with that skill
        - Click skill logo on Skills page → filtered Projects view
        - Open filter popover → add/remove skills → results update
        - Clear filter → normal tabbed view restored with crossfade
        - Verify crossfade animation is smooth, respects reduced motion
        - **Incidental fixes during testing:**
            - Added `showInDefaultFilters` prop to Skill type for curated filter list
            - Curated default set: 3+ skills per category (22 total)
            - Filter shows curated skills + any externally-applied skills
            - Fixed Crossfade layout shift with min-h-11 on both states
            - Fixed FilterIndicator/ProjectTabs border alignment
            - Fixed text-only skill links (`skill=` → `skills=`)
            - Added missing tags: Git (5 projects), Playwright (2), Azure DevOps (1)
            - Visual polish: ghost filter button, checkbox tokens, hover states

    - [x] **4.8.c Run E2E tests for navigation and filtering flow**
        - Fixed smoke test: scoped nav link assertions to `mainNav` (SkillLogoGrid links now match "PROJECTS")
        - Updated visual regression baselines for styling changes
        - 199 E2E tests pass

    - [x] **4.8.d Run full quality gates**
        - Type check, lint, format, markdown lint, build all pass
        - 1081 unit tests pass

- [x] **4.9 Visual polish for filtering controls**

    - [x] **4.9.a Review FilterIndicator styling**
        - Done incidentally during 4.8.b manual testing
        - Badge sizing, spacing, dismiss button all verified
        - Alignment with Filter button confirmed

    - [x] **4.9.b Review SkillFilterPopover styling**
        - Done incidentally during 4.8.b manual testing
        - Fixed ghost button hover opacity in dark mode (global button.tsx fix)
        - Fixed skill count readability on hover (uses opacity-60 instead of text-muted-foreground)
        - Centered Clear all button in popover

    - [x] **4.9.c Verify Crossfade transition smoothness**
        - Done incidentally during 4.8.b manual testing
        - No layout shift (min-h-11 on both states)
        - Reduced motion behavior verified

    - [x] **4.9.d Mobile adaptation for filter controls**

        - [x] **4.9.d.1 Extract MobileDrawer component from ThemeControlDrawer**
            - Created `src/components/ui/MobileDrawer.tsx`
            - Window-aligned positioning using DEFAULT_LAYOUT_TOKENS
            - Standard header with title and 44px touch-target close button
            - Children slot for drawer body content

        - [x] **4.9.d.2 Refactor ThemeControlDrawer to use MobileDrawer**
            - Replaced Sheet/SheetContent with MobileDrawer wrapper
            - All 21 ThemeControlDrawer tests pass
            - Removed unused imports (X icon, Sheet components, DEFAULT_LAYOUT_TOKENS)

        - [x] **4.9.d.3 Write tests for MobileDrawer**
            - Created `src/components/ui/__tests__/MobileDrawer.test.tsx`
            - 12 tests: rendering, close behavior, touch targets, accessibility
            - All tests pass

        - [x] **4.9.d.4 Write tests for SkillFilterDrawer (TDD)**
            - Created `src/components/projects/__tests__/SkillFilterDrawer.test.tsx`
            - 19 tests: trigger, drawer opening, categories, selection, clear all, close, touch targets, a11y
            - Tests fail as expected (component not yet implemented)

        - [x] **4.9.d.5 Implement SkillFilterDrawer**
            - Created `src/components/projects/SkillFilterDrawer.tsx`
            - Uses MobileDrawer, categorized skill list, Clear all button
            - 44px touch targets (min-h-11) on trigger, skill items, clear button
            - All 20 tests pass

        - [x] **4.9.d.6 Create SkillFilterControl wrapper with ResponsiveSwitch**
            - Created `src/components/projects/SkillFilterControl.tsx`
            - Added `breakpoint` prop to ResponsiveSwitch (supports "sm" for phone-only)
            - Uses `breakpoint="sm"`: phone gets drawer, tablet+ gets popover
            - Updated Projects page to use SkillFilterControl

        - [x] **4.9.d.7 Update FilterIndicator touch targets for mobile**
            - Badges now tappable to dismiss (entire badge is button, X is decorative)
            - Badges grouped with Clear all so they wrap as a unit
            - Clear all has 44px touch target on phone (`min-h-11 sm:min-h-0`)

        - [x] **4.9.d.8 Update Projects page layout for mobile filter row**
            - Changed to flex-col on phone, flex-row on tablet+ (sm breakpoint)
            - Filter button centered on phone, right-aligned on tablet+

        - [x] **4.9.d.9 Manual testing on mobile viewports**
            - SkillFilterDrawer: Command search, scroll shadows, OverlayScrollbars padding
            - MobileDrawer: fillHeight prop, safe-area-inset-bottom for iOS
            - FilterIndicator: compact badges, grouped wrapping behavior
            - All touch targets verified

        - [x] **4.9.d.10 Run quality gates and polish spacing**
            - Fixed Projects page mobile content top padding (reduced via CSS override)
            - Fixed ProjectTabs centering on mobile (inline-flex with border hugging tabs)
            - All quality gates pass: type-check, lint, format, markdown, build, 1113 tests

    - [x] **4.9.e Run full quality gates (phase complete)**
        - All gates passed in 4.9.d.10

### **Phase 5:** Contact Form Implementation

**Purpose:** Build functional contact form with email delivery and spam protection.

- [x] **5.1 Environment setup**

    - [x] **5.1.a Configure Zeptomail API key**
        - Added `ZEPTOMAIL_API_KEY` to `.env.local` (quotes required - key contains space)
        - Updated `.env.example` with template and Vercel deployment note

    - [x] **5.1.b Install form dependencies**
        - Installed react-hook-form ^7.71.1, zod ^4.3.5, @hookform/resolvers ^5.2.2
        - Fixed pre-existing `tar` vulnerability via `npm audit fix`

- [x] **5.2 Create contact form component**

    - [x] **5.2.a Write tests for form validation (TDD)**
        - 16 tests covering: rendering, required fields, email format, honeypot, submission, loading state, accessibility
        - Tests written first per TDD protocol

    - [x] **5.2.b Implement `ContactForm` component**
        - Created `src/components/contact/ContactForm.tsx`
        - react-hook-form + zod v4 validation (required `noValidate` on form for jsdom compatibility)
        - Fields: name, email, message + hidden honeypot
        - States: idle, submitting, success, error

    - [x] **5.2.c Style form with TWM aesthetic**
        - Monospace labels (`font-mono`) for TUI feel
        - Theme-aware inputs: `border-input`, `focus:border-ring`
        - Clean, minimal styling

    - [x] **5.2.d All 16 tests pass**

- [x] **5.3 Implement API route**

    - [x] **5.3.a Write tests for API endpoint (TDD)**
        - 14 tests covering: valid submission, validation errors, honeypot, rate limiting, email service errors

    - [x] **5.3.b Create `/api/contact` route**
        - Created `src/app/api/contact/route.ts`
        - Server-side zod validation (same schema as client)
        - Honeypot check (silent success, no email)
        - Vercel KV rate limiting (5 req/min per IP) with in-memory fallback for local dev
        - Zeptomail API integration with HTML/text email
        - Added KV database setup to `BACKLOG-TECHNICAL.md` (deployment prerequisite)

    - [x] **5.3.c All 14 tests pass**

    - [x] **5.3.d Quality gates pass**

- [x] **5.4 Integrate form into Contact page**

    - [x] **5.4.a Update `ContactSection` component**
        - Added `ContactForm` import and integrated as primary contact method
        - Two-column grid layout: form left, direct contact right (stacks on mobile)
        - Email and social links preserved under "Or reach out directly" heading

    - [x] **5.4.b Manual testing**
        - Verified form submission, validation states, honeypot, rate limiting

    - [x] **5.4.c Run E2E tests for contact flow**
        - Updated visual regression baselines (contact page, rose-pine-dark-mobile)
        - All 199 E2E tests pass

    - [x] **5.4.d Visual polish**
        - Desktop: Card layout with social links header, form body
        - Mobile: Standalone layout with icon-only social links
        - Email obfuscation via ObfuscatedMailtoButton (scraper protection)
        - Consistent accent styling for social links, responsive form fields

### **Phase 6:** About Page Polish

**Purpose:** Improve About page visual presentation, add photo, revise copy.

- [x] **6.1 Create EducationCard component**

    - [x] **6.1.a Write tests for `EducationCard` component**
        - 13 tests covering header, body, optional fields, card structure, monospace styling

    - [x] **6.1.b Implement `EducationCard` component**
        - Created `src/components/about/EducationCard.tsx`
        - Header (bg-card/80): Institution name (drops "The " prefix on phone)
        - Body (bg-background/80): Major + degree type (joined, monospace, square corners)
        - Major uses bg-secondary/80, degree uses bg-muted - creates "structured data" aesthetic
        - Metadata badges (rounded): location, year, GPA (right-aligned)

    - [x] **6.1.c Run tests - all pass**

    - [x] **6.1.d Update `EducationSection` to use new component**
        - 2-column grid on md+, stacked on mobile

    - [x] **6.1.e Visual iteration and quality gates**
        - Extensive visual prototyping via `/dev/education-variants` test page
        - Final design: joined major/degree with monospace font, square corners
        - Phone responsive: stacked layout, abbreviated locations (state abbrevs), shorter institution names
        - Added `src/lib/state-abbreviations.ts` utility
        - Created permanent `/dev/sandbox` page for future visual prototyping
        - All quality gates pass (type-check, lint, format, build, 1154 tests)

- [x] **6.2 Add professional photo**

    - [x] **6.2.a Add photo to public assets**
        - Added `public/profile-photo.jpg` (original 1.6MB)
        - Optimized to `public/profile-photo.webp` (44KB, 600x800px)

    - [x] **6.2.b Integrate photo into About page layout**
        - Photo in separate pane (right on desktop, top on mobile)
        - Photo has decorative card with caption footer: `// andrew.jpg`
        - Alt text: "Andrew Creekmore, full-stack developer"

    - [x] **6.2.c Verify responsive layout**
        - Desktop: Photo pane on right with bg-card/80
        - Mobile: Photo pane on top, centered

- [x] **6.3 Bio section styling**

    - [x] **6.3.a Update bio card with two-pane vertical split**
        - Bio pane: bg-background/80 (main content area)
        - Photo pane: bg-card/80 (sidebar-like)
        - Photo card: border-2 border-secondary/80, bg-accent/80 caption footer

    - [x] **6.3.b Cleanup: Remove unused highlightedAchievements feature**
        - Removed from AboutSection.tsx, types/about.ts, data/about.ts
        - Removed related tests from about.test.ts

- [x] **6.4 Copy revision**

    - [x] **6.4.a Review and revise bio content**
        - Rewrote bio for confident, matter-of-fact tone (removed "recently graduated", "eager to add value")
        - Para 1: Psychology background → craft of software → precision/compounding appeal → full-stack →
          AI collaboration philosophy (traditional discipline + deliberate partnership)
        - Para 2: Game dev as hobbyist interest, modding stats with squared-off badge styling
        - Added optional `tagline` field to About type, rendered with muted styling anchored to bottom
        - Tagline: "Film enthusiast. Eagle Scout."
        - Sized up bio text to match ProjectDetail (`text-base sm:text-lg`)
        - Removed unused `parseMarkdownLinks` function (simplified to placeholder-only parsing)

    - [x] **6.4.b Verify rendered output**
        - Placeholders render correctly (modding link, download count)
        - Visual review at multiple viewport widths
        - Tagline anchors to bottom when photo pane is taller

### **Phase 7:** Final Quality Gates and Integration Testing

- [ ] **7.1 Full quality gate suite**

    - [ ] **7.1.a Run all quality checks**
        - `npm run type-check` - zero errors
        - `npm run lint` - zero violations
        - `npm run format:check` - passes
        - `npm run lint:md` - zero violations
        - `npm run build` - succeeds
        - `npm test` - all tests pass

    - [ ] **7.1.b Run E2E test suite**
        - `npm run test:e2e` - all viewports pass

- [ ] **7.2 Cross-page integration verification**

    - [ ] **7.2.a Manual testing of full user flows**
        - Home → click skill logo → filtered Projects → clear → normal Projects
        - Skills page → click skill logo → filtered Projects
        - Contact form submission → email delivery
        - About page visual review

    - [ ] **7.2.b Verify no regressions from P1 work**
        - Projects page tabs still work
        - FeaturedSection still randomizes
        - DetailHeader scroll behavior intact

---

## Implementation Notes

**Skills Data Evolution (Forward Migration):**
The skills data structure changes from flat string arrays to objects with metadata. This enables the
`featured` flag for Home page subset and `iconSlug` for simple-icons mapping. All consumers are
migrated forward in Task 1.1 - no backward compatibility layer. Type checking will catch any missed
consumers; fix them before proceeding rather than adding compatibility shims.

**Simple-Icons Usage:**
The simple-icons package provides SVG path data, not React components. The `skill-icons.ts` utility
will need to construct SVG elements from this data, handling color/sizing appropriately.

**Rate Limiting Strategy:**
For the contact form, start with simple in-memory rate limiting (requests per IP per time window).
If more robust solution needed, Vercel KV or edge middleware can be added later.

**Vercel Configuration:**
Actual Vercel environment variable setup deferred until contact form is ready for production testing.
Document the required variables so setup is straightforward when needed.

---

## Success Criteria

- [ ] SkillLogoGrid component renders SVG logos from simple-icons
- [ ] Home page displays 6-8 featured skills without scrolling on desktop
- [ ] Skills page organized with DetailCard categories and logo/text hierarchy
- [ ] Clicking skill logo navigates to filtered Projects view
- [ ] Contact form successfully delivers emails via Zeptomail
- [ ] Spam protection (honeypot + rate limiting) functional
- [ ] EducationCard component follows DetailCard visual pattern
- [ ] About page includes professional photo with proper placement
- [ ] Bio copy revised for clarity and impact
- [ ] All quality gates pass (type-check, lint, format, markdown lint, build, tests)
- [ ] No regressions in existing functionality (Projects, FeaturedSection, etc.)
- [ ] Ready for merge to main
