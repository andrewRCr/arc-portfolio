# Testing Methodology Strategy

This document outlines the testing approach for andrewRCr Portfolio, detailing when to use Test-Driven
Development (TDD), when to test after implementation, and when tests may be skipped.

## Philosophy: Pragmatic TDD

The project adopts a pragmatic approach to Test-Driven Development that balances rigorous testing for logic
with flexibility for design exploration:

- **Write tests first for behavior and logic** - ensures correctness from the start
- **Test after for visual/design elements** - allows iteration without test friction
- **Skip tests for simple presentation** - avoid testing framework implementation details
- **Always test critical paths** - contact forms, navigation, data handling must be tested

## When to Use Full TDD (Write Tests First)

### API Routes and Server Logic

**Always use TDD for:**

- Contact form submission handling
- Server-side form validation
- API route error handling
- Data transformation and processing

**Example workflow:**

1. Write test: "Contact form API validates required email field"
2. Run test (fails)
3. Implement validation logic
4. Run test (passes)
5. Refactor if needed

**Why:** Server logic has clear inputs/outputs, no visual ambiguity, and bugs can cause data issues.

### Form Validation Logic

**Always use TDD for:**

- Client-side validation functions
- Input sanitization
- Error message generation
- Form state management

**Example:**

```typescript
// Test first
describe("validateEmail", () => {
  it("returns error for invalid email format", () => {
    expect(validateEmail("notanemail")).toEqual({ error: "Invalid email format" });
  });
});

// Then implement
function validateEmail(email: string) {
  // Implementation
}
```

**Why:** Validation logic is pure functions with predictable behavior - perfect for TDD.

### Utility Functions and Helpers

**Always use TDD for:**

- Data formatting functions
- Date/time utilities
- String manipulation
- Calculations or transformations

**Why:** Pure functions with no side effects are the easiest and most valuable to test.

### Component Behavior and Interactions

**Use TDD for:**

- Button click handlers
- Form submission behavior
- Navigation interactions
- State changes triggered by user actions
- Conditional rendering based on state

**Example:**

```typescript
// Test first
test('dark mode toggle switches theme', () => {
  render(<ThemeToggle />);
  const button = screen.getByRole('button', { name: /toggle theme/i });

  fireEvent.click(button);

  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
});

// Then implement
```

**Why:** Behavior is testable before visuals are polished.

## When to Test After Implementation

### Visual Layout and Styling

**Test after for:**

- Component positioning and spacing
- Responsive breakpoint behavior
- CSS class application
- Theme variable usage

**Why:** Design requires iteration and experimentation. Writing tests first would require constant rewriting
as design evolves.

**Approach:**

1. Build component with v0.dev or manual design
2. Iterate on visual design until satisfied
3. Write tests to lock in the final behavior

### Initial Design Prototypes

**Test after for:**

- Components generated from v0.dev
- Early design explorations
- Layout experiments

**Why:** Prototyping tools like v0.dev are for rapid exploration. Add tests once design direction is clear.

### Complex Animations and Transitions

**Test after (or skip) for:**

- CSS animations
- Transition timing
- Visual effects

**Why:** Animation testing is difficult and often brittle. Manual QA is more effective.

## When to Skip Tests

### Pure Presentational Components

**May skip tests for:**

- Simple wrapper components with no logic
- Components that only render children with styling
- Static content containers

**Example of skippable component:**

```typescript
// Simple wrapper - no logic to test
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border p-4">{children}</div>;
}
```

**Why:** Testing framework implementation details adds little value.

**Caution:** If component gains logic (conditional rendering, event handlers), add tests.

### Static Content

**Skip tests for:**

- Hardcoded text content
- Static images
- Fixed layout structures with no interactivity

**Why:** Visual regression testing or manual QA is more appropriate than unit tests.

## Testing Tools and Frameworks

### Unit and Component Testing

- **Framework**: Vitest (faster, more modern than Jest)
- **React Testing**: React Testing Library
- **Coverage**: Built-in Vitest coverage reports
- **Commands**:
    - `npm test` - Run all tests
    - `npm test -- --watch` - Watch mode
    - `npm test -- --coverage` - Generate coverage report

### E2E Testing

- **Framework**: Playwright (for critical user flows)
- **Use cases**:
    - Contact form submission end-to-end
    - Navigation across pages
    - Mobile responsive behavior
    - Dark mode persistence
- **Commands**:
    - `npm run test:e2e` - Run E2E tests
    - `npm run test:e2e:ui` - Run with Playwright UI

### Accessibility Testing

- **Framework**: vitest-axe (integrated with Vitest)
- **Standards**: WCAG 2.1 AA compliance required
- **Automated coverage**: ~57% of WCAG issues (manual testing still required)
- **Commands**:
    - Tests run as part of `npm test`
    - Use `checkA11y()` helper from `@tests/test-utils`

**Pattern:**

```typescript
import { checkA11y } from "@tests/test-utils";

it("has no accessibility violations", async () => {
  const results = await checkA11y(<MyComponent />);
  expect(results).toHaveNoViolations();
});
```

**What vitest-axe catches:**

- Missing alt text, form labels, ARIA attributes
- Color contrast issues (when colors are in DOM)
- Heading hierarchy violations
- Keyboard navigation issues
- Landmark and role problems

**What requires manual testing:**

- Keyboard-only navigation flow
- Screen reader announcements
- Focus management on route changes
- Touch target sizes

## TDD Workflow Example

### Example: Contact Form Validation

**Step 1: Write the test (RED)**

```typescript
describe('ContactForm validation', () => {
  it('displays error when email is invalid', async () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(emailInput, { target: { value: 'notanemail' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

Test fails (no component yet).

**Step 2: Write minimal implementation (GREEN)**

```typescript
export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;

    if (!email.includes('@')) {
      setErrors({ email: 'Invalid email format' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" />
      {errors.email && <p>{errors.email}</p>}
      <button type="submit">Send</button>
    </form>
  );
}
```

Test passes.

**Step 3: Refactor (REFACTOR)**

- Extract validation to utility function
- Improve error messages
- Add proper TypeScript types
- Tests still pass

## Coverage Goals

- **Critical paths**: 100% coverage (API routes, form validation, utilities)
- **Component behavior**: 80%+ coverage
- **Overall project**: 70%+ coverage
- **Visual/presentational**: No coverage requirement

## Integration with Quality Gates

Before any commit, run:

```bash
npm test                    # All tests must pass
npm run test:coverage       # Check coverage thresholds
npm run type-check          # TypeScript validation
npm run lint                # Code quality
```

See DEVELOPMENT-RULES.md for complete pre-commit quality gate requirements.

## Key Principles

1. **Test behavior, not implementation** - Focus on what users see and interact with
2. **Tests should be readable** - Tests serve as documentation of intended behavior
3. **Fast tests** - Unit tests should run in milliseconds, full suite under 10 seconds
4. **Isolated tests** - Each test should be independent and not rely on test order
5. **Meaningful assertions** - Assert on user-visible outcomes, not internal state

## When in Doubt

**If unclear whether to TDD or test-after:**

- Does it have clear inputs and outputs? → TDD
- Is it about visual appearance? → Test after
- Does a user interact with it? → TDD
- Is it pure presentation? → Consider skipping

---

_This testing strategy supports the pragmatic development approach of andrewRCr Portfolio while maintaining
high code quality and demonstrating professional testing practices._
