import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { HeroVisual } from "@/components/HeroVisual";
import { JsonLd } from "@/components/JsonLd";
import { getCompany } from "@/content/company";
import { getHomePage, getSeoSettings } from "@/content/pages";
import { envSite, isIndexable } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { pageEntityData, websiteData } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const [company, seo] = await Promise.all([getCompany(), getSeoSettings()]);
  const indexable = isIndexable(envSite, company.publication.approved);
  return {
    ...pageMetadata(
      {
        title: `Ventilación y climatización en ${company.location.city}`,
        description: `${company.brand.name}: ventilación, climatización y aire acondicionado en ${company.location.city}. Conoce nuestros servicios y cómo trabajar con nosotros.`,
        path: "/",
      },
      { company, indexable, seo: seo.home },
    ),
    title: { absolute: seo.home.metaTitle || `${company.brand.name} · Ventilación y climatización en ${company.location.city}` },
  };
}

export default async function HomePage() {
  const [company, home] = await Promise.all([getCompany(), getHomePage()]);
  const homeServices = company.services.filter((service) => service.id !== "aire-acondicionado");
  const indexable = isIndexable(envSite, company.publication.approved);
  const description = `${company.brand.name}: ventilación, climatización y aire acondicionado en ${company.location.city}. Conoce nuestros servicios y cómo trabajar con nosotros.`;

  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-navy-900 text-white">
        <HeroVisual className="absolute inset-y-0 right-0 -z-10 h-full w-full opacity-60 md:w-[62%] md:opacity-100" />
        <Container className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              {home.heroHeadline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200 sm:text-xl">{home.heroSubtext}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/servicios" variant="secondary-dark">
                {home.secondaryCtaLabel}
              </ButtonLink>
              <ButtonLink href="/trabaja-con-nosotros#puestos-abiertos" className="text-lg sm:px-7">
                {home.primaryCtaLabel}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="areas-titulo" className="bg-white py-16 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <h2 id="areas-titulo" className="text-3xl font-bold sm:text-4xl">
              Áreas de trabajo
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              En {company.brand.name} trabajamos en {homeServices.map((s) => s.name.toLowerCase()).join(" y ")}.
            </p>
          </div>
          <ol className="mt-12 grid border-t border-line md:grid-cols-2">
            {homeServices.map((service, index) => (
              <li
                key={service.id}
                className="border-b border-line py-8 md:border-b-0 md:bg-[linear-gradient(to_bottom,var(--color-line),var(--color-line))] md:bg-left md:bg-no-repeat md:px-8 md:first:bg-none md:first:pl-0 md:[background-size:1px_100%]"
              >
                <p aria-hidden="true" className="text-sm font-bold tracking-[0.12em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-2xl font-bold">{service.name}</h3>
                <p className="mt-3 leading-relaxed text-muted">{service.summary}</p>
                <Link
                  href="/servicios"
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-accent underline-offset-4 hover:underline"
                >
                  Más sobre {service.name.toLowerCase()}
                  <span aria-hidden="true" className="ml-1">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <JsonLd data={websiteData(company, indexable)} />
      <JsonLd
        data={pageEntityData({
          company,
          indexable,
          path: "/",
          name: `Ventilación y climatización en ${company.location.city}`,
          description,
        })}
      />
    </>
  );
}
