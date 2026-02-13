import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch for collaboration, job opportunities, or questions about any of the projects in the portfolio.",
};

export default function ContactPage() {
  return (
    <PageLayout pageId="contact" header={<PageHeader title="Contact // Social" subtitle="Connect or collaborate." />}>
      <ContactSection />
    </PageLayout>
  );
}
