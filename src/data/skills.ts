/**
 * Skills data organized by technical domain
 *
 * Skills migrated from Squarespace and expanded with technologies from recent projects.
 * Focus on software engineering skills (game dev tools removed - see projects for that work).
 * Commented entries are planned enhancements currently in development.
 */

import { Skills } from "@/types/skills";

export const skills: Skills = {
  Languages: ["TypeScript", "JavaScript", "Python", "C#", "C++", "SQL", "HTML", "CSS"],

  Frontend: [
    "React",
    "Next.js",
    "Tailwind CSS",
    "Shadcn/ui",
    "Chakra UI",
    "Bootstrap",
    "Blazor",
    "WPF",
    "MudBlazor",
    "Caliburn Micro",
    // "Framer Motion", // Planned - in development
    // "React Hook Form", // Planned - in development
    // "Zod", // Planned - in development
  ],

  Backend: [
    "Django",
    "Django Ninja",
    ".NET",
    "Node.js",
    "Express.js",
    "Pydantic",
    "Entity Framework",
    "EJS (Embedded JavaScript)",
    // "Celery", // Planned - in development
  ],

  Databases: ["PostgreSQL", "MongoDB", "SQL Server", "MySQL", "Redis"],

  "AI-Assisted Development": [
    "Claude Code",
    "GitHub Copilot",
    "Warp",
    "CodeRabbit",
    "v0.dev",
    "Gemini CLI",
    "Codex CLI",
  ],

  "DevOps & Infrastructure": ["Git", "GitHub", "Azure DevOps", "Docker", "Vercel", "Caddy", "CI/CD", "GitHub Actions"],

  "Testing & Quality": [
    "Vitest",
    "React Testing Library",
    "Postman",
    "Swagger",
    // "Playwright", // Planned - in development
  ],

  // "State Management & Data Fetching": [
  //   "TanStack Query", // Planned - in development
  //   "Redux Toolkit", // Planned - in development
  // ],

  Methodologies: ["Test-Driven Development (TDD)", "Spec-Driven Development", "Agile"],
};
