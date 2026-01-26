# Quick Reference - arc-portfolio

**Version**: 1.3 | **Updated**: 2025-12-27

Command patterns and environment context for arc-portfolio.

## About This Reference Directory

**Read every session:**

- `DEVELOPMENT-RULES.md` (constitution/) - Rules and quality standards
- `QUICK-REFERENCE.md` (this file) - Environment and commands
- `CURRENT-SESSION.md` (active/) - Work status and next actions

**Key documentation:**

- `constitution/` - Project principles (META-PRD, TECHNICAL-OVERVIEW, PROJECT-STATUS)
- `workflows/` - Core process guides (1_create-prd.md, 2_generate-tasks.md, 3_process-task-loop.md)
- `workflows/supplemental/` - Supporting workflows (atomic-commit.md, session-handoff.md)
- `strategies/` - Technical approaches (testing methodology, style guides)
- `agent/` - AI-specific guidance (AGENTS.md, CLAUDE.md)

---

## Environment & Path Context

**Repository Root**: `/home/andrew/dev/arc-portfolio`
**All commands in this document assume you are at repository root unless otherwise specified.**

### Critical Path Reference

| Resource         | Location from Repo Root | Why It Matters                      |
| ---------------- | ----------------------- | ----------------------------------- |
| Source code      | `src/`                  | All application code                |
| Components       | `src/components/`       | React components                    |
| Data files       | `src/data/`             | Static content data                 |
| Type definitions | `src/types/`            | TypeScript interfaces               |
| Unit tests       | `src/**/__tests__/`     | Unit test files (co-located)        |
| E2E tests        | `e2e/tests/`            | Playwright E2E tests                |
| Public assets    | `public/`               | Static assets, images               |
| .arc docs        | `.arc/`                 | Documentation                       |
| Config files     | Root directory          | next.config.ts, tsconfig.json, etc. |

**Working Directory Note**: Commands assume repository root. If in a subdirectory, adjust paths accordingly.

### Development Server

**Local Development**:

- **Next.js Dev Server**: `http://localhost:3000`
- **Browser Console Log Server**: `http://localhost:3001` (runs alongside dev server)
- **Development**: Hot reload enabled, fast refresh for React components

**Console Logging for AI Debugging**:

- Browser console logs are automatically captured to `.console-logs.txt`
- AI can read this file to debug client-side issues without manual copy/paste
- System is **always active** in development mode
- Use `npm run dev:with-logs` to start both servers together
- Or run separately: `npm run dev` + `npm run log-server` in separate terminals

---

## Command Patterns

All commands shown from **repository root**. All npm scripts defined in `package.json`.

### Development

```bash
# Start development server (Next.js only)
npm run dev

# Start development with console logging (RECOMMENDED FOR AI DEBUGGING)
npm run dev:with-logs

# Start log server separately (if dev server already running)
npm run log-server

# Build for production
npm run build

# Start production server (after build)
npm run start

# Regenerate CSS theme defaults (after modifying theme tokens)
# Auto-runs on build, but run manually after editing scripts/generate-css-defaults.ts
npm run generate:css-defaults
```

### Type Checking

```bash
# TypeScript type checking (zero errors required)
npm run type-check
```

### Linting

```bash
# ESLint check
npm run lint

# ESLint with auto-fix
npm run lint -- --fix
```

### Code Formatting

```bash
# Check formatting
npm run format:check

# Auto-format all files
npm run format
```

### Testing (Unit)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing (E2E)

**Full suite (Tier 3 - pre-commit):**

```bash
# Run all E2E tests (all browsers/viewports)
npm run test:e2e
```

**Targeted tests (Tier 2 - integration checkpoints):**

```bash
# Run specific test file (when you modified related components)
npm run test:e2e -- e2e/tests/layout.spec.ts
npm run test:e2e -- e2e/tests/intro-animation.spec.ts

# Run on single browser for speed during development
npm run test:e2e -- --project="Desktop Chrome" e2e/tests/layout.spec.ts

# Run tests matching a pattern (if using tags)
npm run test:e2e -- --grep "@navigation"
```

**Debugging:**

```bash
# Run on specific project/viewport
npm run test:e2e -- --project="Desktop Chrome"
npm run test:e2e -- --project="Mobile Chrome"
npm run test:e2e -- --project="Tablet"

# Run in headed mode (visible browser)
npm run test:e2e -- --headed

# Run in UI mode (interactive debugging)
npm run test:e2e:ui
```

