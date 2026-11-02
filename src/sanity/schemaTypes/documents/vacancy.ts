import { defineField, defineType } from "sanity";

export const vacancy = defineType({
  name: "vacancy",
  title: "Oferta de empleo",
  type: "document",
  description: "Solo publica ofertas reales y confirmadas por la empresa. No crees ofertas de ejemplo.",
  groups: [
    { name: "main", title: "Datos principales", default: true },
    { name: "details", title: "Detalles" },
    { name: "conditions", title: "Condiciones" },
  ],
  fields: [
    defineField({ name: "title", title: "Título del puesto", type: "string", group: "main", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Identificador",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      group: "main",
      options: { list: [{ title: "Abierta", value: "open" }, { title: "Cerrada", value: "closed" }], layout: "radio" },
      initialValue: "closed",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "location", title: "Ubicación", type: "string", group: "main" }),
    defineField({
      name: "summary",
      title: "Resumen del puesto",
      type: "text",
      rows: 3,
      group: "main",
      description: "Obligatorio para publicar la oferta como abierta.",
      validation: (Rule) => Rule.custom((value, context) => {
        const doc = context.document as { status?: string } | undefined;
        if (doc?.status === "open" && !value) return "Las ofertas abiertas necesitan un resumen.";
        return true;
      }),
    }),
    defineField({ name: "datePosted", title: "Fecha de publicación", type: "date", group: "main" }),
    defineField({ name: "validThrough", title: "Válida hasta", type: "date", group: "main" }),

    defineField({ name: "responsibilities", title: "Funciones", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "requiredExperience", title: "Experiencia requerida", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "requiredQualifications", title: "Formación y requisitos", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "drivingLicence", title: "Carné de conducir", type: "string", group: "details" }),
    defineField({ name: "benefits", title: "Qué se ofrece", type: "array", of: [{ type: "string" }], group: "details", description: "Solo condiciones reales." }),
    defineField({ name: "applicationInstructions", title: "Cómo presentarse", type: "text", rows: 2, group: "details" }),

    defineField({
      name: "schedule",
      title: "Horario",
      type: "string",
      group: "conditions",
    }),
    defineField({
      name: "contractType",
      title: "Tipo de contrato",
      type: "string",
      group: "conditions",
      options: {
        list: [
          { title: "Indefinido", value: "indefinido" },
          { title: "Temporal", value: "temporal" },
          { title: "Fijo discontinuo", value: "fijo-discontinuo" },
          { title: "Prácticas", value: "practicas" },
          { title: "Formación", value: "formacion" },
          { title: "Colaboración como autónomo", value: "autonomo" },
        ],
      },
    }),
    defineField({ name: "salaryRange", title: "Salario", type: "salaryRange", group: "conditions" }),
  ],
  orderings: [{ title: "Más recientes primero", name: "datePostedDesc", by: [{ field: "datePosted", direction: "desc" }] }],
  preview: {
    select: { title: "title", status: "status" },
    prepare: ({ title, status }) => ({ title, subtitle: status === "open" ? "Abierta" : "Cerrada" }),
  },
});
