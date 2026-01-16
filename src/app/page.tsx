import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/layout/Hero";
import { FeaturedSection } from "@/components/sections/FeaturedSection";

export default function Home() {
  return (
    <PageLayout header={<Hero />} headerType="hero" stickyHeader>
      <div className="flex-1 flex flex-col px-2 pb-2 md:px-8 md:pb-8">
        <FeaturedSection />
      </div>
    </PageLayout>
  );
}
