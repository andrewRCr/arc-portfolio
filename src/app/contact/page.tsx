import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";

export default function ContactPage() {
  return (
    <PageLayout header={<PageHeader title="Contact" subtitle="Get in touch." />}>
      <ContactSection />
    </PageLayout>
  );
}
