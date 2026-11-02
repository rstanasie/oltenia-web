import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { DraftNotice, Missing } from "@/components/DraftNotice";
import { LegalParagraphs, LegalSection } from "@/components/LegalSection";
import { PageHeader } from "@/components/PageHeader";
import { getCompany } from "@/content/company";
import { formatAddress, isCompleteAddress, isValidEmail, mailtoHref } from "@/lib/contact";
import { missingLegalNotice } from "@/lib/legal";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    { title: "Aviso legal", description: `Aviso legal del sitio web de ${company.brand.name}.`, path: "/aviso-legal", noindex: !company.legal.reviewed },
    { company, indexable },
  );
}

export default async function LegalNoticePage() {
  const company = await getCompany();
  const l = company.legal;
  const missing = missingLegalNotice(l);

  return (
    <>
      <PageHeader title="Aviso legal" />
      <Container className="grid gap-8 py-12 sm:py-16">
        {missing.length > 0 ? (
          <DraftNotice title="Borrador incompleto: este aviso legal no es definitivo">
            <p>Este texto es una estructura provisional y no ha sido revisado. Falta la siguiente información:</p>
            <ul className="list-disc pl-5">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </DraftNotice>
        ) : null}

        <LegalSection id="titular" title="1. Datos identificativos">
          <dl className="grid gap-3">
            <div>
              <dt className="font-semibold text-navy-900">Titular</dt>
              <dd>{l.legalName ?? <Missing>razón social</Missing>}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">NIF/CIF</dt>
              <dd>{l.taxId ?? <Missing>NIF/CIF</Missing>}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Domicilio</dt>
              <dd>
                {isCompleteAddress(l.registeredAddress) ? formatAddress(l.registeredAddress) : <Missing>domicilio social</Missing>}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Datos registrales</dt>
              <dd>{l.registryDetails ?? <Missing>datos registrales, si corresponden</Missing>}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Correo electrónico</dt>
              <dd>
                {isValidEmail(l.legalEmail) ? (
                  <a className="font-semibold text-accent underline underline-offset-4" href={mailtoHref(l.legalEmail)}>
                    {l.legalEmail}
                  </a>
                ) : (
                  <Missing>correo de contacto</Missing>
                )}
              </dd>
            </div>
          </dl>
        </LegalSection>

        <LegalSection id="objeto" title="2. Objeto del sitio web">
          <p>
            Este sitio web ofrece información sobre {company.brand.name}, sus áreas de trabajo y la forma de ponerse en
            contacto con la empresa, incluidas las consultas sobre empleo.
          </p>
        </LegalSection>

        <LegalSection id="uso" title="3. Uso del sitio web">
          <p>
            El acceso al sitio web es gratuito y no requiere registro. El sitio no dispone de formularios ni de áreas
            privadas.
          </p>
          <LegalParagraphs items={l.termsOfUse} missing="condiciones de uso, a redactar y revisar por un asesor" />
        </LegalSection>

        <LegalSection id="propiedad" title="4. Propiedad intelectual e industrial">
          <LegalParagraphs
            items={l.intellectualProperty}
            missing="titularidad de textos, diseño, marca e imágenes, a confirmar y revisar"
          />
        </LegalSection>

        <LegalSection id="enlaces" title="5. Enlaces a servicios externos">
          <p>
            Algunos enlaces abren servicios de terceros, como WhatsApp o mapas en línea, solo cuando la persona usuaria
            decide pulsarlos. Esos servicios se rigen por sus propias condiciones.
          </p>
        </LegalSection>

        <LegalSection id="legislacion" title="6. Legislación aplicable">
          <LegalParagraphs items={l.applicableLaw} missing="legislación aplicable y jurisdicción, a revisar por un asesor" />
        </LegalSection>

        {l.lastReviewed ? <p className="text-sm text-muted">Última revisión: {l.lastReviewed}</p> : null}
      </Container>
    </>
  );
}
