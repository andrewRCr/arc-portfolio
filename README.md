# andrewRCr Portfolio

<div align="center">
  <a href="https://pagespeed.web.dev/analysis?url=https://andrewcreekmore.dev">
    <img alt="Lighthouse Performance"
      src="https://img.shields.io/badge/Performance-90%2B-brightgreen?logo=lighthouse&logoColor=white" /></a>
  <a href="https://pagespeed.web.dev/analysis?url=https://andrewcreekmore.dev">
    <img alt="Lighthouse Accessibility"
      src="https://img.shields.io/badge/Accessibility-100-brightgreen?logo=lighthouse&logoColor=white" /></a>
  <a href="https://pagespeed.web.dev/analysis?url=https://andrewcreekmore.dev">
    <img alt="Lighthouse Best Practices"
      src="https://img.shields.io/badge/Best_Practices-100-brightgreen?logo=lighthouse&logoColor=white" /></a>
  <a href="https://pagespeed.web.dev/analysis?url=https://andrewcreekmore.dev">
    <img alt="Lighthouse SEO"
      src="https://img.shields.io/badge/SEO-100-brightgreen?logo=lighthouse&logoColor=white" /></a>
  <br>
  <a href="https://github.com/andrewRCr/arc-portfolio/actions/workflows/ci.yml">
    <img alt="CI"
      src="https://github.com/andrewRCr/arc-portfolio/actions/workflows/ci.yml/badge.svg" /></a>
  <img alt="Code: MIT" src="https://img.shields.io/badge/Code-MIT-blue" />
  <img alt="Content: CC BY-NC 4.0" src="https://img.shields.io/badge/Content-CC_BY--NC_4.0-blue" />
  <br><br>
</div>

A developer portfolio engineered as a production application. All content (project data, theme
definitions, and site configuration) flows through typed, validated data models. The multi-theme
design system persists user preferences to cookies via Server Actions, preventing flash of unstyled
content on page load. Accessibility is validated by automated testing across the component library
and every theme combination.

<p align="center"><a href="https://andrewcreekmore.dev">andrewcreekmore.dev</a></p>

<div align="center">
  <img alt="Portfolio preview across multiple pages and themes"
    src="public/readme-hero.png" width="95%"/>
</div>

## Highlights

- Type-safe content architecture with validated data models for project data, theme definitions,
  and site configuration
- Theme system built on semantic design tokens for color and layout, with WCAG AA contrast
  validation across all combinations
- Automated accessibility auditing with vitest-axe integrated across component test suites
- Responsive layouts with distinct compositions across viewports; CSS-only breakpoints for
  hydration safety
- Server-side theme resolution via Server Actions and cookies — layout and color state established
  before first paint, zero layout shift
- Orchestrated animation system with centralized timing driving intro sequences, page transitions,
  and shared element morphing, with full reduced-motion support
- Built with [ARC Framework](https://andrewcreekmore.dev/projects/software/arc-framework), a
  spec-driven development methodology emphasizing focused human-agent collaboration

## Technology

- **Framework:** Next.js 16, React 19, TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4, Shadcn/ui, Framer Motion
- **Testing:** Vitest, React Testing Library, Playwright
- **Infrastructure:** Vercel, GitHub Actions CI, Upstash Redis

## License

**Dual License:**

- **Code:** MIT License - free to use, modify, and distribute
- **Content:** CC BY-NC 4.0 - requires attribution, non-commercial only

See [LICENSE](LICENSE) for full details.

<p align="center"><a href="#andrewrcr-portfolio">↑ Back to top</a></p>
