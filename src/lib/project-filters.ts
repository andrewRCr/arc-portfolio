/**
 * Project filtering utilities
 *
 * Provides functions for filtering projects by various criteria.
 * Used by the Projects page to support skill-based filtering.
 */

import { Project } from "@/types/project";

/**
 * Filters projects by a single skill name, matching against the tags array.
 *
 * @param projects - Array of projects to filter
 * @param skillName - Skill name to filter by (matched against tags)
 * @returns Filtered projects sorted by order field
 *
 * @example
 * const typescriptProjects = filterProjectsBySkill(allProjects, "TypeScript");
 */
export function filterProjectsBySkill(projects: Project[], skillName: string): Project[] {
  const normalizedSkill = skillName.trim().toLowerCase();

  // Return empty array for empty/whitespace-only skill names
  if (!normalizedSkill) {
    return [];
  }

  // Filter projects where any tag matches the skill name (case-insensitive)
  const filtered = projects.filter((project) =>
    project.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
  );

  // Sort by order field (ascending - lower order = higher priority)
  return filtered.sort((a, b) => a.order - b.order);
}

/**
 * Filters projects by multiple skills using OR logic.
 *
 * Returns projects that match ANY of the selected skills (union).
 * Each project appears only once even if it matches multiple skills.
 *
 * @param projects - Array of projects to filter
 * @param skills - Array of skill names to filter by
 * @returns Filtered projects sorted by order field, or all projects if skills is empty
 *
 * @example
 * // Returns projects using React OR TypeScript
 * const filtered = filterProjectsBySkills(allProjects, ["React", "TypeScript"]);
 *
 * // Empty array returns all projects (no filtering)
 * const all = filterProjectsBySkills(allProjects, []);
 */
export function filterProjectsBySkills(projects: Project[], skills: string[]): Project[] {
  // Normalize skills: trim whitespace, lowercase, filter out empty strings
  const normalizedSkills = skills
    .map((skill) => skill.trim().toLowerCase())
    .filter((skill) => skill.length > 0);

  // If no valid skills provided, return all projects (no filtering)
  if (normalizedSkills.length === 0) {
    return projects;
  }

  // Filter projects where any tag matches ANY of the skills (OR logic)
  const filtered = projects.filter((project) =>
    project.tags.some((tag) => normalizedSkills.includes(tag.toLowerCase()))
  );

  // Sort by order field (ascending - lower order = higher priority)
  return filtered.sort((a, b) => a.order - b.order);
}
