# andrewRCr Portfolio Technical Architecture

This document outlines the technical architecture of andrewRCr Portfolio, covering the implementation stack,
development practices, and operational considerations.

## 1. Architecture Overview

**andrewRCr Portfolio** is a modern static website built with Next.js using the App Router and Static Site
Generation (SSG). The architecture prioritizes performance, accessibility, and developer experience:

- **Frontend Application**: Next.js 15 with React 19, TypeScript, and Tailwind CSS v4
- **UI Components**: Shadcn/ui component library for consistent, accessible design
- **Build System**: Turbopack for fast development and optimized production builds
- **Deployment**: Vercel platform for global CDN delivery and automatic deployments
- **Content Management**: Code-based content updates (no CMS backend)

## 2. Frontend Architecture

### Technology Stack

- **Framework**: Next.js 15 with App Router and React Server Components
- **Language**: TypeScript 5.x with strict type checking
- **UI Components**: Shadcn/ui (Radix UI primitives with Tailwind styling)
- **Routing**: Next.js App Router with file-system based routing
- **State Management**: React hooks and Server Components (minimal client-side state)
- **Data Fetching**: Static generation at build time, Server Components for dynamic data
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Build Tool**: Turbopack for fast development and production builds
- **Testing**: To be implemented (React Testing Library + Jest/Vitest)

### Key Libraries

- `next@15.5.4`: Full-stack React framework with SSG, SSR, and routing
- `react@19.1.0` / `react-dom@19.1.0`: UI library and rendering
- `typescript@5.x`: Type safety and enhanced developer experience
- `tailwindcss@4.x`: Utility-first CSS framework
- `shadcn/ui`: Accessible component primitives with Radix UI and Tailwind styling
- `class-variance-authority`: Type-safe component variants
- `clsx` / `tailwind-merge`: Conditional className utilities
- `lucide-react`: Icon library for consistent iconography
- `framer-motion`: Animation library for smooth transitions and micro-interactions (to be added)
- `react-hook-form`: Performant form state management with minimal re-renders (to be added)
- `zod`: TypeScript-first schema validation for forms and data (to be added)
- `zeptomail`: Transactional email service for contact form submissions
- `@vercel/analytics`: Real user monitoring and analytics (to be configured)

### Code Organization

```
arc-portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   │   ├── layout.tsx          # Root layout with metadata and providers
│   │   ├── page.tsx            # Homepage
│   │   ├── projects/           # Project showcase pages
│   │   ├── about/              # About/profile page
│   │   ├── contact/            # Contact page
│   │   └── api/                # API routes (contact form handler)
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── layout/             # Layout components (header, footer, nav)
│   │   ├── projects/           # Project-specific components
│   │   └── shared/             # Shared utilities and components
│   ├── lib/                    # Utilities and helper functions
│   │   └── utils.ts            # className utilities (cn function)
│   ├── types/                  # TypeScript type definitions
│   └── data/                   # Static content data (projects, skills, etc.)
├── public/                     # Static assets (images, resume, downloads)
├── .arc/                       # ARC development framework documentation
├── .claude/                    # Claude Code configuration (gitignored)
└── [config files]              # ESLint, Prettier, TypeScript configs
```

### Component Architecture

- **Server Components by default**: Leverage React Server Components for static content
- **Client Components sparingly**: Use `"use client"` only for interactivity (dark mode toggle, contact form)
- **Composition over complexity**: Small, focused components with clear responsibilities
- **Shadcn/ui patterns**: Copy component source into project for full customization control
- **Responsive design**: Mobile-first approach with Tailwind breakpoints

## 3. Data Architecture

### Content Strategy

- **Static Data**: Project information, skills, education stored in TypeScript files in `src/data/`
- **Type Safety**: All content data typed with TypeScript interfaces
- **No Database**: Portfolio content managed in code for simplicity and version control
- **Large Files**: Unreal Engine game projects (~5GB each) hosted externally (solution TBD)

