import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EducationSection } from "@/components/sections/EducationSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { getAuthorStats } from "@/app/actions/nexusmods";
import { isModStatsError } from "@/lib/nexusmods-types";
import { personJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, education, and development experience — from hobbyist projects to full-stack web and desktop applications.",
};

export default async function AboutPage() {
  // Fetch author-level NexusMods stats for dynamic download count
  const authorStats = await getAuthorStats();
  const uniqueDownloads = isModStatsError(authorStats) ? undefined : authorStats.uniqueDownloads;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
      <PageLayout pageId="about" header={<PageHeader title="About" subtitle="Background and qualifications." />}>
        <div className="space-y-4 sm:space-y-6">
          <AboutSection uniqueDownloads={uniqueDownloads} />
          <EducationSection />
        </div>
      </PageLayout>
    </>
  );
}
