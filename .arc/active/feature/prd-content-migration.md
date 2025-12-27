# PRD: Content Migration from Squarespace

**Status:** Complete
**Completed:** 2025-12-27

## 1. Introduction/Overview

This feature migrates all portfolio content from the existing Squarespace site (andrewcreekmore.com) to the new
Next.js portfolio application. The migration establishes a type-safe content architecture using TypeScript interfaces
and data files, populates this structure with actual portfolio content, and creates basic placeholder display
components to verify content rendering and routing.

**Problem Statement:** The new portfolio requires all content from Squarespace to be structured as TypeScript data
with proper type safety, enabling future design iteration and component development while ensuring content accuracy
and completeness.

**Goal:** Migrate 9 projects (6 existing + 3 new), skills/technologies, education credentials, and bio content into
a maintainable, type-safe data structure with basic display capability.

## 2. Goals

### Primary Goals

1. **Establish Type-Safe Content Architecture** - Define comprehensive TypeScript interfaces for all portfolio
   content types (projects, skills, education, bio, contact)
2. **Migrate Existing Content** - Transfer all content from Squarespace into TypeScript data files with 100%
   accuracy
3. **Add New Project Entries** - Include three new projects (CineXplorer, arc-agentic-dev-framework, arc-portfolio)
   with proper prioritization
4. **Enable Content Display** - Create basic placeholder components that render migrated content with functional
   routing
5. **Validate Content Structure** - Ensure zero TypeScript errors and all content properly typed

### Secondary Goals

1. **Prepare for Image Migration** - Document image requirements and establish directory structure
2. **Enable Future Refinement** - Structure data to support easy content expansion and categorization enhancements
3. **Maintain Flexibility** - Support future UI/UX design iteration without data structure changes

## 3. User Stories

### As a developer implementing the portfolio

- I want TypeScript interfaces for all content types so that I have compile-time validation and IDE autocomplete
- I want all Squarespace content in structured data files so that I can reference it in components
- I want sample placeholder components so that I can verify content renders correctly before design implementation
- I want proper routing for project pages so that each project has a unique, shareable URL
- I want organized data files so that adding/updating content is straightforward

### As the portfolio owner (Andrew)

- I want all my existing projects migrated accurately so that no work is lost
- I want my three new projects (CineXplorer, arc-agentic-dev-framework, arc-portfolio) prioritized at the top so
  that they showcase my latest work
- I want my skills properly categorized so that my technical capabilities are clear
- I want my bio and education accurately represented so that my background is properly communicated
- I want placeholder pages working so that I can focus on design decisions next

### As a technical recruiter viewing the portfolio

- I want to see all projects with accurate descriptions so that I can evaluate technical capabilities
- I want clear technology listings so that I can assess skill alignment with roles
- I want working navigation so that I can explore projects independently

## 4. Functional Requirements

### Phase 1: Data Structures & Type Definitions

#### 1.1 TypeScript Interfaces

The system must define TypeScript interfaces in `src/types/` covering:

**1.1.1 Project Interface** - Must include:

- Core fields: `id`, `title`, `slug`, `description`, `shortDescription`
- Categorization: `category`, `tags` (note: `tags` must use canonical technology names matching skills data to
  support future interactive filtering - see `.arc/backlog/feature/notes-future-enhancements.md`)
- Technical details: `techStack` (string array), `features` (string array)
- Links object: `github`, `liveDemo`, `download`, `external`, optional `demoCredentials` (username/password)
- Images object: `thumbnail`, `screenshots` (string array), `altTexts` (string array)
- Optional metadata: `teamSize`, `duration`, `role`, `developmentTime`
- Optional detailed content: `architectureNotes` (string array), `highlights` (string array)
- Display properties: `order` (number), `featured` (boolean)

**1.1.2 Skills Interface** - Must include:

- Categories structure supporting flexible grouping (minimum 3 categories, extensible for AI-specific additions)
- String arrays for each category using canonical technology names (matching project `tags` for filtering support)
- Support for future enhancements (proficiency levels, years of experience, icon references)

**1.1.3 Education Interface** - Must include:

