import { draftMode } from "next/headers";

/** Shown only to editors viewing unpublished Sanity content. Distinct from PreviewBanner, which flags the whole site as not yet approved for the public. */
export async function DraftModeBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="bg-accent text-center text-sm text-white">
      <p className="mx-auto flex max-w-site flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 py-2 sm:px-8">
        <strong className="font-semibold">Modo borrador.</strong>
        <span>Estás viendo contenido sin publicar.</span>
        <form action="/api/draft-mode/disable" method="GET" className="inline">
          <button type="submit" className="font-semibold underline underline-offset-4">
            Salir del modo borrador
          </button>
        </form>
      </p>
    </div>
  );
}
