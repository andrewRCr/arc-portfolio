# PRD: Content Polish P2 - Supporting Pages

**Type:** Feature
**Status:** Complete
**Created:** 2026-01-19
**Completed:** 2026-01-22

---

## Introduction / Overview

Content Polish P2 completes the portfolio's supporting pages (Skills, Contact, About) with visual and functional
improvements that bring them to parity with the polished project showcase from P1. This phase adds the contact
form backend, implements a modular skills logo system, and refines the About page presentation.

**Goal:** Supporting pages should feel polished, visually consistent with the rest of the portfolio, and provide
professional context for the core project content. The portfolio should present a cohesive experience across all
pages.

## Goals

1. **Skills Page**: Transform from text-heavy dump to visually engaging, scannable presentation with logo grid
   and structured categories
2. **Contact Page**: Implement functional contact form with proper validation, spam protection, and TWM-aesthetic
   styling
3. **About Page**: Improve visual presentation and copy quality; add professional photo; style education cards
   consistently with app patterns
4. **Cross-Page Feature**: Enable skill-to-project filtering via logo clicks (Skills → filtered Projects view)
5. **Visual Consistency**: Apply established patterns (DetailCard styling, badge hierarchy) to new components

## User Stories

1. **As a recruiter**, I want to quickly scan technical skills via recognizable logos so I can assess candidate
   fit without reading dense text.
2. **As a visitor**, I want to contact the portfolio owner directly through the site so I don't need to copy
   an email address to my mail client.
3. **As a hiring manager**, I want to see the person behind the portfolio (photo, background) so I can evaluate
   cultural fit alongside technical skills.
4. **As a technical evaluator**, I want to click a skill logo to see which projects use that technology so I
   can assess depth of experience.

## Functional Requirements

### Skills Page

1. **Modular Skills Logo Grid Component**
   - Create reusable `SkillLogoGrid` component supporting multiple display modes (row, grid)
   - Use SVG logos from `simple-icons` package for high fidelity and theming capability
   - Support `featured` flag on skills data for Home page subset (6-8 core skills)
   - Logos are clickable, linking to filtered Projects view

2. **Home Page Integration**
   - Display single row of 6-8 featured skill logos below FeaturedProjects section
   - Maintain no-scroll target on desktop (1440p); mobile already scrolls
   - Mobile behavior: either wrap evenly at breakpoint or skip rendering (decide during implementation)

3. **Skills Page Presentation**
   - Display skill logos inside DetailCard-styled containers per category
   - Each category card shows logos for primary skills + text list for secondary skills
   - Provides depth beyond Home page overview

4. **Content Audit**
   - Review current skills for relevance and impact
   - Remove/de-emphasize skills that dilute core strengths
   - Finalize category organization and skill hierarchy

5. **Skills Data Enhancement**
   - Add `featured: boolean` flag to skills data structure
   - Add `iconSlug: string` for simple-icons mapping (optional - only for logo-displayed skills)

### Contact Page

6. **Contact Form Implementation**
   - Fields: Name (required), Email (required, validated), Message (required)
   - Client-side validation with clear error states
   - Server-side validation via API route
   - Email delivery via Zeptomail transactional email service
   - Success/error feedback states with appropriate messaging

