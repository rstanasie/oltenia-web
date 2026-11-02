import type { MetadataRoute } from "next";
import { getCompany } from "@/content/company";
import { absoluteUrl, envSite, isIndexable } from "@/lib/site";

const publicPaths = ["/", "/trabaja-con-nosotros", "/servicios", "/en-detalle", "/sobre-oltenia", "/contacto"];
const legalPaths = ["/aviso-legal", "/privacidad"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const company = await getCompany();
  if (!isIndexable(envSite, company.publication.approved)) return [];
  const paths = company.legal.reviewed ? [...publicPaths, ...legalPaths] : publicPaths;
  return paths.flatMap((path) => {
    const url = absoluteUrl(path);
    return url ? [{ url }] : [];
  });
}
