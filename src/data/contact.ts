/**
 * Sample contact data demonstrating Contact interface usage
 *
 * In Phase 2, this will be replaced with actual email and social links.
 * Currently expecting: email + 4 social links (GitHub, LinkedIn, etc.)
 */

import { Contact } from "@/types/contact";

export const contact: Contact = {
  // Contact email address
  email: "sample@example.com",

  // Array of social media and professional network links
  socialLinks: [
    {
      platform: "GitHub",
      url: "https://github.com/username",
      icon: "github", // Icon identifier for rendering
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/username",
      icon: "linkedin",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/username",
      icon: "twitter",
    },
    {
      platform: "Email",
      url: "mailto:sample@example.com",
      icon: "mail",
    },
  ],
};
