import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ContactActions } from "@/components/ContactActions";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getCompany } from "@/content/company";
import { getSeoSettings } from "@/content/pages";
import { formatAddress, formatPhone, hasAnyChannel, mailtoHref, mapHref, telHref, whatsappHref } from "@/lib/contact";
import { customerChannels, publicAddress, recruitmentChannels } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [company, seo] = await Promise.all([getCompany(), getSeoSettings()]);
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    {
      title: "Contacto",
      description: `Datos de contacto de ${company.brand.name}, empresa de ventilación, climatización y aire acondicionado en ${company.location.city}.`,
      path: "/contacto",
    },
    { company, indexable, seo: seo.contacto },
  );
}

const linkClass = "inline-flex min-h-11 items-center font-semibold text-accent underline-offset-4 hover:underline break-all";

export default async function ContactPage() {
  const company = await getCompany();
  const channels = customerChannels(company);
  const recruitment = recruitmentChannels(company);
  const address = publicAddress(company);
  const { openingHours } = company.customerContact;
  const { serviceArea } = company.serviceDetails;
  const separateRecruitment = !company.recruitmentContact.sameAsCustomer && hasAnyChannel(recruitment);
  const hasDetails = hasAnyChannel(channels) || address || openingHours.length > 0 || serviceArea;

  const rows: { label: string; value: ReactNode }[] = [
    ...(channels.phone ? [{
      label: "Teléfono",
      value: <a className={linkClass} href={telHref(channels.phone)}>{formatPhone(channels.phone)}</a>,
    }] : []),
    ...(channels.whatsapp ? [{
      label: "WhatsApp",
      value: (
        <a className={linkClass} href={whatsappHref(channels.whatsapp)} target="_blank" rel="noopener noreferrer">
          {formatPhone(channels.whatsapp)}
          <span className="sr-only"> (se abre en una ventana nueva)</span>
        </a>
      ),
    }] : []),
    ...(channels.email ? [{
      label: "Correo electrónico",
      value: (
        <a className={linkClass} href={mailtoHref(channels.email, `Consulta desde la web de ${company.brand.name}`)}>
          {channels.email}
        </a>
      ),
    }] : []),
    ...(address ? [{
      label: "Dirección",
      value: (
        <>
          <address className="not-italic">{formatAddress(address)}</address>
          <a className={linkClass} href={mapHref(address, company.customerContact.mapUrl)} target="_blank" rel="noopener noreferrer">
            Ver en el mapa<span className="sr-only"> (se abre en una ventana nueva)</span>
          </a>
        </>
      ),
    }] : []),
    ...(openingHours.length > 0 ? [{
      label: "Horario",
      value: (
        <ul>
          {openingHours.map((h) => (
            <li key={h.days}>
              {h.days}: {h.hours}
            </li>
          ))}
        </ul>
      ),
    }] : []),
    ...(serviceArea ? [{ label: "Zona de trabajo", value: serviceArea }] : []),
  ];

  return (
    <>
      <PageHeader eyebrow={`${company.location.city}, ${company.location.country}`} title="Contacto">
        <p>Consultas sobre ventilación, climatización y aire acondicionado.</p>
      </PageHeader>

      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="datos-titulo">
          <h2 id="datos-titulo" className="text-2xl font-bold sm:text-3xl">
            Datos de contacto
          </h2>
          {hasDetails ? (
            <>
              <div className="mt-6">
                <ContactActions
                  channels={channels}
                  emailSubject={`Consulta desde la web de ${company.brand.name}`}
                  emptyMessage="No hay canales directos de contacto publicados."
                />
              </div>
              <dl className="mt-8 divide-y divide-line rounded-lg border border-line bg-white">
                {rows.map((row) => (
                  <div key={row.label} className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-4">
                    <dt className="font-semibold text-muted">{row.label}</dt>
                    <dd className="text-navy-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <div className="mt-6 rounded-lg border border-line bg-white p-6">
              <p className="text-lg font-semibold text-navy-900">Datos de contacto no disponibles todavía.</p>
              <p className="mt-2 leading-relaxed text-muted">
                Estamos preparando esta información. {company.brand.name} está en {company.location.city},{" "}
                {company.location.country}.
              </p>
            </div>
          )}
        </section>

        <aside aria-labelledby="empleo-titulo" className="h-fit rounded-xl bg-navy-900 p-8 text-white on-dark">
          <h2 id="empleo-titulo" className="text-2xl font-bold text-white">
            ¿Buscas trabajo?
          </h2>
          <p className="mt-3 leading-relaxed text-navy-200">
            Si te interesa trabajar en {company.brand.name}, consulta cómo presentarte.
          </p>
          {separateRecruitment ? (
            <div className="mt-6">
              <ContactActions
                channels={recruitment}
                tone="dark"
                whatsappMessage={company.recruitment.whatsappMessage}
                emailSubject={company.recruitment.emailSubject}
                emailBody={company.recruitment.emailBody}
                emptyMessage=""
              />
            </div>
          ) : null}
          <Link href="/trabaja-con-nosotros" className="mt-6 inline-flex min-h-11 items-center font-semibold text-accent-soft underline-offset-4 hover:underline">
            Trabaja con nosotros<span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </aside>
      </Container>
    </>
  );
}
