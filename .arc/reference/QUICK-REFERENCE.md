# Quick Reference - arc-portfolio

**Version**: 1.0 | **Updated**: 2025-10-17 | **Location**: `.arc/reference/`

## About This Reference Directory

**Read every session:**

- `DEVELOPMENT-RULES.md` (constitution/) - Rules and quality standards
- `QUICK-REFERENCE.md` (this file) - Environment and commands
- `CURRENT-SESSION.md` (active/) - Work status and next actions

**Key documentation:**

- `constitution/` - Project principles (META-PRD, TECHNICAL-ARCHITECTURE, PROJECT-STATUS, DEVELOPMENT-RULES)
- `workflows/` - Core process guides (3-process-task-loop.md)
- `workflows/supplemental/` - Supporting workflows (atomic-commit.md, session-handoff.md, manage-incidental-work.md,
  session-init.md)
- `strategies/` - Technical approaches (strategy-testing-methodology.md, strategy-work-categorization.md)
- `ai-instructions/` - AI-specific guidance (AGENTS.md, CLAUDE.md, WARP.md)

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
| Tests            | `src/**/__tests__/`     | Test files (co-located)             |
| Public assets    | `public/`               | Static assets, images               |
| .arc docs        | `.arc/`                 | Documentation                       |
| Config files     | Root directory          | next.config.ts, tsconfig.json, etc. |

**Working Directory Note**: Commands assume repository root. If in a subdirectory, adjust paths accordingly.

### Development Server

**Local Development**:

- **Next.js Dev Server**: `http://localhost:3000`
- **Development**: Hot reload enabled, fast refresh for React components

---

## Command Patterns

All commands shown from **repository root**. All npm scripts defined in `package.json`.

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start
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

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Markdown Linting

```bash
# Check markdown files
npm run lint:md

# Auto-fix markdown violations
npm run lint:md:fix
```

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

# 6. Tests (100% pass rate when implemented)
npm test
```

---

## Tool Decision Tree

```
Need to run a command?
│
├─ Type checking?
│  └─ npm run type-check
│
├─ Linting?
│  └─ npm run lint (or npm run lint -- --fix for auto-fix)
│
├─ Formatting?
│  └─ npm run format:check (or npm run format for auto-fix)
│
├─ Testing?
│  └─ npm test (or npm run test:watch for development)
│
├─ Markdown linting?
│  └─ npm run lint:md (or npm run lint:md:fix for auto-fix)
│
├─ Build verification?
│  └─ npm run build
│
└─ Unsure?
   └─ Check package.json scripts section
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

# Lint specific markdown file
npx markdownlint-cli2 .arc/path/to/file.md --fix
```

### Development Workflow

```bash
# 1. Start dev server in one terminal
npm run dev

# 2. Run tests in watch mode in another terminal (optional)
npm run test:watch

# 3. Make changes, verify in browser at localhost:3000

# 4. Before committing, run quality gates
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

---

## Key Reminders

1. **Repository root**: `/home/andrew/dev/arc-portfolio` - all npm commands from here
2. **Dev server port**: `3000` (<http://localhost:3000>)
3. **Quality gates**: Zero tolerance - all must pass before committing
4. **Test location**: Co-located with source in `__tests__/` directories
5. **TypeScript strict mode**: Enabled - no `any` types without justification

---

## Tech Stack Reference

**Framework**: Next.js 15.0.2 (App Router)
**Language**: TypeScript (strict mode)
**Styling**: Tailwind CSS
**Testing**: Vitest + React Testing Library
**Linting**: ESLint + Prettier
**Icons**: lucide-react
**Animations**: Framer Motion (when used)

---

**Version Note**: Commands assume repository root. All npm scripts defined in package.json.
