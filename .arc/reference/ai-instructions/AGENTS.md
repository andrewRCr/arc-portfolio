# arc-portfolio - AI Agent Reference Card

**Version:** 2025-10-17 | **Maintained by:** Andrew Creekmore | **Source of truth:** `.arc/reference/`

## Project Overview

arc-portfolio is a modern developer portfolio website showcasing full-stack development skills through project exhibits,
technical expertise, and professional background. Built with Next.js 15 and TypeScript, it demonstrates proficiency in
contemporary web development practices, type safety, testing, and professional documentation.

**Project Type**: Solo showcase portfolio
**Primary Goal**: Demonstrate technical proficiency and development practices for potential employers/collaborators

## Project Snapshot

**Technology Stack:**

- **Frontend**: Next.js 15.0.2 (App Router) + React + TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Testing**: Vitest + React Testing Library (246 tests, 100% pass rate)
- **Quality Tools**: ESLint + Prettier + markdownlint-cli2
- **Icons**: lucide-react
- **Animations**: Framer Motion (when used)

**Repository Layout:**

- `src/` - All application code (components, data, types, tests co-located)
- `public/` - Static assets (images: 66 WebP files, 6.1MB total)
- `.arc/` - Documentation (constitution, strategies, workflows, active/upcoming tasks)
- Config files at root (next.config.ts, tsconfig.json, vitest.config.ts, etc.)

## Critical Path Information

**Common Friction Points:**

- **All npm commands from repo root**: Commands assume `/home/andrew/dev/arc-portfolio` as working directory
- **Tests co-located**: Test files in `src/**/__tests__/` directories alongside source
- **Image paths**: Public assets at `public/`, referenced in code as `/path/to/asset`
- **Quality gates before commits**: Zero tolerance - type-check, lint, format, markdown lint, build, tests must all pass
- **No Docker/containers**: Runs directly on host with npm
- **TypeScript strict mode**: No `any` types without justification

## Quick Lookup Guide

When you need to find information, use these pointers (don't load everything upfront):

### "How do I...?"

**ARC Framework Processes:**

- **Start a new feature** → `workflows/1-create-prd.md`
- **Break down tasks** → `workflows/2-generate-tasks.md`
- **Implement tasks** → `workflows/3-process-task-loop.md`
- **Handle maintenance work** → `workflows/supplemental/manage-incidental-work.md`
- **Hand off session** → `workflows/supplemental/session-handoff.md`
- **Clean up completed work** → `workflows/supplemental/archive-completed.md`

**Project Information:**

- **Run tests/linting** → `DEVELOPMENT-RULES.md` + `QUICK-REFERENCE.md` (commands section)
- **Understand the product** → `META-PRD.md`
- **See current progress** → `PROJECT-STATUS.md`
- **Learn the architecture** → `TECHNICAL-ARCHITECTURE.md`
- **Get environment context** → `QUICK-REFERENCE.md`

### "What are the rules for...?"

- **Development standards** → `DEVELOPMENT-RULES.md`
- **AI collaboration protocols** → `DEVELOPMENT-RULES.md` (AI Session sections)
- **Code quality requirements** → `TECHNICAL-ARCHITECTURE.md` + `DEVELOPMENT-RULES.md`
- **Commit format and process** → `workflows/supplemental/atomic-commit.md`
- **Task management** → `workflows/3-process-task-loop.md`
- **Testing approach** → `strategies/strategy-testing-methodology.md`
- **Work categorization** → `strategies/strategy-work-categorization.md`

### "Where is...?"

- **Active work** → `.arc/active/` (current feature work, CURRENT-SESSION.md)
- **Upcoming work** → `.arc/upcoming/` (planned features, PRDs)
- **Completed work** → `.arc/reference/archive/` (historical context)
- **Project rules** → `.arc/reference/constitution/` (META-PRD, DEVELOPMENT-RULES, etc.)
- **Workflows** → `.arc/reference/workflows/` (core + supplemental)
- **Patterns** → `.arc/reference/strategies/` (architectural decisions)

## Document Dependencies

When constitutional documents change, update related files to keep documentation in sync:

**META-PRD.md changes** → Update:

- `ai-instructions/AGENTS.md` (this file) - project overview and features
- Potentially `PROJECT-STATUS.md` - if scope or priorities change

**DEVELOPMENT-RULES.md changes** → Update:

- Version number in DEVELOPMENT-RULES.md
- All `ai-instructions/*.md` files - if protocols change

**TECHNICAL-ARCHITECTURE.md changes** → Update:

- `ai-instructions/AGENTS.md` (this file) - technology stack and patterns
- Consider `PROJECT-STATUS.md` if architectural decisions affect roadmap

**PROJECT-STATUS.md changes** → Update:

- Consider if major status changes affect ongoing work priorities

## AI Collaboration Principles

**Working Approach:**

- **Plan before executing** - Default to plan-driven execution; skip plans only for trivial tasks
- **Respect user intent** - Never revert or "fix" user changes without explicit approval
- **Stop on anomalies** - Treat unexpected filesystem diffs as a stop signal and request guidance
- **Limit scope** - Avoid global mutations or widespread changes without explicit approval

**Communication:**

- **Focus on value** - Prioritize findings, risks, and actionable next steps in summaries
- **Be clear and targeted** - Provide enough detail to be useful, not so much it's overwhelming

## Maintenance Notes

- When `DEVELOPMENT-RULES.md` or `TECHNICAL-ARCHITECTURE.md` change, skim this file and update only if the
  high-level snapshot is now inaccurate
- Agent-specific instruction files (CLAUDE.md, WARP.md, etc.) should reference this file rather than duplicating content
- Commands and detailed workflows live in other docs - this is just a reference card
- Keep this file lean - if something is covered in CURRENT-SESSION/DEVELOPMENT-RULES/QUICK-REFERENCE, don't
  repeat it here
- Tool-specific files should be minimal: reference AGENTS.md + add tool-specific tips only

---

*This reference card is part of the ARC (Agentic, Recursive, Coordination) development framework. It provides
quick orientation and lookup guidance for AI assistants working on this project.*
