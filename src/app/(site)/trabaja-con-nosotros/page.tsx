import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { DirectContactCard } from "@/components/DirectContactCard";
import { LightboxProvider } from "@/components/Lightbox";
import { NarrativePhoto } from "@/components/NarrativePhoto";
import { VacancyCards } from "@/components/VacancyCards";
import { getCompany } from "@/content/company";
import { getRecruitmentPage, getSeoSettings, getWorkingConditions } from "@/content/pages";
import { findPhoto, openVacancies, publicAddress, recruitmentChannels } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [company, seo] = await Promise.all([getCompany(), getSeoSettings()]);
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    {
      title: "Trabaja con nosotros",
      description: `Puestos abiertos en instalación de ventilación y climatización en ${company.location.city}, y cómo presentarte a ${company.brand.name}.`,
      path: "/trabaja-con-nosotros",
    },
    { company, indexable, seo: seo.trabajaConNosotros },
  );
}

const discoverPoints = [
  "Interpretar planos y dibujos técnicos.",
  "Medir y adaptar los conductos a cada espacio.",
  "Entender cómo se distribuye el aire.",
  "Resolver imprevistos durante la obra.",
  "Coordinarse con otros oficios de la construcción.",
];

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-l-4 border-accent pl-4">
      <dt className="text-sm font-bold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-1 leading-relaxed text-navy-900">{children}</dd>
    </div>
  );
}

