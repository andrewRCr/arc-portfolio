/**
 * Centralized exports for all portfolio content data
 *
 * This file provides a single import point for all content throughout the application.
 * Components can import from "@/data" instead of individual files.
 *
 * Example usage:
 *   import { projects, mods, skills, education, about, contact } from "@/data";
 */

export { projects } from "./projects";
export { mods } from "./mods";
export { skills } from "./skills";
export { education } from "./education";
export { about } from "./about";
export { contact } from "./contact";

// Re-export types for convenience
export type { Project } from "@/types/project";
export type { Skills } from "@/types/skills";
export type { Education } from "@/types/education";
export type { About } from "@/types/about";
export type { Contact } from "@/types/contact";
