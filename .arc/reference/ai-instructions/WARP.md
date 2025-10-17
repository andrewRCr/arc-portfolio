# WARP.md

Guidance for Warp terminal when working in this repository. For shared rules and architecture, defer to the
canonical docs:

- [AGENTS](AGENTS.md) – Project context, lookup guide, and collaboration principles
- [DEVELOPMENT-RULES](../constitution/DEVELOPMENT-RULES.md) v1.0 – Non-negotiable standards
- [QUICK-REFERENCE](../QUICK-REFERENCE.md) v1.0 – Environment context and command patterns
- [Process Task Loop](../workflows/3-process-task-loop.md) – One-subtask workflow

## Warp-Specific Notes

- **Session startup:** Execute Session Startup Protocol in CURRENT-SESSION.md first (verify working directory,
  verify Node.js/npm available, confirm repo root)
- **Shell syntax:** Prefer cross-platform command syntax
- **Command focus:** All npm commands from repo root (`/home/andrew/dev/arc-portfolio`)
- **Quality gates shorthand:** Reference commands from QUICK-REFERENCE (assume repo root paths); format as shell
  snippets when asked to run checks
- **Environment checks:** Confirm Node.js/npm availability before proposing actions that depend on them
- **Hand-offs:** When finishing terminal work, update CURRENT-SESSION.md (or state "no update required") and note any
  long-running commands left active (e.g., `npm run dev`)
