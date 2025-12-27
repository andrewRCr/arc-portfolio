import { notFound } from "next/navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
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

  return <ProjectDetail project={mod} currentTab={currentTab} from={from} />;
}
