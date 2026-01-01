# Feature Backlog

**Purpose:** Organized collection of feature work ideas and plans, prioritized for future development.

**Processing:** Items move here from `TASK-INBOX.md` during weekly review. When ready to work on an item,
create a PRD in `.arc/active/feature/` and begin the standard workflow.

---

## High Priority

*No high priority items currently.*

---

## Medium Priority

### Portfolio Content

- **Mod Portfolio Integration**
    - Description: Enable mods tab on /projects page, migrate NexusMods content
    - Value: Showcases community contributions and modding expertise
    - Dependencies: Feature flag `FEATURES.SHOW_MODS_TAB` ready, infrastructure exists
    - Effort estimate: M
    - Notes: Deferred from `feature/content-migration` (was Task 8.0). Tab component, routes,
      and placeholder data already exist. Need to: select mods, migrate descriptions/images,
      replace placeholder data in `src/data/mods.ts`.

### User Experience

- **Theme & Wallpaper Control System**
    - Description: Unified theme/wallpaper selection replacing prototype ThemeSwitcher. Theme-aware
      wallpaper filtering, per-theme persistence, polished picker UI.
    - Value: Personalized experience with authorial control; users choose from curated options
    - Plan: `plan-theme-wallpaper-controls.md`
    - Dependencies: TWM Layout System (provides wallpaper infrastructure)
    - Effort estimate: M
    - Notes: Broken out from TWM Layout System Phase 5 during evaluation. Includes ThemePicker
      (8-square palette), WallpaperPicker (thumbnail grid), fallback logic for theme switches.

- **Featured Skills Logo Grid (Home Page)**
    - Description: Add horizontal rows of tech/skill logos to home page below Featured Projects
    - Value: Instant "at a glance" skill overview - common portfolio pattern for good reason.
      Provides quick familiarity with tech stack without reading Skills page or browsing projects.
    - Implementation notes:
        - Location: Home page, below Hero and Featured Projects sections
        - Format: 2 rows max of recognizable tech logos (Python, TypeScript, React, etc.)
        - Complements (doesn't replace) full Skills page depth
        - Space-efficient design to fit TWM/TUI frame constraints
        - Previous portfolio had ~2x12 grid; adapt to current design
        - Consider: clickable links to Skills page sections? Or purely visual?
    - Dependencies: Logo assets (SVG preferred for theming flexibility)
    - Effort estimate: S-M
    - Related: "Interactive Skills Icon Bar with Project Filtering" is a more advanced
      extension that adds filtering behavior; this is the simpler display-only version

- **Interactive Skills Icon Bar with Project Filtering**
    - Description: Transform skills into clickable icons that filter projects by technology
    - Value: Creates cohesive skills→projects discovery flow
    - Plan: `plan-interactive-skills-filtering.md` (detailed 4-phase implementation)
    - Effort estimate: L
    - Note: If "Featured Skills Logo Grid" is implemented first, this could extend it
      with filtering behavior rather than replacing it

- **TWM Startup Animation**
    - Description: "Terminal boot" animation on first home visit - single command window
      types "portfolio init", morphs into TopBar, other windows expand into place
    - Value: Memorable first impression, reinforces TWM/TUI aesthetic, portfolio differentiator
    - Plan: `plan-twm-startup-animation.md` (5-phase implementation with technical approach)
    - Dependencies: TWM Layout System must be merged first
    - Effort estimate: M-L
    - Notes: Session-tracked (once per session). Retriggerable via TopBar branding click.
      Respects prefers-reduced-motion. Optional TUI frame "assembly" animation as final polish.

---

## Lower Priority / Ideas

- **Dynamic NexusMods Download Count** - Integrate NexusMods API to display live download counts
  (replaces hardcoded "270K+ downloads"). Requires API research.
- **Resume Download Feature** - Generate PDF resume from portfolio data. Multiple formats
  (technical vs game dev). Version control alongside portfolio content.
- **Project Search & Discovery** - Full-text search across projects. Advanced filters (date,
  team size, type). Search suggestions/autocomplete. (Overlaps with Skills Icon Bar filtering)

---
