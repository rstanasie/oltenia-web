import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import { apiVersion, assertSanityConfigured, dataset, projectId, readToken } from "@/sanity/env";

assertSanityConfigured();

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * sanityFetch: used by every Server Component that reads site content.
 * It automatically serves drafts when Next.js Draft Mode is enabled (via
 * serverToken) and stays on published content for everyone else.
 *
 * SanityLive: rendered once in the root layout. It keeps a live connection
 * open so published edits appear to visitors without a redeploy or a
 * webhook — this is the project's content-update strategy (see README.md).
 *
 * browserToken is intentionally omitted: without it, <SanityLive /> can only
 * stream published content to the browser, so draft content never reaches
 * a visitor who isn't in Draft Mode, and no privileged token ever ships in
 * the client bundle.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
});
