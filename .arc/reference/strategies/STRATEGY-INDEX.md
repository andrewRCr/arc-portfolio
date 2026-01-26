# Strategy Document Index

**Purpose:** Quick reference to codified strategy guidance in this project. Consult relevant strategies before implementing
work in these domains.

**Location:** All strategies in `.arc/reference/strategies/` subdirectories

## Project Strategies

**Engineering:**

- `project/strategy-testing-methodology.md` - Pragmatic TDD, when to test first/after/skip

**Style & Design:**

- `project/style/strategy-style-guide.md` - Design philosophy, token system, TWM layout, component patterns

## ARC Framework Strategies

**Process:**

- `arc/strategy-adr-methodology.md` - When/how to write Architecture Decision Records
- `arc/strategy-quality-gates.md` - Tiered quality gate system, when to run E2E checkpoints
- `arc/strategy-task-list-formatting.md` - Task list structure, formatting conventions
- `arc/strategy-work-organization.md` - Feature vs incidental work, branch coupling, archival

## Usage Protocol

**Before implementing:**

1. Identify domain (theming, testing, etc.)
2. Grep strategy doc for specific topic: `grep -i "your-topic" path/to/strategy.md`
3. Read relevant section(s)
4. Implement following guidance

**When uncertain if strategy applies:** Ask. "Does this work touch [domain] where we have strategy guidance?"

---

**Maintenance:** Update this index when adding new strategy documents. Keep descriptions to one line.