- Minimal structure: `degree`, `major`, `institution`
- Optional fields: `location`, `graduationDate`, `gpa`, `honors`, `relevantCoursework` (for future expansion)

**1.1.4 About/Bio Interface** - Must include:

- `heading` (string)
- `paragraphs` (string array) supporting markdown syntax
- Optional `highlightedAchievements` array with `label`, `value`, `link` fields

**1.1.5 Contact Interface** - Must include:

- `email` (string)
- `socialLinks` array with `platform`, `url`, `icon` fields

#### 1.2 Sample/Placeholder Data

**1.2.1** The system must create sample data files in `src/data/` demonstrating proper interface usage:

- `src/data/projects.ts` - Minimum 2 sample projects with realistic structure
- `src/data/skills.ts` - Sample skills in 3+ categories
- `src/data/education.ts` - Sample education entry
- `src/data/about.ts` - Sample bio content with markdown
- `src/data/contact.ts` - Sample contact information

**1.2.2** All sample data must:

- Import and implement the defined TypeScript interfaces
- Pass TypeScript compilation with zero errors
- Include inline comments explaining each field's purpose
- Serve as templates for actual content migration

### Phase 2: Content Migration

#### 2.1 Project Data Migration

**2.1.1** The system must migrate all 9 projects in the following order:

**Priority Projects (New):**

1. CineXplorer (full-stack movie discovery application)
2. arc-agentic-dev-framework (AI-assisted development framework)
3. arc-portfolio (this portfolio project itself)

**Existing Projects (from Squarespace):**

1. TaskFocus (full-stack web/desktop task management)
2. PetResort (full-stack pet boarding management)
3. NewGame+ Customizer for DOOM (game mod utility)
4. Action RPG Project (Unreal Engine game demo)
5. Survival Horror Project (capstone game project)
6. Pong Clone (C++ game recreation)

**2.1.2** For existing Squarespace projects, all content must be extracted accurately:

- Project titles, descriptions, and key features
- Complete technology stack listings
- All external links (GitHub, live demos, downloads, NexusMods)
- Demo credentials where applicable (e.g., PetResort: admin/admin)
- Architecture notes and development context
- Team size, duration, and role information
- Image references (actual image files TBD in Phase 2.5)

**2.1.3** For new projects (CineXplorer, arc-agentic-dev-framework, arc-portfolio):

- Content must be drafted with equivalent detail to existing projects
- Must include descriptions, tech stacks, features, and links
- Must follow the same interface structure as migrated projects

**2.1.4** Project ordering must use explicit `order` field (1-9) matching the priority list above

#### 2.2 Skills Data Migration

**2.2.1** The system must migrate existing Squarespace skills from three categories:

- Programming Languages: C#, C++, Python, Java/TypeScript, XAML, HTML, CSS, SQL
- Tools and Frameworks: .NET, Blazor, Node.js, Express.js, SQL Server, MongoDB, MySQL, EJS, Bootstrap, WPF,
  Caliburn Micro, Figma, Swagger, Postman, Blender, Unreal Engine
- Project Management: Git, GitHub, Azure DevOps, Perforce, Jira, Agile methodologies, TDD, CI/CD

**2.2.2** The system must expand/reorganize categories to include new technologies from the three new projects
(CineXplorer, arc-agentic-dev-framework, arc-portfolio), including AI-specific tools, frameworks, and methodologies
(exact structure TBD during implementation):

- Add skills from new projects: AI/LLM tools (Claude API, prompt engineering), additional frontend/backend frameworks,
  new development methodologies
- Consider separate categories for: AI/LLM tools, Frontend, Backend, Databases, DevOps, Game Development
- Maintain flexibility for future reorganization
- Document category decisions in implementation notes

#### 2.3 Education Data Migration

**2.3.1** The system must migrate two education entries with minimal detail:

1. Bachelor of Science - Computer Science | Oregon State University
2. Bachelor of Arts - Psychology | The University of Texas at Dallas

**2.3.2** No additional details required (dates, GPA, coursework, honors) - these are available on resume

#### 2.4 Bio/About Content Migration

**2.4.1** The system must migrate the existing bio text from Squarespace (3 paragraphs, ~150 words)

