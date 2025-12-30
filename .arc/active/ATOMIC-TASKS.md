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

- [ ] Restructure theme debug page + add comprehensive UI components
    - **Problem:** Theme debug page lacks common UI elements (forms, feedback, overlays) and will
      become unwieldy as we add them. Typography section should be its own page.
    - **Approach:** See detailed plan below
    - **Rationale:** Comprehensive debug page ensures all UI elements are tested across themes;
      section components keep code maintainable
    - **Components to install:**
      `npx shadcn@latest add input textarea checkbox switch alert badge popover tooltip dialog tabs`
    - **New file structure:**
      `src/app/dev/theme-debug/page.tsx` (main, imports sections),
      `src/app/dev/theme-debug/_sections/*.tsx` (section components),
      `src/app/dev/typography/page.tsx` (separate typography page)
    - **Sections:** (1) CSS Variables, (2) Color Palette, (3) Buttons, (4) Form Controls [NEW],
      (5) Feedback [NEW], (6) Overlays [NEW], (7) Cards & Layout, (8) Interactive States,
      (9) Developer Notes
    - **Typography page:** Headings, body text, font specimens, line heights; at `/dev/typography`
    - **Footer:** Change `[theme-debug]` to `debug: [theme] [typography]`
    - **Implementation order:** (1) Create `_sections/` structure, (2) Extract existing sections,
      (3) Install shadcn components, (4) Create new sections, (5) Create typography page,
      (6) Update footer, (7) Run quality gates

<!-- Example structure:

- [ ] {{Task name}}
    - Problem: {{What issue this addresses}}
    - Approach: {{How to solve it}}
    - Files: `{{path/to/file.ext}}`
    - Rationale: {{Why this matters}}

-->
