"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLightbox } from "@/components/Lightbox";
import type { Photo } from "@/content/types";
import { approvedPhotos } from "@/lib/content";

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const items = approvedPhotos(photos);
  const trackRef = useRef<HTMLDivElement>(null);
  const openLightbox = useLightbox();

  if (items.length === 0) return null;

  const scrollByCards = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((photo, index) => (
          <figure key={photo.src} className="w-[78%] shrink-0 snap-start sm:w-[340px]">
            <button
              type="button"
              onClick={() => openLightbox(items, index)}
              aria-label={`Ampliar imagen: ${photo.alt}`}
              className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-lg border border-line bg-navy-100"
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 340px, 78vw" className="object-cover" />
            </button>
            <figcaption className="mt-2 text-sm leading-snug text-muted">{photo.alt}</figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Desplazar hacia atrás"
            className="absolute left-0 top-[38%] hidden size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy-900 shadow-sm hover:bg-navy-100 sm:flex"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Desplazar hacia adelante"
            className="absolute right-0 top-[38%] hidden size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy-900 shadow-sm hover:bg-navy-100 sm:flex"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      ) : null}
    </div>
  );
}
