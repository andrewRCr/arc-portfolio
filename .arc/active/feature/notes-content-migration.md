# Content Migration - Development Notes

**Feature**: Content Migration from Squarespace
**Purpose**: General notes, insights, and decisions made during implementation

---

## Visual Design Workflow Strategy

**Date**: 2025-10-18
**Context**: Planning approach for placeholder components → v0.dev iteration → final integration

### Overall Phased Approach

**Phase 1 (Current)**: Functional components + routing
**Phase 2**: v0.dev prototyping and iteration
**Phase 3**: Integration back to codebase
**Phase 4**: Visual design review + refinement (using `@visual-design-reviewer` agent)
**Phase 5**: Ensure consistency across entire app

**Decision**: Build all placeholder components first, then move to v0.dev work. This maintains clear separation
between content migration (data + structure) and visual design (styling + UX).

**Validation Strategy**: Build navbar placeholder first, take through full v0.dev workflow to validate integration
approach before proceeding with bulk placeholder work.

### Key Principles for Placeholder Components

Even though visual design comes later, placeholders should be built with future iteration in mind:

#### 1. Component API Design

Design component props/interfaces that anticipate visual variation:

```typescript
// Good - flexible, well-structured
<SkillsSection skills={skillsData} variant="grid" />

// Less good - rigid, hard to style later
<SkillsSection data={data} />
```

**Guideline**: Component APIs should support layout options, styling hooks, and variants even if we don't use them
in placeholders.

#### 2. Semantic HTML Structure

v0.dev integration and accessibility both benefit from proper semantic HTML:

```tsx
// Good base for v0.dev iteration
<section className="skills-section">
  <h2>Skills</h2>
  <div className="skills-grid">
    {/* proper semantic structure */}
  </div>
</section>

// Harder to work with later
<div>
  <div>Skills</div>
  <div>{/* stuff */}</div>
</div>
```

**Guideline**: Use proper HTML5 semantic elements (section, article, nav, header, footer, aside, main) even in
placeholders.

#### 3. Structural vs. Decorative CSS

Placeholders should have **structural CSS** but avoid **decorative CSS**:

**Structural (Include)**:

- Layout systems (grid, flex)
- Responsive breakpoints
- Spacing/padding for readability
- Basic positioning

**Decorative (Avoid)**:

- Colors, gradients, backgrounds
- Shadows, borders, border-radius
- Animations, transitions
- Typography styling (font families, weights, sizes - beyond semantic defaults)

```tsx
// Good placeholder styling
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
// ↑ Establishes responsive grid structure

// Avoid in placeholders
className="bg-blue-500 rounded-lg shadow-xl border-2 border-gray-200"
// ↑ Decorative styling that will likely be replaced
```

**Guideline**: Use Tailwind utility classes for basic layout/structure but avoid decorative classes.

#### 4. Data Layer Separation

Keep data fetching/transformation separate from presentation:

```tsx
// Good - presentation component
export function SkillsSection({ skills }: { skills: SkillsData }) {
  return (/* render skills */)
}

// Page just passes data
export default function SkillsPage() {
  return <SkillsSection skills={skillsData} />
}
```

**Guideline**: Presentation components accept data via props. Pages/routes handle data imports and pass to
components. This makes v0.dev integration easier - swap presentation layer, keep data flow.

#### 5. Accessibility Baseline

Even in placeholders, maintain accessibility fundamentals:

- **Proper heading hierarchy** (h1 → h2 → h3, no skipping levels)
- **Alt text on images** (already in data structure)
- **ARIA labels** where semantic HTML isn't sufficient
- **Keyboard navigation** (comes mostly free with semantic HTML and proper elements)

**Guideline**: Accessibility built into structure makes visual design review more effective later - agent can check
real accessibility issues, not just structural problems.

### v0.dev Integration Approaches

**Option A: Inspiration approach** (Recommended initially)

- Use v0.dev to explore and iterate on designs
- Manually rebuild to existing components using v0.dev output as visual reference
- More work, but cleaner integration with existing data flow
- Better learning opportunity
- More control over final code quality

**Option B: Direct integration**

- Copy v0.dev generated components directly
- Adapt to existing data structures and interfaces
- Faster iteration
- May require more refactoring to fit into existing architecture

