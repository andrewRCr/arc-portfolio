# Development Rules - arc-portfolio

**Version:** 1.0 | **Updated:** October 25, 2025 | **Hash:** `arc-portfolio-v1.0-20251025`

Core development rules and quality standards for arc-portfolio. These rules are **non-negotiable** and must be followed
by all contributors, including AI assistants.

**For command patterns and environment context**, see [QUICK-REFERENCE.md](../QUICK-REFERENCE.md).
**For session initialization protocol**, see [session-init.md](../workflows/supplemental/session-init.md).

## Manual Commit Control

- **AI NEVER initiates commits** without explicit user approval or instruction
- **AI CAN execute commits** when user explicitly approves/instructs it
- **User approval required** for all git operations
- **MANDATORY:** Comprehensive task context analysis before any commit consideration (see atomic-commit workflow)
- **Task list accuracy required**: Before commit consideration, verify task documentation reflects completed work
  (parent task marked `[x]` if all subtasks complete)
- **Never commit stale task docs**: Task list updates must be saved and included in commits for completed work
- AI reports completion, then awaits commit instructions

### Quality Gates (Zero Tolerance)

Before any commit consideration, ALL of the following must pass with **zero exceptions**.
For specific commands, see [QUICK-REFERENCE.md](../QUICK-REFERENCE.md).

**Zero Tolerance Policy:** All errors, violations, and failures must be fixed. No exceptions.

1. **Type Checking**: Zero errors
    - Command: `npm run type-check`

2. **Code Linting**: Zero violations
    - Command: `npm run lint`
    - Auto-fix: `npm run lint -- --fix`

3. **Code Formatting**: Must pass
    - Command: `npm run format:check`
    - Auto-fix: `npm run format`

4. **Markdown Linting**: Zero violations
    - Command: `npm run lint:md`
    - Auto-fix: `npm run lint:md:fix`

5. **Build Success**: Must complete
    - Command: `npm run build`

6. **Tests**: 100% pass rate
    - Command: `npm test`

### Quality Gate Failure Protocol

If quality gates fail after sub-task completion:

1. **Report the failure** with specific details
2. **Identify suspected causes** and investigation areas
3. **Ask for guidance** on whether to fix immediately or defer
4. **Never proceed** to next sub-task until resolved or user approves

### Leave It Cleaner: Pre-existing Issue Protocol

**Principle:** When touching any file, leave it cleaner than you found it.
Quality issues discovered during work should be addressed, not ignored.

**When quality checks reveal pre-existing issues in files you're modifying:**

1. **Assess severity and scope:**
    - **Minor issues** (< 5 minutes): Fix immediately without asking
    - **Moderate issues** (5-15 minutes): Fix immediately, document in commit
    - **Major issues** (> 15 minutes): Ask for direction before proceeding

2. **Required actions (choose one):**
    - ✅ **Fix immediately** - Preferred for all issues < 15 minutes
    - ✅ **Document and defer** - Create incidental task list with:
        - Clear description of issue found
        - Why it's being deferred (time/scope constraints)
        - Estimated effort to fix
        - Link to relevant files/line numbers
    - ❌ **Ignore silently** - NEVER acceptable

3. **Documentation requirements:**
    - Fixed issues: Note in commit message ("Also fixed X pre-existing issues")
    - Deferred issues: Create task list in `.arc/active/incidental/tasks-incidental-*.md`
    - Never: Leave issues undocumented or unaddressed

## Session Documentation Control

### CURRENT-SESSION.md Update Protocol

- **AI NEVER updates CURRENT-SESSION.md** without explicit user instruction
- CURRENT-SESSION.md is a handoff document only updated at session end when instructed
- AI should report changes and progress, but user decides when/how session docs are updated

## Task Management Protocol

### One Sub-Task Rule

- **Complete ONE sub-task at a time** - never bundle multiple deliverables
- **Mark complete immediately** when work is done (tests pass, quality checks pass)
- **Mandatory stop** after reporting completion for user approval to proceed
- **Implied permission**: User approval implies permission to proceed UNLESS explicitly stated otherwise
  (e.g., "that's done, but before moving on..."). Address such concerns before proceeding to next subtask.

### Sub-Task Granularity Guidelines

Break down a sub-task if it requires:

- More than 3 files to be modified
- More than 50 lines of core logic changes
- Multiple interdependent changes
- Complex debugging/investigation

### Test-First Protocol

**BEFORE implementing any sub-task, assess test-first requirement:**

**Requires test-first** (write tests BEFORE implementation):

- New models (data schemas, TypeScript interfaces)
- New API routes or route modifications
- New service functions or business logic
- Complex algorithms or data transformations
- Non-trivial validation or processing logic
- Component behavior (interactions, state changes)

**Test-after acceptable**:

- Simple data structures without logic
- Presentational UI components (layout/styling)
- Configuration file changes
- Trivial refactoring (renaming, moving files)
- Documentation-only changes

**If unsure whether test-first applies, default to test-first.** Writing tests after implementation is harder and less effective.

**During task list creation:** Ensure test sub-tasks appear BEFORE implementation sub-tasks for test-first work.
This makes the protocol visible during execution.

## Testing Requirements

- **Test-first protocol**: See Task Management Protocol section above for when to write tests before vs. after implementation
- **Integration focus**: Prefer flow-level coverage over isolated units when practical
- **All tests must pass** before any commit discussion (see quality gates above)
- **Command patterns**: See [QUICK-REFERENCE.md](../QUICK-REFERENCE.md) for execution commands
- **Test co-location**: Tests in `src/**/__tests__/` alongside source files

## Code Quality Principles

Apply standard software engineering principles:

- **DRY** (don't repeat yourself)
- **SOLID** (single responsibility, open/closed, dependency inversion)
- **KISS** (keep it simple)
- **YAGNI** (you aren't gonna need it)

Separate concerns, prefer composition over duplication, favor readability when principles conflict.

## Reference Documentation

This document provides core rules and standards. See related documentation:

- [QUICK-REFERENCE.md](../QUICK-REFERENCE.md) - Environment context, command patterns, and tool usage
- [Task Processing Workflow](../workflows/3_process-task-loop.md) - Detailed task execution workflow
- [Atomic Commit Workflow](../workflows/supplemental/atomic-commit.md) - Enhanced commit workflow with task context analysis
- [AI Agent Reference Card](../agent/AGENTS.md) - Complete project context for AI
- [Technical Architecture](TECHNICAL-ARCHITECTURE.md) - Architecture and methodology details
- [Testing Methodology](../strategies/strategy-testing-methodology.md) - Detailed testing approach
