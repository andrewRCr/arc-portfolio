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

- [ ] Test suite quality improvements (non-TWM)
    - **Problem:** Test suite has redundant tests, weak assertions, and DRY violations
    - **Approach:**
        - Remove WindowContainer styling duplication from FooterBar/TopBar tests
        - Strengthen weak assertions (e.g., `toBeGreaterThan(0)` → actual values)
        - Create shared mocks for `next-themes` pattern
        - Add keyboard navigation tests to ProjectTabs (ArrowLeft/Right, Home/End)
        - Add PageLayout, PageHeader, SectionHeader tests (basic coverage)
    - **Files:** `src/components/**/__tests__/*.test.tsx`, `tests/mocks/`
    - **Rationale:** Identified during TWM test coverage analysis; improves test maintainability
    - **Note:** Theme/wallpaper component tests deferred to that work unit