### External Services

- **GitHub API**: Potential integration for repository statistics and project metadata (to be explored)
- **Zeptomail**: Transactional email service for contact form submissions
- **Analytics**: Portfolio effectiveness tracking solution to be determined
- **Domain DNS**: andrewcreekmore.com management (transfer from Squarespace)

### Content Updates

- **Process**: Edit content in `src/data/`, commit, push to trigger Vercel rebuild
- **No CMS**: Content updates handled through code deployment
- **Versioned**: All content changes tracked in Git history

## 4. Infrastructure & Deployment

### Development Environment

- **Local Setup**: `npm install` followed by `npm run dev`
- **Environment Variables**: `.env.local` for local development (gitignored)
- **Hot Reload**: Turbopack provides fast refresh during development
- **Development Tools**:
  - VS Code with recommended extensions (Prettier, ESLint, Tailwind IntelliSense)
  - Claude Code for AI-assisted development
  - Git for version control

### CI/CD Pipeline

- **Platform**: Vercel automatic deployments
- **Trigger**: Push to `main` branch triggers production deployment
- **Preview Deploys**: Pull requests automatically get preview URLs
- **Quality Gates**:
  - Type checking: `npm run type-check`
  - Linting: `npm run lint`
  - Formatting: `npm run format:check`
  - Build validation: Vercel build process
- **Zero-Downtime**: Vercel handles deployments with instant rollback capability

### Production Architecture

- **Hosting**: Vercel platform with global edge network
- **Domain**: andrewcreekmore.com (custom domain configuration)
- **CDN**: Automatic CDN distribution via Vercel Edge Network
- **SSL/TLS**: Automatic HTTPS with Vercel-managed certificates
- **Scaling**: Serverless architecture scales automatically with traffic
- **Caching**: Static assets cached at edge locations globally
- **Performance**:
  - Static Site Generation (SSG) for instant page loads
  - Image optimization via Next.js Image component
  - Code splitting and lazy loading
- **Monitoring**: Vercel Analytics (to be configured)

## 5. Testing Strategy

### Testing Philosophy

The project follows a **Pragmatic Test-Driven Development (TDD)** approach:

- **Full TDD for Logic**: API routes, form validation, utilities, component behavior tested before implementation
- **Test-After for Design**: Visual layout and styling tested after design stabilizes
- **Skip Tests for Pure Presentation**: Simple presentational components without logic may omit tests
- **E2E for Critical Flows**: Playwright for key user journeys (contact form submission, navigation)
- **Accessibility First**: Manual and automated a11y checks integrated throughout (axe DevTools, Lighthouse)

See `.arc/reference/strategies/testing-methodology.md` for detailed testing approach and examples.

### Quality Gates

Before any commit, the following must pass:

1. **Type Safety**: `npm run type-check` - zero TypeScript errors
2. **Code Quality**: `npm run lint` - ESLint passes with zero warnings
3. **Code Formatting**: `npm run format:check` - Prettier formatting enforced
4. **Documentation**: Markdown files pass markdownlint validation
5. **Build Success**: Project builds without errors

See DEVELOPMENT-RULES.md for complete quality gate commands and requirements.

## 6. Security Considerations

- **HTTPS**: Enforced by Vercel for all requests
- **Content Security**: No user-generated content, minimal security surface
- **Form Handling**: Contact form uses server-side validation and Zeptomail API
- **Environment Variables**: Sensitive keys stored in Vercel environment variables
- **Dependencies**: Regular `npm audit` checks, automated Dependabot updates via GitHub
- **No Authentication**: Public portfolio site requires no user authentication
- **Input Validation**: Server-side validation for contact form submissions
- **Rate Limiting**: Consider rate limiting for contact form via Vercel Edge Functions

## 7. Performance Considerations

### Optimization Strategies

