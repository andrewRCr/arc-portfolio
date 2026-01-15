/**
 * Game modification portfolio data
 *
 * Mods use the same Project interface as software projects for component reusability.
 * The `game` field specifies which game the mod is for; `category` is the mod type.
 */

import { Project } from "@/types/project";

export const mods: Project[] = [
  // ==========================================
  // LIES OF P - HARDCORE MODE
  // ==========================================
  {
    id: "lies-of-p-hardcore-mode",
    title: "Hardcore Mode",
    slug: "lies-of-p-hardcore-mode",
    description:
      "Increases overall game difficulty by modifying various core mechanics. Combat is more demanding, requiring precision and punishing mistakes—encouraging mastery. **All difficulties** are affected by these changes.\n\n" +
      "An optional, **modular** version of the mod is also available, allowing you to choose features more selectively.",
    shortDescription:
      "Comprehensive difficulty overhaul with interconnected mechanical changes—tighter guard windows, tiered Legion costs, and accelerated resource decay.",
    game: "Lies of P",
    category: ["Gameplay"],
    tags: ["Balance Design", "UE4 Modding"],
    techStack: ["UAssetGUI", "repak"],
    features: [
      "Link Dodge (dodge chaining) is **disabled**",
      "Enemy damage to the player **increased** by 20% (with an option for 35%)",
      "Perfect Guard window **reduced**, from 9.3 frames → **6** frames (0.155s → 0.1s)",
      "Guard Regain begins to decay **immediately** and decays at **twice** the normal rate",
      "Legion consumption rate **increased** by 25-65% (depending on arm; see detail below)",
      "Fable gain rate (from attacking) for all weapons **reduced** by 30% (with an option for 50%)",
      "All weight tiers **increased** by one (1) level (Light: 0.3 → 0.15, Normal: 0.6 → 0.3, and so on)",
    ],
    highlights: [
      "Left Arm of Steel: unchanged",
      "Fulminis, Pandemonium, Deus Ex Machina, Falcon Eyes: **+25%**",
      "Puppet String, Flamberge, Icarus: **+40%**",
      "Aegis, Cataclysm: **+65%**",
      {
        text: "Certain arms are more powerful and/or easier to use than others. Fulminis and Pandemonium require skillful timing and positioning—they restrict mobility and cannot be guard canceled. Deus Ex Machina requires time to lay and has a magazine size limitation, while Falcon Eyes already comes with a hefty vanilla Legion cost.",
        paragraph: true,
      },
    ],
    sectionLabels: {
      features: "Default Modifiers",
      highlights: "Legion Arms",
    },
    links: {
      external: "https://www.nexusmods.com/liesofp/mods/304",
    },
    images: {
      thumbnail: "/thumbnails/lies-of-p-hardcore-mode.webp",
      hero: "/projects/lies-of-p-hardcore-mode/hero.webp",
      screenshots: [],
    },
    order: 1,
    featured: false,
  },
];
