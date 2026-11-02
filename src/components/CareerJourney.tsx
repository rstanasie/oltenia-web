"use client";

import { useId, useState } from "react";
import type { CareerStage } from "@/data/careerStages";

function StageDetail({ stage }: { stage: CareerStage }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.1em] text-accent">{stage.subtitle}</p>
      <h3 className="mt-1 text-2xl font-bold">{stage.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{stage.description}</p>

      {stage.quote ? (
        <p className="mt-4 border-l-4 border-accent pl-4 italic leading-relaxed text-navy-900">{stage.quote}</p>
      ) : null}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-muted">Qué implica</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-accent">
            {stage.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-muted">Competencias técnicas</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {stage.competencies.map((item) => (
              <li key={item} className="rounded-full border border-navy-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-navy-900">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {stage.relatedContent && stage.relatedContent.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {stage.relatedContent.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-11 items-center font-semibold text-accent underline-offset-4 hover:underline"
              >
                {link.label}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {stage.note ? <p className="mt-6 text-sm leading-relaxed text-muted">{stage.note}</p> : null}
    </div>
  );
}

export function CareerJourney({ stages }: { stages: CareerStage[] }) {
  const baseId = useId();
  const [selectedId, setSelectedId] = useState<string | undefined>(stages[0]?.id);
  const first = stages[0];
  if (!first) return null;
  const selected = stages.find((s) => s.id === selectedId) ?? first;

  return (
    <div className="grid gap-2 lg:grid-cols-[22rem_1fr] lg:items-start lg:gap-12">
      <ol className="border-t-2 border-navy-900">
        {stages.map((stage) => {
          const isSelected = stage.id === selected.id;
          const desktopPanelId = `${baseId}-panel`;
          const mobilePanelId = `${baseId}-panel-${stage.id}-mobile`;
          return (
            <li key={stage.id} className="border-b border-line">
              <button
                type="button"
                onClick={() => setSelectedId(stage.id)}
                aria-expanded={isSelected}
                aria-controls={`${desktopPanelId} ${mobilePanelId}`}
                className={`flex w-full items-start gap-4 py-5 text-left transition-colors motion-reduce:transition-none ${
                  isSelected ? "text-navy-900" : "text-muted hover:text-navy-900"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors motion-reduce:transition-none ${
                    isSelected ? "border-accent bg-accent text-white" : "border-navy-200 text-navy-900"
                  }`}
                >
                  {stage.displayOrder}
                </span>
                <span>
                  <span className="block text-lg font-bold">{stage.title}</span>
                  <span className="block text-sm">{stage.subtitle}</span>
                </span>
              </button>

              <div id={mobilePanelId} hidden={!isSelected} className="pb-6 pl-4 lg:hidden">
                <StageDetail stage={stage} />
              </div>
            </li>
          );
        })}
      </ol>

      <div
        id={`${baseId}-panel`}
        role="region"
        aria-live="polite"
        aria-label={`${selected.title}: ${selected.subtitle}`}
        className="hidden rounded-xl border border-line bg-white p-8 lg:block"
      >
        <StageDetail stage={selected} />
      </div>
    </div>
  );
}
