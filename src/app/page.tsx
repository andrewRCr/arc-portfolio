import Link from "next/link";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";
import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/layout/Hero";

// Featured projects by slug (order determines display order)
const FEATURED_SLUGS = ["cinexplorer", "taskfocus"];

export default function Home() {
  const featuredProjects = FEATURED_SLUGS.map((slug) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project && process.env.NODE_ENV === "development") {
      console.warn(`Featured project slug "${slug}" not found in projects data`);
    }
    return project;
  }).filter((p): p is Project => p !== undefined);

  return (
    <PageLayout>
      <div className="flex-1 flex flex-col p-8">
        {/* Hero Section */}
        <Hero />

        {/* Featured Project Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-muted-foreground">Featured Projects</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/software/${project.slug}?from=home`}
                className="block p-4 border border-border rounded-sm hover:border-secondary/60 transition-colors"
              >
                <p className="text-xs font-mono text-primary mb-2">{"[project]"}</p>
                <h4 className="font-semibold mb-2">{project.title}</h4>
                <p className="text-sm text-muted-foreground">{project.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
