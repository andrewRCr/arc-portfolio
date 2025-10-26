import { notFound } from "next/navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { projects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function SoftwareProjectPage({ params, searchParams }: ProjectPageProps) {
  const { slug } = await params;
  const { tab } = await searchParams;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Preserve tab state from query param, default to 'software'
  const currentTab = tab === "mods" ? "mods" : "software";

  return (
    <div className="flex min-h-screen flex-col p-8">
      <ProjectDetail project={project} currentTab={currentTab} />
    </div>
  );
}
