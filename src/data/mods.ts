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
    projectType: "mod",
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
    details: [
      "Left Arm of Steel: **unchanged**",
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
      details: "Legion Arms",
    },
    links: {
      nexusmods: "https://www.nexusmods.com/liesofp/mods/304",
    },
    images: {
      thumbnail: "/thumbnails/lies-of-p-hardcore-mode.webp",
      hero: "/projects/lies-of-p-hardcore-mode/hero.webp",
      screenshots: [],
    },
    order: 3,
    featured: true,
  },

  // ==========================================
  // STREETS OF RAGE 4 - IMPROVED MOVEMENT
  // ==========================================
  {
    projectType: "mod",
    title: "Improved Movement",
    slug: "sor4-improved-movement",
    description:
      "This mod increases the base movement speed for all playable characters (10% by default), and addresses a common fan criticism: that Axel and Blaze - who could sprint in Streets of Rage 3 - seem to have forgotten how to do so in this installment. While other non-heavyweight characters all have *some* type of mobility move, these two (plus Estel) have nothing mapped to that input. The **EX** version of this mod enables running for all three, addressing what many players felt was an unnecessary regression.\n\n" +
      "**New running sprites** for these characters are provided in the **EX** versions of the mod. Versions for each character's **default color palette + all 3 alternate palettes** are included.\n\n" +
      "Credit for the new artwork goes to [Rounak](https://www.fiverr.com/rounakdraws) (Axel / Blaze) and [Sandwitch](https://www.fiverr.com/sandwwitch) (Estel), whom I commissioned after creating the gameplay side of the mod.",
    shortDescription:
      "Movement speed boost (10-30%) options for all characters, plus enabled sprinting for SoR4 Axel, Blaze, and Estel with custom sprites.",
    game: "Streets of Rage 4",
    category: ["Gameplay"],
    tags: ["Game Modding"],
    techStack: ["Pandora's Box", "SOR4 Explorer"],
    features: [
      {
        text: "10%, 20% and 30% increased speed options are available both with and without sprinting enabled for SoR4 Axel / Blaze / Estel. The adjustments to base move speed affect **all** playable characters - both SoR4 and retro. These increases affect **both walk and run** speed, where relevant (i.e., the run speed increase is only for Cherry, SoR2 Skate, and SoR3 characters in the non-EX versions).",
        paragraph: true,
      },
    ],
    details: [
      {
        text: "The following mods offer compatibility patches for Improved Movement EX:",
        paragraph: true,
      },
      "[Streets of Rage 4: REIGNITED](https://www.nexusmods.com/streetsofrage4/mods/133) by [fuzzyetdeadly](https://github.com/fuzzyetdeadly) and the SoulFire team",
      "[Repeated Enemies Swap](https://www.nexusmods.com/streetsofrage4/mods/200) by [FallenR](https://next.nexusmods.com/profile/FallenR)",
      "[Blaze Biker Outfit](https://www.nexusmods.com/streetsofrage4/mods/183) by [Laast](https://next.nexusmods.com/profile/Laast)",
      "[Blaze with Tifa's Colors and Sounds](https://www.nexusmods.com/streetsofrage4/mods/184) by [fuzzyetdeadly](https://github.com/fuzzyetdeadly)",
      "[SoR 4 Young Axel](https://www.nexusmods.com/streetsofrage4/mods/87) by [djdndiWLr](https://next.nexusmods.com/profile/djdndiWLr) (use [patch](https://www.nexusmods.com/streetsofrage4/mods/202) by [FallenR](https://next.nexusmods.com/profile/FallenR))",
      "[SoR 4 Estel Color Grading](https://www.nexusmods.com/streetsofrage4/mods/88) by [djdndiWLr](https://next.nexusmods.com/profile/djdndiWLr) (use [patch](https://www.nexusmods.com/streetsofrage4/mods/202) by [FallenR](https://next.nexusmods.com/profile/FallenR))",
      { text: "**Acknowledgements:**", heading: true },
      "[Rounak](https://www.fiverr.com/rounakdraws) (Axel / Blaze) and [Sandwitch](https://www.fiverr.com/sandwwitch) (Estel) for the new running sprites",
      "[fuzzyetdeadly](https://github.com/fuzzyetdeadly) and the SoulFire team for [Pandora's Box](https://www.nexusmods.com/streetsofrage4/mods/174)",
      "[jlcebrian](https://github.com/jlcebrian), [xinyingho](https://github.com/xinyingho), and [AyanamiRei0](https://github.com/AyanamiRei1) for [SOR4 Explorer](https://gamebanana.com/tools/7297)",
    ],
    sectionLabels: {
      features: "Mod Options",
      details: "Community Compatibility Patches",
    },
    links: {
      nexusmods: "https://www.nexusmods.com/streetsofrage4/mods/178",
    },
    images: {
      thumbnail: "/thumbnails/sor4-improved-movement.webp",
      hero: "/projects/sor4-improved-movement/hero.webp",
      screenshots: [],
    },
    order: 4,
    featured: true,
  },

  // ==========================================
  // RESIDENT EVIL VILLAGE - AIM-DEPENDENT CROSSHAIR
  // ==========================================
  {
    projectType: "mod",
    title: "Aim-Dependent Crosshair",
    slug: "re8-aim-dependent-crosshair",
    description:
      "Previous entries in the series—RE7 (also first-person) and the recent third-person remakes—hide the crosshair when not aiming by default. Village shipped without this, and the persistent on-screen reticle was a common complaint. This REFramework Lua script addresses the omission by reverse-engineering how GUI elements are drawn and intercepting reticle rendering based on configurable game-state conditions.\n\n" +
      "Supports both first and third-person perspectives, as well as the Shadows of Rose DLC.",
    shortDescription:
      "Prevents the crosshair reticle from being drawn unless configurable conditions (aiming, in combat, not sprinting) are met.",
    game: "Resident Evil Village",
    category: ["Gameplay"],
    tags: ["Game Modding", "Lua"],
    techStack: ["Lua", "REFramework"],
    features: [
      "Disable crosshair whenever not aiming (default behavior **out** of combat)",
      "Disable crosshair only when sprinting (default behavior **in** combat)",
      "Options configurable live in-game via REFramework script-generated UI",
    ],
    sectionLabels: {
      features: "Mod Options",
    },
    links: {
      nexusmods: "https://www.nexusmods.com/residentevilvillage/mods/403",
    },
    images: {
      thumbnail: "/thumbnails/re8-aim-dependent-crosshair.webp",
      hero: "/projects/re8-aim-dependent-crosshair/hero.webp",
      screenshots: [],
    },
    order: 5,
    featured: true,
  },

  // ==========================================
  // ELDEN RING - GUARD PARRY
  // ==========================================
  {
    projectType: "mod",
    title: "Guard Parry",
    slug: "elden-ring-guard-parry",
    description:
      "Adds timed-block parries to small/standard shields and most weapons capable of guarding—activating instantly, with **variable** active frames per weapon class. For balance, guarding now has new **recovery frames** as well. Updated with full support for Shadow of the Erdtree, including Deflecting Hardtear integration.",
    shortDescription:
      "Timed-block parries added to small/standard shields and most guarding weapons, with variable active frames per weapon class and new guard recovery frames for balance.",
    game: "Elden Ring",
    category: ["Gameplay"],
    tags: ["Game Modding", "Animation Editing"],
    techStack: ["DS Anim Studio", "UXM"],
    features: [
      "Parry frames added to the start of guard animations (4-6 frames depending on weapon class)",
      "Recovery frames (9-12) added to guard raising as light spam protection",
      "Deflecting Hardtear extends parry window (+1 frame, optional) for the duration",
      "Extended version available with 7 parry frames for all weapon classes including greatshields",
      "[The Convergence](https://www.nexusmods.com/eldenring/mods/3419) compatibility version available",
    ],
    details: [
      "**6 frames**: Small shields, straight swords, curved swords, katanas, thrusting swords, light greatswords, reverse-hand swords, daggers, whips, axes, flails, hammers, throwing blades, hand-to-hand arts, beast claws",
      "**5 frames**: Thrusting shields, spears, twinblades, halberds, reapers, great spears",
      "**4 frames**: Standard shields, greatswords, curved greatswords, great katanas, great axes, great hammers, colossal weapons",
    ],
    sectionLabels: {
      features: "Key Features",
      details: "Parry Frame Data",
    },
    links: {
      nexusmods: "https://www.nexusmods.com/eldenring/mods/5128",
    },
    images: {
      thumbnail: "/thumbnails/elden-ring-guard-parry.webp",
      hero: "/projects/elden-ring-guard-parry/hero.webp",
      screenshots: [],
    },
    order: 2,
    featured: true,
  },

  // ==========================================
  // RESIDENT EVIL 4 REMAKE - IMPROVED WEAPON BALANCE
  // ==========================================
  {
    projectType: "mod",
    title: "Improved Weapon Balance",
    slug: "re4r-improved-weapon-balance",
    description:
      "Comprehensive weapon balance overhaul with targeted, conservative adjustments across all weapon categories. Each weapon has been tuned to feel more distinct and competitive - leaning into existing strengths rather than homogenizing. This addresses a common fan criticism: that certain weapons are either somewhat underpowered (when compared with other options) or lack a compelling identity to encourage their use on repeat playthroughs. \n\n" +
      "Balanced around Professional difficulty.",
    shortDescription:
      "Targeted adjustments to weapons making each one feel competitive and distinct, while improving overall balance. Multiple versions and add-ons available.",
    game: "Resident Evil 4 (2023)",
    category: ["Gameplay"],
    tags: ["Game Modding", "Balance Design"],
    techStack: ["010 Editor", "RszTool", "REtool", "REMSG_Converter"],
    features: [
      "Damage curves selectively front-loaded; exclusive multipliers reduced with cost adjusted accordingly",
      "Secondary stats (wince, break, stopping power, critical rate) tuned per weapon identity",
      "Spread patterns, precision, and reticle bloom refined where needed",
      "Covers 25+ weapons across 8 categories: knives, handguns, shotguns, SMGs, rifles, magnums, special, and Separate Ways exclusives",
    ],
    details: [
      "**Lite version**: Buff-only adjustments (no nerfs)",
      "**Overhaul support**: Also available as a dedicated, custom-built add-on for [Berserker](https://www.nexusmods.com/residentevil42023/mods/2346), [Valkyrie](https://www.nexusmods.com/residentevil42023/mods/2564), and [Befalling of Night](https://www.nexusmods.com/residentevil42023/mods/2385)",
      "**DLC support**: Separate Ways included; Mercenaries via optional add-on",
      "Multiple optional add-ons for granular control (Riot Gun nerf restoration, vanilla CQBR fire rate, etc.) + additional features",
      { text: "**Acknowledgements:**", heading: true },
      "[elsuperaguas](https://next.nexusmods.com/profile/elsuperaguas) for the toggle-able Blacktail laser weapon model (included with permission)",
      "[bloocobalt](https://next.nexusmods.com/profile/bloocobalt) for the Riot Gun weapon model magazine tube extension (included with permission)",
      "[Rabbit-TooneedIM](https://www.nexusmods.com/residentevil42023/users/66480841) for [Berserker](https://www.nexusmods.com/residentevil42023/mods/2346) + [Valkyrie](https://www.nexusmods.com/residentevil42023/mods/2564) (IWB add-ons built with permission)",
      "[TSprmy](https://www.nexusmods.com/residentevil42023/users/179145156) for [Befalling of Night](https://www.nexusmods.com/residentevil42023/mods/2385) (IWB add-on built with permission)",
      "[dtlnor](https://github.com/dtlnor) for [REMSG_Converter](https://github.com/dtlnor/REMSG_Converter)",
      "[chenstack](https://next.nexusmods.com/profile/chenstack) for [RszTool](https://www.nexusmods.com/residentevil42023/mods/2246)",
      "[alphaZomega](https://next.nexusmods.com/profile/alphaZomega) for their many RE Engine [tools](https://github.com/alphazolam) and contributions to the community",
    ],
    sectionLabels: {
      features: "Adjustment Philosophy",
      details: "Versions & Compatibility",
    },
    links: {
      nexusmods: "https://www.nexusmods.com/residentevil42023/mods/3016",
    },
    images: {
      thumbnail: "/thumbnails/re4r-improved-weapon-balance.webp",
      hero: "/projects/re4r-improved-weapon-balance/hero.webp",
      screenshots: [],
    },
    order: 1,
    featured: true,
  },

  // ==========================================
  // SILENT HILL 2 REMAKE - NEVER HOLSTER WEAPONS
  // ==========================================
  {
    projectType: "mod",
    title: "Never Holster Weapons",
    slug: "sh2r-never-holster-weapons",
    description:
      "Prevents the automatic weapon holstering triggered by the game's internal 'player safety' state detection—holstering based on enemy proximity the **character** has no way of knowing, which some players find immersion breaking.\n\n" +
      "Since the holster delay parameter wasn't directly exposed, two workaround approaches are provided: one manipulates the danger-state threshold (seamless but affects companion AI locomotion), the other blocks the holster animation directly (no side effects but less automatic). Players choose based on their tolerance for trade-offs.\n\n" +
      "Routine gameplay actions (opening the map, unlocking doors, cutscene transitions, etc) which **bypass** the holstering animation still result in your weapon being put away temporarily; the difference lies in what happens afterward.",
    shortDescription:
      "Prevents automatic weapon holstering when no enemies are detected. Two versions available, each working around the unexposed holster delay parameter differently.",
    game: "Silent Hill 2 (2024)",
    category: ["Gameplay"],
    tags: ["Game Modding", "UE5 Modding"],
    techStack: ["UAssetGUI", "Retoc", "ZenTools", "IoStorePackagev2"],
    features: [
      { text: "**Automatic Version**", heading: true },
      "Manipulates the danger-state threshold so James never considers himself 'safe'; weapon unholsters immediately after routine actions, without requiring player input",
      "Trade-off: Maria plays distressed locomotion/dialogue out of context; James never fully relaxes in idle animations",
      { text: "**Manual Version**", heading: true },
      "Blocks the holster animation directly with no side effects on companion AI or player animations",
      "Trade-off: after routine actions, you must manually re-equip via weapon select key (or aiming, for firearms)",
    ],
    sectionLabels: {
      features: "Approach Comparison",
    },
    links: {
      nexusmods: "https://www.nexusmods.com/silenthill2/mods/199",
    },
    images: {
      thumbnail: "/thumbnails/sh2r-never-holster-weapons.webp",
      hero: "/projects/sh2r-never-holster-weapons/hero.webp",
      screenshots: [],
    },
    order: 6,
    featured: false,
  },
];
