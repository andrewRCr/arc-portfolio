# Roadmap: Order of Operations

**Purpose:** Internal planning artifact documenting sequencing strategy for remaining work.
Subject to change as we learn.

**Last Updated:** 2026-01-27

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

3. ✅ **TWM Layout System** (2026-01-06)
   - Three-window layout, wallpaper system, responsive adaptation, 588 tests
   - [Archive](../reference/archive/2026-q1/feature/01_twm-layout-system/)

4. ✅ **Theme & Wallpaper Control System** (2026-01-13)
   - Unified theme/wallpaper controls, cookie-first SSR, 6 themes, 36 wallpapers, 862+67 tests
   - [Archive](../reference/archive/2026-q1/feature/02_theme-wallpaper-controls/)

5. ✅ **Content Polish P1** (2026-01-18)
   - Project showcase: DetailHeader, image gallery, 3-tab Projects, NexusMods API, Featured section
   - 1002 unit tests, 199 E2E tests
   - [Archive](../reference/archive/2026-q1/feature/03_content-polish-p1/)

6. ✅ **Content Polish P2** (2026-01-22)
   - SkillLogoGrid, skill-to-project filtering, Contact form with Zeptomail, About page polish
   - 1196 unit tests, 199 E2E tests
   - [Archive](../reference/archive/2026-q1/feature/04_content-polish-p2/)

7. ✅ **TWM Startup Animation** (2026-01-26)
   - Terminal boot sequence: CommandWindow → TopBar morph, SVG frame animation
   - Cookie-based state, skip on click/keypress, reduced-motion support, TopBar replay
   - 1239 unit tests, 304 E2E tests
   - [Archive](../reference/archive/2026-q1/feature/05_twm-startup-animation/)

8. 🔄 **Visual Polish** ← Active
   - Task list: `.arc/active/feature/tasks-visual-polish.md`
   - Branch: `feature/visual-polish`
   - Rationale: Remaining animation/transition work after startup animation
   - Scope: Page transitions, tab animations, micro-interactions, technical fixes,
     project hero images, terminal vs standard aesthetic standardization (exploratory)
   - Dependencies: TWM Startup Animation

### Phase C: Launch

Production readiness and deployment.

9. **Feature Flag System**
   - Rationale: Unified infrastructure for dev-only content, incomplete projects, and future feature rollouts
   - Scope: Centralized flag definitions, environment-based defaults (dev vs prod), type-safe API
   - Consolidates: Dev pages visibility, mods tab gating, incomplete project hiding
   - Enables: Deploy v1.0 without waiting for all projects; enable incrementally as completed

10. **SEO & Meta Tags**
    - Backlog: `.arc/backlog/feature/BACKLOG-FEATURE.md`
    - Rationale: Discoverability and social sharing
    - Scope: Open Graph (social previews), structured data (search), sitemap, robots.txt

11. **Deployment**
    - Rationale: Final step; requires all above complete
    - Scope: Vercel setup, domain transfer, production config

---

## Post-v1.0 (Backlog)

Items that can wait until after initial deployment:

- **Incomplete Projects Strategy** - Feature-flagged until ready; enable incrementally
- **Resume Download** - PDF generation
- **Analytics Integration** - Vercel Analytics

---

## Dependency Analysis

```
Content Migration ──► Design System Foundation ──► TWM Layout System
                                                            │
                                                            ▼
                                               Theme & Wallpaper Controls
                                                            │
                                                            ▼
                                                    Content Polish P1
                                                            │
                                                            ▼
                                                    Content Polish P2
                                                            │
                                                            ▼
                                                TWM Startup Animation
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

- **2026-01-23**: Split TWM Startup Animation from Visual Polish as separate work unit (item 7). Visual
  Polish becomes item 8 with remaining scope. Activated TWM Startup Animation, created PRD and task list.
  Renumbered Phase C items to 9-11.
- **2026-01-21**: Created `plan-visual-polish.md` as primary Visual Polish plan (app-wide scope). Includes
  terminal vs standard aesthetic exploration. TWM startup animation plan now referenced as detailed spec.
- **2026-01-19**: Content Polish P2 activated. PRD and task list created, moved to active, branch created.
- **2026-01-18**: Content Polish P1 completed and archived. Split into P1 (project showcase) and P2 (skills/about/contact).
  Renumbered items 7-9 to 8-10.
- **2026-01-13**: Theme & Wallpaper Control System completed and archived
- **2026-01-06**: TWM Layout System completed and archived
- **2026-01-01**: Added Theme & Wallpaper Control System (B4), renumbered subsequent items. Broken out
  from TWM Layout System Phase 5 after evaluation showed need for dedicated feature with state
  management, persistence, and unified control UI.
- **2026-01-01**: Added Feature Flag System (C7), renamed Phase C to "Launch", added incomplete projects
  strategy (feature-flagged, enable incrementally post-v1.0), updated scoping decisions
- **2026-01-01**: Added Content Polish (B5), renamed Visual Polish & Animations to Visual Polish (B6),
  moved Contact Form into Content Polish scope, updated dependency diagram
- **2025-12-30**: Added Design System Foundation to Phase A (Foundation), marked phase complete, updated numbering
- **2025-12-26**: Initial roadmap created from PROJECT-STATUS and backlog audit
