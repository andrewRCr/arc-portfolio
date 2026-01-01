# Plan: Content Polish

**Status:** Backlog (not yet scheduled)
**Created:** 2026-01-01
**Priority:** High (required for v1.0)
**Effort Estimate:** L (multiple pages, contact form, image integration)
**Dependencies:** TWM Layout System must be merged first

---

## Overview

Transform migrated placeholder content into production-ready pages. Content Migration (Phase A) brought raw
content over; this work unit makes each page structurally complete, visually polished, and ready for v1.0.

**Goal:** Every content page should feel intentional and complete, not "placeholder with migrated content."

## Scope Summary

| Page                 | Priority | Work Type            | Key Items                    |
|----------------------|----------|----------------------|------------------------------|
| Project Detail Pages | High     | Structural + Content | Header, images, copy         |
| Skills               | Medium   | Structural + Content | Reorganization, presentation |
| Contact              | Medium   | Feature + Polish     | Contact form, polish         |
| Home                 | Medium   | Feature              | Skills logo grid             |
| About                | Lower    | Content              | Copy pass                    |

---

## Project Detail Pages

**Priority:** High - These are the portfolio's core showcase.

### Current State

- Content migrated from Squarespace
- No consistent header pattern
- No images displayed (images exist in `public/`, just not integrated)
- Copy is raw/unedited from old portfolio

### Required Work

**1. Detail Page Header Component**

Create stable header element outside scrollable content (like PageHeader on list pages):

- Back button (consistent navigation pattern)
- Project tag/category (Web App, Desktop App, Game Dev, etc.)
- Project title
- Possibly: project links (GitHub, live site) in header vs body

**Design consideration:** Should this share DNA with PageHeader or be distinct? Detail pages have
different needs (back nav, category context) vs list pages (page title, description).

**2. Image Integration**

Images exist and are optimized - need display strategy:

**Options to evaluate:**

- **Hero image** - Single prominent image at top (simple, proven)
- **Gallery grid** - Multiple images in responsive grid (good for multi-screenshot projects)
- **Slideshow/carousel** - Sequential viewing (interactive but accessibility concerns)
- **Hybrid** - Hero + expandable gallery

**Recommendation:** Start with hero image + optional gallery grid. Avoid carousel (accessibility,
mobile UX issues). Can enhance later.

**Image inventory:** Check `public/projects/` for available assets per project.

**3. Copy Pass**

Review and improve text for each project:

- Description clarity
- Key features (are they compelling?)
- Tech stack presentation
- Highlights/achievements
- Remove Squarespace-isms

**Not in scope:** Major content rewrites. Goal is polish, not reinvention.

---

## Skills Page

**Priority:** Medium - Important showcase but less critical than project details.

### Current State

- Large content dump with minimal styling
- No clear visual hierarchy
- Potentially overwhelming for visitors

### Required Work

**1. Content Audit**

- What's essential vs nice-to-have?
- Are categories logical?
- Is there redundancy?

**2. Reorganization**

- Clear category groupings
- Progressive disclosure (summary → detail?)
- Better visual hierarchy

**3. Visual Presentation**

- Consider skill cards/tiles vs lists
- Icons for major technologies (ties into skills logo grid work)
- Proficiency indicators? (risky - can feel arbitrary)

**Open question:** How much to reduce? Skills pages can be overwhelming. Consider what employers
actually look for vs comprehensive listing. Conduct external research to inform decisions. Page should expand
on the at-a-glance logos on Home page, not replicate them verbatim - but also not be a wall of text or mention
everything I've ever touched/worked with - only truly relevant and key skills.

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

## Home Page

**Priority:** Medium - First impression, but already largely functional.

### Current State

- Hero section exists
- Featured projects section exists
- Missing skills at-a-glance

### Required Work

**1. Skills Logo Grid**

Add horizontal rows of tech/skill logos below Featured Projects:

- 2 rows max of recognizable tech logos
- Quick visual reference to skillset
- Links to Skills page (entire grid or individual?)
- Space-efficient for TWM frame constraints

**Cross-reference:** `BACKLOG-FEATURE.md` - "Featured Skills Logo Grid (Home Page)" entry

**Dependencies:**

- Logo assets (SVG preferred for theming)
- Selection of which skills to feature

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

1. **Project Detail Pages** - Highest impact, most structural work
2. **Contact Form** - Core functionality, can work in parallel
3. **Home Skills Grid** - Visible improvement, bounded scope
4. **Skills Page** - Needs design decisions, can defer some
5. **About Page** - Quick win, minimal effort

### Phasing Within PRD

When creating PRD, consider splitting into phases:

- **Phase 1:** Project detail pages (header + images)
- **Phase 2:** Contact form
- **Phase 3:** Home skills grid + Skills page
- **Phase 4:** Copy passes across all pages

Allows incremental commits and progress visibility.

---

## Open Questions

- **Detail page header:** Share component with PageHeader or distinct component?
- **Image gallery:** Grid vs hero-only vs hybrid approach?
- **Skills page:** How aggressive to reduce content? What's the right density?
- **Skills logo selection:** Which ~20 technologies get visual representation?
- **Contact form provider:** Zeptomail confirmed or evaluate alternatives?
- **Rate limiting:** Client-side honeypot vs server-side rate limit vs both?

---

## Related Backlog Items

- `BACKLOG-FEATURE.md` - "Featured Skills Logo Grid (Home Page)"
- `BACKLOG-FEATURE.md` - "Interactive Skills Icon Bar with Project Filtering" (future extension)
- `BACKLOG-FEATURE.md` - "Mod Portfolio Integration" (deferred, not part of this work)

---

## Risks & Mitigations

| Risk                               | Mitigation                                                 |
|------------------------------------|------------------------------------------------------------|
| Scope creep (endless copy editing) | Time-box copy passes, focus on structural issues first     |
| Skills page redesign becomes major | Start with reorganization, defer visual overhaul if needed |
| Contact form complexity            | Use proven patterns, consider existing form libraries      |
| Image gallery decision paralysis   | Start simple (hero + grid), enhance post-v1.0 if needed    |

---

**Next Step:** When ready to implement, create PRD based on this plan and generate task list.
