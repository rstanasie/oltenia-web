import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { getCompany } from "@/content/company";
import { getVacancyBySlug, getVacancySlugs, getWorkingConditions } from "@/content/pages";
import { contractLabels, formatSalaryOrientativo } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";
import { jobPostingData } from "@/lib/structured-data";

export async function generateStaticParams() {
  const slugs = await getVacancySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/puestos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [company, vacancy] = await Promise.all([getCompany(), getVacancyBySlug(slug)]);
  const indexable = isIndexable(envSite, company.publication.approved);
  if (!vacancy || vacancy.status !== "open") {
    return pageMetadata({ title: "Puesto no encontrado", description: "", path: `/puestos/${slug}`, noindex: true }, { company, indexable });
  }
  return pageMetadata(
    {
      title: vacancy.title,
      description: vacancy.summary ?? `${vacancy.title} en ${company.brand.name}, ${company.location.city}.`,
      path: `/puestos/${slug}`,
    },
    { company, indexable },
  );
}

function Section({ letter, title, children }: { letter: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`seccion-${letter}`} className="scroll-mt-20 border-t border-line pt-8 first:border-t-0 first:pt-0">
      <h2 id={`seccion-${letter}`} className="text-xl font-bold text-navy-900 sm:text-2xl">
        <span className="text-accent">{letter}.</span> {title}
      </h2>
      <div className="mt-4 grid gap-4 leading-relaxed">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-accent pl-4">
      <dt className="text-sm font-bold uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className="mt-1 text-navy-900">{children}</dd>
    </div>
  );
}

