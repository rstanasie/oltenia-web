import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { DraftNotice, Missing } from "@/components/DraftNotice";
import { JsonLd } from "@/components/JsonLd";
import { LegalParagraphs, LegalSection } from "@/components/LegalSection";
import { PageHeader } from "@/components/PageHeader";
import { getCompany } from "@/content/company";
import { formatAddress } from "@/lib/contact";
import { missingPrivacy } from "@/lib/legal";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";
import { pageEntityData } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    { title: "Privacidad", description: `Información sobre el tratamiento de datos personales en el sitio web de ${company.brand.name}.`, path: "/privacidad", noindex: !company.legal.reviewed },
    { company, indexable },
  );
}

export default async function PrivacyPage() {
  const company = await getCompany();
  const l = company.legal;
  const missing = missingPrivacy(l);
  const indexable = isIndexable(envSite, company.publication.approved) && l.reviewed;

  return (
    <>
      <PageHeader title="Privacidad" />
      <Container className="grid gap-8 py-12 sm:py-16">
        {missing.length > 0 ? (
          <DraftNotice title="Borrador incompleto: esta información de privacidad no es definitiva">
            <p>Este texto es una estructura provisional y no ha sido revisado. Falta la siguiente información:</p>
            <ul className="list-disc pl-5">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </DraftNotice>
        ) : null}

        <LegalSection id="responsable" title="1. Responsable del tratamiento">
          {l.dataController ? (
            <p>
              {l.dataController.name}. {formatAddress(l.dataController.address)}. Correo electrónico:{" "}
              {l.dataController.email}.
            </p>
          ) : (
            <p>
              <Missing>nombre, dirección y correo del responsable del tratamiento</Missing>
            </p>
          )}
        </LegalSection>

        <LegalSection id="datos" title="2. Qué datos se tratan">
          <p>
            Este sitio web no tiene formularios ni permite subir archivos. Si contactas con {company.brand.name} por
            teléfono, WhatsApp o correo electrónico, se tratarán los datos que decidas facilitar, por ejemplo tu nombre,
            tus datos de contacto y la información sobre tu experiencia o tu consulta.
          </p>
        </LegalSection>

        <LegalSection id="finalidades" title="3. Para qué se usan">
          <LegalParagraphs
            list
            items={l.purposes}
            missing="finalidades del tratamiento, p. ej. responder consultas y atender a quienes se presentan para trabajar"
          />
        </LegalSection>

        <LegalSection id="base-legal" title="4. Base legal">
          <LegalParagraphs list items={l.legalBases} missing="bases legales de cada finalidad, a definir por un asesor" />
        </LegalSection>

        <LegalSection id="conservacion" title="5. Plazos de conservación">
          <LegalParagraphs list items={l.retentionPeriods} missing="plazos de conservación, a definir por un asesor" />
        </LegalSection>

        <LegalSection id="destinatarios" title="6. Destinatarios y servicios de terceros">
          <p>
            Si eliges escribir por WhatsApp, la comunicación se realiza a través de ese servicio, que tiene su propia
            política de privacidad.
          </p>
          <LegalParagraphs
            list
            items={l.recipients}
            missing="proveedores que tratan datos (alojamiento web y sus registros técnicos, correo electrónico, etc.) y transferencias, si las hay"
          />
        </LegalSection>

        <LegalSection id="derechos" title="7. Tus derechos">
          <p>
            Puedes solicitar el acceso, la rectificación o la supresión de tus datos, así como la limitación del
            tratamiento, la oposición y la portabilidad.
          </p>
          <p>
            Dirección para ejercer tus derechos: {l.rightsContact ?? <Missing>dirección o correo para ejercer derechos</Missing>}
          </p>
          <p>
            También puedes presentar una reclamación ante la Agencia Española de Protección de Datos.
          </p>
        </LegalSection>

        <LegalSection id="cookies" title="8. Cookies">
          <p>
            En su versión actual, este sitio web no utiliza cookies de analítica, publicidad ni seguimiento, y no carga
            servicios externos de forma automática.
          </p>
        </LegalSection>

        {l.lastReviewed ? <p className="text-sm text-muted">Última revisión: {l.lastReviewed}</p> : null}
      </Container>

      <JsonLd
        data={pageEntityData({
          company,
          indexable,
          path: "/privacidad",
          name: "Privacidad",
          description: `Información sobre el tratamiento de datos personales en el sitio web de ${company.brand.name}.`,
        })}
      />
    </>
  );
}
