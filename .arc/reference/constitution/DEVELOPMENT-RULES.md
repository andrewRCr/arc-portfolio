# Development Rules - andrewRCr Portfolio

**Version**: 1.0
**Last Updated**: October 12, 2025
**Rules Hash**: `arc-portfolio-v1.0-20251012`

This document consolidates the core development rules and quality standards for andrewRCr Portfolio.
These rules are **non-negotiable** and must be followed during development, including by AI assistants.

## AI Session Initialization Required

Before starting ANY work, AI assistants must:

1. **Confirm rules version**: "Acknowledging DEVELOPMENT-RULES v1.0, hash arc-portfolio-v1.0-20251012"
2. **State understanding**: Briefly confirm understanding of commit protocols, quality gates,
   and session management
3. **Verify context access**: Confirm access to required documents (META-PRD, TECHNICAL-ARCHITECTURE, etc.)
4. **Check branch status**: Verify current git branch and ensure alignment with intended work

## Session Documentation Control

**CURRENT-SESSION.md Update Protocol**:

- **AI NEVER updates CURRENT-SESSION.md** without explicit user instruction
- CURRENT-SESSION.md is a handoff document controlled by the user
- AI should report changes and progress but NOT modify this file during active work
- User decides when and how session documentation is updated

## Git & Commit Control

**Manual Commit Control**:

- **AI NEVER initiates commits** without explicit user approval or instruction
- **AI CAN execute commits** when user explicitly approves/instructs it to do so
- **User approval required** to begin any git operations
- AI reports completion with readiness report, then awaits commit instructions

**Feature Branch Workflow**:

- **Constitutional setup**: Work directly on `main` branch (foundational documents)
- **All feature work**: Must happen on dedicated feature branches after constitution is complete
- **Branch naming convention**: `feature/[feature-name]` (e.g., `feature/project-showcase`)
- **Branch verification**: Always verify correct branch before committing
- **Merge strategy**: Preserve commit history when merging to main (no squash merge)
- **Branch cleanup**: Delete feature branches after successful merge

## Quality Gates (Zero Tolerance)

Before any commit consideration, ALL of the following must pass with **zero exceptions**:

### 1. Type Checking: Zero errors

```bash
npm run type-check
```

Every TypeScript error must be resolved before committing.

### 2. Code Linting: Zero violations

```bash
npm run lint
```

Auto-fix available:

```bash
npm run lint -- --fix
```

Every ESLint violation must be fixed.

### 3. Code Formatting: Must pass

```bash
npm run format:check
```

Auto-fix available:

```bash
npm run format
```

All code must be Prettier-formatted.

### 4. Documentation Linting: Zero violations

**ALWAYS run after updating any documentation files**:

```bash
npm run lint:md
```

Auto-fix available:

```bash
npm run lint:md:fix
```

Every markdown violation must be fixed.

### 5. Build Success: Must complete

```bash
npm run build
```

Project must build without errors before committing.

### 6. Tests: 100% pass rate (when implemented)

```bash
npm test
```

Once testing is implemented, all tests must pass.

## Quality Gate Failure Protocol

If quality gates fail after work completion:

1. **Report the failure** with specific details
2. **Identify suspected causes** and investigation areas
3. **Ask for guidance** on whether to fix immediately or defer
4. **Never proceed** to next task until resolved or user approves

## Leave It Cleaner: Pre-existing Issue Protocol

**Principle:** When touching any file, leave it cleaner than you found it.

**When quality checks reveal pre-existing issues in files you're modifying:**

1. **Assess severity and scope:**
   - **Minor issues** (< 5 minutes): Fix immediately without asking
   - **Moderate issues** (5-15 minutes): Fix immediately, document in commit
   - **Major issues** (> 15 minutes): Ask for direction before proceeding

2. **Required actions:**
   - ✅ **Fix immediately** - Preferred for all issues < 15 minutes
   - ✅ **Document and defer** - Create incidental task with clear description
   - ❌ **Ignore silently** - NEVER acceptable

3. **Documentation requirements:**
   - Fixed issues: Note in commit message ("Also fixed X pre-existing issues")
   - Deferred issues: Create task in `.arc/active/incidental/`
   - Never: Leave issues undocumented

## Code Quality Principles

Apply standard software engineering principles to maintain clean, maintainable code:

### Core Principles

