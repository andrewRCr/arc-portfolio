/**
 * TypeScript interfaces for skills and technology categorization
 *
 * Defines the structure for organizing technical skills into flexible categories.
 * Tags use canonical technology names matching project tags to enable future filtering.
 */

/**
 * Skills organized by category
 *
 * Flexible structure supporting multiple categories with extensibility for future additions
 * (e.g., proficiency levels, years of experience, icon references).
 *
 * Categories can be reorganized as needed (e.g., Frontend, Backend, AI/LLM, Databases, DevOps, Game Dev).
 */
export interface Skills {
  [category: string]: string[]; // Category name maps to array of skill/technology names
}

/**
 * Example structure:
 * {
 *   "Frontend": ["React", "Next.js", "TypeScript", "Tailwind CSS"],
 *   "Backend": ["Node.js", "Express.js", "PostgreSQL"],
 *   "AI/LLM": ["Claude API", "Prompt Engineering", "LangChain"],
 *   "DevOps": ["Git", "GitHub Actions", "Docker", "Vercel"]
 * }
 */
