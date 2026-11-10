import type { Vacancy } from "@/content/types";
import {
  toEnDetallePage,
  toHomePage,
  toRecruitmentPage,
  toSeoSettings,
  toServicesPage,
  toVacancy,
  toWorkingConditions,
  type EnDetallePageContent,
  type HomePageContent,
  type RawSiteQueryResult,
  type RecruitmentPageContent,
  type SeoSettingsContent,
  type ServicesPageContent,
  type WorkingConditionsContent,
} from "@/sanity/lib/mappers";
import { SITE_QUERY, VACANCY_BY_SLUG_QUERY, VACANCY_SLUGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";

/**
 * Per-page editorial content (headings, intro text, CTA labels) for pages
 * that are otherwise mostly driven by other content types. Each getter
 * fetches the same combined query as getCompany() — Next.js deduplicates
 * identical fetches within one request, so calling several of these on the
 * same page costs a single network round trip.
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

export async function getWorkingConditions(): Promise<WorkingConditionsContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toWorkingConditions((data as RawSiteQueryResult).workingConditions);
}

export async function getEnDetallePage(): Promise<EnDetallePageContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toEnDetallePage((data as RawSiteQueryResult).enDetallePage);
}

export async function getSeoSettings(): Promise<SeoSettingsContent> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toSeoSettings((data as RawSiteQueryResult).seoSettings);
}

/**
 * Used only from generateStaticParams, which runs at build time with no
 * request context — draftMode() (used internally by sanityFetch to resolve
 * draft/published state) isn't available there, so this uses the plain
 * published-only client instead.
 */
export async function getVacancySlugs(): Promise<string[]> {
  const data = await client.fetch<{ slug?: string | null }[]>(VACANCY_SLUGS_QUERY);
  return data.map((d) => d.slug).filter((s): s is string => Boolean(s));
}

export async function getVacancyBySlug(slug: string): Promise<Vacancy | null> {
  const { data } = await sanityFetch({ query: VACANCY_BY_SLUG_QUERY, params: { slug } });
  return toVacancy(data as Parameters<typeof toVacancy>[0]);
}
