import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { DetailHeader } from "@/components/projects/DetailHeader";
import { DetailHeaderCompact } from "@/components/projects/DetailHeaderCompact";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { getBackDestination } from "@/components/projects/utils";
import { projects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    tab?: string;
    from?: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function SoftwareProjectPage({ params, searchParams }: ProjectPageProps) {
  const { slug } = await params;
  const { tab, from } = await searchParams;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Preserve tab state from query param, default to 'software'
  const currentTab = tab === "mods" ? "mods" : "software";
  const backDest = getBackDestination(from, currentTab);

  // Use thumbnail as hero, fallback to first screenshot if available
  const heroImage = project.images.thumbnail || project.images.screenshots[0]?.src;

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
      />
      <ProjectDetail project={project} />
    </PageLayout>
  );
}
