# Roadmap: Order of Operations

**Purpose:** Internal planning artifact documenting sequencing strategy for remaining work.
Subject to change as we learn.

**Last Updated:** 2026-01-01

---

## Current Sequencing Strategy

### Phase A: Foundation ✅

Establish content baseline and design system infrastructure before visual design work.

1. ✅ **Content Migration** (2025-12-27)
   - All Squarespace content migrated with display components
   - [Archive](../.arc/reference/archive/2025-q4/feature/03_content-migration/)

2. ✅ **Design System Foundation** (2025-12-30)
   - Token architecture (shadcn conventions), E2E testing (Playwright), accessibility validation
   - 3 theme families (Gruvbox, Rose Pine, Remedy) with WCAG AA compliance
   - [Archive](../.arc/reference/archive/2025-q4/technical/04_design-system-foundation/)

### Phase B: Visual Design System (Current)

Transform placeholder styling into distinctive, polished design.

3. **TWM Layout System**
   - PRD: `.arc/active/feature/prd-twm-layout-system.md`
   - Rationale: Core visual identity; affects all pages; foundational for polish work
   - Scope: Three-window layout, theming architecture, responsive adaptation
   - Dependencies: Content migration complete, design system foundation established

4. **Content Polish**
   - Plan: `.arc/backlog/feature/plan-content-polish.md`
   - Rationale: Pages need structural completion before animation polish
   - Scope: Project detail pages (header, images, copy), Skills page reorganization,
     About copy pass, Contact form + polish, Home skills logo grid
   - Dependencies: TWM Layout System (styling foundation)

5. **Visual Polish**
   - Plan: `.arc/backlog/feature/plan-twm-startup-animation.md` (primary)
   - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md` (additional items)
   - Rationale: Animation/transition layer after pages are structurally complete
   - Scope: TWM startup animation, Framer Motion transitions, micro-interactions, loading states
   - Dependencies: Content Polish (can't animate incomplete pages)

### Phase C: Launch

Production readiness and deployment.

6. **Feature Flag System**
   - Rationale: Unified infrastructure for dev-only content, incomplete projects, and future feature rollouts
   - Scope: Centralized flag definitions, environment-based defaults (dev vs prod), type-safe API
   - Consolidates: Dev pages visibility, mods tab gating, incomplete project hiding
   - Enables: Deploy v1.0 without waiting for all projects; enable incrementally as completed

7. **SEO & Meta Tags**
   - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
   - Rationale: Discoverability and social sharing
   - Scope: Open Graph (social previews), structured data (search), sitemap, robots.txt

8. **Deployment**
   - Rationale: Final step; requires all above complete
   - Scope: Vercel setup, domain transfer, production config

---

## Post-v1.0 (Backlog)

Items that can wait until after initial deployment:

- **Incomplete Projects** - CineXplorer, TaskFocus 2.0, ARC Framework, arc-portfolio detail page
  (feature-flagged; enable as each project completes)
- **Mod Portfolio Integration** - Feature flag ready, infrastructure exists
- **Interactive Skills Filtering** - Plan exists (`plan-interactive-skills-filtering.md`)
- **Dynamic NexusMods Stats** - API integration
- **Resume Download** - PDF generation
- **Analytics Integration** - Vercel Analytics

---

## Dependency Analysis

```
Content Migration ──► Design System Foundation ──► TWM Layout System
                                                            │
                                                            ▼
                                                      Content Polish
                                                            │
                                                            ▼
                                                      Visual Polish
                                                            │
                                                            ▼
                                                  Feature Flag System
                                                            │
                                                            ▼
                                                    SEO & Meta Tags
                                                            │
                                                            ▼
                                                       Deployment
```

---

## Scoping Decisions

### Included in v1.0

| Item                       | Rationale                                         |
|----------------------------|---------------------------------------------------|
| TWM Layout System          | Core visual identity                              |
| Basic theming (dark/light) | User preference                                   |
| Responsive design          | Mobile users                                      |
| Feature flag system        | Enable incremental project/feature rollout        |
| Completed project pages    | Portfolio showcase (projects ready at launch)     |

### Deferred Post-v1.0

| Item                | Rationale                    | When                        |
|---------------------|------------------------------|-----------------------------|
| Incomplete Projects | Feature-flagged until ready  | Enable as each completes    |
| Mod Portfolio       | Undecided on inclusion       | After v1.0, if wanted       |
| Skills Filtering    | Enhancement, not core        | Post-launch                 |
| Advanced animations | Polish, not essential        | Iterative improvement       |

### Skipped

| Item            | Rationale                               |
|-----------------|-----------------------------------------|
| CMS integration | Static content sufficient for portfolio |
| User accounts   | Not needed for portfolio                |
| Blog            | Out of scope for v1.0                   |

---

## Open Questions

- Mod portfolio: Include in v1.0 or defer entirely?

**Resolved:**

- ~~Incomplete projects strategy~~: Feature-flagged; deploy v1.0 without waiting, enable incrementally (2026-01-01)
- ~~Contact form placement~~: Included in Content Polish work unit (2026-01-01)
- ~~Mods tab implementation~~: Deferred via feature flag (2025-12-26)

---

## Change Log

- **2026-01-01**: Added Feature Flag System (C6), renamed Phase C to "Launch", added incomplete projects
  strategy (feature-flagged, enable incrementally post-v1.0), updated scoping decisions
- **2026-01-01**: Added Content Polish (B4), renamed Visual Polish & Animations to Visual Polish (B5),
  moved Contact Form into Content Polish scope, updated dependency diagram
- **2025-12-30**: Added Design System Foundation to Phase A (Foundation), marked phase complete, updated numbering
- **2025-12-26**: Initial roadmap created from PROJECT-STATUS and backlog audit
