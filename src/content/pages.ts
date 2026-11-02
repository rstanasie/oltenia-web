import {
  toEnDetallePage,
  toHomePage,
  toRecruitmentPage,
  toSeoSettings,
  toServicesPage,
  type EnDetallePageContent,
  type HomePageContent,
  type RawSiteQueryResult,
  type RecruitmentPageContent,
  type SeoSettingsContent,
  type ServicesPageContent,
} from "@/sanity/lib/mappers";
import { SITE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

/**
 * Per-page editorial content (headings, intro text, CTA labels) for pages
 * that are otherwise mostly driven by other content types. Each getter
 * fetches the same combined query as getCompany()/getCareerStages() —
 * Next.js deduplicates identical fetches within one request, so calling
 * several of these on the same page costs a single network round trip.
 */

export async function getHomePage(): Promise<HomePageContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toHomePage((data as RawSiteQueryResult).homePage);
}

export async function getServicesPage(): Promise<ServicesPageContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toServicesPage((data as RawSiteQueryResult).servicesPage);
}

export async function getRecruitmentPage(): Promise<RecruitmentPageContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toRecruitmentPage((data as RawSiteQueryResult).recruitmentPage);
}

export async function getEnDetallePage(): Promise<EnDetallePageContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toEnDetallePage((data as RawSiteQueryResult).enDetallePage);
}

export async function getSeoSettings(): Promise<SeoSettingsContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toSeoSettings((data as RawSiteQueryResult).seoSettings);
}