**Decision**: Start with **Option A** for first component (navbar) to establish patterns and validate workflow,
then decide if Option B is viable for subsequent components.

### Style Guide Documentation

When documenting decisions in `.arc/reference/strategies/strategy-style-guide.md`, structure for:

**Design Tokens**:

- Colors: primary, secondary, accent, text, background
- Typography: font families, scale (h1-h6, body, small)
- Spacing: base unit, scale (xs, sm, md, lg, xl)
- Borders: radius values, widths
- Shadows: elevation levels

**Component Patterns**:

- Button variants
- Card styles
- Section layouts
- Navigation patterns
- Form elements

**Responsive Breakpoints**:

- Mobile, tablet, desktop breakpoints
- Common responsive patterns and behaviors

### Iteration Strategy

**Validation-First Approach** (Decided):

1. **Navbar first** - Build navbar placeholder component
2. **v0.dev prototype** - Take navbar through v0.dev iteration until satisfied
3. **Integration** - Bring navbar design back, integrate with existing routing
4. **Visual review** - Use `@visual-design-reviewer` agent for comprehensive review
5. **Document** - Record decisions, patterns, and tokens in style-guide.md
6. **Validate workflow** - Confirm this approach works before proceeding

Then proceed with:

1. **Bulk placeholder work** - Build all content section placeholders (Skills, Education, About, Contact, Projects)
2. **Routing verification** - Ensure all pages render and navigation works
3. **Visual design work** - Take to v0.dev in batches, applying learned patterns
4. **Consistency pass** - Ensure all components follow established style guide

**Rationale**: Navbar is simple, well-understood, and touches all sections. Perfect validation case without disrupting
the preferred workflow of having all placeholders complete before bulk visual design work.

---

## Implementation Decisions

### Education + About Page Grouping

**Date**: 2025-10-18
**Decision**: Education and About sections will share the `/about` page

**Rationale**:

- Both are biographical/background content - natural grouping
- Splitting them would feel unnecessarily fragmented for users
- Components remain modular (EducationSection and AboutSection separate) for flexibility
- Reduces implementation work (one fewer page route)

**Navigation Impact**: Navigation header will have 5 links: Home, Projects, Skills, About, Contact (no separate
Education link)

**Implementation**: `/about` page will import and render both EducationSection and AboutSection components

---

## Animation Timing Quick Reference

### AdaptiveHero Component

**File**: `src/components/AdaptiveHero.tsx`

**Animation Durations** (adjust to taste):

| Element | Line(s) | Duration | Notes |
|---------|---------|----------|-------|
| Container padding | 23, 30 | `0.4s` | Vertical padding expansion/contraction |
| Name size | 42, 50 | `0.2s` | Font size transition (text-4xl ↔ text-2xl) |
| Prompt fade | 62, 70 | `0.3s` | "> portfolio.init()" fade in/out |
| Tagline fade | 79, 87 | `0.3s` | Tagline fade in/out |
| Cursor fade | 101, 107 | `0.15s` | ">_" cursor fade in/out |
| Cursor delay | 108 | `0.15s` | Delay before cursor appears (compact state) |
| State cross-fade | 130, 158 | `0.2s` | Overall container fade between states |

**Tuning Guidelines**:

- **Faster (0.15-0.25s)**: Snappy, energetic feel
- **Medium (0.3-0.4s)**: Smooth, polished (current sweet spot)
- **Slower (0.5s+)**: Starts feeling laggy for UI micro-interactions

**Technical Notes**:

- Uses `AnimatePresence` with `mode="wait"` to prevent layout jumping
- Each state renders independently with cross-fade transition
- Name animates from opposite state size as it fades in
- All animations use `"easeOut"` easing for smooth deceleration

---

## Notes & Insights

### Component Modularity Philosophy

Components should be designed as reusable building blocks, not tied to specific pages. This allows:

- Easy reorganization during design phase (move components between pages)
- Reuse in multiple contexts (e.g., EducationSection could appear on About page OR resume page)
- Independent testing and iteration
- Separation of concerns (component logic vs. page routing)

### Future Enhancements to Consider

- Dynamic NexusMods download count integration (API research needed)
- Project search/filtering system
- Advanced categorization/tagging
- Resume PDF download feature
- Contact form functionality
- Animations and micro-interactions (Framer Motion)

---

**Last Updated**: 2025-10-18
