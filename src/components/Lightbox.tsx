"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/types";

type LightboxState = { photos: Photo[]; index: number } | null;

const LightboxContext = createContext<(photos: Photo[], index: number) => void>(() => {});

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((photos: Photo[], index: number) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setState({ photos, index });
  }, []);

  const close = useCallback(() => {
    setState(null);
    triggerRef.current?.focus();
  }, []);

  const go = useCallback((delta: number) => {
    setState((s) => (s ? { ...s, index: (s.index + delta + s.photos.length) % s.photos.length } : s));
  }, []);

  useEffect(() => {
    if (!state) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [state, close, go]);

  const photo = state?.photos[state.index];

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {state && photo ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-4 sm:p-8"
          onClick={close}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {state.photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
              <div aria-hidden="true" className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                {state.index + 1} / {state.photos.length}
              </div>
            </>
          ) : null}

          <div className="flex max-h-full max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="90vw"
              className="h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-lg object-contain"
            />
            <p className="mt-3 max-w-[90vw] text-center text-sm text-navy-200">{photo.alt}</p>
          </div>
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}
