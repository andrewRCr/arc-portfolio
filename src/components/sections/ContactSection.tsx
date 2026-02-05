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

// Pre-encode email since contact.email is static
const encodedEmail = encodeEmail(contact.email);

/** Compact icon-only style (phone) - toolbar layout with internal dividers */
function CompactContactLinks() {
  const socialLinks = contact.socialLinks.filter((social) => iconMap[social.icon]);

  return (
    <div className="flex border border-border">
      {/* Email - obfuscated mailto button, icon only */}
      <ObfuscatedMailtoButton encoded={encodedEmail} iconOnly className="flex-1 border-r border-border" />

      {/* Social Links - icon only */}
      {socialLinks.map((social, index) => {
        const Icon = iconMap[social.icon]!;
        const isLast = index === socialLinks.length - 1;
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className={`flex flex-1 items-center justify-center bg-accent-mid p-3 text-accent-mid-foreground transition-colors hover:bg-accent-mid-hover hover:text-accent-mid-hover-foreground ${!isLast ? "border-r border-border" : ""}`}
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
    <div className="space-y-4">
      {/* Compact icon links */}
      <CompactContactLinks />
      {/* Contact form */}
      <ContactForm />
    </div>
  );
}

/** Full-width toolbar links with text labels (desktop/tablet) - similar to mobile but with labels */
function ToolbarContactLinks() {
  const socialLinks = contact.socialLinks.filter((social) => iconMap[social.icon]);

  return (
    <div className="flex border border-border-strong">
      {/* Email - obfuscated mailto button */}
      <ObfuscatedMailtoButton encoded={encodedEmail} className="flex-1 justify-center border-r border-border-strong" />

      {/* Social Links */}
      {socialLinks.map((social, index) => {
        const Icon = iconMap[social.icon]!;
        const isLast = index === socialLinks.length - 1;
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-1 items-center justify-center gap-1.5 bg-accent-mid px-3 py-2 font-terminal text-sm text-accent-mid-foreground transition-colors hover:bg-accent-mid-hover hover:text-accent-mid-hover-foreground ${!isLast ? "border-r border-border-strong" : ""}`}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{social.platform}</span>
          </a>
        );
      })}
    </div>
  );
}

/** Desktop layout - toolbar links above form card with gap */
function DesktopContactSection() {
  return (
    <div className="mx-auto max-w-xl space-y-8 pt-6">
      {/* Toolbar - social links as separate element */}
      <ToolbarContactLinks />
      {/* Form card with header and body sections */}
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Header section */}
        <div className="bg-surface-card px-6 py-3">
          <p className="text-sm font-terminal text-muted-foreground">[COMPOSE MSG]</p>
        </div>
        {/* Body section - form */}
        <div className="bg-surface-background px-6 pt-6 pb-6">
          <ContactForm variant="card" />
        </div>
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