export default async function RecruitmentPage() {
  const [company, hero, workingConditions] = await Promise.all([getCompany(), getRecruitmentPage(), getWorkingConditions()]);
  const vacancies = openVacancies(company);
  const channels = recruitmentChannels(company);
  const address = publicAddress(company);
  const projects = company.photos.projects;
  const pick = (filename: string) => findPhoto(projects, filename);

  const heroPhoto = pick("instalacion-conductos-fachada-01.jpg");
  const discoverPhoto = pick("instalacion-conductos-fachada-01.jpg");

  return (
    <LightboxProvider>
      {/* HERO */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-900 text-white">
        {heroPhoto ? (
          <div className="absolute inset-0 -z-10">
            <NarrativePhoto photo={heroPhoto} aspect="aspect-auto h-full" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
          </div>
        ) : null}
        <Container className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">
              {hero.heroEyebrow || `Empleo · ${company.location.city}`}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">{hero.heroHeadline}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200 sm:text-xl">{hero.heroSubtext}</p>
            <div className="mt-10">
              <ButtonLink href="/trabaja-con-nosotros#puestos" className="text-lg sm:px-7">
                {hero.primaryCtaLabel}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* A. PUESTOS ABIERTOS */}
      <section id="puestos" aria-labelledby="puestos-titulo" className="scroll-mt-16 bg-white py-16 sm:py-24">
        <Container>
          <h2 id="puestos-titulo" className="text-3xl font-bold sm:text-4xl">
            Puestos abiertos
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Estas son las formas en las que puedes incorporarte a los equipos de instalación de ventilación y
            climatización de {company.brand.name}, según tu nivel de experiencia.
          </p>
          <div className="mt-10">
            <VacancyCards vacancies={vacancies} />
          </div>

          {/* B. NO SABES QUÉ PUESTO */}
          <div id="aplicar" className="mt-10 scroll-mt-16 sm:mt-12">
            <h3 className="text-lg font-bold">¿No sabes qué puesto encaja contigo?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Cuéntanos tu experiencia y te decimos si encajas en el equipo. Si no tienes experiencia, no te
              preocupes: el requerimiento más importante es tu actitud y tus ganas de aprender el oficio.
            </p>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border-l-4 border-accent bg-paper p-6">
                <ApplicationForm channels={channels} brandName={company.brand.name} />
              </div>
              <DirectContactCard
                phone={company.customerContact.phone}
                whatsapp={company.customerContact.whatsapp}
                email={channels.email}
                address={address}
                mapUrl={company.customerContact.mapUrl}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* C. MUCHO MÁS QUE INSTALAR CONDUCTOS */}
      <section aria-labelledby="oficio-titulo" className="bg-paper py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 id="oficio-titulo" className="text-3xl font-bold sm:text-4xl">
                Mucho más que instalar conductos
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Instalar ventilación y climatización combina conocimiento técnico, destreza manual y capacidad de
                resolver problemas sobre la marcha. En el día a día, esto significa:
              </p>
              <ul className="mt-6 grid gap-2.5">
                {discoverPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 leading-relaxed">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-muted">
                Si quieres ver cómo se trabaja una pieza en detalle, lo explicamos en{" "}
                <Link href="/en-detalle" className="font-semibold text-accent underline-offset-4 hover:underline">
                  En detalle
                </Link>
                .
              </p>
            </div>
            {discoverPhoto ? (
              <div className="min-h-64 lg:h-full">
                <NarrativePhoto photo={discoverPhoto} aspect="aspect-[4/3] lg:aspect-auto lg:h-full" />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* D. CONDICIONES DE TRABAJO */}
      {workingConditions.hasContent ? (
        <section id="condiciones-de-trabajo" aria-labelledby="condiciones-titulo" className="scroll-mt-16 bg-white py-16 sm:py-24">
          <Container>
            <h2 id="condiciones-titulo" className="text-3xl font-bold sm:text-4xl">
              Condiciones de trabajo
            </h2>
            <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {workingConditions.employmentStatement ? <Fact label="Contratación y retribución">{workingConditions.employmentStatement}</Fact> : null}
              {workingConditions.collectiveAgreementStatement ? <Fact label="Convenio colectivo aplicable">{workingConditions.collectiveAgreementStatement}</Fact> : null}
              {workingConditions.scheduleStatement ? <Fact label="Horario">{workingConditions.scheduleStatement}</Fact> : null}
              {workingConditions.vacationStatement ? <Fact label="Vacaciones">{workingConditions.vacationStatement}</Fact> : null}
              {workingConditions.holidaysStatement ? <Fact label="Festivos">{workingConditions.holidaysStatement}</Fact> : null}
              {workingConditions.vehicleArrangementNote ? <Fact label="Desplazamientos">{workingConditions.vehicleArrangementNote}</Fact> : null}
              {workingConditions.travelJourneysNote ? <Fact label="Trayectos que se cuentan">{workingConditions.travelJourneysNote}</Fact> : null}
              {workingConditions.travelDestinationsNote ? <Fact label="Destinos y frecuencia">{workingConditions.travelDestinationsNote}</Fact> : null}
              {workingConditions.overnightStaysNote ? <Fact label="Pernoctas">{workingConditions.overnightStaysNote}</Fact> : null}
              {workingConditions.expensesCoveredNote ? <Fact label="Gastos cubiertos">{workingConditions.expensesCoveredNote}</Fact> : null}
              {workingConditions.siteSafetyStatement ? <Fact label="Seguridad en obra">{workingConditions.siteSafetyStatement}</Fact> : null}
              {workingConditions.trainingStatement ? <Fact label="Formación y aprendizaje">{workingConditions.trainingStatement}</Fact> : null}
              {workingConditions.overtimeStatement ? <Fact label="Horas extra">{workingConditions.overtimeStatement}</Fact> : null}
            </dl>
            {workingConditions.companyBaseNote ? (
              <p className="mt-10 max-w-2xl leading-relaxed text-muted">{workingConditions.companyBaseNote}</p>
            ) : null}
          </Container>
        </section>
      ) : null}

      {/* E. CON QUIÉN TRABAJARÁS */}
      <section aria-labelledby="equipo-titulo" className="bg-paper py-14 sm:py-20">
        <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="equipo-titulo" className="text-2xl font-bold">
              Con quién trabajarás
            </h2>
            <p className="mt-2 max-w-xl leading-relaxed text-muted">
              {company.brand.name} está dirigida por sus fundadores, que participan directamente en cada proyecto.
              Conoce al equipo en «Quiénes somos».
            </p>
          </div>
          <ButtonLink href="/sobre-oltenia" variant="secondary" className="shrink-0">
            Quiénes somos
          </ButtonLink>
        </Container>
      </section>
    </LightboxProvider>
  );
}
