# Atomic Tasks

**Purpose:** Small, one-off tasks that are ready to execute (GTD "Next Actions").

**How to use:**

1. Add tasks with checkboxes under "Active" section
2. When complete:
   - Mark `[x]` and add completion notes
   - Move to `completed-atomic-{{QUARTER}}.md` in `reference/archive/` (insert at top)
   - Add branch line after completion notes (with empty line separator):

     ```markdown
     - [x] Task description
         - **Outcome:** What was done, key changes
         - **Files:** list of modified files

         - **Branch:** `feature/feature-name` or `technical/tech-name`
     ```

3. Commit atomic work with: `Context: {{CATEGORY}} (atomic / no associated task list)`
   - Categories: maintenance, refactor, documentation, planning

**Referencing completed work:** "see {{TASK_NAME}} in `completed-atomic-{{QUARTER}}.md`"

- Quick access: [Completed Atomic Tasks](../reference/archive/{{QUARTER}}/completed-atomic-{{QUARTER}}.md)
- **Quarter format:** Use `YYYY-qN` (e.g., `2025-q4` for Oct-Dec 2025)

---

## Active

- [ ] **Audit light mode token issues across themes**
    - Issue: Some themes have token problems in light mode (untested, app defaults to dark)
    - Scope: Systematic audit of all 6 themes in light mode
    - Identify: Contrast issues, readability problems, visual inconsistencies
    - **Progress:**
        - **Root cause identified:** Pure white (#ffffff) card/popover tokens feel too stark against
          semi-transparent (80% opacity) window background. Creates visual disconnect.
        - **Solution approach:** (1) Darken card/popover tokens in light mode to harmonize with
          window aesthetic, (2) ensure large surfaces use `/80` opacity pattern for consistency
        - **Rouge:** Complete - card/popover #ffffff → #eeece9, ProjectCard uses bg-background/80
        - **Remaining:** Mariana, Rosé Pine, Gruvbox, Ayu, Remedy (5 themes)
