import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ButtonLink } from "@/components/Button";
import { CareerJourney } from "@/components/CareerJourney";
import { Container } from "@/components/Container";
import { LightboxProvider } from "@/components/Lightbox";
import { NarrativePhoto } from "@/components/NarrativePhoto";
import { VacancyList } from "@/components/VacancyList";
import { getCompany } from "@/content/company";
import { getCareerStages } from "@/content/careerStages";
import { getRecruitmentPage, getSeoSettings } from "@/content/pages";
import { findPhoto, openVacancies, recruitmentChannels } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [company, seo] = await Promise.all([getCompany(), getSeoSettings()]);
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    {
      title: "Trabaja con nosotros",
      description: `Descubre el oficio de instalador de ventilación y climatización en ${company.location.city}, cómo se desarrolla profesionalmente y cómo presentarte a ${company.brand.name}.`,
      path: "/trabaja-con-nosotros",
    },
    { company, indexable, seo: seo.trabajaConNosotros },
  );
}

const discoverPoints = [
  "Interpretar planos y dibujos técnicos.",
  "Trabajar con materiales diferentes.",
  "Instalar soportes y anclajes.",
  "Medir y adaptar los conductos a cada espacio.",
  "Entender cómo se distribuye el aire.",
  "Resolver imprevistos durante la obra.",
  "Trabajar con seguridad en altura y en entornos complejos.",
  "Coordinarse con otros oficios de la construcción.",
  "Aprender con la experiencia real, instalación a instalación.",
];

