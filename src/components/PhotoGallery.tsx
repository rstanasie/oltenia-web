import Image from "next/image";
import type { Photo } from "@/content/types";
import { approvedPhotos } from "@/lib/content";

/** Renders nothing unless at least one approved photo exists. */
export function PhotoGallery({ photos, title, headingId }: { photos: Photo[]; title: string; headingId: string }) {
  const items = approvedPhotos(photos);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((photo) => (
          <li key={photo.src}>
            <figure className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="relative aspect-[4/3] bg-navy-100">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {photo.caption ? <figcaption className="px-4 py-3 text-sm text-muted">{photo.caption}</figcaption> : null}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
