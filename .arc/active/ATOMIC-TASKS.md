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

- [ ] Fix icon button jitter during theme transitions (Safari)
    - The ThemeToggle sun/moon icon in TopBar and the filter button on
      /projects jitter visibly during light/dark transitions on Safari.
      Other icon buttons may also be affected — do a full audit. A
      stabilizing CSS property (likely `will-change` or a Framer Motion
      layout prop) was previously set on ThemeToggle but removed during
      code review (CodeRabbit flagged it as unnecessary). It was
      unnecessary on Firefox but Safari needs it. Investigate the git
      history for the removed property and restore it (or find an
      alternative stabilization approach) and apply to all affected
      elements.

- [ ] Investigate slow image loading on WiFi / lower-bandwidth connections
    - Two areas affected:
      a) **Wallpaper thumbnails in ThemeControl** — preview thumbnails load
         slowly when browsing theme options
      b) **Profile photo on About page** — appeared broken for 20+ seconds
         before loading on a laptop over WiFi
    - Possible causes: image sizes too large for thumbnails, missing
      responsive `sizes`/`srcSet`, no low-quality placeholder, or Next.js
      Image optimization settings need tuning for these use cases

- [ ] Laptop viewport responsive design pass
    - At 13" MacBook default resolution (1440×900, default scaling), several
      layout issues surface:
    - **Home:** Skill logos not visible without scrolling — poor landing page
      experience. Options: reduce to 2 featured projects, move skill logos above
      cards (as on mobile), or other accommodation
    - **Contact:** Minor scrolling required when the content could fit if top
      padding were reduced at this viewport size
    - **General:** Full audit of all pages at laptop-class viewports
      (~1280–1440px width, limited height) for any responsive accommodations
      needed — this is a common real-world viewport that may need its own
      breakpoint considerations

---