- **Static Generation**: All pages pre-rendered at build time (SSG)
- **Image Optimization**: Next.js Image component with automatic optimization
- **Code Splitting**: Automatic route-based code splitting via Next.js
- **Bundle Optimization**: Turbopack handles efficient bundling
- **CSS Optimization**: Tailwind CSS purges unused styles in production
- **Font Optimization**: Next.js font optimization for custom fonts
- **Lazy Loading**: Dynamic imports for heavy components (project media, galleries)

### Performance Targets

- **Initial Load**: Sub-2 second time-to-interactive
- **Lighthouse Score**: 90+ across all categories (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Monitoring

- **Vercel Analytics**: Real User Monitoring (RUM) for Core Web Vitals
- **Lighthouse CI**: Regular automated audits
- **Manual Testing**: Regular performance checks across devices

## 8. Development Workflow Integration

### ARC Framework Integration

This technical architecture supports the ARC development methodology through:

- **Quality Automation**: Pre-commit checks via quality-gate-enforcer agent
- **Documentation**: Markdown-based documentation with linting enforcement
- **Systematic Development**: Constitutional documents guide technical decisions
- **Version Control**: All changes tracked in Git with atomic commits

### Development Commands

```bash
# Development setup
npm install                    # Install dependencies
npm run dev                    # Start development server with Turbopack

# Testing
npm run type-check            # TypeScript type checking
npm run lint                  # ESLint code quality checks
npm run format                # Format code with Prettier
npm run format:check          # Check formatting without writing

# Build and deployment
npm run build                 # Production build with Turbopack
npm run start                 # Start production server locally
npx markdownlint-cli2 "**/*.md"  # Lint markdown documentation

# Quality gates (all must pass)
npm run type-check && npm run lint && npm run format:check && npm run build
```

## 9. Architectural Decisions

### Key Technical Decisions

- **Next.js App Router over Pages Router**: Modern approach with React Server Components, better performance,
  and future-proof architecture
- **Turbopack over Webpack**: Significantly faster builds and hot reload during development
- **Tailwind CSS v4**: Utility-first CSS for rapid UI development with excellent performance
- **Shadcn/ui over Component Library**: Full control over components, no vendor lock-in, source code in repo
- **TypeScript (strict mode)**: Type safety prevents runtime errors and improves developer experience
- **Vercel Deployment**: Zero-configuration deployment optimized for Next.js, global CDN, automatic scaling
- **Static Generation (SSG)**: Portfolio content doesn't change frequently, SSG provides best performance
- **No Backend/Database**: Content managed in code simplifies architecture and improves reliability
- **Prettier + ESLint**: Enforced code style and quality standards across all contributors
- **Framer Motion for Animations**: Modern animation library demonstrates UX polish and attention to detail
- **React Hook Form + Zod**: Type-safe form handling with minimal re-renders and robust validation
- **Vercel Analytics**: Data-driven portfolio optimization and performance monitoring

### Trade-offs

- **No CMS**: Content updates require code deployment (acceptable for portfolio site, reduces complexity)
- **Static Content**: Dynamic features require API routes or client-side data fetching (minimal use case)
- **Vercel Lock-in**: Deployment optimized for Vercel (can migrate but requires reconfiguration)

### Future Considerations

- **Testing Suite**: Implement comprehensive testing as codebase grows
- **Analytics**: Integrate analytics solution for portfolio effectiveness tracking
- **Large File Hosting**: Evaluate alternatives to Google Drive for Unreal Engine project downloads
  (Vercel Large File Support, Cloudflare R2, AWS S3)
- **Blog/Writing**: May add content management system if blogging becomes priority (Contentful, Sanity.io)
- **Internationalization**: Consider i18n if international audience grows (currently English-only)

---

*This TECHNICAL-ARCHITECTURE document complements the META-PRD by focusing on implementation details
rather than product vision. It should be updated as the technical foundation evolves.*

*Last updated: October 12, 2025*
