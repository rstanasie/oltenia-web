import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ContactActions } from "@/components/ContactActions";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { getCompany } from "@/content/company";
import { getSeoSettings } from "@/content/pages";
import { formatAddress, formatPhone, hasAnyChannel, mailtoHref, mapHref, telHref, whatsappHref } from "@/lib/contact";
import { customerChannels, publicAddress, recruitmentChannels } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";
import { pageEntityData } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const [company, seo] = await Promise.all([getCompany(), getSeoSettings()]);
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    {
      title: "Contacto",
      description: `Cómo presentarte a un puesto en ${company.brand.name} o contactar por una consulta sobre ventilación, climatización y aire acondicionado en ${company.location.city}.`,
      path: "/contacto",
    },
    { company, indexable, seo: seo.contacto },
  );
}

const linkClass = "inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline break-all";

export default async function ContactPage() {
  const company = await getCompany();
  const indexable = isIndexable(envSite, company.publication.approved);
  const recruitment = recruitmentChannels(company);
  const customer = customerChannels(company);
  const address = publicAddress(company);
  const { openingHours } = company.customerContact;
  const { serviceArea } = company.serviceDetails;
  const hasCustomerDetails = hasAnyChannel(customer) || address || openingHours.length > 0 || serviceArea;

  const customerRows: { label: string; value: ReactNode }[] = [
    ...(customer.phone ? [{
      label: "Teléfono",
      value: <a className={`${linkClass} text-accent`} href={telHref(customer.phone)}>{formatPhone(customer.phone)}</a>,
    }] : []),
    ...(customer.whatsapp ? [{
      label: "WhatsApp",
      value: (
        <a className={`${linkClass} text-accent`} href={whatsappHref(customer.whatsapp)} target="_blank" rel="noopener noreferrer">
          {formatPhone(customer.whatsapp)}
          <span className="sr-only"> (se abre en una ventana nueva)</span>
        </a>
      ),
    }] : []),
    ...(customer.email ? [{
      label: "Correo electrónico",
      value: (
        <a className={`${linkClass} text-accent`} href={mailtoHref(customer.email, `Consulta desde la web de ${company.brand.name}`)}>
          {customer.email}
        </a>
      ),
    }] : []),
    ...(address ? [{
      label: "Dirección",
      value: (
        <>
          <address className="not-italic">{formatAddress(address)}</address>
          <a className={`${linkClass} text-accent`} href={mapHref(address, company.customerContact.mapUrl)} target="_blank" rel="noopener noreferrer">
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
      <PageHeader title="Contacto">
        <p>¿Buscas trabajo con nosotros o tienes una consulta sobre nuestros servicios? Aquí tienes cómo escribirnos.</p>
      </PageHeader>

      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="empleo-titulo" className="rounded-xl border-2 border-accent bg-white p-8">
          <h2 id="empleo-titulo" className="text-2xl font-bold sm:text-3xl">
            ¿Quieres trabajar con nosotros?
          </h2>
          <p className="mt-4 max-w-prose leading-relaxed text-muted">
            Si buscas trabajo en el sector de la climatización y ventilación, o te gustaría aprender el oficio, ponte en
            contacto con nosotros. Cuéntanos tu experiencia y qué tipo de trabajo estás buscando.
          </p>

          <div className="mt-6">
            <ContactActions
              channels={recruitment}
              whatsappMessage={company.recruitment.whatsappMessage}
              emailSubject={company.recruitment.emailSubject}
              emailBody={company.recruitment.emailBody}
              emptyMessage="Todavía no hemos publicado un canal de contacto para candidaturas."
            />
          </div>

          {recruitment.email ? (
            <p className="mt-4 text-sm text-muted">
              O copia nuestro correo y escríbenos desde tu propio cliente de correo:{" "}
              <span className="select-all font-mono font-semibold text-navy-900">{recruitment.email}</span>
            </p>
          ) : null}

          <Link href="/trabaja-con-nosotros#puestos-abiertos" className="mt-6 inline-flex min-h-11 items-center font-semibold text-accent underline-offset-4 hover:underline">
            Ver puestos abiertos<span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </section>

        <aside aria-labelledby="comercial-titulo" className="h-fit rounded-xl border border-line bg-paper p-8">
          <h2 id="comercial-titulo" className="text-xl font-bold text-navy-900">
            Consultas comerciales
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Si tienes una consulta sobre nuestros servicios de ventilación, climatización o aire acondicionado, escríbenos.
          </p>
          {hasCustomerDetails ? (
            <>
              <div className="mt-6">
                <ContactActions
                  channels={customer}
                  emailSubject={`Consulta desde la web de ${company.brand.name}`}
                  emptyMessage=""
                />
              </div>
              {customerRows.length > 0 ? (
                <dl className="mt-6 grid gap-3 text-sm">
                  {customerRows.map((row) => (
                    <div key={row.label}>
                      <dt className="font-semibold text-navy-900">{row.label}</dt>
                      <dd className="mt-0.5 text-muted">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </>
          ) : (
            <p className="mt-6 text-sm text-muted">
              Todavía no hemos publicado un canal de contacto comercial. {company.brand.name} está en{" "}
              {company.location.city}, {company.location.country}.
            </p>
          )}
        </aside>
      </Container>

      <JsonLd
        data={pageEntityData({
          company,
          indexable,
          path: "/contacto",
          type: "ContactPage",
          name: "Contacto",
          description: `Cómo presentarte a un puesto en ${company.brand.name} o contactar por una consulta sobre ventilación, climatización y aire acondicionado en ${company.location.city}.`,
        })}
      />
    </>
  );
}
