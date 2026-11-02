import type { MetadataRoute } from "next";
import { getCompany } from "@/content/company";
import { absoluteUrl, envSite, isIndexable } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const company = await getCompany();
  if (!isIndexable(envSite, company.publication.approved)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  const sitemap = absoluteUrl("/sitemap.xml");
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(sitemap ? { sitemap } : {}),
  };
}
