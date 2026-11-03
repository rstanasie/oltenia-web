import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { getCompany } from "@/content/company";
import { getVacancyBySlug, getVacancySlugs } from "@/content/pages";
import { contractLabels, formatSalary } from "@/lib/content";
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

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-bold text-navy-900">{title}</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-accent">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function VacancyPage({ params }: PageProps<"/puestos/[slug]">) {
  const { slug } = await params;
  const [company, vacancy] = await Promise.all([getCompany(), getVacancyBySlug(slug)]);
  const indexable = isIndexable(envSite, company.publication.approved);

  if (!vacancy || vacancy.status !== "open") notFound();

  const facts = [
    vacancy.location && { label: "Ubicación", value: vacancy.location },
    vacancy.travelExpectations && { label: "Desplazamientos", value: vacancy.travelExpectations },
    vacancy.schedule && { label: "Horario", value: vacancy.schedule },
    vacancy.contractType && { label: "Contrato", value: contractLabels[vacancy.contractType] },
    vacancy.salaryRange && { label: "Retribución", value: formatSalary(vacancy.salaryRange) },
    vacancy.drivingLicence && { label: "Carné de conducir", value: vacancy.drivingLicence },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <>
      <PageHeader eyebrow="Puestos" title={vacancy.title}>
        {vacancy.summary ? <p>{vacancy.summary}</p> : null}
      </PageHeader>

      <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_20rem]">
        <div className="grid gap-10">
          <List title="Qué harás" items={vacancy.responsibilities} />
          {vacancy.essentialRequirements.length > 0 || vacancy.desirableRequirements.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <List title="Qué necesitas — imprescindible" items={vacancy.essentialRequirements} />
              <List title="Qué necesitas — valorable" items={vacancy.desirableRequirements} />
            </div>
          ) : null}
          <List title="Qué puedes aprender" items={vacancy.learningOpportunities} />
          {vacancy.applicationInstructions ? (
            <p className="max-w-prose leading-relaxed">
              <strong className="text-navy-900">Cómo presentarte: </strong>
              {vacancy.applicationInstructions}
            </p>
          ) : null}

          <div>
            <ButtonLink href={`/trabaja-con-nosotros?puesto=${encodeURIComponent(vacancy.title)}#aplicar`}>
              Presentar mi candidatura
            </ButtonLink>
          </div>
        </div>

        {facts.length > 0 ? (
          <dl className="h-fit grid gap-5 rounded-xl border border-line bg-white p-6">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm font-semibold text-muted">{fact.label}</dt>
                <dd className="font-semibold text-navy-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>

      <JsonLd data={jobPostingData(company, vacancy, indexable)} />
    </>
  );
}
