/**
 * Skills data organized by technical domain
 *
 * Skills migrated from Squarespace and expanded with technologies from recent projects.
 * Focus on software engineering skills (game dev tools removed - see projects for that work).
 * Commented entries are planned enhancements currently in development.
 */

import { Skills } from "@/types/skills";

export const skills: Skills = {
  // Special row: Languages (displayed as centered hero, no card)
  Languages: [
    { name: "TypeScript", featured: true, iconSlug: "typescript" },
    { name: "JavaScript", iconSlug: "javascript" },
    { name: "Python", featured: true, iconSlug: "python" },
    { name: "C#", featured: true, iconSlug: "csharp" },
    { name: "C++", iconSlug: "cplusplus" },
    { name: "HTML", iconSlug: "html5" },
    { name: "CSS", iconSlug: "css" },
  ],

  // Row 1: Frontend + Backend
  Frontend: [
    { name: "React", featured: true, iconSlug: "react" },
    { name: "Next.js", featured: true, iconSlug: "nextdotjs" },
    { name: "TanStack Query", iconSlug: "reactquery" },
    { name: "Shadcn/ui", iconSlug: "shadcnui" },
    { name: "Chakra UI", iconSlug: "chakraui" },
    { name: "Blazor", featured: true, iconSlug: "blazor" },
    { name: "WPF" },
    { name: "MudBlazor" },
    { name: "Bootstrap" },
    { name: "Framer Motion", iconSlug: "framer" }, // Used in arc-portfolio; remove if startup animation not implemented
    // { name: "React Hook Form" }, // Planned - in development
    // { name: "Zod" }, // Planned - in development
  ],

  Backend: [
    { name: "Django", featured: true, iconSlug: "django" },
    { name: ".NET", featured: true, iconSlug: "dotnet" },
    { name: "Node.js", iconSlug: "nodedotjs" },
    { name: "Express.js", iconSlug: "express" },
    { name: "Pydantic", iconSlug: "pydantic" },
    { name: "Dapper" },
    { name: "Django Ninja" },
    { name: "Entity Framework" },
    // { name: "Celery" }, // Planned - in development
  ],

  // Row 2: Databases + DevOps
  Databases: [
    { name: "PostgreSQL", iconSlug: "postgresql" },
    { name: "MongoDB", iconSlug: "mongodb" },
    { name: "Redis", iconSlug: "redis" },
    { name: "SQL Server" },
  ],

  "DevOps & Infrastructure": [
    { name: "Git", iconSlug: "git" },
    { name: "Docker", iconSlug: "docker" },
    { name: "Vite", iconSlug: "vite" },
    { name: "Vercel", iconSlug: "vercel" },
    { name: "Caddy", iconSlug: "caddy" },
    { name: "GitHub Actions", iconSlug: "githubactions" },
    { name: "Azure DevOps" },
  ],

  // Row 3: AI + Testing
  "AI-Assisted Development": [
    { name: "Claude Code", featured: true, iconSlug: "claude" },
    { name: "Codex CLI", featured: true, iconSlug: "openai" },
    { name: "Gemini CLI", iconSlug: "googlegemini" },
    { name: "Warp", iconSlug: "warp" },
    { name: "GitHub Copilot", iconSlug: "githubcopilot" },
    { name: "CodeRabbit" },
  ],

  "Testing & Quality": [
    { name: "Vitest", iconSlug: "vitest" },
    { name: "React Testing Library", iconSlug: "testinglibrary" },
    { name: "Pytest", iconSlug: "pytest" },
    { name: "Postman", iconSlug: "postman" },
    { name: "Swagger", iconSlug: "swagger" },
    { name: "Playwright" },
  ],

  // Excluded from display (filtered in SkillsSection)
  Methodologies: [{ name: "Test-Driven Development (TDD)" }, { name: "Spec-Driven Development" }, { name: "Agile" }],
};
