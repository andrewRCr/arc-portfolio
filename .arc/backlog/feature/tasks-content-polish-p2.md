# Task List: Content Polish P2 - Supporting Pages

**PRD:** `.arc/backlog/feature/prd-content-polish-p2.md`
**Created:** 2026-01-19
**Branch:** `feature/content-polish-p2`
**Base Branch:** `main`
**Status:** Pending

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

- [ ] **1.1 Enhance skills data structure**

    **Approach:** Forward migration - update type, data, and all consumers together. No backward compat.

    - [ ] **1.1.a Update `Skills` type in `src/types/skills.ts`**
        - Change from flat string arrays to object arrays with metadata
        - Add `featured?: boolean` flag for Home page display
        - Add `iconSlug?: string` for simple-icons mapping

    - [ ] **1.1.b Update `src/data/skills.ts` with enhanced structure**
        - Migrate all skills to new object format
        - Add `featured` and `iconSlug` to key skills
        - Initial featured selection: TypeScript, React, Python, Django, C#, .NET (refine later)
        - Map icon slugs to simple-icons identifiers

    - [ ] **1.1.c Migrate all consumers to new data structure**
        - Update `SkillsSection` component to consume new format
        - Update any existing tests that reference skills data
        - Search codebase for other usages: `grep -r "skills" src/`

    - [ ] **1.1.d Run type checking to verify all consumers updated**
        - Type errors indicate missed consumers - fix before proceeding

- [ ] **1.2 Install and configure simple-icons**

    - [ ] **1.2.a Install `simple-icons` package**
        - Run `npm install simple-icons`
        - Verify package provides SVG paths/data

    - [ ] **1.2.b Create utility for icon retrieval**
        - Create `src/lib/skill-icons.ts`
        - Export function to get SVG data by slug
        - Handle missing icons gracefully (return null)

    - [ ] **1.2.c Verify icons load correctly for test skills**

- [ ] **1.3 Create SkillLogoGrid component**

    - [ ] **1.3.a Write tests for `SkillLogoGrid` component**
        - Test: Renders correct number of logos
        - Test: Applies correct layout class based on `layout` prop (row vs grid)
        - Test: Logos are wrapped in links when `linkToProjects` is true
        - Test: Handles missing icons gracefully
        - Expect tests to FAIL initially

    - [ ] **1.3.b Implement `SkillLogoGrid` component**
        - Create `src/components/skills/SkillLogoGrid.tsx`
        - Props: `skills`, `layout` (row | grid), `size` (sm | md | lg), `linkToProjects`
        - Use simple-icons SVG data for rendering
        - Apply TWM-consistent styling (borders, backgrounds)

    - [ ] **1.3.c Run tests - should now PASS**

    - [ ] **1.3.d Run quality gates (type-check, lint)**

### **Phase 2:** Home Page Skills Row Integration

**Purpose:** Add featured skills visual to Home page below FeaturedProjects.

- [ ] **2.1 Integrate SkillLogoGrid on Home page**

    - [ ] **2.1.a Update `src/app/page.tsx` to include skills row**
        - Filter skills data for `featured: true`
        - Render `SkillLogoGrid` with `layout="row"`, `linkToProjects={true}`
        - Position below FeaturedSection

    - [ ] **2.1.b Verify no-scroll behavior on desktop (1440p)**
        - Manual test: Page should not scroll at 1440p resolution
        - If scrolling occurs, adjust spacing/sizing

    - [ ] **2.1.c Handle mobile layout**
        - Decide: wrap evenly at breakpoint OR skip render on mobile
        - Implement chosen approach with appropriate Tailwind classes

    - [ ] **2.1.d Run quality gates**

- [ ] **2.2 Visual refinement**

    - [ ] **2.2.a Adjust spacing between FeaturedSection and skills row**
        - Ensure visual balance without crowding
        - Test across viewport sizes

    - [ ] **2.2.b Verify logo sizing and alignment**
        - Logos should be recognizable but not dominant
        - Consistent spacing between logos

### **Phase 3:** Skills Page Reorganization

**Purpose:** Transform Skills page from text dump to structured, visually engaging presentation.

