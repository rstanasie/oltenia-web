import type { CareerStage } from "@/data/careerStages";
import { toCareerStages, type RawSiteQueryResult } from "@/sanity/lib/mappers";
import { SITE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

export async function getCareerStages(): Promise<CareerStage[]> {
  const { data } = await sanityFetch({ query: SITE_QUERY });
  return toCareerStages((data as RawSiteQueryResult).careerStages);
}
