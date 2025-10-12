/**
 * Sample skills data demonstrating Skills interface usage
 *
 * Skills organized by flexible categories using canonical technology names.
 * In Phase 2, this will be updated with actual skills from Squarespace
 * plus new technologies from recent projects (AI/LLM tools, modern frameworks).
 */

import { Skills } from "@/types/skills";

export const skills: Skills = {
  // Frontend technologies
  Frontend: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Shadcn/ui"],

  // Backend technologies
  Backend: ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Prisma", "REST APIs", "GraphQL"],

  // Development tools and workflows
  DevOps: ["Git", "GitHub", "GitHub Actions", "Vercel", "Docker", "CI/CD", "Jest", "Vitest"],

  // Programming languages (beyond web)
  "Programming Languages": ["TypeScript", "JavaScript", "Python", "C++", "C#", "SQL"],

  // Additional categories can be added as needed
  // Example: "AI/LLM": ["Claude API", "Prompt Engineering", "LangChain"],
};
