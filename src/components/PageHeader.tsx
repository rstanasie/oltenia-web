import type { ReactNode } from "react";
import { Container } from "@/components/Container";

function WindLines() {
  return (
    <div className="pointer-events-none hidden flex-col lg:flex">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 400 200" className="h-48 w-full text-navy-100" fill="none" stroke="currentColor" strokeWidth="2" preserveAspectRatio="none">
        <path d="M0 60 C 120 40, 200 100, 400 70" />
        <path d="M0 110 C 140 90, 220 150, 400 120" />
        <path d="M0 160 C 160 140, 240 200, 400 170" />
      </svg>
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="border-b border-line bg-white">
      <Container className="py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div>
            {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">{eyebrow}</p> : null}
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
            {children ? <div className="mt-5 text-lg leading-relaxed sm:text-xl">{children}</div> : null}
          </div>
          <WindLines />
        </div>
      </Container>
    </div>
  );
}