export default async function RecruitmentPage() {
  const [company, hero, careerStages] = await Promise.all([getCompany(), getRecruitmentPage(), getCareerStages()]);
  const indexable = isIndexable(envSite, company.publication.approved);
  const vacancies = openVacancies(company);
  const channels = recruitmentChannels(company);
  const projects = company.photos.projects;
  const pick = (filename: string) => findPhoto(projects, filename);

  const heroPhoto = pick("instalacion-conductos-fachada-01.jpg");
  const discoverPhotos = [
    pick("instalacion-conductos-nave-01.jpg"),
    pick("equipos-climatizacion-01.jpg"),
    pick("conductos-textiles-03.jpg"),
  ].filter((p): p is NonNullable<typeof p> => p !== null);

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
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/trabaja-con-nosotros#camino" className="text-lg sm:px-7">
                {hero.primaryCtaLabel}
              </ButtonLink>
              <ButtonLink href="/trabaja-con-nosotros#aplicar" variant="secondary-dark">
                {hero.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* B. DESCUBRE EL OFICIO */}
      <section aria-labelledby="oficio-titulo" className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <h2 id="oficio-titulo" className="text-3xl font-bold sm:text-4xl">
                Mucho más que instalar conductos
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Instalar ventilación y climatización combina conocimiento técnico, destreza manual y capacidad de
                resolver problemas sobre la marcha. Cada instalación presenta desafíos diferentes, y trabajar en
                este oficio significa, entre otras cosas:
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {discoverPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 leading-relaxed">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-muted">
                Una buena instalación requiere mucho más que montar conductos. Si quieres ver cómo se trabaja una
                pieza en detalle, lo explicamos en{" "}
                <Link href="/en-detalle" className="font-semibold text-accent underline-offset-4 hover:underline">
                  En detalle
                </Link>
                .
              </p>
            </div>
            {discoverPhotos.length > 0 ? (
              <div className="grid gap-4">
                <NarrativePhoto photo={discoverPhotos[0] ?? null} aspect="aspect-[16/10]" />
                <div className="grid grid-cols-2 gap-4">
                  {discoverPhotos.slice(1).map((photo) => (
                    <NarrativePhoto key={photo.src} photo={photo} aspect="aspect-[4/3]" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* C. TU CAMINO EN EL OFICIO */}
      <section id="camino" aria-labelledby="camino-titulo" className="scroll-mt-16 py-16 sm:py-24">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">Desarrollo profesional</p>
          <h2 id="camino-titulo" className="mt-2 text-3xl font-bold sm:text-4xl">
            Tu camino en el oficio
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Cada profesional empieza desde un punto diferente. Algunos descubren el oficio desde cero; otros llegan
            con años de experiencia. Lo importante es desarrollar conocimientos, autonomía y capacidad para afrontar
            nuevos retos.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Esta progresión es una representación orientativa del desarrollo profesional en el oficio, no una
            clasificación laboral oficial. El convenio colectivo del metal de Zaragoza organiza la clasificación en
            grupos profesionales; los nombres tradicionales —peón, oficial de tercera, de segunda, de primera,
            encargado— son las denominaciones habituales del oficio, y son las que usamos aquí de forma ilustrativa,
            no como una promoción garantizada.
          </p>

          {careerStages.length > 0 ? (
            <div className="mt-10">
              <CareerJourney stages={careerStages} />
            </div>
          ) : null}
        </Container>
      </section>

      {/* D. DÓNDE ENCAJAS TÚ */}
      <section aria-labelledby="encajas-titulo" className="bg-white pt-16 pb-10 sm:pt-24 sm:pb-14">
        <Container>
          <h2 id="encajas-titulo" className="text-3xl font-bold sm:text-4xl">
            ¿Dónde encajas tú?
          </h2>
          <div className="mt-6 max-w-4xl">
            <p className="text-lg leading-relaxed text-muted">
              Si tienes experiencia en ventilación, climatización, montaje de conductos o algún oficio relacionado
              de la construcción, puedes presentarte directamente: valoramos el conocimiento técnico, la
              experiencia práctica y la responsabilidad en obra. Y si no tienes experiencia previa pero te
              interesa desarrollar un oficio técnico, también puedes escribirnos — valoramos la curiosidad, la
              disposición a aprender y el compromiso. No podemos confirmar de antemano si tu perfil encaja con
              las necesidades actuales del equipo, pero nos interesa conocerlo.
            </p>
            <div className="mt-6 flex justify-center">
              <ButtonLink href="/trabaja-con-nosotros#aplicar">
                Quiero presentar mi candidatura
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* OFERTAS ABIERTAS (si existen) */}
      {vacancies.length > 0 ? (
        <section aria-labelledby="ofertas-titulo" className="py-16 sm:py-24">
          <Container>
            <h2 id="ofertas-titulo" className="text-3xl font-bold sm:text-4xl">
              Ofertas abiertas
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
              Si ninguna encaja contigo, también puedes presentarte de forma general más abajo.
            </p>
            <div className="mt-8">
              <VacancyList company={company} vacancies={vacancies} indexable={indexable} />
            </div>
          </Container>
        </section>
      ) : null}

      {/* E. FORMA PARTE DE OLTENIA */}
      <section id="aplicar" aria-labelledby="aplicar-titulo" className="scroll-mt-16 bg-white pt-10 pb-16 sm:pt-14 sm:pb-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
            <div>
              <h2 id="aplicar-titulo" className="text-3xl font-bold sm:text-4xl">
                Forma parte de Oltenia
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                Para una primera presentación no hace falta enviar un currículum: basta con contarnos tu experiencia
                y tu disponibilidad.
              </p>
              <div className="mt-8">
                <Suspense fallback={null}>
                  <ApplicationForm
                    channels={channels}
                    areas={company.services.map((service) => service.name)}
                    brandName={company.brand.name}
                  />
                </Suspense>
              </div>
            </div>
            <div className="grid gap-8">
              <div>
                <h3 className="text-lg font-bold text-navy-900">Dónde estamos</h3>
                <p className="mt-2 leading-relaxed text-muted">
                  {company.location.city}, {company.location.country}
                  {company.serviceDetails.serviceArea ? ` · ${company.serviceDetails.serviceArea}` : ""}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900">En qué trabajamos</h3>
                <ul className="mt-2 grid gap-1.5">
                  {company.services.map((service) => (
                    <li key={service.id} className="leading-relaxed text-muted">
                      {service.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </LightboxProvider>
  );
}
