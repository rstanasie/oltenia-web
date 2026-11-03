import type { StructureResolver } from "sanity/structure";
import { singletonTypes } from "./schemaTypes";

const singletonLabels: Record<(typeof singletonTypes)[number], string> = {
  siteSettings: "Marca y publicación",
  companyInfo: "Presentación de la empresa",
  contactInfo: "Contacto",
  legalInfo: "Datos legales",
  homePage: "Página de inicio",
  servicesPage: "Página de servicios",
  recruitmentPage: "Página «Trabaja con nosotros»",
  workingConditions: "Condiciones de trabajo",
  enDetallePage: "Página «En detalle»",
  seoSettings: "SEO por página",
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido de Oltenia")
    .items([
      S.listItem()
        .title("Configuración del sitio")
        .child(
          S.list()
            .title("Configuración del sitio")
            .items(
              singletonTypes.map((type) =>
                S.listItem()
                  .title(singletonLabels[type])
                  .id(type)
                  .child(S.document().schemaType(type).documentId(type)),
              ),
            ),
        ),
      S.divider(),
      S.documentTypeListItem("teamMember").title("Equipo"),
      S.documentTypeListItem("service").title("Servicios"),
      S.documentTypeListItem("vacancy").title("Puestos"),
      S.documentTypeListItem("photo").title("Fotos"),
    ]);
