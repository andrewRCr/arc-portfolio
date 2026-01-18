# PRD: Content Polish P1 - Project Showcase

**Type:** Feature
**Status:** Complete
**Created:** 2026-01-13

---

## Overview

Transform the project showcase experience from functional placeholder to polished portfolio. This phase focuses
on Home and Projects - the core of what visitors come to see. P2 (separate PRD) covers supporting pages
(Skills, About, Contact).

**Goal:** Every project-related page should feel intentional, visually cohesive, and professionally presented.

## Goals

1. Establish a compelling Home page Featured section that highlights best work across categories
2. Polish Project Detail pages with proper header, imagery, and refined copy
3. Complete mod content migration and integrate mods as first-class portfolio items
4. Reorganize Projects page with three-tab structure (Software/Games/Mods)

## User Stories

- As a visitor, I want to see a curated selection of featured work on the Home page so I can quickly
  gauge the portfolio's quality and breadth
- As a hiring manager, I want to see polished project detail pages with clear imagery so I can evaluate
  technical work professionally
- As a visitor, I want to browse projects by category (Software/Games/Mods) so I can explore areas of interest
- As a visitor, I want a sticky header on project details so I can navigate back easily while scrolling

## Functional Requirements

### Home Page Featured Section

1. Display 4 Featured cards in a semi-randomized layout
2. Card slot configuration (two options under consideration):
   - **Option A:** Software, Software, Framework, (Game OR Mod)
   - **Option B:** Software, Framework, Game, Mod
3. Randomization occurs client-side on page load
4. Card pools:
   - Software: CineXplorer, TaskFocus (PetResort may join later after 2.0 overhaul)
   - Framework: ARC Agentic Dev Framework (always featured, dedicated slot)
   - Game: ActionRPGProject, SurvivalHorrorProject (not Pong)
   - Mod: subset of migrated mods (smaller pool than full 6-9 on Mods tab)
5. Replace "Featured Projects" header with "Featured"
6. Replace redundant "[project]" card labels with category type labels:
   - Lowercase: "software", "framework" (or "toolkit" - follows ARC naming), "game", "mod"

### Projects Page Tabs

7. Implement 3-tab structure: Software, Games, Mods
8. Move game projects to Games tab: ActionRPGProject, SurvivalHorrorProject, Pong
9. Enable Mods tab (currently feature-flagged off)
10. Maintain consistent card presentation across all tabs

### Project Detail Pages

11. Create DetailHeader component (may extend PageHeader if feasible):
    - Hero image as header background
    - Project title
    - Smart back button (previous page if from projects, else /projects) - already implemented
    - Category badges (e.g., "desktop app", "web app", "game", "mod")
12. Move project description out of header into scrollable content area
13. Implement image gallery with clickable thumbnails opening lightbox/modal
14. Ensure header remains sticky while content scrolls
15. Light copy editing pass for each project (typos, awkward phrasing - not deep rewrites)

### Mod Content Migration

16. Migrate 6-9 featured mods (selection TBD from 35 published)
17. For each mod, migrate:
    - Copy/description from NexusMods
    - Thumbnail image (16:9, ~1080p) - remove text overlay
    - Banner/hero image (wide format) - remove text overlay
    - Content images where applicable
18. Mods use the same ProjectDetail layout as software/game projects
19. Mod data structure aligns with existing project type (or extends minimally)

## Non-Goals (Out of Scope)

- Skills page changes (P2)
- About page changes (P2)
- Contact form implementation (P2)
- Deep content rewrites (light editing only)
- PetResort 2.0 overhaul (separate future work)
- Animation/transitions (Visual Polish phase)
- Incomplete project pages (CineXplorer, TaskFocus 2.0, arc-portfolio - feature-flagged)

## Design Considerations

- DetailHeader should maintain TWM aesthetic consistency with existing PageHeader
- Gallery lightbox should be accessible (keyboard navigation, focus management)
- Featured card randomization should feel natural, not jarring on repeat visits
- Category badges should use existing badge/tag styling patterns
- Hero images in headers must work within TWM's constrained content space

## Technical Considerations

- Client-side randomization for Featured cards (no SSR complexity)
- DetailHeader component may share base with PageHeader or be distinct - evaluate during implementation
- Mod data can likely extend existing Project type with minimal additions
- Image optimization: existing WebP pipeline applies to mod images
- Feature flag for Mods tab already exists - enable when content ready

## Success Criteria

- [x] Home Featured section displays 4 cards with category labels and randomization
- [x] Projects page has 3 functional tabs (Software/Games/Mods)
- [x] All project detail pages have sticky DetailHeader with hero image and badges
- [x] All project detail pages have functional image gallery with lightbox
- [x] 6-9 mods fully migrated with images and copy
- [x] All existing software projects have light copy editing pass completed
- [x] All game projects properly categorized and accessible via Games tab

## Open Questions (Resolved)

1. **Featured layout:** Chose Option B (Software, Framework, Game, Mod) - one of each type for variety.
2. **Framework label:** Used "framework" - aligns with naming conventions.
3. **Hero image in header:** Implemented 3.5:1 aspect ratio banner with crossfade animation on scroll.
4. **DetailHeader inheritance:** Created as sibling to PageHeader (distinct component) - both work in
   PageLayout's header slot.
5. **Mod selection:** Selected 6 mods for Mods tab; 5 in Featured pool (excludes sh2r-never-holster-weapons).

## Related Documentation

- Plan (P2): `.arc/backlog/feature/plan-content-polish-p2.md`
- Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
