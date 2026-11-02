import { defineField, defineType } from "sanity";

const paragraphArray = (name: string, title: string, description: string) =>
  defineField({ name, title, type: "array", of: [{ type: "text", rows: 3 }], description });

export const legalInfo = defineType({
  name: "legalInfo",
  title: "Datos legales",
  type: "document",
  groups: [
    { name: "identity", title: "Identidad", default: true },
    { name: "notice", title: "Aviso legal" },
    { name: "privacy", title: "Privacidad" },
    { name: "review", title: "Revisión" },
  ],
  description:
    "No inventes ningún dato de esta página. Déjalo vacío hasta que la empresa y su asesor lo confirmen; el sitio muestra un aviso de borrador mientras falte información.",
  fields: [
    defineField({ name: "legalName", title: "Razón social", type: "string", group: "identity" }),
    defineField({ name: "taxId", title: "NIF/CIF", type: "string", group: "identity" }),
    defineField({ name: "registeredAddress", title: "Domicilio social", type: "postalAddress", group: "identity" }),
    defineField({ name: "registryDetails", title: "Datos registrales", type: "text", rows: 2, group: "identity" }),
    defineField({ name: "legalEmail", title: "Correo de contacto legal", type: "email", group: "identity" }),

    defineField({ name: "dataControllerName", title: "Nombre del responsable del tratamiento", type: "string", group: "privacy" }),
    defineField({ name: "dataControllerAddress", title: "Dirección del responsable", type: "postalAddress", group: "privacy" }),
    defineField({ name: "dataControllerEmail", title: "Correo del responsable", type: "email", group: "privacy" }),
    defineField({ name: "rightsContact", title: "Dirección para ejercer derechos", type: "string", group: "privacy" }),

    paragraphArray("termsOfUse", "Condiciones de uso", "Redactadas o revisadas por un asesor."),
    paragraphArray("intellectualProperty", "Propiedad intelectual e industrial", ""),
    paragraphArray("applicableLaw", "Legislación aplicable y jurisdicción", ""),
    paragraphArray("purposes", "Finalidades del tratamiento", "Ej. responder consultas y atender a quienes se presentan para trabajar."),
    paragraphArray("recipients", "Destinatarios y encargados del tratamiento", "Proveedores que tratan datos: alojamiento, correo electrónico, etc."),
    paragraphArray("legalBases", "Bases legales", "A definir por un asesor."),
    paragraphArray("retentionPeriods", "Plazos de conservación", "A definir por un asesor."),

    defineField({ name: "lastReviewed", title: "Fecha de la última revisión", type: "date", group: "review" }),
    defineField({
      name: "reviewed",
      title: "Revisado por un asesor cualificado",
      type: "boolean",
      group: "review",
      initialValue: false,
      description: "Actívalo solo tras la revisión profesional de ambos textos legales. Mientras esté desactivado, Aviso legal y Privacidad son noindex y muestran un aviso de borrador.",
    }),
  ],
  preview: {
    select: { reviewed: "reviewed" },
    prepare: ({ reviewed }) => ({ title: "Datos legales", subtitle: reviewed ? "Revisado" : "Borrador, pendiente de revisión" }),
  },
});
