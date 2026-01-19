/**
 * Skills data organized by technical domain
 *
 * Skills migrated from Squarespace and expanded with technologies from recent projects.
 * Focus on software engineering skills (game dev tools removed - see projects for that work).
 * Commented entries are planned enhancements currently in development.
 */

import { Skills } from "@/types/skills";

export const skills: Skills = {
  Languages: [
    { name: "TypeScript", featured: true, iconSlug: "typescript" },
    { name: "JavaScript", iconSlug: "javascript" },
    { name: "Python", featured: true, iconSlug: "python" },
    { name: "C#", featured: true, iconSlug: "csharp" },
    { name: "C++", iconSlug: "cplusplus" },
    { name: "SQL" },
    { name: "HTML", iconSlug: "html5" },
    { name: "CSS", iconSlug: "css" },
  ],

  Frontend: [
    { name: "React", featured: true, iconSlug: "react" },
    { name: "Next.js", iconSlug: "nextdotjs" },
    { name: "Tailwind CSS", iconSlug: "tailwindcss" },
    { name: "Shadcn/ui", iconSlug: "shadcnui" },
    { name: "Chakra UI", iconSlug: "chakraui" },
    { name: "Bootstrap", iconSlug: "bootstrap" },
    { name: "Blazor", iconSlug: "blazor" },
    { name: "WPF" },
    { name: "MudBlazor" },
    { name: "Caliburn Micro" },
    // { name: "Framer Motion", iconSlug: "framer" }, // Planned - in development
    // { name: "React Hook Form" }, // Planned - in development
    // { name: "Zod" }, // Planned - in development
  ],

  Backend: [
    { name: "Django", featured: true, iconSlug: "django" },
    { name: "Django Ninja" },
    { name: ".NET", featured: true, iconSlug: "dotnet" },
    { name: "Node.js", iconSlug: "nodedotjs" },
    { name: "Express.js", iconSlug: "express" },
    { name: "Pydantic", iconSlug: "pydantic" },
    { name: "Entity Framework" },
    { name: "EJS (Embedded JavaScript)" },
    // { name: "Celery" }, // Planned - in development
  ],

  Databases: [
    { name: "PostgreSQL", iconSlug: "postgresql" },
    { name: "MongoDB", iconSlug: "mongodb" },
    { name: "SQL Server" },
    { name: "MySQL", iconSlug: "mysql" },
    { name: "Redis", iconSlug: "redis" },
  ],

  "AI-Assisted Development": [
    { name: "Claude Code", iconSlug: "claude" },
    { name: "GitHub Copilot", iconSlug: "githubcopilot" },
    { name: "Warp", iconSlug: "warp" },
    { name: "CodeRabbit" },
    { name: "v0.dev" },
    { name: "Gemini CLI", iconSlug: "googlegemini" },
    { name: "Codex CLI" },
  ],

  "DevOps & Infrastructure": [
    { name: "Git", iconSlug: "git" },
    { name: "GitHub", iconSlug: "github" },
    { name: "Azure DevOps" },
    { name: "Docker", iconSlug: "docker" },
    { name: "Vercel", iconSlug: "vercel" },
    { name: "Caddy", iconSlug: "caddy" },
    { name: "CI/CD" },
    { name: "GitHub Actions", iconSlug: "githubactions" },
  ],

  "Testing & Quality": [
    { name: "Vitest", iconSlug: "vitest" },
    { name: "React Testing Library", iconSlug: "testinglibrary" },
    { name: "Postman", iconSlug: "postman" },
    { name: "Swagger", iconSlug: "swagger" },
    // { name: "Playwright", iconSlug: "playwright" }, // Planned - in development
  ],

  // "State Management & Data Fetching": [
  //   { name: "TanStack Query" }, // Planned - in development
  //   { name: "Redux Toolkit", iconSlug: "redux" }, // Planned - in development
  // ],

  Methodologies: [{ name: "Test-Driven Development (TDD)" }, { name: "Spec-Driven Development" }, { name: "Agile" }],
};
