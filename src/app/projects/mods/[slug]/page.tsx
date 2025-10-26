import { notFound } from "next/navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { mods } from "@/data/mods";

interface ModPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export async function generateStaticParams() {
  return mods.map((mod) => ({
    slug: mod.slug,
  }));
}

export default async function ModProjectPage({ params, searchParams }: ModPageProps) {
  const { slug } = await params;
  const { tab } = await searchParams;

  const mod = mods.find((m) => m.slug === slug);

  if (!mod) {
    notFound();
  }

  // Preserve tab state from query param, default to 'mods' for mod pages
  const currentTab = tab === "software" ? "software" : "mods";

  return (
    <div className="flex min-h-screen flex-col p-8">
      <ProjectDetail project={mod} currentTab={currentTab} />
    </div>
  );
}
