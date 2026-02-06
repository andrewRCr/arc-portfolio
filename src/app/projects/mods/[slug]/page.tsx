import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { DetailHeader } from "@/components/projects/DetailHeader";
import { DetailHeaderCompact } from "@/components/projects/DetailHeaderCompact";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { DetailCard } from "@/components/projects/DetailCard";
import { getBackDestination } from "@/components/projects/utils";
import { TextLink } from "@/components/common/TextLink";
import { mods } from "@/data/mods";
import { FEATURES } from "@/config/features";
import { getModStatsBySlug } from "@/app/actions/nexusmods";
import { isModStatsError } from "@/lib/nexusmods-types";
import { getHeroImage } from "@/lib/project-utils";

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
  if (!FEATURES.SHOW_ALL_PROJECT_TYPES) {
    return [];
  }
  return mods.map((mod) => ({
    slug: mod.slug,
  }));
}

export default async function ModProjectPage({ params, searchParams }: ModPageProps) {
  // Feature flag guard - enforces same access control as UI tab visibility
  if (!FEATURES.SHOW_ALL_PROJECT_TYPES) {
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

  const heroImage = getHeroImage(mod.images);

  // For mods, prefix title with game name on larger screens
  // Phone uses just the mod title for space
  const fullTitle = mod.game ? `${mod.game}: ${mod.title}` : mod.title;

  // Fetch NexusMods stats (cached server-side) - only if mod has NexusMods link
  const statsResult = mod.links?.nexusmods ? await getModStatsBySlug(slug) : undefined;
  const stats =
    statsResult && !isModStatsError(statsResult)
      ? {
          downloads: statsResult.downloads,
          uniqueDownloads: statsResult.uniqueDownloads,
          endorsements: statsResult.endorsements,
        }
      : undefined;

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
        status={mod.status}
        categories={mod.game ? [mod.game] : mod.category}
        heroImage={heroImage}
        backHref={backDest.href}
        backLabel={backDest.label}
        links={mod.links}
        stats={stats}
      />
      <ProjectDetail
        project={mod}
        footer={
          mod.links?.nexusmods && (
            <DetailCard title="More Information" className="mt-8">
              <p className="text-muted-foreground">
                For compatibility details, installation instructions, and additional information, visit the{" "}
                <TextLink href={mod.links.nexusmods}>NexusMods page</TextLink>.
              </p>
            </DetailCard>
          )
        }
      />
    </PageLayout>
  );
}
