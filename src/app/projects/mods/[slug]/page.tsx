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
  // Don't generate static pages when mods tab is disabled
  if (!FEATURES.SHOW_MODS_TAB) {
    return [];
  }
  return mods.map((mod) => ({
    slug: mod.slug,
  }));
}

export default async function ModProjectPage({ params, searchParams }: ModPageProps) {
  // Feature flag guard - enforces same access control as UI tab visibility
  if (!FEATURES.SHOW_MODS_TAB) {
    notFound();
  }

  const { slug } = await params;
  const { tab, from } = await searchParams;

  const mod = mods.find((m) => m.slug === slug);

  if (!mod) {
    notFound();
  }

  // Preserve tab state from query param, default to 'mods' for mod pages
  const currentTab = tab === "software" ? "software" : "mods";
  const backDest = getBackDestination(from, currentTab);

  // Use thumbnail as hero, fallback to first screenshot if available
  const heroImage = mod.images.thumbnail || mod.images.screenshots[0]?.src;

  return (
    <PageLayout
      stickyHeader
      pageId="project-detail"
      header={
        <DetailHeaderCompact title={mod.title} backHref={backDest.href} backLabel={backDest.label} links={mod.links} />
      }
    >
      <DetailHeader
        title={mod.title}
        categories={mod.category}
        heroImage={heroImage}
        backHref={backDest.href}
        backLabel={backDest.label}
        links={mod.links}
      />
      <ProjectDetail project={mod} />
    </PageLayout>
  );
}
