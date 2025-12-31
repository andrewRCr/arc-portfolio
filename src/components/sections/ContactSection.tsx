/**
 * ContactSection - Modular component for displaying contact information
 *
 * Renders email and social media links with icons.
 */

import { contact } from "@/data/contact";
import { SocialIcon } from "@/types/contact";
import { Github, Linkedin, Mail, LucideIcon } from "lucide-react";
import { NexusModsIcon } from "@/components/icons/NexusModsIcon";

/** Icon component type that accepts className prop */
type IconComponent = LucideIcon | typeof NexusModsIcon;

// Map icon identifiers to icon components
const iconMap: Record<SocialIcon, IconComponent> = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  nexusmods: NexusModsIcon,
};

export function ContactSection() {
  return (
    <section className="px-8 py-2">
      {/* <h2 className="mb-8 text-3xl font-bold">Contact</h2> */}

      <div className="space-y-8">
        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-muted-foreground" />
          <a href={`mailto:${contact.email}`} className="text-lg text-primary hover:text-primary/80 underline">
            {contact.email}
          </a>
        </div>

        {/* Social Links (excluding email, which is shown above) */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Connect</h3>
          <div className="flex flex-wrap gap-4">
            {contact.socialLinks
              .filter((social) => social.icon !== "mail")
              .map((social) => {
                const IconComponent = iconMap[social.icon];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary hover:bg-accent/10"
                  >
                    <IconComponent className="h-5 w-5 text-foreground" />
                    <span className="font-medium text-foreground">{social.platform}</span>
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
