import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/layout/Hero";
import { FeaturedSection } from "@/components/sections/FeaturedSection";

export default function Home() {
  return (
    <PageLayout headerType="hero">
      <div className="flex-1 flex flex-col pt-1 px-2 pb-2 md:pt-7 md:px-8 md:pb-8">
        <Hero />
        <FeaturedSection />
      </div>
    </PageLayout>
  );
}
