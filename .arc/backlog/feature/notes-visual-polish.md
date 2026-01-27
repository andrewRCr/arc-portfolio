# Notes: Visual Polish - Aesthetic Exploration

**Purpose:** Reference material for the aesthetic exploration phase of Visual Polish work unit.

---

## Terminal vs Standard Aesthetic Standardization

**Context:** The portfolio blends TWM/terminal aesthetic with standard web design patterns. Currently this
blend is intuitive but not formally codified. This creates occasional ambiguity about when to use terminal
styling (monospace, squared corners, caps) vs standard styling (rounded corners, regular fonts).

### Current State Analysis

| Element                | Current Approach       | Notes                         |
|------------------------|------------------------|-------------------------------|
| Page titles            | Monospace              | Terminal-y, works well        |
| Form labels            | Monospace              | Consistent with titles        |
| Subtitles/descriptions | Regular font           | Standard prose                |
| Nav links background   | Squared corners        | Terminal UI indicator style   |
| TUI frame              | Rounded corners        | Decorative border element     |
| Form fields            | Rounded corners        | Standard input styling        |
| Cards                  | Rounded corners        | Content containers            |
| Buttons (social links) | Rounded + regular font | Friendly, approachable        |
| Buttons (primary CTA)  | Rounded + regular font | Same as above (question mark) |

### Proposed Framework: "System vs Content" Distinction

- **Terminal/TUI aesthetic** for "system" elements: Navigation, labels/identifiers, headers/titles, frames,
  status indicators, counters
- **Standard web aesthetic** for "content/interaction" elements: Body text, descriptions, prose, input fields,
  cards containing content

### Grey Area - Action Buttons

Buttons straddle both categories (human-facing verbs + system commands). Possible distinction:

- **Primary commands** (form submit, destructive actions): Squared + monospace + caps → `[EXECUTE]` feel
- **Navigation/links** (social links, "learn more"): Rounded + regular → friendly destinations

### Evaluation Checklist

- [ ] Audit all button/action styles across the app
- [ ] Test squared+monospace+caps treatment for primary CTAs
- [ ] Evaluate visual consistency and whether it enhances or detracts from UX
- [ ] If viable, codify in `strategy-style-guide.md` as formal guidance
- [ ] If not viable, document decision and maintain current approach

### Guiding Principles

**Goal:** Strengthen the terminal/TWM/tech-y feel of the app - either by increasing that feel or making it
more consistent.

**Constraints:**

- Don't get lost in abstraction - this isn't a huge project requiring deep systematization
- If the outcome is just 2-3 minor component tweaks, don't over-formalize
- If it reveals a path that meaningfully improves the aesthetic, worth documenting properly
- Accessibility and ease of use must not be compromised

**Outcome:** Either formalize the "System vs Content" framework as a strategy, or explicitly decide the
current intuitive blend is sufficient and document that decision.
