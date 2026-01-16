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

- [ ] **Evaluate secondary token strength in certain themes**
    - Issue: `secondary` token is visually too strong in gruvbox and ayu themes (dark mode)
    - Affects: ModStatsBadge (new), potentially other Badge uses
    - Does NOT affect: Navigation backgrounds (use `/20` modifier, works fine)
    - Options to evaluate:
        1. Add semantic tokens like `secondary-muted` with built-in opacity
        2. Adjust base secondary values for problem themes only
        3. Use different variant for stat badges specifically
    - Goal: Targeted fix that doesn't impact working areas (nav /20, non-problem themes)

- [ ] **Audit light mode token issues across themes**
    - Issue: Some themes have token problems in light mode (untested, app defaults to dark)
    - Scope: Systematic audit of all 6 themes in light mode
    - Identify: Contrast issues, readability problems, visual inconsistencies
    - May overlap with secondary token issue above