7. **Spam Protection**
   - Honeypot field (hidden input that bots fill, humans don't)
   - Server-side rate limiting (prevent rapid submissions from same source)

8. **Form Styling**
   - TWM/terminal aesthetic - not pure web form
   - Light touch: styled inputs, monospace hints, but still clearly functional
   - Loading state during submission
   - Keyboard accessible with proper focus management

9. **Email Display**
   - Keep email visible on page (privacy concern dropped)
   - Format (plain text vs mailto link) determined during implementation based on visual balance with form

10. **Accessibility**
    - Proper labels and ARIA attributes
    - Error announcements for screen readers
    - Full keyboard navigation support

### About Page

11. **Bio Section Styling**
    - Add `background/80` to bio card for better contrast/readability
    - Consistent with DetailCard body pattern

12. **Copy Revision**
    - Collaborative revision of bio paragraphs for clarity, tone, and impact
    - Contained to single task, open-ended within that scope

13. **Professional Photo**
    - Add photo alongside bio text (not above/below)
    - Target ratio: 60-80% text, 20-40% image
    - Proper alt text (under 125 characters, purpose-driven)
    - Use existing photo from GitHub profile

14. **EducationCard Component**
    - Create styled education cards with header/body split
    - Header (bg-card/80): Institution name (abbreviated on phone)
    - Body (bg-background/80): Major + degree type joined, monospace font, square corners
    - Metadata badges (rounded): location (state abbrev on phone), year, GPA
    - Cards side-by-side on desktop, stacked on mobile

15. **Download Stats**
    - Already functional via NexusMods API (no work needed)

### Cross-Page: Skills Filtering

16. **Filtered Projects View**
    - Clicking skill logo navigates to `/projects?skills={skillName}` (single skill entry point)
    - Projects page reads query param and filters displayed projects
    - **Multi-skill support:** Users can add/remove skills via filter popover (OR logic - matches ANY selected skill)
    - Filter applies across all tabs (Software/Games/Mods) - tabs hidden when filtered
    - **Filter controls:** SkillFilterPopover (desktop) / SkillFilterDrawer (mobile) with searchable categorized list
    - FilterIndicator shows active filter chips + clear button (crossfade transition with tabs)
    - Clear button removes filter and restores normal tabbed view

## Non-Goals (Out of Scope)

- **Proficiency indicators** - No skill level bars/percentages (can feel arbitrary)
- **Availability status / response time** - Removed from scope
- **Blog/CMS integration** - Portfolio remains code-managed
- **Contact form analytics** - Basic success/error logging only

**Note:** Skill filtering scope expanded during implementation. Originally "skill-click only, no dedicated filter UI"
but evolved to include SkillFilterPopover (desktop) and SkillFilterDrawer (mobile) with searchable categorized
multi-skill selection. This was a natural expansion to provide better UX once the filtering infrastructure existed.

## Design Considerations

### Visual Consistency

- **Badge hierarchy**: Use established token pattern (secondary for high-emphasis, muted for lower emphasis)
- **Card patterns**: DetailCard-style transparent headers where appropriate
- **Spacing**: Maintain existing rhythm and padding patterns

### Skills Logo Grid

- Single row on Home: 6-8 logos, evenly spaced
- Category grids on Skills page: responsive, inside DetailCard containers
- Logo size: consistent across contexts, large enough for recognition

### Contact Form

- TWM aesthetic: consider monospace labels, terminal-style input styling
- Keep functional clarity - users must understand it's a form
- Loading/success/error states should feel native to design system

### About Page Layout

- Photo placement requires visual iteration during implementation
- Education cards side-by-side may need responsive breakpoint adjustment
- Overall page structure may shift from current fixed sections

## Technical Considerations

### Dependencies

- `simple-icons` package for SVG tech logos
- `react-hook-form` + `zod` for form handling (already planned per TECHNICAL-OVERVIEW)
- Zeptomail SDK/API for email delivery
- Vercel edge middleware or in-memory counter for rate limiting

### Data Structure Changes

```typescript
// Enhanced skill type
interface Skill {
  name: string;
  category: SkillCategory;
  featured?: boolean;      // Show on Home page
  iconSlug?: string;       // simple-icons slug (e.g., "react", "typescript")
}
```

### API Route

- `POST /api/contact` - Handle form submission
- Validate inputs server-side
- Check honeypot field
- Apply rate limiting
- Send email via Zeptomail
- Return appropriate status

### Skills Filtering

- Query param: `/projects?skills=React,TypeScript` (comma-separated for multi-skill)
- Projects page component reads param, filters `projects` + `mods` data using OR logic
- No persistent state needed - URL is source of truth
- ARIA live region announces result count changes

## Success Metrics

- **Functional**: Contact form successfully delivers emails; spam protection prevents abuse
- **Visual**: Pages feel cohesive with P1 work; no jarring style differences
- **Performance**: No regression in Lighthouse scores; logo SVGs don't bloat bundle
- **Accessibility**: Maintains WCAG 2.1 AA compliance across all new components

## Open Questions (Resolved)

- **Mobile logo row behavior**: Responsive approach - curated 6 icons (single row) in hero on mobile boxed,
  full 10 icons (5/5 split) in hero on mobile fullscreen; tablet+ shows 10 icons below FeaturedSection
- **Exact skill selection for featured**: TypeScript, React, Python, Django, C#, .NET (6 featured, ecosystem pairs)
- **About page layout iteration**: Photo in right pane (desktop) / top pane (mobile), decorative card with
  `// andrew.jpg` caption, bio content in left pane with bg-background/80

---
