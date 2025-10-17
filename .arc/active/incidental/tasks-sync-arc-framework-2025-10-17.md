# Incidental Work: Sync ARC Framework Updates

**Created**: 2025-10-17
**Triggered By**: Session resume (`.arc/active/CURRENT-SESSION.md`)
**Status**: In Progress
**Estimated Effort**: 90-120 minutes

## Context

**Why Now**: Before resuming Phase 3 content migration work, ensure this project has the latest ARC framework
improvements and workflow refinements.

These changes have been developed and battle-tested across CineXplorer and the framework repository.

**Discovery**: User identified that arc-portfolio's `.arc/` documentation is outdated compared to
arc-agentic-dev-framework's current state before starting new feature work.

**Impact**:

- Ensures consistent workflow and quality standards across all ARC-adopting projects
- Brings in refined constitutional documents, workflows, and AI instructions
- Prevents drift between projects using ARC framework
- Provides better session management, task tracking, and quality assurance patterns

## Scope

**Will Do**:

- Copy sync-with-arc-framework.md workflow (already completed)
- Update sync workflow to match this project's structure (.arc/ not .arc-internal/)
- Sync new framework files (QUICK-REFERENCE, strategy-work-categorization, maintain-task-notes)
- Update existing workflow files with framework improvements
- Update strategy documents with framework refinements
- Review AI instructions for applicable updates
- Verify all cross-references and internal links work
- Run markdown linting on all synced files
- Document sync completion

**Won't Do** (preserve project-specific):

- Project-specific constitutional documents (DEVELOPMENT-RULES.md, META-PRD.md, etc.)
- Active work content (tasks-content-migration.md, CURRENT-SESSION.md content)
- Project-specific strategy documents (testing-methodology.md)
- Custom quality gate commands for Next.js/TypeScript stack

## Framework Version

**Syncing from**: arc-agentic-dev-framework
**Framework commit**: d86916e (2025-10-17)
**Commit message**: "docs(workflows): add sync-with-arc-framework workflow for adopting projects"

## Tasks

- [x] 1. Copy sync-with-arc-framework.md workflow to project
  - [x] 1.1 Copy file from framework to .arc/reference/workflows/supplemental/
  - [x] 1.2 Update path reference (.arc/active/incidental/ not .arc-internal/)
  - [x] 1.3 Verify markdown linting passes

- [x] 2. Create incidental task list for sync work
  - [x] 2.1 Create tasks-sync-arc-framework-2025-10-17.md
  - [x] 2.2 Document framework version and context

- [ ] 3. Analyze framework vs project differences
  - [ ] 3.1 Run diff comparison between framework .arc/reference/ and project
  - [ ] 3.2 Categorize changes (new files, updated files, project-specific)
  - [ ] 3.3 Create prioritized sync list

- [ ] 4. Sync new framework files
  - [ ] 4.1 Copy QUICK-REFERENCE.example.md (if applicable)
  - [ ] 4.2 Copy strategy-work-categorization.md
  - [ ] 4.3 Copy maintain-task-notes.md workflow
  - [ ] 4.4 Update directory READMEs to reference new files
  - [ ] 4.5 Lint new files

- [ ] 5. Sync updated workflow files
  - [ ] 5.1 Update 3-process-task-loop.md with framework improvements
  - [ ] 5.2 Update agent-pr-review.md
  - [ ] 5.3 Update archive-completed.md
  - [ ] 5.4 Update manage-incidental-work.md
  - [ ] 5.5 Update session-handoff.md
  - [ ] 5.6 Lint updated workflow files

- [ ] 6. Sync updated strategy files
  - [ ] 6.1 Update strategies/README.md
  - [ ] 6.2 Review patterns.md for applicable updates
  - [ ] 6.3 Lint updated strategy files

- [ ] 7. Review AI instructions updates
  - [ ] 7.1 Review framework's AGENTS.example.md for improvements
  - [ ] 7.2 Review CLAUDE.example.md, GEMINI.example.md for new patterns
  - [ ] 7.3 Evaluate if updates apply to this project (Next.js/TypeScript stack)
  - [ ] 7.4 Update AI-SHARED.md or WARP.md if applicable
  - [ ] 7.5 Lint any updated AI instruction files

- [ ] 8. Validation and quality checks
  - [ ] 8.1 Verify cross-references and internal links work
  - [ ] 8.2 Run markdown linting on all .arc/ files
  - [ ] 8.3 Verify active work content intact (CURRENT-SESSION.md, tasks-content-migration.md)
  - [ ] 8.4 Check for framework placeholders that need project values

- [ ] 9. Documentation and completion
  - [ ] 9.1 Add completion notes to this task list
  - [ ] 9.2 Update CURRENT-SESSION.md notes (framework sync completed)
  - [ ] 9.3 Stage all changes for review
  - [ ] 9.4 Commit sync changes with detailed message

## Relevant Files

**Workflows (New)**:

- `.arc/reference/workflows/supplemental/sync-with-arc-framework.md`: Sync workflow copied and adapted

**Workflows (To Update)**:

- `.arc/reference/workflows/3-process-task-loop.md`: Core task execution workflow
- `.arc/reference/workflows/supplemental/agent-pr-review.md`: PR review workflow
- `.arc/reference/workflows/supplemental/archive-completed.md`: Archival workflow
- `.arc/reference/workflows/supplemental/manage-incidental-work.md`: Incidental work management
- `.arc/reference/workflows/supplemental/session-handoff.md`: Session handoff protocol

**Strategies (To Update)**:

- `.arc/reference/strategies/README.md`: Strategy directory overview

**Task Tracking**:

- `.arc/active/incidental/tasks-sync-arc-framework-2025-10-17.md`: This file

## Implementation Notes

### Sync Strategy

**Approach**: Incremental sync with careful preservation of project-specific customizations.

**Merge Pattern**:

- **Scenario A** (No custom content): Replace entire file with framework version
- **Scenario B** (Minor custom sections): Copy framework + re-add marked custom sections
- **Scenario C** (Heavy customization): Keep project version, manually merge improvements

**Files Expected to Use Scenario C** (preserve project-specific):

- DEVELOPMENT-RULES.md (Next.js quality gates, npm commands)
- META-PRD.md (portfolio project details)
- TECHNICAL-ARCHITECTURE.md (Next.js/TypeScript stack)
- PROJECT-STATUS.md (portfolio progress)
- testing-methodology.md (project-specific testing approach)

### Quality Checks After Each Subtask

```bash
# Lint specific file after updates
npx --yes markdownlint-cli2 .arc/path/to/updated-file.md

# Verify no broken cross-references
grep -r "\.md)" .arc/reference/ | grep -v "http"
```
