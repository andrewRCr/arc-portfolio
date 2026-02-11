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

- [ ] Investigate Safari border-color snap during theme transitions
    - Borders snap instead of transitioning smoothly on Safari (Chrome/Firefox smooth)
    - Likely CSS custom property interpolation limitation — `border-color: var(--color-border)`
      doesn't re-resolve frame-by-frame in Safari despite `@property` registration on `<html>`
    - Explore: removing `border-color` from `*` rule (let inheritance handle it), or alternative
      approaches. Research started in this session — resume from external-research-analyst findings
    - Ref: Task 4.1 - `tasks-launch-preparation.md` (discovered during Safari jitter investigation)

- [ ] Restore hover effects on FilterIndicator badges (`/projects` page)
    - Badge `secondary` variant has no hover styles for non-anchor usage (`<span>` with `onClick`)
    - May have been lost during Shadcn/ui update or was never added for the non-anchor case
    - File: `src/components/projects/FilterIndicator.tsx`, `src/components/ui/badge.tsx`

---
