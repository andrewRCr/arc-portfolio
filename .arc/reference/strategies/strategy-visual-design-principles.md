# Strategy: Visual Design Principles

<!--
Derived from: https://github.com/OneRedOak/claude-code-workflows/blob/main/design-review/design-principles-example.md
Original work licensed under MIT License
-->

## I. Core Design Philosophy & Strategy

- **Users First:** Prioritize user needs, workflows, and ease of use in every design decision.
- **Meticulous Craft:** Aim for precision, polish, and high quality in every UI element and interaction.
- **Speed & Performance:** Design for fast load times and snappy, responsive interactions.
- **Simplicity & Clarity:** Strive for a clean, uncluttered interface. Ensure labels, instructions, and information are
unambiguous.
- **Focus & Efficiency:** Help users achieve their goals quickly and with minimal friction. Minimize unnecessary steps
  or distractions.
- **Consistency:** Maintain a uniform design language (colors, typography, components, patterns) across the entire app.
- **Accessibility (WCAG AA+):** Design for inclusivity. Ensure sufficient color contrast, keyboard navigability,
  and screen reader compatibility.
- **Opinionated Design (Thoughtful Defaults):** Establish clear, efficient default workflows and settings,
  reducing decision fatigue for users.

## II. Design System Foundation (Tokens & Core Components)

- **Define a Color Palette:**
    - **Primary Brand Color:** User-specified, used strategically.
    - **Neutrals:** A scale of grays (5-7 steps) for text, backgrounds, borders.
    - **Semantic Colors:** Define specific colors for Success (green), Error/Destructive (red), Warning (yellow/amber),
    Informational (blue).
    - **Dark Mode Palette:** Create a corresponding accessible dark mode palette.
    - **Accessibility Check:** Ensure all color combinations meet WCAG AA contrast ratios.
- **Establish a Typographic Scale:**
    - **Primary Font Family:** Choose a clean, legible sans-serif font (e.g., Inter, Manrope, system-ui).
    - **Modular Scale:** Define distinct sizes for H1, H2, H3, H4, Body Large, Body Medium (Default), Body Small/Caption.
    (e.g., H1: 32px, Body: 14px/16px).
    - **Font Weights:** Utilize a limited set of weights (e.g., Regular, Medium, SemiBold, Bold).
    - **Line Height:** Ensure generous line height for readability (e.g., 1.5-1.7 for body text).
- **Define Spacing Units:**
    - **Base Unit:** Establish a base unit (e.g., 8px).
    - **Spacing Scale:** Use multiples of the base unit for all padding, margins, and layout spacing
    (e.g., 4px, 8px, 12px, 16px, 24px, 32px).
- **Define Border Radii:**
    - **Consistent Values:** Use a small set of consistent border radii (e.g., Small: 4-6px for inputs/buttons;
    Medium: 8-12px for cards/modals).
- **Develop Core UI Components (with consistent states: default, hover, active, focus, disabled):**
    - Examples include:
        - Buttons (primary, secondary, tertiary/ghost, destructive, link-style; with icon options)
        - Input Fields (text, textarea, select, date picker; with clear labels, placeholders, helper text,
      error messages)
        - Checkboxes & Radio Buttons
        - Toggles/Switches
        - Cards (for content blocks, multimedia items, widgets)
        - Data Displays (tables, lists, grids; ensure clear headers, grouping, and optional sorting/filtering)
        - Modals/Dialogs (for confirmations, forms, detailed views)
        - Navigation Elements (e.g., sidebar, top/bottom navigation, tabs)
        - Form Patterns (validation states, inline messages, progressive disclosure)
        - Badges/Tags (for status indicators, categorization)
        - Tooltips (for contextual help)
        - Progress Indicators (Spinners, Progress Bars)
        - Icons (use a single, modern, clean icon set; SVG preferred)
        - Avatars

## III. Layout, Visual Hierarchy & Structure

- **Responsive Grid System:** Design based on a responsive grid (e.g., 12-column) for consistent layout across devices.
- **Strategic White Space:** Use ample negative space to improve clarity, reduce cognitive load, and create visual balance.
- **Clear Visual Hierarchy:** Guide the user's eye using typography (size, weight, color), spacing, and element positioning.
- **Consistent Alignment:** Maintain consistent alignment of elements.
- **Overall Page Structure:** Choose layout patterns that fit the product's content density and navigation needs
  (e.g., persistent sidebar, top navigation, segmented panels, single-column scroll).
    - Keep primary actions and navigation predictable and easy to access.
    - Ensure structural elements scale across desktop, tablet, and mobile breakpoints.
- **Mobile-First Considerations:** Ensure the design adapts gracefully to smaller screens.

## IV. Interaction Design & Animations

- **Purposeful Micro-interactions:** Use subtle animations and visual feedback for user actions (hovers, clicks,
  form submissions, status changes).
    - Feedback should be immediate and clear.
    - Animations should be quick (150-300ms) and use appropriate easing (e.g., ease-in-out).
- **Loading States:** Implement clear loading indicators (skeleton screens for page loads, spinners for in-component actions).
- **Transitions:** Use smooth transitions for state changes, modal appearances, and section expansions.
- **Avoid Distraction:** Animations should enhance usability, not overwhelm or slow down the user.
- **Keyboard Navigation:** Ensure all interactive elements are keyboard accessible and focus states are clear.

## V. CSS & Styling Architecture

- **Choose a Scalable CSS Methodology:**
    - **Utility-First Frameworks:** e.g., Tailwind CSS. Define design tokens in config, apply via utility classes.
    - **BEM with Sass:** If not utility-first, use structured BEM naming with Sass variables for tokens.
    - **CSS-in-JS (Scoped Styles):** e.g., Stripe's approach for Elements.
- **Integrate Design Tokens:** Ensure colors, fonts, spacing, radii tokens are directly usable in the chosen CSS architecture.
- **Maintainability & Readability:** Code should be well-organized and easy to understand.
- **Performance:** Optimize CSS delivery; avoid unnecessary bloat.

## VI. General Best Practices

- **Iterative Design & Testing:** Continuously test with users and iterate on designs.
- **Clear Information Architecture:** Organize content and navigation logically.
- **Responsive Design:** Ensure the app is fully functional and looks great on all device sizes (desktop, tablet, mobile).
- **Documentation:** Maintain clear documentation for the design system and components.
