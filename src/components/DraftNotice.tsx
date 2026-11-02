import type { ReactNode } from "react";

export function DraftNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside role="note" className="rounded-lg border-2 border-dashed border-accent bg-accent-tint p-5 text-ink sm:p-6">
      <p className="font-bold text-accent-strong">{title}</p>
      <div className="mt-2 space-y-2 leading-relaxed">{children}</div>
    </aside>
  );
}

export function Missing({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-accent-tint px-1.5 py-0.5 font-semibold text-accent-strong ring-1 ring-accent/40">
      [Pendiente: {children}]
    </span>
  );
}
