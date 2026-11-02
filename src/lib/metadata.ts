import type { Metadata } from "next";
import type { CompanyContent } from "@/content/types";
import type { SeoEntry } from "@/sanity/lib/mappers";
import { envSite } from "@/lib/site";

export function socialImage(company: CompanyContent) {
  return {
    url: "/social-preview.png",
    width: 1200,
    height: 630,
    alt: `${company.brand.name} · Ventilación y climatización en ${company.location.city}`,
  };
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Force noindex regardless of site configuration, e.g. legal drafts. */
  noindex?: boolean;
};

type PageMetaContext = {
  company: CompanyContent;
  /** Combined env + content (publication.approved) indexing gate — see lib/site.ts#isIndexable. */
  indexable: boolean;
  /** Optional per-page SEO override from Sanity's seoSettings singleton. Empty fields fall back to the defaults above. */
  seo?: SeoEntry;
};

export function pageMetadata({ title, description, path, noindex = false }: PageMetaInput, { company, indexable, seo }: PageMetaContext): Metadata {
  const finalTitle = seo?.metaTitle || title;
  const finalDescription = seo?.metaDescription || description;
  const canIndex = indexable && !noindex;
  return {
    title: finalTitle,
    description: finalDescription,
    alternates: envSite.siteUrl ? { canonical: path } : undefined,
    openGraph: {
      title: `${finalTitle} | ${company.brand.name}`,
      description: finalDescription,
      url: envSite.siteUrl ? path : undefined,
      siteName: company.brand.name,
      locale: "es_ES",
      type: "website",
      images: envSite.siteUrl ? [socialImage(company)] : undefined,
    },
    twitter: { card: "summary_large_image" },
    robots: canIndex
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/** Serializes JSON-LD safely for inline <script> output. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .split("<").join("\\u003c")
    .split(">").join("\\u003e")
    .split("&").join("\\u0026")
    .split(LINE_SEPARATOR).join("\\u2028")
    .split(PARAGRAPH_SEPARATOR).join("\\u2029");
}
