import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import ProjectDetail from "@/components/projects/ProjectDetail";
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

  return (
    <PageLayout>
      <ProjectDetail project={project} currentTab={currentTab} from={from} />
    </PageLayout>
  );
}