- [ ] **3.1 Content audit**

    **Goal:** Identify which skills to emphasize, de-emphasize, or remove.

    - [ ] **3.1.a Review current skills list against project portfolio**
        - Which skills appear in actual projects?
        - Which are "resume padding" vs genuine strengths?

    - [ ] **3.1.b Propose skill hierarchy per category**
        - Primary skills: Get logos in DetailCard
        - Secondary skills: Text list below logos
        - Remove: Skills that dilute core strengths

    - [ ] **3.1.c Finalize featured skill selection for Home page**
        - Confirm 6-8 core skills that best represent portfolio
        - Update `featured` flags in data

- [ ] **3.2 Create category DetailCard layout**

    - [ ] **3.2.a Write tests for skills category cards**
        - Test: Each category renders as DetailCard
        - Test: Primary skills show as logos
        - Test: Secondary skills show as text list
        - Expect tests to FAIL initially

    - [ ] **3.2.b Update `SkillsSection` component**
        - Replace current grid with DetailCard per category
        - Use `SkillLogoGrid` for primary skills within each card
        - Add text list for secondary skills
        - File: `src/components/sections/SkillsSection.tsx`

    - [ ] **3.2.c Run tests - should now PASS**

    - [ ] **3.2.d Run quality gates**

- [ ] **3.3 Visual polish and responsiveness**

    - [ ] **3.3.a Verify layout across breakpoints**
        - Desktop: Multi-column category cards
        - Tablet: 2-column or full-width cards
        - Mobile: Stacked full-width cards

    - [ ] **3.3.b Adjust DetailCard styling if needed**
        - Ensure consistent with ProjectDetail cards
        - Verify logo grid fits well within card body

### **Phase 4:** Skills-to-Projects Filtering

**Purpose:** Enable clicking skill logos to filter Projects page.

- [ ] **4.1 Implement filtered Projects view**

    - [ ] **4.1.a Write tests for skill filtering logic**
        - Test: Projects filtered by `tags` array matching skill name
        - Test: Filter applies across all project types (software, games, mods)
        - Test: Empty result state handled gracefully
        - Expect tests to FAIL initially

    - [ ] **4.1.b Create filter utility function**
        - Create filtering logic in `src/lib/project-filters.ts`
        - Filter projects + mods by skill tag
        - Return combined, sorted results

    - [ ] **4.1.c Run tests - should now PASS**

- [ ] **4.2 Update Projects page for filtered mode**

    - [ ] **4.2.a Write tests for filtered UI state**
        - Test: Query param `?skill=X` triggers filtered mode
        - Test: Tabs hidden when filtered
        - Test: Filter indicator + clear button displayed
        - Test: Clear button removes filter and restores tabs
        - Expect tests to FAIL initially

    - [ ] **4.2.b Implement filtered mode in Projects page**
        - Read `skill` query param via `useSearchParams()`
        - When present: hide tabs, show all matching projects
        - Display filter indicator: "Filtered by: {skill}" with clear button
        - Clear button navigates to `/projects` (no params)
        - File: `src/app/projects/page.tsx`

    - [ ] **4.2.c Run tests - should now PASS**

    - [ ] **4.2.d Run quality gates**

- [ ] **4.3 Connect skill logos to filtered view**

    - [ ] **4.3.a Update `SkillLogoGrid` links**
        - When `linkToProjects={true}`, logos link to `/projects?skill={skillName}`
        - Ensure skill name matches project `tags` array values

    - [ ] **4.3.b Manual testing of full flow**
        - Click skill logo on Home → filtered Projects view
        - Click skill logo on Skills page → filtered Projects view
        - Clear filter → normal tabbed view restored

    - [ ] **4.3.c Run E2E tests for navigation flow**

### **Phase 5:** Contact Form Implementation

**Purpose:** Build functional contact form with email delivery and spam protection.

- [ ] **5.1 Environment setup**

    - [ ] **5.1.a Configure Zeptomail API key**
        - Add `ZEPTOMAIL_API_KEY` to `.env.local` for development
        - Document Vercel environment variable setup for production (defer actual Vercel config)

    - [ ] **5.1.b Install form dependencies**
        - Run `npm install react-hook-form zod @hookform/resolvers`
        - Verify installation

