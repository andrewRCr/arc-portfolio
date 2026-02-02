import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";

export default function ContactPage() {
  return (
    <PageLayout pageId="contact" header={<PageHeader title="Contact // Social" subtitle="Connect or collaborate." />}>
      <ContactSection />
    </PageLayout>
  );
}
