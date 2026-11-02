"use client";

import Image from "next/image";
import type { Photo } from "@/content/types";
import { useLightbox } from "@/components/Lightbox";

export function NarrativePhoto({
  photo,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  photo: Photo | null;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const openLightbox = useLightbox();
  if (!photo) return null;
  return (
    <button
      type="button"
      onClick={() => openLightbox([photo], 0)}
      aria-label={`Ampliar imagen: ${photo.alt}`}
      className={`relative block ${aspect} w-full cursor-zoom-in overflow-hidden rounded-xl bg-navy-100`}
    >
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" priority={priority} />
    </button>
  );
}
