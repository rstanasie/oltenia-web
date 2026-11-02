import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { Photo } from "@/content/types";

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity no está configurado: falta NEXT_PUBLIC_SANITY_PROJECT_ID.");
  }
  return builder.image(source);
}

/** Raw shape returned by GROQ projections that resolve an image field with its asset metadata. */
export type SanityPhotoFragment = {
  asset: {
    _id: string;
    url: string;
    metadata: { dimensions: { width: number; height: number } | null } | null;
  } | null;
  hotspot?: { x: number; y: number } | null;
  alt?: string | null;
  caption?: string | null;
  publicationApproved?: boolean | null;
} | null;

/**
 * Maps a Sanity image fragment to the app's existing Photo type, so every
 * component that already consumes Photo (NarrativePhoto, PhotoGallery,
 * PhotoCarousel, Lightbox…) keeps working unchanged: src becomes a Sanity
 * CDN URL instead of a /public path, which next/image renders identically.
 */
export function toPhoto(fragment: SanityPhotoFragment, fallbackWidth = 1600): Photo | null {
  if (!fragment?.asset) return null;
  const dimensions = fragment.asset.metadata?.dimensions;
  const width = dimensions?.width ?? fallbackWidth;
  const height = dimensions?.height ?? Math.round(fallbackWidth * 0.75);
  return {
    src: urlFor(fragment.asset).width(width > 2400 ? 2400 : width).fit("max").auto("format").url(),
    alt: fragment.alt?.trim() ?? "",
    width,
    height,
    caption: fragment.caption?.trim() || null,
    publicationApproved: fragment.publicationApproved ?? false,
  };
}
