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

- [ ] Create and wire up hero images (3.5:1 aspect ratio) for 8 projects
    - DOOM NG+ Customizer already has dedicated hero image (from NexusMods page)
    - All other software/game projects currently fallback to first thumbnail
    - Not a blocker - visual polish task, do whenever convenient
