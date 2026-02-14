import { personJsonLd } from "@/lib/json-ld";
import HomeContent from "./HomeContent";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
      <HomeContent />
    </>
  );
}
