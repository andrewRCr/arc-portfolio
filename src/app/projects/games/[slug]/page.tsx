import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { DetailHeader } from "@/components/projects/DetailHeader";
import { DetailHeaderCompact } from "@/components/projects/DetailHeaderCompact";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { projects } from "@/data/projects";
import { FEATURES } from "@/config/features";
import { getHeroImage } from "@/lib/project-utils";
import { breadcrumbJsonLd } from "@/lib/json-ld";

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Games route only serves game projects
const gameProjects = projects.filter((p) => p.projectType === "game");

export async function generateStaticParams() {
  if (!FEATURES.SHOW_ALL_PROJECT_TYPES) {
    return [];
  }
  return gameProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = gameProjects.find((p) => p.slug === slug);

  if (!project) return {};

  const ogImage = getHeroImage(project.images);

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
}

export default async function GameProjectPage({ params }: GamePageProps) {
  if (!FEATURES.SHOW_ALL_PROJECT_TYPES) {
    notFound();
  }

  const { slug } = await params;

  // Only find in game projects
  const project = gameProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const heroImage = getHeroImage(project.images);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("Games", project.title)) }}
      />
      <PageLayout
        stickyHeader
        pageId="project-detail"
        header={
          <DetailHeaderCompact
            title={project.title}
            compactTitle={project.compactTitle}
            defaultTab="games"
            links={project.links}
          />
        }
      >
        <DetailHeader
          title={project.title}
          status={project.status}
          categories={project.category}
          heroImage={heroImage}
          defaultTab="games"
          links={project.links}
          metadata={{
            teamRole: project.teamRole,
            teamRoleCompact: project.teamRoleCompact,
            developmentTime: project.developmentTime,
            developmentTimeCompact: project.developmentTimeCompact,
          }}
        />
        <ProjectDetail project={project} />
      </PageLayout>
    </>
  );
}
