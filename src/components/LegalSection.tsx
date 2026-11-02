import type { ReactNode } from "react";
import { Missing } from "@/components/DraftNotice";

export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line pt-8">
      <h2 id={id} className="text-2xl font-bold">
        {title}
      </h2>
      <div className="mt-4 max-w-prose space-y-4 leading-relaxed">{children}</div>
    </section>
  );
}

export function LegalParagraphs({ items, missing, list = false }: { items: string[]; missing: string; list?: boolean }) {
  if (items.length === 0) {
    return (
      <p>
        <Missing>{missing}</Missing>
      </p>
    );
  }
  if (list) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return items.map((item) => <p key={item}>{item}</p>);
}
