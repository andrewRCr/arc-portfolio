# Tasks: Content Migration from Squarespace

**Feature**: Content Migration from Squarespace
**PRD**: `.arc/active/feature/prd-content-migration.md`
**Branch**: `feature/content-migration`
**Status**: In Progress

## Relevant Files

### Type Definitions

- `src/types/project.ts` - TypeScript interface for project data structure ✓
- `src/types/skills.ts` - TypeScript interface for skills categorization ✓
- `src/types/education.ts` - TypeScript interface for education credentials ✓
- `src/types/about.ts` - TypeScript interface for bio/about content ✓
- `src/types/contact.ts` - TypeScript interface for contact information ✓

### Data Files

- `src/data/projects.ts` - All 9 projects with complete data (implements Project interface) ✓ (Phase 2: Tasks 2.1-2.9 complete)
- `src/data/skills.ts` - Categorized skills data (implements Skills interface) ✓ (sample, Phase 2)
- `src/data/education.ts` - Education credentials (implements Education interface) ✓ (sample, Phase 2)
- `src/data/about.ts` - Bio content with markdown support (implements About interface) ✓ (sample, Phase 2)
- `src/data/contact.ts` - Contact information and social links (implements Contact interface) ✓ (sample, Phase 2)
- `src/data/index.ts` - Centralized exports for all content data ✓

### Components

- `src/components/Navigation.tsx` - Navigation header component (to be created - Task 5.0 workflow validation)
- `src/components/home/SkillsSection.tsx` - Placeholder component for skills display (to be created)
- `src/components/home/EducationSection.tsx` - Placeholder component for education display (to be created)
- `src/components/home/AboutSection.tsx` - Placeholder component for bio display (to be created)
- `src/components/home/ContactSection.tsx` - Placeholder component for contact display (to be created)
- `src/components/projects/ProjectCard.tsx` - Placeholder card component for project list (to be created)
- `src/components/projects/ProjectDetail.tsx` - Placeholder component for project detail pages (to be created)

### Pages/Routes

- `src/app/page.tsx` - Homepage (hero/landing page, content deferred to design phase) (exists, minimal modification)
- `src/app/layout.tsx` - Root layout with navigation header (Home, Projects, Skills, About, Contact)
  (exists, to be modified)
- `src/app/skills/page.tsx` - Skills page displaying SkillsSection component (to be created)
- `src/app/about/page.tsx` - About page displaying both EducationSection and AboutSection components (to be created)
- `src/app/contact/page.tsx` - Contact page displaying ContactSection component (to be created)
- `src/app/projects/page.tsx` - Project list page with grid/list display (to be created)
- `src/app/projects/[slug]/page.tsx` - Dynamic project detail pages (to be created)

### Testing Configuration & Files

- `vitest.config.ts` - Vitest configuration for unit and component tests ✓
- `src/test/setup.ts` - Test environment setup and global test utilities ✓
- `src/types/__tests__/project.test.ts` - Type definition tests for projects ✓
- `src/types/__tests__/skills.test.ts` - Type definition tests for skills ✓
- `src/types/__tests__/education.test.ts` - Type definition tests for education ✓
- `src/types/__tests__/about.test.ts` - Type definition tests for about ✓
- `src/types/__tests__/contact.test.ts` - Type definition tests for contact ✓
- `src/data/__tests__/projects.test.ts` - Data validation tests for projects (31 tests, refactored for flexibility) ✓
- `src/data/__tests__/projects-images.test.ts` - Image data validation tests (28 tests) ✓
- `src/data/__tests__/skills.test.ts` - Data validation tests for skills (45 tests, refactored) ✓
- `src/data/__tests__/education.test.ts` - Data validation tests for education (30 tests, refactored) ✓
- `src/data/__tests__/about.test.ts` - Data validation tests for about/bio (39 tests, refactored) ✓
- `src/data/__tests__/contact.test.ts` - Data validation tests for contact (44 tests, refactored) ✓
- `src/components/__tests__/Navigation.test.tsx` - Component tests for navigation (to be created - Task 5.0)
- `src/components/home/__tests__/SkillsSection.test.tsx` - Component tests for skills section (to be created)
- `src/components/home/__tests__/AboutSection.test.tsx` - Component tests for about section (to be created)
- `src/components/projects/__tests__/ProjectCard.test.tsx` - Component tests for project card (to be created)
- `src/components/projects/__tests__/ProjectDetail.test.tsx` - Component tests for project detail (to be created)

### Image Assets

- `public/thumbnails/` - Project thumbnail images, one per project (9 total, to be migrated from Squarespace)
- `public/projects/{slug}/` - Project screenshot directories, one per project
  (28+ screenshots total, to be migrated from Squarespace)

### Documentation

- `public/projects/README.md` - Documentation for image organization, naming conventions, and migration details ✓

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

