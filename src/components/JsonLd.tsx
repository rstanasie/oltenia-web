import { jsonLd } from "@/lib/metadata";

export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