**2.4.2** Bio must preserve:

- Markdown link to NexusMods profile
- 200K+ downloads mention (note: actual count is now 270K+ - consider dynamic update as future enhancement)
- Career transition narrative (psychology → computer science)
- Self-starter and continuous learning themes

**2.4.3** Content should remain editable as plain text/markdown (future redesign planned)

#### 2.5 Image Asset Organization (Partially TBD)

**2.5.1** The system must document image requirements for 61+ images from Squarespace:

- 9 images for TaskFocus
- 8 images for PetResort
- 5 images for DOOM Customizer
- 17 images for Action RPG Project
- 22 images for Survival Horror Project
- 3 images for Pong Clone
- Additional project thumbnails for grid display
- Profile/bio images if applicable

**2.5.2** The system must establish directory structure in `public/`:

- `public/projects/[project-slug]/` for project-specific images
- `public/thumbnails/` for project card thumbnails
- Clear naming conventions for easy reference from data files

**2.5.3** Image migration approach TBD based on:

- Actual image files available locally
- Image quality and formats
- Optimization needs (Next.js Image component will handle runtime optimization)
- Potentially provide script/tool to assist with organization

**2.5.4** Data files must reference image paths correctly even if actual files not yet placed

### Phase 3: Placeholder Display Components

#### 3.1 Project List Page

**3.1.1** The system must create a basic projects list page at `/projects` that:

- Displays all projects in a grid or list layout
- Shows project thumbnail (or placeholder if image not available)
- Shows project title and short description
- Provides clickable links to individual project pages
- Orders projects by `order` field (priority projects first)

**3.1.2** Styling must be minimal/unstyled - this is a placeholder for future design implementation

**3.1.3** Component must be easily replaceable when actual designed components are ready

#### 3.2 Project Detail Pages

**3.2.1** The system must create project detail pages at `/projects/[slug]` that:

- Use Next.js dynamic routing with `slug` parameter
- Display all project data: title, description, tech stack, features, links
- Render screenshots/images (or placeholders if not available)
- Include functional links to GitHub, live demos, downloads
- Display demo credentials if applicable
- Show architecture notes and highlights if present

**3.2.2** Each project must have a unique, shareable URL using the project `slug`

**3.2.3** Component must handle missing optional fields gracefully (no errors if field is undefined)

#### 3.3 Content Section Components

**3.3.1** The system must create modular content section components:

- **SkillsSection component** - Display categorized skills as lists (minimal styling)
- **EducationSection component** - Display education entries with degree and institution
- **AboutSection component** - Render bio paragraphs with markdown support
- **ContactSection component** - Display email and social links

**3.3.2** All components must render content from migrated data (no hardcoded content)

**3.3.3** Components must be modular, reusable building blocks - not tied to specific pages

**3.3.4** Initial implementation creates individual pages: `/skills`, `/about` (displays both AboutSection and
EducationSection components), `/contact`

**3.3.5** Final page architecture is deferred to design phase for Skills and Contact; Education+About grouping on
`/about` is confirmed as starting point

**3.3.6** Components remain modular and reusable - designed to be easily moved/reorganized as needed

#### 3.4 Navigation & Routing

**3.4.1** The system must implement basic navigation between:

- Homepage (`/`) - Hero/landing page (content TBD in design phase)
- Projects list page (`/projects`)
- Individual project pages (`/projects/[slug]`)
- Skills page (`/skills`)
- About page (`/about`) - Displays both EducationSection and AboutSection components
- Contact page (`/contact`)

**3.4.2** Navigation header must include links to all sections: Home, Projects, Skills, About, Contact

**3.4.3** All navigation links must be functional (clickable links work correctly)

**3.4.4** Routing must use Next.js App Router conventions

**3.4.5** Note: Individual pages structure allows flexibility - final architecture (consolidated vs. separate pages)
deferred to design phase

### Phase 4: Validation & Quality Assurance

#### 4.1 Type Safety Validation

**4.1.1** All data files must pass TypeScript compilation with zero errors

**4.1.2** All interfaces must be properly imported and implemented