- [ ] 5.0 **WORKFLOW VALIDATION**: Build navbar, validate v0.dev integration workflow
  - [x] 5.1 Write behavior tests for Navigation (links, hrefs, content rendering - TDD: test first)
  - [x] 5.2 Create basic Navigation component (placeholder - semantic HTML + structural Tailwind only)
  - [x] 5.3 Add Navigation to root layout with links: Home, Projects, Skills, About, Contact
  - [x] 5.4 Verify navigation renders and links are functional (may link to non-existent pages - OK for now)
  - [x] 5.5 Clear starter Next.js homepage content (page.tsx)
  - [ ] 5.6 Take Navigation component to v0.dev for design iteration
  - [ ] 5.7 Integrate v0.dev design back into Navigation component
  - [ ] 5.8 Write visual/accessibility tests for Navigation (after design finalized)
  - [ ] 5.9 Review with @visual-design-reviewer agent (comprehensive design validation)
  - [ ] 5.10 Document design decisions, patterns, tokens in `.arc/reference/strategies/strategy-style-guide.md`
  - [ ] 5.11 Run incremental quality checks (type-check, lint, format, test)
  - [ ] 5.12 **Validate workflow** - Confirm v0.dev → integration → review process works before proceeding
  - **Note**: Navbar design from this task may be refined later; primary purpose is workflow validation

- [ ] 6.0 Create modular content section components and individual pages
  - [ ] 6.1 Write behavior tests for SkillsSection (data rendering, structure - TDD: test first)
  - [ ] 6.2 Create SkillsSection component displaying categorized skills (modular, reusable)
  - [ ] 6.3 Create `/skills` page using SkillsSection component
  - [ ] 6.4 Write behavior tests for EducationSection (data rendering, structure - TDD: test first)
  - [ ] 6.5 Create EducationSection component displaying degrees (modular, reusable)
  - [ ] 6.6 Write behavior tests for AboutSection (markdown rendering, content - TDD: test first)
  - [ ] 6.7 Create AboutSection component with markdown support (modular, reusable)
  - [ ] 6.8 Create `/about` page using both EducationSection and AboutSection components
  - [ ] 6.9 Write behavior tests for ContactSection (links, external link attributes - TDD: test first)
  - [ ] 6.10 Create ContactSection component with social links (modular, reusable)
  - [ ] 6.11 Create `/contact` page using ContactSection component
  - [ ] 6.12 Run incremental quality checks (type-check, lint, format, test)

- [ ] 7.0 Create project list page and dynamic project detail pages
  - [ ] 7.1 Write behavior tests for ProjectCard (data rendering, link functionality - TDD: test first)
  - [ ] 7.2 Create ProjectCard component for grid/list display
  - [ ] 7.3 Create projects list page at `/projects` with all 9 projects
  - [ ] 7.4 Write behavior tests for ProjectDetail (data display, external link attributes, conditional rendering -
    TDD: test first)
  - [ ] 7.5 Create ProjectDetail component with external links opening in new tabs
  - [ ] 7.6 Create dynamic project detail page at `/projects/[slug]`
  - [ ] 7.7 Implement `generateStaticParams` for all 9 project slugs
  - [ ] 7.8 Verify all project links and external URLs are functional
  - [ ] 7.9 Run incremental quality checks (type-check, lint, format, test)

- [ ] 8.0 Verify routing and navigation integration
  - [ ] 8.1 Verify routing works between all pages (Home ↔ Projects ↔ Skills ↔ About ↔ Contact)
  - [ ] 8.2 Ensure all internal navigation links are functional
  - [ ] 8.3 Confirm `/about` page displays both Education and About sections correctly
  - [ ] 8.4 Write integration tests for navigation and routing flows
  - [ ] 8.5 Run incremental quality checks (type-check, lint, format, test)

### Phase 4: Validation & Quality Assurance

- [ ] 9.0 Validate content accuracy, type safety, and display functionality
  - [ ] 9.1 Verify zero TypeScript errors across all files
  - [ ] 9.2 Verify all content section pages render correctly (`/skills`, `/about`, `/contact`)
  - [ ] 9.3 Verify `/about` page displays both Education and About sections correctly
  - [ ] 9.4 Verify all 9 projects display correctly with accurate data
  - [ ] 9.5 Verify all external links open correctly in new tabs
  - [ ] 9.6 Verify project ordering matches priority (new projects 1-3, existing 4-9)
  - [ ] 9.7 Verify skills categories are complete with technologies from all projects
  - [ ] 9.8 Verify education, bio, and contact data accuracy
  - [ ] 9.9 Verify navigation header shows all sections and links work correctly
  - [ ] 9.10 Run full test suite and verify all tests pass
  - [ ] 9.11 Test all navigation and routing flows manually (all pages accessible)
  - [ ] 9.12 Run full quality gate suite (type-check, lint, format, markdown, build, test)
  - [ ] 9.13 Verify build succeeds and site renders without runtime errors
