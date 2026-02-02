import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { DetailHeader, type DetailHeaderStats } from "@/components/projects/DetailHeader";
import { DetailHeaderCompact } from "@/components/projects/DetailHeaderCompact";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { PhotoCredits } from "@/components/projects/PhotoCredits";
import { getBackDestination } from "@/components/projects/utils";
import { projects } from "@/data/projects";
import { getModStatsBySlug } from "@/app/actions/nexusmods";
import { isModStatsError } from "@/lib/nexusmods-types";
import { getHeroImage } from "@/lib/project-utils";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    tab?: string;
    from?: string;
  }>;
}

// Software route only serves software projects
const softwareProjects = projects.filter((p) => p.projectType === "software");

export async function generateStaticParams() {
  return softwareProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function SoftwareProjectPage({ params, searchParams }: ProjectPageProps) {
  const { slug } = await params;
  const { tab, from } = await searchParams;

  // Only find in software (non-game) projects
  const project = softwareProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Preserve tab state from query param, default to 'software'
  const validTabs = ["software", "games", "mods"] as const;
  const currentTab = validTabs.includes(tab as (typeof validTabs)[number])
    ? (tab as (typeof validTabs)[number])
    : "software";
  const backDest = getBackDestination(from, currentTab);

  const heroImage = getHeroImage(project.images);

  // Fetch NexusMods stats if project has a NexusMods link (e.g., DOOM NG+ Customizer)
  let stats: DetailHeaderStats | undefined;
  if (project.links?.nexusmods) {
    const statsResult = await getModStatsBySlug(slug);
    if (!isModStatsError(statsResult)) {
      stats = {
        downloads: statsResult.downloads,
        uniqueDownloads: statsResult.uniqueDownloads,
        endorsements: statsResult.endorsements,
      };
    }
  }

  return (
    <PageLayout
      stickyHeader
      pageId="project-detail"
      header={
        <DetailHeaderCompact
          title={project.title}
          compactTitle={project.compactTitle}
          backHref={backDest.href}
          backLabel={backDest.label}
          links={project.links}
        />
      }
    >
      <DetailHeader
        title={project.title}
        categories={project.category}
        heroImage={heroImage}
        backHref={backDest.href}
        backLabel={backDest.label}
        links={project.links}
        stats={stats}
        metadata={{
          teamSize: project.teamSize,
          teamSizeCompact: project.teamSizeCompact,
          role: project.role,
          developmentTime: project.developmentTime,
          developmentTimeCompact: project.developmentTimeCompact,
        }}
      />
      <ProjectDetail
        project={project}
        footer={
          project.photoCredits && project.photoCredits.length > 0 && <PhotoCredits credits={project.photoCredits} />
        }
      />
    </PageLayout>
  );
}
