import Link from "next/link";
import type { Vacancy } from "@/content/types";

export function VacancyCards({ vacancies }: { vacancies: Vacancy[] }) {
  if (vacancies.length === 0) return null;

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {vacancies.map((vacancy) => (
        <li key={vacancy.id}>
          <article className="flex h-full flex-col rounded-xl border border-line bg-white p-6">
            <h3 className="text-xl font-bold text-navy-900">{vacancy.title}</h3>
            {vacancy.shortDescription ? <p className="mt-1 text-muted">{vacancy.shortDescription}</p> : null}
            <Link
              href={`/puestos/${vacancy.id}`}
              className="mt-5 inline-flex min-h-11 w-fit items-center font-semibold text-accent underline-offset-4 hover:underline"
            >
              Ver puesto<span aria-hidden="true" className="ml-1">→</span>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}
