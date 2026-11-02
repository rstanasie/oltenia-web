import type { ReactNode } from "react";
import { Container } from "@/components/Container";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-white">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 400 200" className="pointer-events-none absolute -right-10 top-0 hidden h-full w-[28rem] text-navy-100 md:block" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M0 60 C 120 40, 200 100, 400 70" />
        <path d="M0 110 C 140 90, 220 150, 400 120" />
        <path d="M0 160 C 160 140, 240 200, 400 170" />
      </svg>
      <Container className="relative py-14 sm:py-20">
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        {children ? <div className="mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl">{children}</div> : null}
      </Container>
    </div>
  );
}
