# Technical Backlog

**Purpose:** Organized collection of technical work ideas and plans - infrastructure, tooling,
modernization, and quality improvements.

**Processing:** Items move here from `TASK-INBOX.md` during weekly review. When ready to work on an item,
create a PRD/plan in `.arc/active/technical/` and begin the standard workflow.

---

## High Priority

*No high priority items currently.*

---

## Medium Priority

*No medium priority items currently.*

---

## Lower Priority / Ideas

### Semantic Status Tokens (Success/Warning/Info)

**Trigger:** When app needs success, warning, or info status indicators

**Context:** Design system has `destructive` + `destructive-foreground` as a WCAG-compliant semantic
pair, but lacks equivalent tokens for success/warning/info states. Current accent colors
(accent-green, accent-orange, accent-blue) are decorative only - not validated for text contrast.

**Proposed tokens:**

- `success` + `success-foreground` (green-based, WCAG AA compliant)
- `warning` + `warning-foreground` (orange/yellow-based, WCAG AA compliant)
- `info` + `info-foreground` (blue-based, WCAG AA compliant)

**Why deferred:** No current app need. Add when building features requiring semantic status feedback.

**Origin:** CodeRabbit PR #2 review (2025-12-30)

---

### DevPageLayout Component Extraction

**Trigger:** When adding a 3rd dev page (or touching these files for other reasons)

**Context:** `theme-debug` and `typography` pages share identical patterns:

- Dev-only NODE_ENV guard with wrapper pattern
- Sticky header with title, theme selector, mode toggle, jump links
- Consistent page layout structure

**Proposed refactor:**

- `DevPageGuard` or `withDevGuard` wrapper handling NODE_ENV check
- `DevPageHeader` component with parameterized title and jump links
- Shared layout structure

**Why deferred:** Only 2 consumers currently - abstraction would be premature. Extract when
the pattern is needed a 3rd time.

**Origin:** CodeRabbit PR #2 review (2025-12-30)

---
