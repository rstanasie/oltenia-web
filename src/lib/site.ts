const LOCAL_HOSTS = /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\])$|\.local$|\.localhost$/;

/**
 * Env-only site configuration: everything knowable without fetching company
 * content, so it can be read synchronously at next.config.ts eval time.
 * Whether the site is actually indexable also depends on live content
 * (publication.approved from Sanity) — see isIndexable().
 */
export type EnvSiteConfig = {
  siteUrl: URL | null;
  siteUrlError: string | null;
  indexingRequested: boolean;
  isVercelNonProduction: boolean;
  /** Env-level reasons indexing is blocked. Does not include content-level reasons (see isIndexable). */
  blockers: string[];
};

export function parseSiteUrl(raw: string | undefined): { url: URL | null; error: string | null } {
  if (!raw || raw.trim() === "") return { url: null, error: null };
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { url: null, error: `NEXT_PUBLIC_SITE_URL no es una URL válida: "${raw}"` };
  }
  if (url.protocol !== "https:") {
    return { url: null, error: "NEXT_PUBLIC_SITE_URL debe usar https://" };
  }
  if (LOCAL_HOSTS.test(url.hostname)) {
    return { url: null, error: "NEXT_PUBLIC_SITE_URL no puede ser una dirección local" };
  }
  if (url.hostname.endsWith(".vercel.app")) {
    return { url: null, error: "NEXT_PUBLIC_SITE_URL debe ser el dominio definitivo, no un dominio *.vercel.app" };
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    return { url: null, error: "NEXT_PUBLIC_SITE_URL debe ser solo el origen, p. ej. https://dominio.es" };
  }
  return { url, error: null };
}

export function getEnvSiteConfig(env: NodeJS.ProcessEnv = process.env): EnvSiteConfig {
  const { url, error } = parseSiteUrl(env.NEXT_PUBLIC_SITE_URL);
  const indexingRequested = env.SITE_INDEXING === "true";
  const isVercelNonProduction = Boolean(env.VERCEL_ENV) && env.VERCEL_ENV !== "production";

  const blockers: string[] = [];
  if (!indexingRequested) blockers.push('SITE_INDEXING no está a "true"');
  if (!url) blockers.push(error ?? "NEXT_PUBLIC_SITE_URL no está configurada");
  if (isVercelNonProduction) blockers.push(`despliegue de Vercel no productivo (VERCEL_ENV=${env.VERCEL_ENV})`);

  return { siteUrl: url, siteUrlError: error, indexingRequested, isVercelNonProduction, blockers };
}

/** Safe to evaluate eagerly: pure env, no network/content dependency. Used by next.config.ts. */
export const envSite = getEnvSiteConfig();

/** True only when env config AND live content both allow indexing. */
export function isIndexable(env: EnvSiteConfig, publicationApproved: boolean): boolean {
  return env.blockers.length === 0 && publicationApproved;
}

export function absoluteUrl(path: string, env: EnvSiteConfig = envSite): string | null {
  return env.siteUrl ? new URL(path, env.siteUrl).toString() : null;
}
