import { createClient } from "next-sanity";
import { apiVersion, assertSanityConfigured, dataset, projectId, writeToken } from "@/sanity/env";

/**
 * Write-capable client, used only by the /api/candidaturas Route Handler to
 * create jobApplication documents. Only import this from server-side code
 * (Route Handlers, Server Components) — never from a Client Component.
 */
export function getWriteClient() {
  assertSanityConfigured(projectId);
  if (!writeToken) {
    throw new Error(
      "Falta SANITY_API_WRITE_TOKEN. Añádelo en las variables de entorno de Vercel (Production) para que el formulario de candidaturas pueda guardar el envío.",
    );
  }
  return createClient({ projectId, dataset, apiVersion, token: writeToken, useCdn: false });
}
