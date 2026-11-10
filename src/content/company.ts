import type { CompanyContent } from "./types";
import { toCompanyContent, type RawSiteQueryResult } from "@/sanity/lib/mappers";
import { SITE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";

/**
 * Fetches Oltenia's website content from Sanity and shapes it into the
 * app's existing CompanyContent type, so every page and component keeps
 * consuming the same shape they always have.
 *
 * Call this from Server Components only (it reads published content cached
 * for 5 minutes, or fresh draft content in Draft Mode — see
 * src/sanity/lib/fetch.ts). Next.js deduplicates identical calls within a
 * single request, so call it wherever you need company data rather than
 * threading it through props.
 */
export async function getCompany(): Promise<CompanyContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toCompanyContent(data as RawSiteQueryResult);
}
