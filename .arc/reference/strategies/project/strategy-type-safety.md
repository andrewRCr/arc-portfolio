# Type Safety Strategy

**Version:** 1.0 | **Updated:** 2025-12-27 | **Status:** Active

Policy and guidance for type safety decisions in arc-portfolio. This document covers judgment calls
within TypeScript's strict mode—not configuration (see `tsconfig.json` for that).

## Guiding Principles

1. **Strict mode is non-negotiable** - Already enforced; this doc doesn't restate it
2. **Types are documentation** - Future readers (including AI) rely on accurate types
3. **Suppressions are technical debt** - Each one requires justification and periodic review
4. **Runtime validation at boundaries** - External data gets validated, not trusted

---

## `any` Usage Policy

### Prohibited

```typescript
// ❌ Never use any for laziness
function processData(data: any): any { ... }

// ❌ Never use any to silence errors
const result = someFunction() as any;
```

### Acceptable (with justification)

| Context                 | Example                           | Justification                    |
|-------------------------|-----------------------------------|----------------------------------|
| Type declaration files  | `interface Assertion<T = any>`    | Required for module augmentation |
| External API boundaries | `response.json() as unknown`      | Validated immediately after      |
| Third-party lib gaps    | Generic callbacks in untyped libs | Document and contain             |

**Pattern for external data:**

```typescript
// ✅ Validate immediately at boundary
const rawData: unknown = await response.json();
const validated = schema.parse(rawData); // Zod, or manual validation
```

### Alternatives to `any`

| Instead of            | Use                                |
|-----------------------|------------------------------------|
| `any`                 | `unknown` (forces type narrowing)  |
| `any[]`               | `unknown[]` or specific tuple      |
| `Record<string, any>` | `Record<string, unknown>`          |
| `Function`            | Specific signature `(arg: T) => R` |

---

## Type Assertions (`as`)

### Prohibited

```typescript
// ❌ Never use 'as' to silence type errors
const user = data as User; // No validation

// ❌ Never use 'as any'
const result = broken as any as Correct;
```

### Acceptable

```typescript
// ✅ After type guard
if (isUser(data)) {
  const user = data; // Already narrowed, no 'as' needed
}

// ✅ With runtime validation
const user = validateUser(data); // Throws if invalid

// ✅ DOM APIs where type is known
const input = document.getElementById("email") as HTMLInputElement;
// Only when you control the HTML and know the element type

// ✅ Const assertions for literals
const config = { mode: "strict" } as const;
```

### `as unknown as T` Pattern

**Almost always wrong.** If you need this, you likely have a design problem.

Exception: Test mocks where you're intentionally providing partial implementations.

```typescript
// ✅ Acceptable in tests only
const mockRouter = { push: vi.fn() } as unknown as NextRouter;
```

---

## Suppression Guidelines

### Hierarchy of Preference

1. **Fix the code** - Most "errors" indicate real problems
2. **Add type declaration** - Create `.d.ts` for untyped libs
3. **Use `@ts-expect-error`** - Preferred over `@ts-ignore`
4. **Use `@ts-ignore`** - Last resort, only for unfixable cases

### `@ts-expect-error` vs `@ts-ignore`

| Directive          | Behavior                  | Use when                            |
|--------------------|---------------------------|-------------------------------------|
| `@ts-expect-error` | Errors if no error exists | Temporary workaround, expect to fix |
| `@ts-ignore`       | Silently ignores          | Permanent, unfixable limitation     |

**Prefer `@ts-expect-error`** - It will alert you when the underlying issue is fixed.

### Required Format

```typescript
// ✅ Correct: specific, justified
// @ts-expect-error -- vitest-axe matcher not in base Vitest types
expect(results).toHaveNoViolations();

// ❌ Wrong: no justification
// @ts-ignore
expect(results).toHaveNoViolations();
```

### Sanctioned Use Cases

| Case                  | Directive          | Example               |
|-----------------------|--------------------|-----------------------|
| Library type gaps     | `@ts-expect-error` | Missing matcher types |
| Framework limitations | `@ts-expect-error` | Next.js internal APIs |
| Test mocks            | `@ts-expect-error` | Partial mock objects  |

### Unsanctioned (Never Acceptable)

- Silencing errors you don't understand
- Avoiding proper typing work
- Making type errors "go away" without investigation

---

## ESLint Disable Patterns

Same discipline as TypeScript suppressions.

### Required Format

```typescript
// ✅ Correct: specific rule, justified
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required by interface
const _unusedButRequired = value;

// ❌ Wrong: blanket disable
// eslint-disable-next-line
const something = problematic();
```

### Acceptable Patterns

```typescript
// ✅ Specific rule, single line
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- External API contract

// ✅ Block disable for repeated pattern (rare)
/* eslint-disable @typescript-eslint/no-empty-object-type -- Module augmentation requires this */
interface Assertion<T> extends CustomMatchers {}
/* eslint-enable @typescript-eslint/no-empty-object-type */
```

### File-Level Disables

**Avoid.** If an entire file needs a rule disabled, either:

1. The rule doesn't apply to that file type → Configure in `eslint.config.mjs`
2. The file has a design problem → Refactor

---

## Third-Party Library Handling

### Decision Tree

```
Library missing types?
├── Check DefinitelyTyped (@types/package) → Install if available
├── Types exist but incomplete?
│   ├── Small gap → Inline @ts-expect-error with justification
│   └── Large gap → Create project .d.ts stub
└── No types at all?
    ├── Simple usage → Create minimal .d.ts
    └── Complex usage → Consider alternative library
```

### Creating Type Declarations

**Location:** `src/types/<library-name>.d.ts`

**Template:**

```typescript
// src/types/some-library.d.ts
/**
 * Type declarations for some-library
 *
 * Library version: 1.2.3
 * Last verified: 2025-12-27
 *
 * These declarations cover our usage patterns only.
 * Update when upgrading the library.
 */

declare module "some-library" {
  export function doThing(input: string): Promise<Result>;
  export interface Result {
    success: boolean;
    data: unknown;
  }
}
```

**Maintenance:** Each stub documents library version and verification date.

---

## Module Augmentation

When extending library types (like we did for vitest-axe):

```typescript
// src/types/vitest-axe.d.ts
import "vitest";
import type { AxeMatchers } from "vitest-axe";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = unknown> extends AxeMatchers {}
}
```

**Note:** Module augmentation often requires ESLint suppressions for empty interfaces.
This is acceptable when documented.

---

## Code Review Checklist

When reviewing PRs, check for:

- [ ] No unexplained `any` usage
- [ ] Type assertions have runtime validation or are in tests
- [ ] Suppressions include justification comments
- [ ] ESLint disables are specific (not blanket)
- [ ] New `.d.ts` files document library version

---

## Related Documentation

- `tsconfig.json` - Compiler configuration (strict mode, paths)
- `eslint.config.mjs` - Lint rules including TypeScript rules
- [strategy-testing-methodology.md](./strategy-testing-methodology.md) - Testing patterns
