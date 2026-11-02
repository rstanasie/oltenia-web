import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { readToken } from "@/sanity/env";
import { client } from "@/sanity/lib/client";

/**
 * Called by the Studio's Presentation tool (and by anyone following a
 * preview link with a valid share secret) to enter Draft Mode. Requires a
 * server-only token with read access to drafts; public visitors never see
 * this route succeed without going through Sanity's own authenticated
 * preview flow.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken }),
});