**Notes:**

- **Always use npm scripts** (not `npx playwright` directly) - ensures correct config and output paths
- **Tiered approach:** Use targeted tests (Tier 2) during development, full suite (Tier 3) before commits.
  See [Quality Gates Strategy](strategies/arc/strategy-quality-gates.md) for guidance.
- E2E tests auto-start dev server if not running
- Reports saved to `e2e/playwright-report/` (gitignored)
- Test artifacts in `e2e/test-results/` (gitignored)
- **Local:** Runs Desktop Chrome, Mobile Chrome, Tablet, Firefox (WebKit excluded - WSL2 lacks deps)
- **CI:** Adds WebKit to test suite (full browser coverage)

### Markdown Linting

```bash
# Check all markdown files
npm run lint:md

# Auto-fix markdown violations
npm run lint:md:fix

# Check single file only (bypass config globs)
npx markdownlint-cli2 --no-globs "path/to/file.md"

# Auto-fix single file only
npx markdownlint-cli2 --fix --no-globs "path/to/file.md"

# Fix table formatting (MD060 violations)
# Note: --fix does NOT fix MD060 table alignment - use this instead:
npx --yes markdown-table-prettify < input.md > output.md
```

**Important:**

- Without `--no-globs`, markdownlint-cli2 processes config globs **in addition to** specified files
- Use `--no-globs` when checking/fixing individual files to avoid processing entire workspace
- `markdownlint-cli2 --fix` does NOT fix MD060 (table alignment) - use `markdown-table-prettify` instead

---

## Quality Gate Commands

Reference for DEVELOPMENT-RULES quality gates. Run these before any commit.

```bash
# 1. Type Checking (zero errors)
npm run type-check

# 2. Code Linting (zero violations)
npm run lint

# 3. Code Formatting (must pass)
npm run format:check

# 4. Markdown Linting (zero violations)
npm run lint:md

# 5. Build Success (must complete)
npm run build

# 6. Tests (100% pass rate)
npm test
```

---

## Common Patterns

### Incremental Quality Checks (After Sub-Task)

```bash
# Type check specific file
npx tsc --noEmit src/path/to/file.ts

# Lint specific file
npx eslint src/path/to/file.ts --fix

# Run specific test file
npm test -- src/path/to/__tests__/file.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="specific test name"

# Lint specific markdown file (use --no-globs to avoid processing entire workspace)
npx markdownlint-cli2 --fix --no-globs .arc/path/to/file.md
```

### Mobile Device Testing

```bash
# Expose local dev server via Cloudflare quick tunnel
~/.local/bin/cloudflared tunnel --url http://localhost:3000
# Generates random *.trycloudflare.com URL for mobile testing
```

### Development Workflow

```bash
# 1. Start dev server with console logging (RECOMMENDED)
npm run dev:with-logs

# 2. Run tests in watch mode in another terminal (optional)
npm run test:watch

# 3. Make changes, verify in browser at localhost:3000

# 4. Check browser console logs for AI debugging
cat .console-logs.txt
# Or clear logs: rm .console-logs.txt

# 5. Before committing, run quality gates
npm run type-check && npm run lint && npm run format:check && npm run lint:md && npm run build && npm test
```

---

## Anti-Patterns

### Path Confusion

❌ Assuming you're at repo root without checking
❌ Using relative paths from subdirectories
❌ Forgetting to navigate back to root for npm commands

✅ Check `pwd` first
✅ Run all npm commands from repository root
✅ Use absolute paths when working in subdirectories

### Quality Gate Assumptions

❌ Skipping type checking ("it will probably pass")
❌ Committing without running linting
❌ Assuming build works without testing
❌ Ignoring markdown linting for .arc/ docs

✅ Run all quality gates before every commit
✅ Fix issues immediately when discovered
✅ Use auto-fix flags for linting and formatting
✅ Verify build succeeds locally

### Command Construction

❌ Using commands from DEVELOPMENT-RULES without verifying they work
❌ Running quality checks individually instead of in sequence
❌ Forgetting to pass flags (like --fix or --testNamePattern)

✅ Use commands from QUICK-REFERENCE (tested for this project)
✅ Chain commands with && to ensure all pass
✅ Reference package.json for available scripts
✅ Use appropriate flags for incremental checks
