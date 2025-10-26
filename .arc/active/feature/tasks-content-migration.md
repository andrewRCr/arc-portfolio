# Tasks: Content Migration from Squarespace

**Feature**: Content Migration from Squarespace
**PRD**: `.arc/active/feature/prd-content-migration.md`
**Branch**: `feature/content-migration`
**Status**: READY - Theme system complete, resuming Task 7.0 (expanded for tabbed project pages with mods)

## Tasks

### Phase 1: Data Structures & Type Definitions

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

### Phase 2: Content Migration

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
    - [x] 4.1 Create directory structure and download images from Squarespace using browser extension (Image Downloader Plus)
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

### Phase 3: Placeholder Display Components

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
    TWM Layout System feature (see `.arc/upcoming/feature/prd-twm-layout-system.md`) where overall layout will be
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

- [ ] 7.0 Create tabbed project pages with software projects + stub mods
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
    - [ ] 7.7 Create projects list page at `/projects` with ProjectTabs component
    - [ ] 7.8 Draft intro text for Software tab (emphasizes current focus, breadth)
    - [ ] 7.9 Draft intro text for Mods tab (community work, maintenance, professionalism)
    - [ ] 7.10 Implement software projects grid in Software tab (9 existing projects, revised order)
    - [ ] 7.11 Create `src/data/mods.ts` with 2 placeholder mod entries (uses Project interface)
    - [ ] 7.12 Implement placeholder mods grid in Mods tab (2 placeholders, same UI as software)
    - [ ] 7.13 Export mods from `src/data/index.ts`
    - [ ] 7.14 Write behavior tests for ProjectDetail (data display, external links, back button - TDD)
    - [ ] 7.15 Create ProjectDetail component with back button (preserves tab state via query param)
    - [ ] 7.16 Create dynamic detail page at `/projects/software/[slug]`
    - [ ] 7.17 Create dynamic detail page at `/projects/mods/[slug]` (placeholder support)
    - [ ] 7.18 Implement `generateStaticParams` for software project slugs
    - [ ] 7.19 Implement `generateStaticParams` for placeholder mod slugs
    - [ ] 7.20 Verify tab switching, routing, back navigation, and all links functional
    - [ ] 7.21 Run incremental quality checks (type-check, lint, format, test)

    **Architecture Notes**:
    - Routing: `/projects` (list with tabs) → `/projects/software/[slug]` or `/projects/mods/[slug]` (details)
    - Tab state: Query param (`?tab=mods`) for shareable links and back button preservation
    - Badge system: `category` field displays as prominent badge (Software: "Web App"/"Game"/etc, Mods: game name)
    - Tech tags: `tags` array for technology filtering (future enhancement per META-PRD)
    - Project order (revised): 1-CineXplorer, 2-TaskFocus, 3-ARC, 4-arc-portfolio, 5-PetResort,
      6-DOOM NG+ Customizer, 7-ActionRPG, 8-SurvivalHorror, 9-PongClone
    - Placeholder mods: 2 entries with obvious dummy data, validates layout and component reusability

- [ ] 8.0 Migrate and integrate mod data from NexusMods
    - [ ] 8.1 Select 5-9 mods for showcase (high-effort, well-maintained, technically interesting)
    - [ ] 8.2 Create incidental task list for detailed per-mod migration tracking
        (See: `.arc/active/incidental/tasks-mod-migration.md` - one sub-task per mod with full migration steps)
    - [ ] 8.3 Execute mod migration workflow via incidental task list
        (Adapt NexusMods descriptions, add technical details, download images, organize assets)
    - [ ] 8.4 Replace placeholder mods in `src/data/mods.ts` with real mod data
    - [ ] 8.5 Update `generateStaticParams` in `/projects/mods/[slug]/page.tsx` for actual mod slugs
    - [ ] 8.6 Write data validation tests for mods (`src/data/__tests__/mods.test.ts`)
    - [ ] 8.7 Write image validation tests for mods (`src/data/__tests__/mods-images.test.ts`)
    - [ ] 8.8 Verify all mod pages render correctly with accurate data
    - [ ] 8.9 Verify mod category badges display game names correctly
    - [ ] 8.10 Verify all mod external links (NexusMods profile, individual mod pages) functional
    - [ ] 8.11 Run incremental quality checks (type-check, lint, format, test)

    **Migration Notes**:
    - NexusMods profile: [Link to be added during migration]
    - Mods will use `category` field for game name (e.g., "Skyrim", "DOOM", "Fallout 4")
    - Each mod requires: title, description (adapted), features, links (NexusMods), images (banner + screenshots)
    - Maintain same professional tone and detail level as software projects
    - Consider adding `highlights` for download counts, community feedback, maintenance history
    - Detailed per-mod migration steps tracked in separate incidental task list for granular progress tracking

- [ ] 9.0 Verify routing and navigation integration (was 8.0)
    - [ ] 9.1 Verify routing works between all pages (Home ↔ Projects ↔ Skills ↔ About ↔ Contact)
    - [ ] 9.2 Ensure all internal navigation links are functional
    - [ ] 9.3 Verify `/projects` tab switching works (Software ↔ Mods)
    - [ ] 9.4 Verify project detail pages back button returns to correct tab
    - [ ] 9.5 Confirm `/about` page displays both Education and About sections correctly
    - [ ] 9.6 Write integration tests for navigation and routing flows
    - [ ] 9.7 Run incremental quality checks (type-check, lint, format, test)

### Phase 4: Validation & Quality Assurance

- [ ] 10.0 Validate content accuracy, type safety, and display functionality (was 9.0)
    - [ ] 10.1 Verify zero TypeScript errors across all files
    - [ ] 10.2 Verify all content section pages render correctly (`/skills`, `/about`, `/contact`)
    - [ ] 10.3 Verify `/about` page displays both Education and About sections correctly
    - [ ] 10.4 Verify all 9 software projects display correctly with accurate data
    - [ ] 10.5 Verify all mod projects display correctly with accurate data
    - [ ] 10.6 Verify category badges display correctly (software categories + mod game names)
    - [ ] 10.7 Verify all external links open correctly in new tabs
    - [ ] 10.8 Verify project ordering matches revised priority (CineXplorer-1, TaskFocus-2, etc.)
    - [ ] 10.9 Verify skills categories are complete with technologies from all projects
    - [ ] 10.10 Verify education, bio, and contact data accuracy
    - [ ] 10.11 Verify navigation header shows all sections and links work correctly
    - [ ] 10.12 Run full test suite and verify all tests pass
    - [ ] 10.13 Test all navigation and routing flows manually (all pages accessible)
    - [ ] 10.14 Run full quality gate suite (type-check, lint, format, markdown, build, test)
    - [ ] 10.15 Verify build succeeds and site renders without runtime errors
