# Strategy: Quality Gates

**Purpose:** Define the philosophy and methodology for quality gate execution during development. This strategy
establishes a tiered approach that balances thoroughness with development velocity.

**Scope:** General ARC methodology. Project-specific test commands, tooling, and component-to-test mappings
belong in project documentation (QUICK-REFERENCE, testing methodology strategy).

---

## Core Philosophy

Quality gates exist to catch problems early, when context is fresh and fixes are cheap. However, running
all checks after every change is wasteful - different checks have different costs and different value at
different stages of work.

**The goal:** Run *just enough* validation at each stage to catch likely problems, reserving comprehensive
checks for key milestones.

---

## Tiered Quality Gate System

### Tier 1: Fast Incremental (Per-Subtask)

**When:** After completing each subtask, before marking it complete.

**What:**

- Type checking on modified files/directories
- Linting on modified files (with auto-fix)
- Format checking on modified files
- Related unit tests (tests for the code you changed)

**Time budget:** Seconds to ~1 minute

**Purpose:** Catch syntax errors, type mismatches, and broken unit-level behavior immediately. Fast feedback
loop keeps you in flow.

**Guidance:**

- Always run before marking subtask complete
- Use targeted commands (specific files/directories), not full-project scans
- Fix issues immediately while context is fresh

---

### Tier 2: Integration Checkpoint (Per-Phase or Integration Point)

**When:**

- After completing a phase that modifies integration-tested code
- When you've touched components that existing E2E/integration tests exercise
- Before moving from one major area of the codebase to another

**What:**

- Everything in Tier 1 (full project scope)
- Targeted E2E/integration tests for affected areas
- Build verification (if applicable)

**Time budget:** 1-5 minutes

**Purpose:** Catch integration breakage while context is still fresh. The key insight: if you modify code
that E2E tests cover, those tests can break. Discovering this at the end of a multi-phase task list means
reconstructing context for each failure. Discovering it per-phase means fixing with full context.

**Guidance for identifying E2E checkpoints:**

1. **Component scope:** Did you modify components that handle layout, navigation, routing, forms, or
   user interactions? These are typically E2E-tested.

2. **Behavior changes:** Did you change how something works (not just how it looks)? Behavioral changes
   are more likely to break E2E assertions.

3. **Cross-cutting changes:** Did you modify shared infrastructure (context providers, hooks used by
   multiple components, global state)? These have wider blast radius.

4. **Phase boundaries:** Completing a phase is a natural checkpoint. If the phase touched E2E-relevant
   code, run targeted E2E tests before starting the next phase.

**Running targeted E2E tests:**

Don't run the full E2E suite at Tier 2 - that's Tier 3. Instead:

- Run specific test files that cover the area you modified
- Run tests tagged for the feature area (if using a tag system)
- Run on a single browser configuration for speed (full browser matrix is Tier 3)

Example patterns (project-specific commands vary):

```bash
# Run tests for a specific area
npm run test:e2e -- e2e/tests/layout.spec.ts

# Run tests matching a tag/grep pattern
npm run test:e2e -- --grep "@navigation"

# Run on single browser for speed
npm run test:e2e -- --project="Desktop Chrome" e2e/tests/layout.spec.ts
```

---

### Tier 3: Full Suite (Pre-Commit / Pre-PR)

**When:**

- Before considering any commit
- After completing all subtasks of a parent task
- Before creating a pull request
- Final quality gate before merge

**What:**

- Full type checking (entire project)
- Full linting (entire project)
- Full format checking
- Full unit test suite
- Full E2E test suite (all browsers/viewports)
- Build verification
- Markdown linting (for documentation changes)

**Time budget:** 5-15+ minutes (acceptable because it's infrequent)

**Purpose:** Comprehensive validation before code leaves your machine. This is the "zero tolerance" gate -
everything must pass with no exceptions.

**Guidance:**

- Never skip or partially run Tier 3
- If Tier 3 fails, fix before proceeding (see Quality Gate Failure Protocol in DEVELOPMENT-RULES)
- Tier 3 failures after proper Tier 1/2 execution should be rare

---

## Task List Integration

When generating task lists, include appropriate quality gate checkpoints:

**Subtask level (implicit):**
Every subtask implicitly includes Tier 1 checks before completion. No need to list explicitly unless
emphasizing a specific check.

**Phase level (explicit when relevant):**
Include explicit E2E checkpoint tasks when a phase modifies E2E-tested code:

```markdown
### **Phase 3:** Layout Modifications

- [ ] **3.1 Modify TopBar component**
    - [implementation details]

- [ ] **3.2 Update FooterBar positioning**
    - [implementation details]

- [ ] **3.3 Run integration checkpoint**
    - Run layout E2E tests: `npm run test:e2e -- e2e/tests/layout.spec.ts`
    - Run on single browser for speed
    - Fix any failures before proceeding to Phase 4
```

**Parent task completion (implicit):**
Full quality gates (Tier 3) are always required when all subtasks of a parent task are complete.
This is documented in 3_process-task-loop.md.

**Final phase (explicit):**
Task lists typically include a final "Testing & Quality" phase for Tier 3:

```markdown
### **Phase N:** Testing & Quality Gates

- [ ] **N.1 Run full test suite**
- [ ] **N.2 Run full E2E suite**
- [ ] **N.3 Run all quality gates**
```

---

## When to Escalate Tiers

**Escalate from Tier 1 to Tier 2 when:**

- You're unsure if your changes affect E2E-tested behavior
- You've made changes across multiple components
- You're about to context-switch to a different area
- Your "gut feeling" says something might be broken

**Escalate from Tier 2 to Tier 3 when:**

- You've completed significant work and want confidence before continuing
- You're about to take a break or end a session
- You want to create a checkpoint commit

**The cost of under-testing:** Discovering breakage later, with stale context, requiring time to reconstruct
what you changed and why.

**The cost of over-testing:** Slower development velocity, running checks that rarely catch anything.

**When in doubt:** Err toward running more checks. A few extra minutes of testing is cheaper than an hour
of debugging with forgotten context.

---

## Anti-Patterns

**❌ Skipping Tier 2 entirely:**
"I'll just run everything at the end." This leads to the painful scenario of many failures discovered
at once, each requiring context reconstruction.

**❌ Running full E2E at Tier 2:**
Running the complete E2E suite (all browsers, all tests) after every phase is wasteful. Targeted tests
provide the integration confidence you need with fraction of the time.

**❌ Skipping Tier 1 to "save time":**
Tier 1 is seconds. Skipping it means type errors and lint violations accumulate, making Tier 3 cleanup
painful.

**❌ Treating Tier 3 as optional:**
"Tests were passing at Tier 2, so Tier 3 will be fine." Tier 3 catches cross-cutting issues that targeted
tests miss. It's mandatory, not optional.

---

## Relationship to Other Documentation

- **DEVELOPMENT-RULES:** Defines the "zero tolerance" policy and lists required quality gates (Tier 3).
  References this strategy for tier guidance.

- **3_process-task-loop:** Defines when quality gates run in the task execution workflow. References
  this strategy for what to run at each stage.

- **2_generate-tasks:** Guidance on including quality checkpoint tasks in task lists. References this
  strategy for checkpoint placement.

- **QUICK-REFERENCE:** Project-specific commands for each tier. The authoritative source for "how to run"
  each check.

- **Project testing methodology:** Project-specific guidance on which test files cover which components,
  tag systems, and targeted test patterns.

---

**Version:** 2026-01-26
