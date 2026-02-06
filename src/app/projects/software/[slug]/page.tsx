import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { DetailHeader, type DetailHeaderStats } from "@/components/projects/DetailHeader";
import { DetailHeaderCompact } from "@/components/projects/DetailHeaderCompact";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { PhotoCredits } from "@/components/projects/PhotoCredits";
import { projects } from "@/data/projects";
import { getModStatsBySlug } from "@/app/actions/nexusmods";
import { isModStatsError } from "@/lib/nexusmods-types";
import { getHeroImage } from "@/lib/project-utils";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Software route only serves software projects
const softwareProjects = projects.filter((p) => p.projectType === "software");

export async function generateStaticParams() {
  return softwareProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function SoftwareProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  // Only find in software (non-game) projects
  const project = softwareProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

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
          defaultTab="software"
          links={project.links}
        />
      }
    >
      <DetailHeader
        title={project.title}
        status={project.status}
        categories={project.category}
        heroImage={heroImage}
        defaultTab="software"
        links={project.links}
        stats={stats}
        metadata={{
          teamRole: project.teamRole,
          teamRoleCompact: project.teamRoleCompact,
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