**4.1.3** No use of `any` types or type assertions unless absolutely necessary and documented

#### 4.2 Content Accuracy Validation

**4.2.1** All migrated content must match Squarespace content exactly (no data loss or corruption)

**4.2.2** All external links must be verified as correct and functional

**4.2.3** Project ordering must match specified priority (new projects 1-3, existing projects 4-9)

#### 4.3 Display Validation

**4.3.1** All pages must render without errors (no 404s, no runtime errors)

**4.3.2** All data must display correctly (no undefined values in UI)

**4.3.3** All internal navigation must work (homepage ↔ all section pages ↔ projects list ↔ project details)

**4.3.4** All external links must open in new tabs where appropriate

## 5. Non-Goals (Out of Scope)

### Explicitly Out of Scope for This Feature

1. **UI/UX Design** - No styled components, no design system implementation, no v0.dev design work
2. **Advanced Categorization** - Project categories/tags system is TBD and may be refined in future feature
3. **Image Optimization/Processing** - Beyond Next.js Image component's built-in optimization (no custom image
   processing pipelines)
4. **Content Refinement** - No rewriting of project descriptions, no content enhancements beyond accurate migration
5. **Resume Integration** - No resume PDF generation, no resume download feature
6. **Contact Form** - No functional contact form (just email/social links display)
7. **Search/Filter** - No project search, no skill filtering, no advanced navigation
8. **Dynamic NexusMods Integration** - No API integration for live download count (noted as future enhancement)
9. **Analytics Integration** - Vercel Analytics setup is separate from content migration
10. **SEO Optimization** - Meta tags, Open Graph, structured data handled in separate feature
11. **Accessibility Enhancements** - Beyond semantic HTML (detailed a11y work is separate feature)
12. **Performance Optimization** - Beyond Next.js/Turbopack defaults (detailed optimization separate)
13. **Animations** - No Framer Motion integration (animations are design/polish work)

### Testing Approach for This Feature

**Testing implementation is IN SCOPE** and should be added incrementally as soon as testable code exists:

- **Vitest + React Testing Library setup** - Configure testing framework when first components are created
- **Data validation tests** - Test TypeScript data files implement interfaces correctly
- **Component tests** - Test placeholder components render data correctly
- **Type safety tests** - Verify interfaces work as expected
- **Integration tests** - Test navigation and routing flows
- **Testing added incrementally** - Set up framework during Phase 1, add tests as each phase completes

### Acceptable Small Inclusions (If They Naturally Arise)

- Minor category refinements during skills migration (if structure becomes clear)
- Basic semantic HTML structure in placeholder components
- Minimal CSS for basic readability (not design, just structural clarity)

## 6. Design Considerations

### Current State (Minimal)

- **No design system** - Placeholder components use unstyled or minimally styled HTML
- **No component library integration** - Shadcn/ui components not used in Phase 3 (design phase)
- **Semantic HTML focus** - Use proper HTML5 elements (article, section, nav, etc.) for future styling ease

### Future Design Path

- **v0.dev exploration** - After content migration, design work begins with v0.dev prototyping
- **Component replacement strategy** - Placeholder components designed to be swappable without data changes
- **Image asset requirements** - Placeholder structure prepares for proper image gallery/lightbox components

### Navigation Structure (Initial Implementation)

- **Homepage** - Hero/landing page at `/` (content deferred to design phase)
- **Projects list** - Dedicated page at `/projects`
- **Project details** - Dynamic pages at `/projects/[slug]`
- **Content sections** - Individual pages at `/skills`, `/about` (Education+About combined), `/contact`
- **Header/Footer** - Navigation links to all sections (Home, Projects, Skills, About, Contact)
- **Architecture flexibility** - Individual page structure allows easy reorganization during design phase; Education+About
  grouping confirmed as starting point

## 7. Technical Considerations

### Data Management

- **Pure TypeScript approach** - All content in `.ts` files (not JSON) for compile-time validation
- **Interface-first design** - Types defined before data, data imports types
- **Centralized exports** - Consider `src/data/index.ts` as single import point for all content
- **Immutable data** - Content treated as read-only (no runtime mutations)

