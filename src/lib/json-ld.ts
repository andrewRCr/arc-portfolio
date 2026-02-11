/**
 * JSON-LD structured data builders for SEO.
 *
 * Generates Schema.org objects consumed by search engines for rich results.
 * Data sourced from SITE config (single source of truth).
 */

import { SITE, SOCIAL_LINKS } from "@/config/site";

/** Person schema for home and about pages. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.jobTitle,
    url: SITE.url,
    sameAs: SOCIAL_LINKS.map((link) => link.url),
  };
}

/**
 * BreadcrumbList schema for project detail pages.
 *
 * Breadcrumb hierarchy: Home → Projects → {category} → {project title}.
 * Category links to /projects (tab-based navigation, no separate category pages).
 * Last item (current page) omits URL per Google guidelines.
 */
export function breadcrumbJsonLd(category: string, projectTitle: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE.url}/projects` },
      { "@type": "ListItem", position: 3, name: category, item: `${SITE.url}/projects` },
      { "@type": "ListItem", position: 4, name: projectTitle },
    ],
  };
}