**DRY (Don't Repeat Yourself)**

- Extract repeated logic into reusable functions, components, or utilities
- Wait for 2-3 instances before abstracting (avoid premature optimization)
- Share types and interfaces instead of duplicating definitions

**SOLID Principles**

- **Single Responsibility**: Each component/function should have one clear purpose
- **Open/Closed**: Use composition and configuration over modification
- **Liskov Substitution**: Subtypes must be substitutable for their base types
- **Interface Segregation**: Keep interfaces focused and minimal
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

**KISS (Keep It Simple)**

- Choose simple solutions over clever ones
- Prefer clarity over brevity when they conflict
- Question complexity - if it's hard to explain, simplify it

**YAGNI (You Aren't Gonna Need It)**

- Implement features when required, not when anticipated
- Start specific, generalize later when patterns actually emerge
- Delete unused code

### Practical Application

- **Separate concerns**: UI from business logic, data fetching from presentation
- **Use custom hooks** to abstract and share logic
- **Prefer composition** over inheritance or duplication
- **Design component APIs** that accept configuration
- **When principles conflict**: Favor readability and simplicity

## Task Management Protocol

### One Sub-Task Rule

- **Complete ONE sub-task at a time** - never bundle multiple deliverables
- **Mandatory stop** after each sub-task completion
- **Wait for explicit user approval** before starting next sub-task

### Sub-Task Granularity Guidelines

Break down a sub-task if it requires:

- More than 3 files to be modified
- More than 50 lines of core logic changes
- Multiple interdependent changes
- Complex debugging/investigation

### Documentation Synchronization

- **Immediate task list updates**: Mark `[x]` in task files after each sub-task
- **Update "Relevant Files"** section when files are created/modified
- **Never batch documentation updates** - do immediately after work
- **Task lists and commit messages must align**

## Testing Requirements

### Test-Driven Development (Pragmatic TDD)

The project follows pragmatic TDD as detailed in `.arc/reference/strategies/strategy-testing-methodology.md`:

- **Write tests first for**: API routes, form validation, utilities, component behavior
- **Test after for**: Visual layout, styling, design iterations
- **May skip tests for**: Pure presentational components without logic

### Test Coverage Standards

- **Critical paths**: 100% coverage (API routes, form validation, utilities)
- **Component behavior**: 80%+ coverage
- **Overall project**: 70%+ coverage
- **Visual/presentational**: No coverage requirement

### Test Execution Standards

- **Before commits**: Full test suite must pass completely (when tests exist)
- **During development**: Use watch mode for rapid feedback
- **Coverage reporting**: `npm run test:coverage`

## Commit Standards

### Comprehensive Task Context Analysis Protocol

**MANDATORY** before every commit consideration:

1. **Examine ALL uncommitted changes**: `git status` and `git diff --stat`
2. **Locate relevant task documentation** in `.arc/active/` or `.arc/upcoming/tasks/`
3. **Analyze task completion status** vs documented tasks
4. **Update task documentation** - mark subtasks complete with `[x]`
5. **Write accurate commit messages** reflecting actual progress

**Key Principle**: Commit messages must communicate WHERE the project stands after the commit.

### Conventional Commit Format

- **Types**: feat, fix, docs, style, refactor, test, config, chore
- **Scope**: Use feature/component name for context
- **Reference tasks**: Include task context when applicable
- **Format**: `[type](scope): Brief description`

Example:

```
feat(contact): Add form validation with Zod

- Implement email and message validation
- Add error message display
- Include client-side validation feedback
```

### Atomic Commit Guidelines

- Each commit should be a single logical change
- Commits should be independently buildable/testable
- Use descriptive messages with context
- Group related changes together (e.g., "config: " for multiple config file updates)
- Separate formatting from functional changes

## Error Handling

### When Things Go Wrong

- **Report immediately** with full context
- **Provide diagnostic information** (error messages, stack traces, file paths)
- **Suggest investigation areas** based on the changes made
- **Wait for guidance** rather than attempting fixes without approval

### Never Proceed If

- Quality gates are failing
- Tests are broken
- Linting violations exist
- Type errors are present
- Build fails
- User has not approved the next step

## Project-Specific Standards

### Technology Stack Requirements

- **TypeScript**: Strict mode enabled, no `any` types without justification
- **React**: Use Server Components by default, Client Components only when needed
- **Styling**: Tailwind utility classes, avoid inline styles
- **Components**: Follow Shadcn/ui patterns for consistency
- **Icons**: Use lucide-react for all iconography
- **Animations**: Use Framer Motion for transitions and micro-interactions

### Code Organization Standards

- **File naming**: kebab-case for files, PascalCase for components
- **Component structure**: One component per file (except tightly coupled helpers)
- **Import order**: React → Next.js → third-party → local (handled by Prettier)
- **Type definitions**: Store shared types in `src/types/`
- **Utilities**: Reusable functions in `src/lib/`
- **Data**: Static content in `src/data/` with TypeScript interfaces

### Accessibility Requirements

- **Semantic HTML**: Use appropriate HTML elements (not just divs)
- **ARIA labels**: Add where semantic HTML is insufficient
- **Keyboard navigation**: All interactive elements must be keyboard accessible
- **Color contrast**: Meet WCAG 2.1 AA standards (4.5:1 for normal text)
- **Focus indicators**: Visible focus states for all interactive elements

### Performance Standards

- **Images**: Always use Next.js `<Image>` component with proper sizing
- **Lazy loading**: Use dynamic imports for heavy components
- **Bundle size**: Monitor bundle size, code split when needed
- **Core Web Vitals**: Target LCP < 2.5s, FID < 100ms, CLS < 0.1

## Essential Commands

### Development

```bash
# Start development server
npm run dev

# Run in production mode locally
npm run build && npm run start
```

### Quality Checks

```bash
# Run all quality gates
npm run type-check && npm run lint && npm run format:check && npm run build

# Run tests (when implemented)
npm test
npm run test:coverage

# Fix formatting and linting issues
npm run format
npm run lint -- --fix
```

### Feature Branch Management

```bash
# Create and switch to new feature branch
git checkout -b feature/[feature-name]

# Check current branch
git status
git branch --show-current

# Switch back to main and merge (preserves commit history)
git checkout main
git merge feature/[feature-name]

# Delete feature branch after merge
git branch -d feature/[feature-name]

# Push to remote
git push origin main
```

## Reference Documentation

This document provides core rules. See detailed protocols in:

- [META-PRD](META-PRD.md) - Project vision and goals
- [Technical Architecture](TECHNICAL-ARCHITECTURE.md) - Implementation stack and patterns
- [Testing Methodology](../strategies/strategy-testing-methodology.md) - Detailed testing approach
- [Task Processing Workflow](../workflows/3-process-task-loop.md) - Task execution workflow
- [Atomic Commit Workflow](../workflows/supplemental/atomic-commit.md) - Commit workflow with task analysis
- [Session Handoff Workflow](../workflows/supplemental/session-handoff.md) - Context handoff protocol

---

_These development rules ensure consistent quality and maintainability throughout the andrewRCr Portfolio project._
