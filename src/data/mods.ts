/**
 * Game modification portfolio data
 *
 * PLACEHOLDER DATA - Task 7.11
 * This file contains placeholder mod entries to validate the tabbed project architecture.
 * Real mod data will be migrated in Task 8.0 from NexusMods portfolio (~35 published mods).
 *
 * Note: Mods use the same Project interface as software projects, demonstrating
 * component reusability across different project categories.
 */

import { Project } from "@/types/project";

export const mods: Project[] = [
  // ==========================================
  // PLACEHOLDER MOD 1
  // ==========================================
  {
    id: "placeholder-mod-1",
    title: "[Placeholder] Example Skyrim Mod",
    slug: "placeholder-skyrim-mod",
    description:
      "This is a placeholder entry for a Skyrim mod. Real mod data will be added in Task 8.0. " +
      "The actual portfolio includes gameplay overhauls, UI improvements, and quality-of-life enhancements " +
      "published on NexusMods with thousands of downloads and active community support.",
    shortDescription: "Placeholder for gameplay mod. Real data coming in Task 8.0 migration from NexusMods portfolio.",
    category: ["Skyrim"],
    tags: ["Modding", "Game Design", "Community Support"],
    techStack: ["Creation Kit", "Papyrus Scripting", "xEdit"],
    features: [
      "Placeholder feature 1 - Real features will include gameplay mechanics",
      "Placeholder feature 2 - Real features will include balance improvements",
      "Placeholder feature 3 - Real features will include compatibility patches",
    ],
    links: {
      external: "https://www.nexusmods.com/skyrim",
    },
    images: {
      thumbnail: "", // Empty string triggers placehold.co fallback in ProjectCard
      screenshots: [],
      altTexts: [],
    },
    order: 1,
    featured: false,
  },

  // ==========================================
  // PLACEHOLDER MOD 2
  // ==========================================
  {
    id: "placeholder-mod-2",
    title: "[Placeholder] Example Fallout 4 Mod",
    slug: "placeholder-fallout4-mod",
    description:
      "This is a placeholder entry for a Fallout 4 mod. Real mod data will be added in Task 8.0. " +
      "The actual portfolio includes settlement building tools, weapon modifications, and gameplay enhancements " +
      "demonstrating reverse engineering skills and ongoing maintenance commitment.",
    shortDescription:
      "Placeholder for settlement mod. Real data coming in Task 8.0 migration from NexusMods portfolio.",
    category: ["Fallout 4"],
    tags: ["Modding", "Game Design", "Bug Fixing"],
    techStack: ["Creation Kit", "F4SE", "Material Editor"],
    features: [
      "Placeholder feature 1 - Real features will include building mechanics",
      "Placeholder feature 2 - Real features will include custom assets",
      "Placeholder feature 3 - Real features will include performance optimizations",
    ],
    links: {
      external: "https://www.nexusmods.com/fallout4",
    },
    images: {
      thumbnail: "", // Empty string triggers placehold.co fallback in ProjectCard
      screenshots: [],
      altTexts: [],
    },
    order: 2,
    featured: false,
  },
];