### File Organization

```
src/
├── types/
│   ├── project.ts
│   ├── skills.ts
│   ├── education.ts
│   ├── about.ts
│   └── contact.ts
├── data/
│   ├── projects.ts      (9 projects, ordered 1-9)
│   ├── skills.ts        (categorized skills)
│   ├── education.ts     (2 degrees)
│   ├── about.ts         (bio content)
│   ├── contact.ts       (email + social links)
│   └── index.ts         (optional: centralized exports)
├── app/
│   ├── page.tsx         (homepage with sections)
│   ├── projects/
│   │   ├── page.tsx     (projects list)
│   │   └── [slug]/
│   │       └── page.tsx (project detail)
│   └── layout.tsx       (root layout with basic nav)
└── components/
    ├── projects/
    │   ├── ProjectCard.tsx      (placeholder)
    │   └── ProjectDetail.tsx    (placeholder)
    └── home/
        ├── SkillsSection.tsx    (placeholder)
        ├── EducationSection.tsx (placeholder)
        ├── AboutSection.tsx     (placeholder)
        └── ContactSection.tsx   (placeholder)
```

### Next.js App Router Integration

- **Server Components by default** - Content is static, no client-side data fetching needed
- **Static Site Generation (SSG)** - All pages pre-rendered at build time
- **Dynamic routes** - Use `generateStaticParams` for project detail pages
- **Metadata** - Basic page titles/descriptions (detailed SEO separate feature)

### Image Handling Strategy (Partially TBD)

- **Directory structure** - `public/projects/[slug]/` mirrors data organization
- **Next.js Image component** - Use `<Image>` for all project images (automatic optimization)
- **Path references** - Data files store relative paths (`/projects/taskfocus/screenshot-1.png`)
- **Alt text** - Store alt text in data alongside image paths (accessibility foundation)
- **Fallback strategy** - Placeholder images if actual files not yet available (prevent build errors)

### Content Validation

- **TypeScript strict mode** - Zero type errors required
- **Build verification** - `npm run build` must succeed
- **Runtime error handling** - Components handle missing optional fields gracefully
- **Link validation** - Manual verification of external links during migration

### Markdown Support

- **Bio content** - Supports markdown syntax (links, emphasis)
- **Rendering library** - May need markdown parser (e.g., `react-markdown`) for rich text
- **Sanitization** - If accepting markdown, ensure HTML sanitization

### Dependencies

**Minimal new dependencies:**

- Possibly `react-markdown` or similar for bio rendering (if rich formatting needed)
- No other new dependencies required for this feature

**Existing tools sufficient:**

- Next.js Image for images
- Next.js routing for navigation
- TypeScript for type safety

## 8. Success Metrics

### Phase 1 Success: Data Structures Established

- ✅ All 5 TypeScript interface files created in `src/types/`
- ✅ All 5 sample data files created in `src/data/` with realistic examples
- ✅ TypeScript compilation passes with zero errors
- ✅ Sample data correctly implements all interfaces
- ✅ Code review confirms interfaces are comprehensive and extensible

### Phase 2 Success: Content Migrated

- ✅ All 9 projects migrated to `src/data/projects.ts` with complete information
- ✅ All skills migrated and reorganized into updated category structure
- ✅ Both education entries migrated accurately
- ✅ Bio content migrated with markdown formatting preserved
- ✅ Contact information (email + 4 social links) migrated
- ✅ Image directory structure established in `public/`
- ✅ All image paths referenced in data (even if files not yet placed)
- ✅ Content accuracy validated against Squarespace site (zero discrepancies)
- ✅ All external links verified as functional
- ✅ Project ordering matches specified priority (1-9)

### Phase 3 Success: Content Displayable

- ✅ Modular content section components created (SkillsSection, EducationSection, AboutSection, ContactSection)
- ✅ Individual pages created for each section (`/skills`, `/education`, `/about`, `/contact`)
- ✅ Projects list page (`/projects`) displays all 9 projects in correct order
- ✅ All 9 project detail pages (`/projects/[slug]`) render without errors
- ✅ Navigation header includes all sections (Home, Projects, Skills, Education, About, Contact)
- ✅ All navigation links functional between all pages
- ✅ All external links are clickable and functional
- ✅ No runtime errors in browser console
- ✅ All data displays correctly (no "undefined" in UI)
- ✅ TypeScript compilation continues to pass with zero errors
- ✅ Build succeeds: `npm run build` completes without errors

