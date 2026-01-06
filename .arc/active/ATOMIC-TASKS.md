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

- [ ] Investigate iOS Safari OverlayScrollbars padding alignment issue
    - **Context:** On iPhone 16, scrollbar `os-padding-axis` (vertical) doesn't align correctly with content
    - **Symptoms:** Top padding inconsistent, bottom padding extends past content end
    - **Possible cause:** Known iOS Safari issues with OverlayScrollbars, or app-specific CSS
    - **Location:** `src/app/globals.css` (lines 514-527), ScrollShadow component integration
    - **Acceptance:** Either fix alignment or document as known limitation with rationale
