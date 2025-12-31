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