### Overall Feature Success

- ✅ Zero TypeScript errors across all data and component files
- ✅ Zero runtime errors when navigating portfolio
- ✅ All content from Squarespace accurately migrated
- ✅ Three new projects (CineXplorer, arc-agentic-dev-framework, arc-portfolio) properly included
- ✅ Content ready for design iteration (data structures stable)
- ✅ Placeholder components easily replaceable (minimal coupling)
- ✅ All quality gates pass (type-check, lint, format, markdown lint, build)

### Validation Checklist

**Content Completeness:**

- [ ] 9 projects with full details (titles, descriptions, tech stacks, features, links)
- [ ] 30+ skills across multiple categories
- [ ] 2 education entries
- [ ] Complete bio text with markdown
- [ ] Email + 4 social links
- [ ] 61+ image references (actual files may be TBD)

**Technical Completeness:**

- [ ] TypeScript interfaces for all content types
- [ ] Data files implementing all interfaces
- [ ] Homepage with all sections rendering
- [ ] Projects list page functional
- [ ] 9 project detail pages with unique URLs
- [ ] Basic navigation between all pages
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] Build succeeds

## 9. Open Questions

### To Be Determined During Implementation

1. **Skills Category Structure:**
   - Exact categories after splitting existing structure and adding skills from new projects (CineXplorer,
     arc-agentic-dev-framework, arc-portfolio)
   - Decision to be made during Phase 2 based on actual skill inventory from all 9 projects
   - Document final structure in implementation notes

2. **Image Migration Mechanics:**
   - Exact process for organizing 61+ images into directory structure
   - Whether to create helper script for batch image organization
   - Image format/quality decisions based on actual source files
   - Timing: images added during Phase 2 or after Phase 3 complete?

3. **Project Categories/Tags Implementation:**
   - Whether to implement explicit categories (Web Apps, Desktop Apps, Game Dev, Game Mods) in Phase 2
   - Or defer to future content refinement feature
   - Interfaces should support this but implementation is flexible

4. **New Project Content (CineXplorer, arc-agentic-dev-framework, arc-portfolio):**
   - Who will draft the content for these three new projects?
   - Should descriptions match the detail level of existing Squarespace projects?
   - Timeline for gathering this content vs. using placeholder text temporarily

5. **NexusMods Dynamic Download Count:**
   - Is there a NexusMods API for fetching download counts?
   - Future enhancement or include in this feature if trivial?
   - Document API research findings for future implementation

6. **Markdown Rendering Library:**
   - Do we need `react-markdown` or similar for bio content?
   - Or is simple text with inline `<a>` tags sufficient for Phase 3?
   - Decision based on actual markdown complexity in bio

7. **Image Placeholder Strategy:**
   - If actual images not available during Phase 3, use placeholder images or skip images entirely?
   - How to handle missing images without breaking layout?

8. **Component Organization:**
   - Should placeholder components be in same files as future designed components?
   - Or create separate `components/placeholder/` directory for easy removal later?

### Future Enhancement Considerations

- Dynamic NexusMods download count integration (API research needed)
- Resume PDF download feature (separate feature)
- Project search/filtering system (separate feature)
- Advanced categorization/tagging system (separate feature)
- Content management workflow for easy updates (future refinement feature)

---

**Document Version:** 1.0
**Created:** October 12, 2025
**Author:** Andrew R. Creekmore (via AI-assisted PRD workflow)
**Related Documents:**

- META-PRD: `.arc/reference/constitution/META-PRD.md`
- TECHNICAL-OVERVIEW: `.arc/reference/constitution/TECHNICAL-OVERVIEW.md`
- DEVELOPMENT-RULES: `.arc/reference/constitution/DEVELOPMENT-RULES.md`
- Content Audit: External research analyst report (October 12, 2025)
