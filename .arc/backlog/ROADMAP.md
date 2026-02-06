# Roadmap: Order of Operations

**Purpose:** Internal planning artifact documenting sequencing strategy for remaining work.
Subject to change as we learn.

**Last Updated:** 2026-02-06

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

### Phase B: Visual Design System ✅

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

8. ✅ **Visual Polish** (2026-02-05)
   - Page transitions, tab animations, micro-interactions, theme consolidation, AnimationContext
   - 1366 unit tests, 341 E2E tests
   - [Archive](../reference/archive/2026-q1/feature/06_visual-polish/)

### Phase C: Launch

Production readiness and deployment.

9. 🔄 **Launch Preparation** ← Active
   - Task list: `.arc/active/feature/tasks-launch-preparation.md`
   - Branch: `feature/launch-preparation`
   - Scope: Dev infrastructure, content copy pass, custom error pages, SEO & metadata,
     Vercel deployment with multi-domain (`andrewcreekmore.dev` primary)

---

## Post-v1.0 (Backlog)

Items that can wait until after initial deployment:

- **Resume Download** - PDF generation (portfolio is primary artifact; TBD if needed)
- **Analytics Integration** - Vercel Analytics (trivial post-launch addition)
- **Blog / Content Feature** - Feature flag infrastructure supports future addition

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
                                                   Launch Preparation
                                               (flags, SEO, deployment)
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

| Item            | Rationale                  | When                    |
|-----------------|----------------------------|-------------------------|
| Resume Download | Portfolio is primary asset | If needed for job apps  |
| Blog            | Scope TBD                  | Post-v1.0, flag-gated   |
| Analytics       | Trivial addition           | Post-launch             |

### Skipped

| Item              | Rationale                               |
|-------------------|-----------------------------------------|
| CMS integration   | Static content sufficient for portfolio |
| User accounts     | Not needed for portfolio                |
| Project search    | Superseded by tabs + skill filtering    |
| Semantic tokens   | Single form doesn't justify token system|

---

## Open Questions

*No open questions.*

**Resolved:**

- ~~Mod portfolio~~: Included in v1.0 (mods tab, NexusMods API integration complete) (2026-01-18)
- ~~Incomplete projects strategy~~: In-development badge on cards + feature flags for future use (2026-02-05)
- ~~Contact form placement~~: Included in Content Polish work unit (2026-01-01)
- ~~Mods tab implementation~~: Included via `SHOW_PROJECT_TABS` flag (2026-01-18)
- ~~Feature Flags / SEO / Deployment split~~: Consolidated into single Launch Preparation work unit (2026-02-06)

---

## Change Log

- **2026-02-06**: Consolidated Phase C items 9-11 (Feature Flags, SEO, Deployment) into single
  Launch Preparation work unit (item 9). Cleaned stale backlog entries (Mod Portfolio complete,
  Project Search superseded). Phase B marked complete (Visual Polish archived).
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
