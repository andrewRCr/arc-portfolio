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

- [ ] Copy pass on project content prior to deployment
    - Review `src/data/projects.ts` for all project entries
    - Focus on `shortDescription` field - concise, compelling, consistent tone
    - **Merge features → highlights:** For each project, curate best points from `features`
      into `highlights` (features array no longer rendered but data preserved)
    - Target ~4-6 highlights per project focusing on impressive/notable aspects
    - Check for typos, awkward phrasing, or overly technical language
    - Consider if any highlights belong in architectureNotes instead

---
