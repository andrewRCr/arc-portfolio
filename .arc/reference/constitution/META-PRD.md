# andrewRCr Portfolio Meta Product Requirements Document (META-PRD)

## 1. Purpose

**andrewRCr Portfolio** is a modern developer portfolio website showcasing professional projects, technical
skills, and software engineering capabilities with an emphasis on both traditional computer science fundamentals
and contemporary AI-assisted development practices.

**Target Users**:

- Primary: Technical recruiters and hiring managers evaluating software engineering candidates
- Secondary: Professional network, peers, and potential collaborators

**Core Value Proposition**:

This portfolio demonstrates a unique blend of traditional software engineering rigor and cutting-edge
development practices. It showcases:

- Strong computer science fundamentals through a CS degree and early projects built with traditional methodologies
- Modern technical proficiency with current tools and frameworks
- Thoughtful, strategic approach to AI-assisted development (context engineering, spec-driven workflows)
- Emphasis on code quality, idiomatic best practices, and maintainable architecture
- Progression from foundational skills to contemporary development techniques

## 2. Core Features

### Project Showcase

- Featured projects with detailed case studies highlighting development approach and technical decisions
- Project cards displaying tech stack, descriptions, and links to GitHub repositories and live demos
- Filter and sort functionality by technology, category, or development timeline
- Emphasis on code quality, architectural choices, and development methodology for each project

### Professional Profile

- About section presenting CS background, development philosophy, and approach to modern tooling
- Skills and technologies organized by proficiency and experience level
- Education credentials and relevant certifications
- Downloadable resume/CV

### Contact & Professional Links

- Contact form or direct email integration
- Professional network links (GitHub, LinkedIn, etc.)
- Current availability status and opportunity preferences

### Interactive Elements & Polish

- Dark mode toggle for improved user experience
- Smooth page transitions and animations
- Responsive design optimized for all devices
- Performance-optimized asset loading
- Modern UI components leveraging Shadcn/ui and Tailwind CSS

## 3. Out-of-Scope Features

- **Blog/CMS**: No content management system or blog functionality - portfolio remains focused on project showcase
- **User Authentication**: No user accounts, login, or personalized user experiences
- **Social Features**: No comments, ratings, or interactive social functionality
- **E-commerce**: No payment processing, shop, or transactional features
- **Multi-language Support**: English-only for initial release
- **Admin Dashboard**: No backend CMS - content updates handled through code/deployment

## 4. User Flows (Primary)

**Primary User Journey (Recruiter/Hiring Manager)**:

A visitor lands on the homepage and encounters a professional introduction establishing technical background and
development philosophy. They browse featured projects, exploring detailed case studies that highlight code quality,
architectural decisions, and development approach. After understanding the breadth of work, they review the skills
and professional background section to assess qualifications. Finally, they can contact directly or download the
resume for follow-up.

**Secondary User Flows**:

- **Quick Exploration**: Casual browsing of project portfolio without deep engagement
- **Direct Project Access**: Navigation to specific project details from external links (e.g., GitHub, LinkedIn)
- **Contact-Focused**: Quick assessment of availability and direct navigation to contact options

## 5. Success Metrics

- **Performance**: Sub-2 second initial load times, Lighthouse scores of 90+ across all categories
  (Performance, Accessibility, Best Practices, SEO)
- **Technical Quality**: Clean, maintainable codebase following best practices, WCAG 2.1 AA accessibility
  compliance, semantic HTML and proper SEO implementation
- **User Experience**: Responsive design functioning flawlessly across devices, low bounce rate, intuitive
  navigation, smooth interactions
- **Conversion**: Contact form submissions, resume downloads, successful interview requests resulting from
  portfolio views

## 6. Technical Requirements

- **Performance**: Sub-2 second initial load time, optimized image and asset delivery, code splitting for
  efficient bundle sizes, fast time-to-interactive
- **Reliability**: 99.9% uptime target (Vercel-managed), error boundaries for graceful failure handling,
  progressive enhancement and graceful degradation
- **Scalability**: Static site generation where applicable, CDN-based global delivery, efficient build processes
- **Security**: HTTPS enforcement, secure form handling, no exposed credentials or sensitive data, content
  security policy implementation
- **Accessibility**: WCAG 2.1 AA compliance, full keyboard navigation support, screen reader compatibility,
  semantic HTML structure

## 7. Data Sources & Dependencies

- **External Sources**:
  - GitHub API (potential integration for repository statistics and project metadata - to be explored)
  - Domain registrar (andrewcreekmore.com transfer from Squarespace to appropriate DNS provider)
- **User-Generated**:
  - Contact form submissions (routed through Zeptomail for transactional email)
  - Download tracking for resume and project files
- **Derived Data**:
  - Potential analytics aggregation for portfolio effectiveness tracking (to be explored)
- **Dependencies**:
  - Vercel (hosting, deployment, and CDN delivery)
  - Zeptomail (transactional email service for contact form)
  - GitHub (version control and potential API integration)
  - Large file storage solution for Unreal Engine game projects (~5GB each - alternatives to Google Drive
    to be evaluated for professional delivery)

## 8. Project Context

**Timeline**:

- MVP (Minimum Viable Product): 4 weeks from project start
- Full Launch: Before end of year 2025

**Key Constraints**:

- Learning curve for Next.js, Tailwind CSS, Shadcn/ui, and Vercel ecosystem (first project with this stack)
- Budget: Prefer free-tier services where available; budget-friendly paid options acceptable for essential
  functionality
- Content migration from existing Squarespace site required

**Success Criteria**:

Version 1.0 is considered complete when:

- All content from existing Squarespace portfolio has been migrated
- Site demonstrates improved UX and more professional content presentation
- Domain (andrewcreekmore.com) successfully transferred and configured
- Core features (project showcase, professional profile, contact functionality) fully operational
- Performance, accessibility, and technical quality metrics met
- Site deployed and publicly accessible on custom domain

**Stakeholders**:

- Andrew Creekmore (developer and portfolio owner)

---

*This META-PRD serves as the foundational vision document for andrewRCr Portfolio.*
*Individual feature work should align with this overall direction.*
*Update this document as the project vision evolves.*
