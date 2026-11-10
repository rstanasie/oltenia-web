import { cookies, draftMode } from "next/headers";
import { resolvePerspectiveFromCookies } from "next-sanity/live";
import { assertSanityConfigured, readToken } from "@/sanity/env";
import { client } from "@/sanity/lib/client";

assertSanityConfigured();

/** How long the published dataset is cached before Next.js refetches it. */
const PUBLISHED_REVALIDATE_SECONDS = 300;

/**
 * sanityFetch: used by every Server Component that reads site content.
 *
 * Public visitors get the published dataset straight from Sanity's CDN,
 * cached for PUBLISHED_REVALIDATE_SECONDS so the browser never talks to
 * Sanity directly (no live connection, no CORS dependency). This is a
 * time-based cache: a published edit can take up to that long to reach a
 * given visitor, it is not an on-demand/instant refresh.
 *
 * When Next.js Draft Mode is enabled (Studio's Presentation tool, or a
 * preview link via /api/draft-mode/enable), it fetches the draft
 * perspective uncached instead, using serverToken.
 */
export async function sanityFetch<QueryResult = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: QueryResult }> {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    const perspective = await resolvePerspectiveFromCookies({ cookies: await cookies() });
    const data = await client.fetch<QueryResult>(query, params, {
      perspective,
      useCdn: false,
      token: readToken,
      next: { revalidate: 0 },
    });
    return { data };
  }

  const data = await client.fetch<QueryResult>(query, params, {
    next: { revalidate: PUBLISHED_REVALIDATE_SECONDS },
  });
  return { data };
}
