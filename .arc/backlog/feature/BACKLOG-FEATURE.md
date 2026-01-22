# Feature Backlog

**Purpose:** Organized collection of feature work ideas and plans, prioritized for future development.

**Processing:** Items move here from `TASK-INBOX.md` during weekly review. When ready to work on an item,
create a PRD in `.arc/active/feature/` and begin the standard workflow.

**Last Cleaned:** 2026-01-21

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

---

## Lower Priority / Ideas

- **Resume Download Feature** - Generate PDF resume from portfolio data. Multiple formats
  (technical vs game dev). Version control alongside portfolio content.
- **Project Search & Discovery** - Full-text search across projects. Advanced filters (date,
  team size, type). Search suggestions/autocomplete.

---

## Recently Completed (Moved Out)

Items removed from backlog after completion:

- ~~Theme & Wallpaper Control System~~ → Completed 2026-01-13, archived
- ~~Featured Skills Logo Grid~~ → Implemented in Content Polish P2 (SkillLogoGrid component, Home page row)
- ~~TWM Startup Animation~~ → Moved to `plan-visual-polish.md` (Visual Polish work unit)
- ~~Dynamic NexusMods Download Count~~ → Implemented in Content Polish P1 (NexusMods API with 6-hour cache)
