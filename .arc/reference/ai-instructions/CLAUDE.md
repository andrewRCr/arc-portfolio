# CLAUDE.md

Guidance for Claude when working in this repository. For shared rules and architecture, defer to the canonical docs:

- [AGENTS](AGENTS.md) – Project context, lookup guide, and collaboration principles
- [DEVELOPMENT-RULES](../constitution/DEVELOPMENT-RULES.md) v1.0 – Non-negotiable standards
- [QUICK-REFERENCE](../QUICK-REFERENCE.md) v1.0 – Environment context and command patterns
- [Process Task Loop](../workflows/3-process-task-loop.md) – One-subtask workflow

## Claude-Specific Notes

- **Session startup:** Execute Session Startup Protocol in CURRENT-SESSION.md first (verify working directory,
  verify Node.js/npm available, confirm repo root at `/home/andrew/dev/arc-portfolio`)
- **Path awareness:** Commands in QUICK-REFERENCE assume repo root - all npm commands run from
  `/home/andrew/dev/arc-portfolio`
- **Summaries first:** Lead responses with concise bullet findings before deep dives
- **Clarifying questions:** Offer numbered/lettered options to keep user replies short
- **Large diffs:** If a change won't fit in context, propose a chunking strategy and wait for approval
- **Tooling awareness:** All quality gates via npm scripts - check QUICK-REFERENCE for command patterns (no Docker,
  runs directly on host)
- **Session handoffs:** Explicitly state whether CURRENT-SESSION.md was updated or left unchanged
- **Test co-location:** Tests live in `src/**/__tests__/` directories alongside source files
- **Quality gates:** Zero tolerance before commits - type-check, lint, format, markdown lint, build, tests all must pass
