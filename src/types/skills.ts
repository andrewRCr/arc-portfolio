/**
 * TypeScript interfaces for skills and technology categorization
 *
 * Defines the structure for organizing technical skills into categories.
 * Tags use canonical technology names matching project tags to enable future filtering.
 */

/**
 * Allowed skill category names
 *
 * Constrained union provides compile-time validation of category names.
 * To add a new category: add it here, then add the corresponding data in skills.ts.
 */
export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "AI-Assisted Development"
  | "DevOps & Infrastructure"
  | "Testing & Quality"
  | "Methodologies";

/**
 * Individual skill with optional metadata
 *
 * @property name - Display name of the skill/technology
 * @property featured - If true, skill appears in Home page featured row
 * @property iconSlug - Identifier for simple-icons package (e.g., "typescript", "react")
 * @property showInDefaultFilters - If true, skill appears in Projects filter popover by default
 */
export interface Skill {
  name: string;
  featured?: boolean;
  iconSlug?: string;
  showInDefaultFilters?: boolean;
}

/**
 * Skills organized by category
 *
 * Mapped type ensures only valid SkillCategory keys are allowed.
 * Each category maps to an array of Skill objects.
 */
export type Skills = {
  [K in SkillCategory]: Skill[];
};
