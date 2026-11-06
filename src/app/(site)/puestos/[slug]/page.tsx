import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { SolicitudForm } from "@/components/SolicitudForm";
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

function List({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="list-disc space-y-1.5 pl-5 leading-relaxed marker:text-accent">
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

  const conditionFacts = [
    wc.employmentStatement && { label: "Contratación y retribución", value: wc.employmentStatement },
    wc.collectiveAgreementStatement && { label: "Convenio colectivo aplicable", value: wc.collectiveAgreementStatement },
    vacancy.schedule && { label: "Horario de este puesto", value: vacancy.schedule },
    wc.scheduleStatement && { label: "Horario", value: wc.scheduleStatement },
    vacancy.contractType && { label: "Tipo de contrato", value: contractLabels[vacancy.contractType] },
    wc.vacationStatement && { label: "Vacaciones", value: wc.vacationStatement },
    vacancy.travelExpectations && { label: "Desplazamientos de este puesto", value: vacancy.travelExpectations },
    wc.vehicleArrangementNote && { label: "Desplazamientos", value: wc.vehicleArrangementNote },
    wc.expensesCoveredNote && { label: "Gastos cubiertos", value: wc.expensesCoveredNote },
    wc.siteSafetyStatement && { label: "Seguridad en obra", value: wc.siteSafetyStatement },
    wc.trainingStatement && { label: "Formación y aprendizaje", value: wc.trainingStatement },
    wc.overtimeStatement && { label: "Horas extra", value: wc.overtimeStatement },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  return (
    <>
      <PageHeader eyebrow={`Puestos · ${vacancy.location ?? company.location.city}`} title={vacancy.title}>
        {vacancy.summary ? <p>{vacancy.summary}</p> : null}
        {vacancy.salaryRange ? <p className="text-base text-muted">{formatSalaryOrientativo(vacancy.salaryRange)}</p> : null}
      </PageHeader>

      <Container className="grid max-w-3xl gap-10 py-14 sm:py-20">
        {vacancy.responsibilities.length > 0 ? (
          <section>
            <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">Qué harás</h2>
            <div className="mt-4">
              <List items={vacancy.responsibilities} />
            </div>
          </section>
        ) : null}

        {vacancy.essentialRequirements.length > 0 || vacancy.desirableRequirements.length > 0 ? (
          <section>
            <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">Qué buscamos</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
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
            </div>
          </section>
        ) : null}

        {conditionFacts.length > 0 ? (
          <section>
            <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">Condiciones laborales</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {conditionFacts.map((f) => (
                <Fact key={f.label} label={f.label}>
                  {f.value}
                </Fact>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="rounded-lg border-l-4 border-accent bg-paper p-6">
          <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">Presentar mi candidatura</h2>
          {vacancy.applicationInstructions ? <p className="mt-2 text-muted">{vacancy.applicationInstructions}</p> : null}
          <div className="mt-6">
            <SolicitudForm vacancyTitle={vacancy.title} vacancySlug={vacancy.id} />
          </div>
        </section>
      </Container>

      <JsonLd data={jobPostingData(company, vacancy, indexable)} />
    </>
  );
}
