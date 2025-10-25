/**
 * ContactSection - Modular component for displaying contact information
 *
 * Renders email and social media links with icons.
 * Designed to be reusable across multiple pages (e.g., /contact, homepage).
 */

import { contact } from "@/data/contact";
import { Github, Linkedin, Package, Mail } from "lucide-react";

// Map icon identifiers to lucide-react components
const iconMap = {
  github: Github,
  linkedin: Linkedin,
  package: Package,
};

export function ContactSection() {
  return (
    <section className="p-8">
      <h2 className="mb-8 text-3xl font-bold">Contact</h2>

      <div className="space-y-8">
        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-gray-600" />
          <a href={`mailto:${contact.email}`} className="text-lg text-blue-600 hover:text-blue-800 underline">
            {contact.email}
          </a>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Connect</h3>
          <div className="flex flex-wrap gap-4">
            {contact.socialLinks.map((social) => {
              const IconComponent = iconMap[social.icon as keyof typeof iconMap];
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 transition-colors hover:border-blue-500 hover:bg-blue-50"
                >
                  {IconComponent && <IconComponent className="h-5 w-5 text-gray-700" />}
                  <span className="font-medium text-gray-900">{social.platform}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
