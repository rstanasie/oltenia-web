export function PreviewBanner({ indexable }: { indexable: boolean }) {
  if (indexable) return null;
  return (
    <div className="bg-navy-100 text-center text-sm text-navy-900">
      <p className="mx-auto max-w-site px-5 py-2 sm:px-8">
        <strong className="font-semibold">Vista previa.</strong> Contenido pendiente de revisión; esta versión no se
        muestra en buscadores.
      </p>
    </div>
  );
}
