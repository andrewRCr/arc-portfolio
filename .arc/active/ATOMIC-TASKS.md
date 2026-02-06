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

- [ ] Extract surface-tuning sandbox tool to dedicated dev page
    - Promote `SurfaceOpacityComparison` from `/dev/sandbox` to its own `/dev/surface` page
    - Match pattern of existing dev tools (`/dev/typography`, `/dev/theme`, `/dev/wallpaper`)
    - Clean up variable naming (e.g., `lightOpacity` → `currentSurfaceOpacity`)
    - Add `useEffect` cleanup for DOM-injected `data-sandbox-overlay`
    - Snapshot and restore CSS variables on unmount (--surface-opacity, --surface-darken,
      --window-darken, per-element --window-bg-opacity) to prevent style leaks on navigation
    - Fix `exportCss` wallpaper overlay: emit per-mode color/opacity variables so dark and
      light modes with opposite overlay signs produce correct styles independently
    - Remove the component from sandbox page after extraction

- [ ] Copy pass on project content prior to deployment
    - Review `src/data/projects.ts` and `src/data/mods.ts` for all entries
    - Focus on `shortDescription` field - concise, compelling, consistent tone
    - **Merge features → highlights:** For each project, curate best points from `features`
      into `highlights` (features array no longer rendered but data preserved)
    - **Priority:** `re8-aim-dependent-crosshair` and `sh2r-never-holster-weapons` have
      features but no highlights — their detail pages currently show no content sections
    - Target ~4-6 highlights per project focusing on impressive/notable aspects
    - Check for typos, awkward phrasing, or overly technical language
    - Consider if any highlights belong in architectureNotes instead
    - **Cleanup after merge:** Remove `features` from `Project` type, `sectionLabels.features`
      from type and data, update docstring in `ProjectDetail.tsx`

---
