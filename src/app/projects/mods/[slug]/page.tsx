import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { DetailHeader } from "@/components/projects/DetailHeader";
import { DetailHeaderCompact } from "@/components/projects/DetailHeaderCompact";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { getBackDestination } from "@/components/projects/utils";
import { mods } from "@/data/mods";
import { FEATURES } from "@/config/features";

interface ModPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    tab?: string;
    from?: string;
  }>;
}

export async function generateStaticParams() {
  // Don't generate static pages when project tabs are disabled
  if (!FEATURES.SHOW_PROJECT_TABS) {
    return [];
  }
  return mods.map((mod) => ({
    slug: mod.slug,
  }));
}

export default async function ModProjectPage({ params, searchParams }: ModPageProps) {
  // Feature flag guard - enforces same access control as UI tab visibility
  if (!FEATURES.SHOW_PROJECT_TABS) {
    notFound();
  }

  const { slug } = await params;
  const { tab, from } = await searchParams;

  const mod = mods.find((m) => m.slug === slug);

  if (!mod) {
    notFound();
  }

  // Preserve tab state from query param, default to 'mods' for mod pages
  const validTabs = ["software", "games", "mods"] as const;
  const currentTab = validTabs.includes(tab as (typeof validTabs)[number])
    ? (tab as (typeof validTabs)[number])
    : "mods";
  const backDest = getBackDestination(from, currentTab);

  // Use hero image if available, then thumbnail, then first screenshot
  const heroImage = mod.images.hero || mod.images.thumbnail || mod.images.screenshots[0]?.src;

  // For mods, prefix title with game name on larger screens
  // Phone uses just the mod title for space
  const fullTitle = mod.game ? `${mod.game}: ${mod.title}` : mod.title;

  return (
    <PageLayout
      stickyHeader
      pageId="project-detail"
      header={
        <DetailHeaderCompact
          title={fullTitle}
          compactTitle={mod.title}
          backHref={backDest.href}
          backLabel={backDest.label}
          links={mod.links}
        />
      }
    >
      <DetailHeader
        title={mod.title}
        categories={mod.game ? [mod.game] : mod.category}
        heroImage={heroImage}
        backHref={backDest.href}
        backLabel={backDest.label}
        links={mod.links}
      />
      <ProjectDetail project={mod} />
    </PageLayout>
  );
}
