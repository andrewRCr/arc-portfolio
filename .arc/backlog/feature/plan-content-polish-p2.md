# Plan: Content Polish P2 - Supporting Pages

**Status:** Backlog (not yet scheduled)
**Created:** 2026-01-01
**Updated:** 2026-01-13
**Priority:** High (required for v1.0)
**Effort Estimate:** M (three pages, contact form backend)
**Dependencies:** Content Polish P1 should be merged first

---

## Overview

Complete the supporting pages that provide context around the project showcase. P1 (separate PRD) covers
Home and Projects; this phase covers Skills, About, and Contact.

**Goal:** Supporting pages should feel polished and complete, providing professional context for the
portfolio's core project content.

**Related:** `prd-content-polish-p1.md` (Project Showcase - Home, Projects, Mods)

## Scope Summary

| Page    | Priority | Work Type            | Key Items                         |
|---------|----------|----------------------|-----------------------------------|
| Skills  | Medium   | Structural + Content | Logo grid, reorganization         |
| Contact | Medium   | Feature + Polish     | Contact form (backend), polish    |
| About   | Lower    | Content              | Copy pass                         |

---

## Skills Page

**Priority:** Medium - Important showcase, now the home for the skills logo grid.

### Current State

- Large content dump with minimal styling
- No clear visual hierarchy
- Potentially overwhelming for visitors

### Required Work

**1. Skills Logo Grid (Top of Page)**

Add visual overview of key technologies at top of page:

- 2 rows of recognizable tech logos (SVG preferred for theming)
- Quick visual reference before detailed content
- ~15-20 technologies featured (selection TBD)
- Links to Skills page sections or external docs?

**Rationale:** Originally planned for Home page, but Home now uses space for Featured cards.
Skills page benefits more - gives the page visual life and serves as "at-a-glance" overview
before the detailed text content.

**2. Content Audit**

- What's essential vs nice-to-have?
- Are categories logical?
- Is there redundancy?

**3. Reorganization**

- Clear category groupings
- Progressive disclosure (summary → detail?)
- Better visual hierarchy

**4. Visual Presentation**

- Consider skill cards/tiles vs lists
- Proficiency indicators? (risky - can feel arbitrary)

**Open question:** How much to reduce? Skills pages can be overwhelming. Consider what employers
actually look for vs comprehensive listing. Page should provide depth beyond the logo grid overview,
but not be a wall of text mentioning everything ever touched.

---

## Contact Page

**Priority:** Medium - Core functionality needed for v1.0.

### Current State

- Basic page structure exists
- No contact form (uses mailto link currently?)
- Minimal styling

### Required Work

**1. Contact Form**

**Scope:**

- Name, email, message fields
- Client-side validation
- Server-side handling (API route)
- Email delivery (Zeptomail or similar)
- Rate limiting (prevent spam/abuse)
- Success/error states

**Accessibility:**

- Proper labels and ARIA
- Error announcement for screen readers
- Keyboard navigation

**Design:**

- Fits TWM aesthetic
- Clear call-to-action
- Loading states during submission

**2. Visual Polish**

- Ensure page feels complete alongside form
- Social/professional links presentation
- Possibly: availability status or response time expectation

---

## About Page

**Priority:** Lower - Functional, just needs polish.

### Current State

- Content migrated
- Structure is reasonable
- Copy may need freshening

### Required Work

**1. Copy Pass**

- Review for clarity and tone
- Update any outdated information
- Ensure consistency with overall portfolio voice
- Download stats current? (recently updated per git log)

**Minimal structural changes expected.**

---

## Implementation Strategy

### Recommended Order

1. **Skills Page** - Logo grid + reorganization (structural work first)
2. **Contact Form** - Core functionality, can work in parallel with Skills
3. **About Page** - Quick win, minimal effort

---

## Open Questions

- **Skills logo selection:** Which ~15-20 technologies get visual representation?
- **Skills page density:** How aggressive to reduce content? What's the right balance?
- **Contact form provider:** Zeptomail confirmed or evaluate alternatives?
- **Rate limiting:** Client-side honeypot vs server-side rate limit vs both?

---

## Related Backlog Items

- `BACKLOG-FEATURE.md` - "Featured Skills Logo Grid (Home Page)" - now Skills page instead
- `BACKLOG-FEATURE.md` - "Interactive Skills Icon Bar with Project Filtering" (future extension)

---

## Risks & Mitigations

| Risk                               | Mitigation                                                 |
|------------------------------------|------------------------------------------------------------|
| Skills page redesign becomes major | Start with logo grid + light reorg, defer visual overhaul  |
| Contact form complexity            | Use proven patterns, consider existing form libraries      |
| Logo sourcing takes time           | Use simple-icons or similar package for common tech logos  |

---

**Next Step:** After P1 is complete, create PRD based on this plan and generate task list.
