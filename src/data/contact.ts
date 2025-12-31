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
      platform: "Email",
      url: "mailto:andrew.creekmore@me.com",
      icon: "mail",
    },
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
      icon: "nexusmods",
    },
  ],
};
