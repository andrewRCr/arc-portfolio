/**
 * Skill icon utilities using simple-icons package
 *
 * Provides SVG data for technology logos by slug identifier.
 * Uses lazy-initialized lookup map for efficient slug-based retrieval.
 * Includes custom icons for technologies not in simple-icons.
 */

import * as simpleIcons from "simple-icons";

/**
 * Icon data returned from simple-icons or custom icons
 */
export interface SkillIconData {
  title: string;
  slug: string;
  path: string;
  hex: string;
  /** SVG viewBox - defaults to "0 0 24 24" for simple-icons */
  viewBox?: string;
}

/**
 * Custom icons not available in simple-icons
 * Format matches simple-icons for consistent rendering
 * Sources:
 * - C#: devicon (MIT license) https://devicon.dev/
 * - OpenAI: Wikimedia Commons (CC0) https://commons.wikimedia.org/wiki/File:OpenAI_logo_2025_(symbol).svg
 */
const customIcons: Record<string, SkillIconData> = {
  csharp: {
    title: "C#",
    slug: "csharp",
    // Source: https://github.com/devicons/devicon - MIT License
    viewBox: "0 0 128 128",
    path: "M117.5 33.5l.3-.2c-.6-1.1-1.5-2.1-2.4-2.6L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.3.9 3.4l-.2.1c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c.1-.8 0-1.7-.4-2.6zm-53.5 70c-21.8 0-39.5-17.7-39.5-39.5S42.2 24.5 64 24.5c14.7 0 27.5 8.1 34.3 20l-13 7.5C81.1 44.5 73.1 39.5 64 39.5c-13.5 0-24.5 11-24.5 24.5s11 24.5 24.5 24.5c9.1 0 17.1-5 21.3-12.4l12.9 7.6c-6.8 11.8-19.6 19.8-34.2 19.8zM115 62h-3.2l-.9 4h4.1v5h-5l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6H94v-5h3.5l.9-4H94v-5h5.3l1.2-6h4.9l-1.2 6h3.8l1.2-6h4.8l-1.2 6h2.2v5zm-12.7 4h3.8l.9-4h-3.8z",
    hex: "68217A",
  },
  openai: {
    title: "OpenAI",
    slug: "openai",
    // Source: Wikimedia Commons (CC0) - official OpenAI brand asset
    viewBox: "0 0 159 158",
    path: "M60.8734,57.2556v-14.9432c0-1.2586.4722-2.2029,1.5728-2.8314l30.0443-17.3023c4.0899-2.3593,8.9662-3.4599,13.9988-3.4599,18.8759,0,30.8307,14.6289,30.8307,30.2006,0,1.1007,0,2.3593-.158,3.6178l-31.1446-18.2467c-1.8872-1.1006-3.7754-1.1006-5.6629,0l-39.4812,22.9651ZM131.0276,115.4561v-35.7074c0-2.2028-.9446-3.7756-2.8318-4.8763l-39.481-22.9651,12.8982-7.3934c1.1007-.6285,2.0453-.6285,3.1458,0l30.0441,17.3024c8.6523,5.0341,14.4708,15.7296,14.4708,26.1107,0,11.9539-7.0769,22.965-18.2461,27.527v.0021ZM51.593,83.9964l-12.8982-7.5497c-1.1007-.6285-1.5728-1.5728-1.5728-2.8314v-34.6048c0-16.8303,12.8982-29.5722,30.3585-29.5722,6.607,0,12.7403,2.2029,17.9324,6.1349l-30.987,17.9324c-1.8871,1.1007-2.8314,2.6735-2.8314,4.8764v45.6159l-.0014-.0015ZM79.3562,100.0403l-18.4829-10.3811v-22.0209l18.4829-10.3811,18.4812,10.3811v22.0209l-18.4812,10.3811ZM91.2319,147.8591c-6.607,0-12.7403-2.2031-17.9324-6.1344l30.9866-17.9333c1.8872-1.1005,2.8318-2.6728,2.8318-4.8759v-45.616l13.0564,7.5498c1.1005.6285,1.5723,1.5728,1.5723,2.8314v34.6051c0,16.8297-13.0564,29.5723-30.5147,29.5723v.001ZM53.9522,112.7822l-30.0443-17.3024c-8.652-5.0343-14.471-15.7296-14.471-26.1107,0-12.1119,7.2356-22.9652,18.403-27.5272v35.8634c0,2.2028.9443,3.7756,2.8314,4.8763l39.3248,22.8068-12.8982,7.3938c-1.1007.6287-2.045.6287-3.1456,0ZM52.2229,138.5791c-17.7745,0-30.8306-13.3713-30.8306-29.8871,0-1.2585.1578-2.5169.3143-3.7754l30.987,17.9323c1.8871,1.1005,3.7757,1.1005,5.6628,0l39.4811-22.807v14.9435c0,1.2585-.4721,2.2021-1.5728,2.8308l-30.0443,17.3025c-4.0898,2.359-8.9662,3.4605-13.9989,3.4605h.0014ZM91.2319,157.296c19.0327,0,34.9188-13.5272,38.5383-31.4594,17.6164-4.562,28.9425-21.0779,28.9425-37.908,0-11.0112-4.719-21.7066-13.2133-29.4143.7867-3.3035,1.2595-6.607,1.2595-9.909,0-22.4929-18.2471-39.3247-39.3251-39.3247-4.2461,0-8.3363.6285-12.4262,2.045-7.0792-6.9213-16.8318-11.3254-27.5271-11.3254-19.0331,0-34.9191,13.5268-38.5384,31.4591C11.3255,36.0212,0,52.5373,0,69.3675c0,11.0112,4.7184,21.7065,13.2125,29.4142-.7865,3.3035-1.2586,6.6067-1.2586,9.9092,0,22.4923,18.2466,39.3241,39.3248,39.3241,4.2462,0,8.3362-.6277,12.426-2.0441,7.0776,6.921,16.8302,11.3251,27.5271,11.3251Z",
    hex: "000000",
  },
};

// Lazy-initialized lookup map by slug
let iconsBySlug: Map<string, SkillIconData> | null = null;

/**
 * Build lookup map from simple-icons exports and custom icons
 * Called once on first use, then cached
 */
function getIconMap(): Map<string, SkillIconData> {
  if (iconsBySlug) return iconsBySlug;

  iconsBySlug = new Map();

  // Add simple-icons
  for (const icon of Object.values(simpleIcons)) {
    // simple-icons exports include non-icon properties, filter them
    if (icon && typeof icon === "object" && "slug" in icon && "path" in icon) {
      const iconData = icon as SkillIconData;
      iconsBySlug.set(iconData.slug, iconData);
    }
  }

  // Add custom icons (override simple-icons if same slug)
  for (const [slug, iconData] of Object.entries(customIcons)) {
    iconsBySlug.set(slug, iconData);
  }

  return iconsBySlug;
}

/**
 * Get icon data by slug
 *
 * @param slug - Icon slug (e.g., "typescript", "react", "csharp")
 * @returns Icon data with title, slug, path, hex - or null if not found
 *
 * @example
 * const icon = getSkillIcon("typescript");
 * if (icon) {
 *   // Use icon.path for SVG, icon.hex for brand color
 * }
 */
export function getSkillIcon(slug: string): SkillIconData | null {
  const map = getIconMap();
  return map.get(slug) ?? null;
}

/**
 * Check if an icon exists for a given slug
 *
 * @param slug - Icon slug to check
 * @returns true if icon exists
 */
export function hasSkillIcon(slug: string): boolean {
  return getIconMap().has(slug);
}
