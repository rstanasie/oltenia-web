import type { ReactNode } from "react";

export { metadata, viewport } from "next-sanity/studio";

/**
 * Separate root layout for /studio: Sanity Studio is a standalone,
 * authenticated tool, not a page of the public site, so it must not inherit
 * the public site's <html>/<body>, Header, Footer, or preview banners (which
 * also depend on live Sanity content and would be wrong to show inside the
 * CMS itself). See https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
