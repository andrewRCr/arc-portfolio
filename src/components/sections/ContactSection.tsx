/**
 * ContactSection - Modular component for displaying contact information
 *
 * Renders contact links row followed by contact form.
 * Uses ResponsiveSwitch for icon-only links on phone, full buttons on tablet+.
 */

import { contact } from "@/data/contact";
import { SocialIcon } from "@/types/contact";
import { Github, Linkedin, LucideIcon } from "lucide-react";
import { NexusModsIcon } from "@/components/icons/NexusModsIcon";
import { ContactForm } from "@/components/contact/ContactForm";
import { ObfuscatedMailtoButton } from "@/components/contact/ObfuscatedMailtoButton";
import { encodeEmail } from "@/lib/email-utils";
import { ResponsiveSwitch } from "@/components/ui/ResponsiveSwitch";

/** Icon component type that accepts className prop */
type IconComponent = LucideIcon | typeof NexusModsIcon;

// Map icon identifiers to icon components
const iconMap: Partial<Record<SocialIcon, IconComponent>> = {
  github: Github,
  linkedin: Linkedin,
  nexusmods: NexusModsIcon,
};

/** Full button style with icon + label (tablet+) */
function FullContactLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Email - obfuscated mailto button */}
      <ObfuscatedMailtoButton encoded={encodeEmail(contact.email)} />

      {/* Social Links */}
      {contact.socialLinks
        .filter((social) => iconMap[social.icon])
        .map((social) => {
          const Icon = iconMap[social.icon]!;
          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-accent px-4 py-3 text-accent transition-colors hover:bg-accent/10"
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{social.platform}</span>
            </a>
          );
        })}
    </div>
  );
}

/** Compact icon-only style (phone) */
function CompactContactLinks() {
  return (
    <div className="flex justify-center gap-4">
      {/* Email - obfuscated mailto button, icon only */}
      <ObfuscatedMailtoButton encoded={encodeEmail(contact.email)} iconOnly />

      {/* Social Links - icon only */}
      {contact.socialLinks
        .filter((social) => iconMap[social.icon])
        .map((social) => {
          const Icon = iconMap[social.icon]!;
          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
              className="rounded-lg border border-accent p-3 text-accent transition-colors hover:bg-accent/10"
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
    </div>
  );
}

/** Mobile layout - no card, just stacked with breathing room */
function MobileContactSection() {
  return (
    <div className="space-y-5">
      {/* Compact icon links */}
      <CompactContactLinks />
      {/* Contact form */}
      <ContactForm />
    </div>
  );
}

/** Desktop layout - card with social links header, form body */
function DesktopContactSection() {
  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-lg border border-border-strong">
      {/* Header - social links */}
      <div className="flex justify-center bg-card/80 px-4 py-4">
        <FullContactLinks />
      </div>
      {/* Body - contact form */}
      <div className="bg-background/80 px-6 py-6">
        <ContactForm variant="card" />
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section className="px-0 md:px-4">
      <ResponsiveSwitch breakpoint="sm" mobile={<MobileContactSection />} desktop={<DesktopContactSection />} />
    </section>
  );
}
