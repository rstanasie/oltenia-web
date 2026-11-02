import { createClient } from "next-sanity";
import { apiVersion, assertSanityConfigured, dataset, projectId } from "@/sanity/env";

assertSanityConfigured();

/**
 * Read-only client for the published dataset. Used outside of Server
 * Components (e.g. the content validation script) where the Live Content
 * API's sanityFetch is not available.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
