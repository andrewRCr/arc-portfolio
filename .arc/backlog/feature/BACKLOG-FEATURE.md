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

- **Interactive Skills Icon Bar with Project Filtering**
    - Description: Transform skills into clickable icons that filter projects by technology
    - Value: Creates cohesive skills→projects discovery flow
    - Plan: `plan-interactive-skills-filtering.md` (detailed 4-phase implementation)
    - Effort estimate: L

---

## Lower Priority / Ideas

- **Dynamic NexusMods Download Count** - Integrate NexusMods API to display live download counts
  (replaces hardcoded "270K+ downloads"). Requires API research.
- **Resume Download Feature** - Generate PDF resume from portfolio data. Multiple formats
  (technical vs game dev). Version control alongside portfolio content.
- **Project Search & Discovery** - Full-text search across projects. Advanced filters (date,
  team size, type). Search suggestions/autocomplete. (Overlaps with Skills Icon Bar filtering)

---
