# arc-portfolio - AI Agent Reference Card

**Version:** 1.1 | **Updated:** 2026-02-12

## Project Overview

arc-portfolio is a modern developer portfolio website showcasing full-stack development skills through project exhibits,
technical expertise, and professional background. Built with Next.js 16 and TypeScript, it demonstrates proficiency in
contemporary web development practices, type safety, testing, and professional documentation.

**Project Type**: Solo showcase portfolio
**Primary Goal**: Demonstrate technical proficiency and development practices for potential employers/collaborators

## Project Snapshot

**Technology Stack:**

- **Frontend**: Next.js 16 (App Router) + React + TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Testing**: Vitest + React Testing Library
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

- **All npm commands from repo root**: See QUICK-REFERENCE for environment context and paths
- **Tests co-located**: Test files in `src/**/__tests__/` directories alongside source
- **Image paths**: Public assets at `public/`, referenced in code as `/path/to/asset`
- **Quality gates before commits**: Zero tolerance - type-check, lint, format, markdown lint, build, tests must all pass
- **No Docker/containers**: Runs directly on host with npm
- **TypeScript strict mode**: No `any` types without justification
- **Console logging for AI**: Browser console logs auto-captured to `.console-logs.txt` (use `npm run dev:with-logs`)

## AI Collaboration Principles

**Working Approach:**

- **Plan before executing** - Default to plan-driven execution; skip plans only for trivial tasks
- **Respect user intent** - Never revert or "fix" user changes without explicit approval
- **Stop on anomalies** - Treat unexpected filesystem diffs as a stop signal and request guidance
- **Limit scope** - Avoid global mutations or widespread changes without explicit approval
- **One subtask at a time** - Complete tasks incrementally, await approval between subtasks
- **Manual commit control** - AI NEVER initiates commits without explicit user approval or instruction

**Communication:**

- **Focus on value** - Prioritize findings, risks, and actionable next steps in summaries
- **Be clear and targeted** - Provide enough detail to be useful, not so much it's overwhelming

---
