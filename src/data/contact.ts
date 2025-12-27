/**
 * Contact information migrated from Squarespace
 *
 * Includes email and 3 social/professional links.
 * Icon identifiers will be used with lucide-react or similar icon library.
 */

import { Contact } from "@/types/contact";

export const contact: Contact = {
  email: "andrew.creekmore@me.com",

  socialLinks: [
    {
      platform: "GitHub",
      url: "https://github.com/andrewRCr",
      icon: "github",
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/andrewRCr",
      icon: "linkedin",
    },
    {
      platform: "NexusMods",
      url: "https://next.nexusmods.com/profile/andrewRCr/mods",
      icon: "package", // Generic icon for modding platform (or could use "external-link")
    },
  ],
};
