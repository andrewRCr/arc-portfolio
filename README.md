# andrewRCr Portfolio

A modern developer portfolio website built with Next.js 15, showcasing professional projects, technical skills, and
software engineering capabilities. This portfolio demonstrates a blend of traditional computer science fundamentals
and contemporary AI-assisted development practices.

## Technology Stack

### Core Framework

- **[Next.js 15](https://nextjs.org/)** - Full-stack React framework with App Router and Server Components
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Type safety and enhanced developer experience
- **[Turbopack](https://turbo.build/pack)** - Next-generation build tool for fast development and production builds

### Styling & UI

- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework with CSS variables for theming
- **[Shadcn/ui](https://ui.shadcn.com/)** - Accessible component primitives built on Radix UI
- **[Lucide React](https://lucide.dev/)** - Icon library for consistent iconography
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for smooth transitions and
  micro-interactions

### Form Handling & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Performant form state management with minimal re-renders
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation for forms and data

### Development Tools

- **[ESLint](https://eslint.org/)** - Code quality and consistency enforcement
- **[Prettier](https://prettier.io/)** - Opinionated code formatting
- **[Vitest](https://vitest.dev/)** - Fast unit test framework powered by Vite (to be implemented)

### External Services

- **[Zeptomail](https://www.zoho.com/zeptomail/)** - Transactional email service for contact form submissions
- **[Vercel](https://vercel.com/)** - Zero-configuration deployment with global CDN
- **[GitHub Actions](https://github.com/features/actions)** - Continuous integration and quality gates

## Development Framework

This project uses the **ARC (Agentic Recursive Coordination)** development framework for systematic documentation
and workflow management in AI-assisted development. ARC provides constitutional documents (META-PRD,
TECHNICAL-ARCHITECTURE, DEVELOPMENT-RULES, PROJECT-STATUS) and structured workflows for feature planning and
implementation.

Learn more about the ARC framework: [arc-agentic-dev-framework](https://github.com/andrewRCr/arc-agentic-dev-framework)

## Project Structure

```
arc-portfolio/
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Homepage
│   │   ├── projects/        # Project showcase pages
│   │   ├── about/           # Professional profile page
│   │   ├── contact/         # Contact page
│   │   └── api/             # API routes (contact form handler)
│   ├── components/          # React components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── layout/          # Header, footer, navigation
│   │   └── shared/          # Reusable components
│   ├── lib/                 # Utilities and helper functions
│   ├── types/               # TypeScript type definitions
│   └── data/                # Static content (projects, skills, etc.)
├── public/                  # Static assets (images, resume, downloads)
├── .arc/                    # ARC development framework documentation
├── .github/workflows/       # CI/CD configuration
└── [config files]           # ESLint, Prettier, TypeScript configs
```

## License

**Dual License:**

- **Code**: MIT License - Source code is open source and free to use
- **Content**: CC BY-NC 4.0 - Portfolio content (text, images, assets) requires attribution and is for
  non-commercial use

See [LICENSE](LICENSE) for full details.

---

_Built with React 19, Next.js 15, TypeScript, Tailwind CSS v4, and deployed on Vercel._
