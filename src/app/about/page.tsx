import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EducationSection } from "@/components/sections/EducationSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { getAggregateStats } from "@/app/actions/nexusmods";
import { isModStatsError } from "@/lib/nexusmods-types";

export default async function AboutPage() {
  // Fetch aggregate NexusMods stats for dynamic download count
  const aggregateStats = await getAggregateStats();
  const uniqueDownloads = isModStatsError(aggregateStats) ? undefined : aggregateStats.totalUniqueDownloads;

  return (
    <PageLayout header={<PageHeader title="About" subtitle="Background and qualifications." />}>
      <div className="space-y-8">
        <AboutSection uniqueDownloads={uniqueDownloads} />
        <EducationSection />
      </div>
    </PageLayout>
  );
}
