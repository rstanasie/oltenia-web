import { ContactActions } from "@/components/ContactActions";
import { JsonLd } from "@/components/JsonLd";
import type { CompanyContent, Vacancy } from "@/content/types";
import { contractLabels, formatSalary, recruitmentChannels } from "@/lib/content";
import { jobPostingData } from "@/lib/structured-data";

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="font-bold text-navy-900">{title}</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed marker:text-accent">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function VacancyList({ company, vacancies, indexable }: { company: CompanyContent; vacancies: Vacancy[]; indexable: boolean }) {
  const channels = recruitmentChannels(company);

  return (
    <ul className="grid gap-6">
      {vacancies.map((vacancy) => {
        const facts = [
          vacancy.location && { label: "Ubicación", value: vacancy.location },
          vacancy.contractType && { label: "Contrato", value: contractLabels[vacancy.contractType] },
          vacancy.schedule && { label: "Horario", value: vacancy.schedule },
          vacancy.salaryRange && { label: "Salario", value: formatSalary(vacancy.salaryRange) },
          vacancy.drivingLicence && { label: "Carné de conducir", value: vacancy.drivingLicence },
        ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

        return (
          <li key={vacancy.id}>
            <article id={`oferta-${vacancy.id}`} aria-labelledby={`oferta-${vacancy.id}-titulo`} className="rounded-lg border border-line bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-accent">Oferta abierta</p>
              <h3 id={`oferta-${vacancy.id}-titulo`} className="mt-2 text-2xl font-bold">
                {vacancy.title}
              </h3>
              {facts.length > 0 ? (
                <dl className="mt-5 grid gap-x-8 gap-y-3 border-y border-line py-4 sm:grid-cols-2">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-sm font-semibold text-muted">{fact.label}</dt>
                      <dd className="font-semibold text-navy-900">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {vacancy.summary ? <p className="mt-5 max-w-prose leading-relaxed">{vacancy.summary}</p> : null}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <List title="Funciones" items={vacancy.responsibilities} />
                <List title="Experiencia" items={vacancy.requiredExperience} />
                <List title="Formación y requisitos" items={vacancy.requiredQualifications} />
                <List title="Qué ofrecemos" items={vacancy.benefits} />
              </div>
              {vacancy.applicationInstructions ? (
                <p className="mt-6 max-w-prose leading-relaxed">
                  <strong className="text-navy-900">Cómo presentarte: </strong>
                  {vacancy.applicationInstructions}
                </p>
              ) : null}
              <div className="mt-6">
                <ContactActions
                  channels={channels}
                  whatsappMessage={`Hola, me interesa la oferta «${vacancy.title}» de ${company.brand.name}. Mi experiencia es…`}
                  emailSubject={`Oferta: ${vacancy.title}`}
                  emailBody={`Hola,\n\nme interesa la oferta «${vacancy.title}».\n\nMi experiencia es…\n\nMi disponibilidad es…\n`}
                  emptyMessage="El canal de contacto para esta oferta todavía no está publicado."
                />
              </div>
              <JsonLd data={jobPostingData(company, vacancy, indexable)} />
            </article>
          </li>
        );
      })}
    </ul>
  );
}