export default async function VacancyPage({ params }: PageProps<"/puestos/[slug]">) {
  const { slug } = await params;
  const [company, vacancy, wc] = await Promise.all([getCompany(), getVacancyBySlug(slug), getWorkingConditions()]);
  const indexable = isIndexable(envSite, company.publication.approved);

  if (!vacancy || vacancy.status !== "open") notFound();

  const scheduleFacts = [
    vacancy.schedule && { label: "Horario de este puesto", value: vacancy.schedule },
    wc.scheduleStatement && { label: "Jornada", value: wc.scheduleStatement },
    wc.overtimeStatement && { label: "Horas extra", value: wc.overtimeStatement },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  const restFacts = [
    wc.vacationStatement && { label: "Vacaciones", value: wc.vacationStatement },
    wc.holidaysStatement && { label: "Festivos", value: wc.holidaysStatement },
    wc.weeklyRestStatement && { label: "Descanso semanal", value: wc.weeklyRestStatement },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  const travelFacts = [
    vacancy.travelExpectations && { label: "Desplazamientos de este puesto", value: vacancy.travelExpectations },
    wc.vehicleArrangementNote && { label: "Vehículo", value: wc.vehicleArrangementNote },
    wc.travelTimeStatement && { label: "Tiempo de desplazamiento", value: wc.travelTimeStatement },
    wc.travelJourneysNote && { label: "Trayectos que cuentan", value: wc.travelJourneysNote },
    wc.travelDestinationsNote && { label: "Destinos y frecuencia", value: wc.travelDestinationsNote },
    wc.overnightStaysNote && { label: "Pernoctas", value: wc.overnightStaysNote },
    wc.expensesCoveredNote && { label: "Gastos cubiertos", value: wc.expensesCoveredNote },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  const contractFacts = [
    vacancy.contractType && { label: "Tipo de contrato", value: contractLabels[vacancy.contractType] },
    wc.collectiveAgreementStatement && { label: "Convenio colectivo aplicable", value: wc.collectiveAgreementStatement },
    wc.employmentStatement && { label: "Formalización y pago", value: wc.employmentStatement },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  return (
    <>
      <PageHeader eyebrow={`Puestos · ${vacancy.location ?? company.location.city}`} title={vacancy.title}>
        {vacancy.summary ? <p>{vacancy.summary}</p> : null}
      </PageHeader>

      <Container className="grid max-w-3xl gap-8 py-14 sm:py-20">
        {vacancy.summary ? (
          <Section letter="A" title="Descripción del puesto">
            <p>{vacancy.summary}</p>
          </Section>
        ) : null}

        {vacancy.responsibilities.length > 0 ? (
          <Section letter="B" title="Responsabilidades habituales">
            <List items={vacancy.responsibilities} />
          </Section>
        ) : null}

        {vacancy.essentialRequirements.length > 0 || vacancy.desirableRequirements.length > 0 ? (
          <Section letter="C" title="Requisitos y experiencia">
            {vacancy.essentialRequirements.length > 0 ? (
              <div>
                <h3 className="font-bold text-navy-900">Imprescindible</h3>
                <div className="mt-2">
                  <List items={vacancy.essentialRequirements} />
                </div>
              </div>
            ) : null}
            {vacancy.desirableRequirements.length > 0 ? (
              <div>
                <h3 className="font-bold text-navy-900">Valorable</h3>
                <div className="mt-2">
                  <List items={vacancy.desirableRequirements} />
                </div>
              </div>
            ) : null}
          </Section>
        ) : null}

        {vacancy.salaryRange ? (
          <Section letter="D" title="Salario">
            <p className="text-lg font-bold text-navy-900">{formatSalaryOrientativo(vacancy.salaryRange)}</p>
            <p className="text-muted">
              Es un importe bruto anual orientativo, pendiente de confirmación definitiva por la empresa; el importe neto
              depende de las retenciones fiscales y de la Seguridad Social aplicables en cada caso.
            </p>
          </Section>
        ) : null}

        {scheduleFacts.length > 0 ? (
          <Section letter="E" title="Horarios y jornada laboral">
            <dl className="grid gap-4 sm:grid-cols-2">
              {scheduleFacts.map((f) => (
                <Fact key={f.label} label={f.label}>
                  {f.value}
                </Fact>
              ))}
            </dl>
          </Section>
        ) : null}

        {restFacts.length > 0 ? (
          <Section letter="F" title="Vacaciones, festivos y descansos">
            <dl className="grid gap-4 sm:grid-cols-2">
              {restFacts.map((f) => (
                <Fact key={f.label} label={f.label}>
                  {f.value}
                </Fact>
              ))}
            </dl>
          </Section>
        ) : null}

        {travelFacts.length > 0 ? (
          <Section letter="G" title="Desplazamientos y trabajo en obra">
            <dl className="grid gap-4 sm:grid-cols-2">
              {travelFacts.map((f) => (
                <Fact key={f.label} label={f.label}>
                  {f.value}
                </Fact>
              ))}
            </dl>
          </Section>
        ) : null}

        {contractFacts.length > 0 ? (
          <Section letter="H" title="Contrato y condiciones laborales">
            <dl className="grid gap-4 sm:grid-cols-2">
              {contractFacts.map((f) => (
                <Fact key={f.label} label={f.label}>
                  {f.value}
                </Fact>
              ))}
            </dl>
          </Section>
        ) : null}

        {vacancy.learningOpportunities.length > 0 ? (
          <Section letter="I" title="Qué puedes aprender">
            <List items={vacancy.learningOpportunities} />
          </Section>
        ) : null}

        <p className="text-sm text-muted">
          Puedes ver el resto de condiciones comunes a todos los puestos en{" "}
          <Link href="/trabaja-con-nosotros#condiciones-de-trabajo" className="font-semibold text-accent underline-offset-4 hover:underline">
            Condiciones de trabajo
          </Link>
          .
        </p>

        <Section letter="J" title="Solicitar el puesto">
          {vacancy.applicationInstructions ? <p>{vacancy.applicationInstructions}</p> : null}
          <div>
            <ButtonLink href={`/trabaja-con-nosotros?puesto=${encodeURIComponent(vacancy.title)}#aplicar`} className="text-lg sm:px-7">
              Presentar mi candidatura
            </ButtonLink>
          </div>
        </Section>
      </Container>

      <JsonLd data={jobPostingData(company, vacancy, indexable)} />
    </>
  );
}
