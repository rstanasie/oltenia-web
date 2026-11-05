/**
 * Centralizes Sanity environment access so every call site fails the same
 * way when the project is not configured yet (e.g. before the owner has
 * created a Sanity project). See .env.example for how to set these.
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Server-only token with at least "Viewer" access, used to read drafts for previews. Never exposed to the browser. */
export const readToken = process.env.SANITY_API_READ_TOKEN;

/** Server-only token with "Editor" access, used only by the job-application API route to create candidatura documents. Never exposed to the browser. */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN;

export function assertSanityConfigured(id: string | undefined = projectId): asserts id is string {
  if (!id) {
    throw new Error(
      "Falta NEXT_PUBLIC_SANITY_PROJECT_ID. Copia .env.example a .env.local y configura el proyecto de Sanity (ver README.md § Sanity).",
    );
  }
}