- [ ] **5.2 Create contact form component**

    - [ ] **5.2.a Write tests for form validation**
        - Test: Name required
        - Test: Email required and valid format
        - Test: Message required
        - Test: Honeypot field rejection
        - Expect tests to FAIL initially

    - [ ] **5.2.b Implement `ContactForm` component**
        - Create `src/components/contact/ContactForm.tsx`
        - Use react-hook-form with zod schema validation
        - Fields: name, email, message
        - Hidden honeypot field
        - Loading, success, error states

    - [ ] **5.2.c Style form with TWM aesthetic**
        - Monospace labels/hints where appropriate
        - Styled inputs consistent with design system
        - Clear but not overly decorative

    - [ ] **5.2.d Run tests - should now PASS**

- [ ] **5.3 Implement API route**

    - [ ] **5.3.a Write tests for API endpoint**
        - Test: Valid submission returns success
        - Test: Invalid data returns 400 with errors
        - Test: Honeypot filled returns silent success (no email sent)
        - Test: Rate limiting blocks rapid submissions
        - Expect tests to FAIL initially

    - [ ] **5.3.b Create `/api/contact` route**
        - Create `src/app/api/contact/route.ts`
        - Server-side validation with zod
        - Honeypot check (reject silently if filled)
        - Rate limiting (simple in-memory counter or Vercel KV)
        - Zeptomail API call for email delivery

    - [ ] **5.3.c Run tests - should now PASS**

    - [ ] **5.3.d Run quality gates**

- [ ] **5.4 Integrate form into Contact page**

    - [ ] **5.4.a Update `ContactSection` component**
        - Add `ContactForm` component
        - Arrange with existing email/social links
        - Determine email display format based on visual balance

    - [ ] **5.4.b Manual testing**
        - Submit form with valid data → verify email received
        - Submit with invalid data → verify error states
        - Test honeypot → verify silent rejection
        - Rapid submissions → verify rate limiting

    - [ ] **5.4.c Run E2E tests for contact flow**

### **Phase 6:** About Page Polish

**Purpose:** Improve About page visual presentation, add photo, revise copy.

- [ ] **6.1 Create EducationCard component**

    - [ ] **6.1.a Write tests for `EducationCard` component**
        - Test: Renders degree in transparent header
        - Test: Renders institution as high-emphasis badge
        - Test: Renders location, year, GPA as smaller badges
        - Expect tests to FAIL initially

    - [ ] **6.1.b Implement `EducationCard` component**
        - Create `src/components/about/EducationCard.tsx`
        - Follow DetailCard pattern: transparent header, opaque body
        - Header: Degree name (e.g., "Bachelor of Science in Computer Science")
        - Body: Institution badge (high-emphasis), location/year/GPA badges (muted)

    - [ ] **6.1.c Run tests - should now PASS**

    - [ ] **6.1.d Update `EducationSection` to use new component**
        - Replace current education cards with `EducationCard`
        - Layout: Side-by-side on desktop (2-column grid)
        - Verify responsive behavior

    - [ ] **6.1.e Run quality gates**

- [ ] **6.2 Add professional photo**

    - [ ] **6.2.a Add photo to public assets**
        - Place photo in `public/` (e.g., `public/profile-photo.webp`)
        - Ensure appropriate size/quality for web

    - [ ] **6.2.b Integrate photo into About page layout**
        - Position alongside bio text
        - Target ratio: 60-80% text, 20-40% image
        - Add proper alt text: `alt="Andrew Creekmore, full-stack developer"`

    - [ ] **6.2.c Verify responsive layout**
        - Desktop: Photo beside bio
        - Mobile: Photo above or integrated appropriately

- [ ] **6.3 Bio section styling**

    - [ ] **6.3.a Update bio card with `background/80`**
        - Add semi-transparent background to bio container
        - Consistent with DetailCard body pattern
        - File: `src/components/sections/AboutSection.tsx`

    - [ ] **6.3.b Verify visual consistency across themes**
        - Test with multiple themes (Remedy, Rose Pine, Gruvbox, etc.)
        - Ensure readability and contrast

- [ ] **6.4 Copy revision**

    **Goal:** Collaborative revision of bio paragraphs for clarity, tone, and impact.

    - [ ] **6.4.a Review and revise bio content**
        - Read current paragraphs in `src/data/about.ts`
        - Identify areas for improvement
        - Revise for clarity, professional tone, and impact
        - Preserve placeholder handling (`{{MODDING_LINK}}`, `{{DOWNLOAD_COUNT}}`)

    - [ ] **6.4.b Verify rendered output**
        - Check placeholders render correctly
        - Verify markdown links work
        - Manual review of final presentation

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
